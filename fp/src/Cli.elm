port module Cli exposing (main)

import Json.Decode as Decode
import Json.Encode as Encode
import Platform
import Sutra.Ast as Ast
import Sutra.Eval as Eval
import Sutra.Parser as Parser
import Sutra.Print as Print


port requests : (Decode.Value -> msg) -> Sub msg
port responses : Encode.Value -> Cmd msg


type Msg = Request Decode.Value


type alias Input =
    { requestId : Int
    , mode : String
    , program : String
    , expression : String
    , maxSteps : Int
    , trace : Bool
    }


decoder : Decode.Decoder Input
decoder =
    Decode.map6 Input
        (Decode.field "requestId" Decode.int)
        (Decode.field "mode" Decode.string)
        (Decode.field "program" Decode.string)
        (Decode.field "expr" Decode.string)
        (Decode.field "maxSteps" Decode.float |> Decode.map floor)
        (Decode.field "trace" Decode.bool)


main : Program () () Msg
main =
    Platform.worker
        { init = \_ -> ( (), Cmd.none )
        , subscriptions = \_ -> requests Request
        , update = \(Request value) _ -> ( (), responses (handle value) )
        }


handle : Decode.Value -> Encode.Value
handle value =
    case Decode.decodeValue decoder value of
        Err error ->
            Encode.object
                [ ( "requestId", Encode.int -1 )
                , ( "result", Encode.object [ ( "parse_error", Encode.string ("bad_input: " ++ Decode.errorToString error) ) ] )
                ]

        Ok input ->
            let
                result =
                    case Parser.parseProgram input.program of
                        Err error -> Encode.object [ ( "parse_error", Encode.string error ) ]
                        Ok program ->
                            if input.mode == "program" then
                                Encode.object [ ( "parse_error", Encode.null ) ]
                            else
                                case Parser.parseExpression input.expression of
                                    Err error ->
                                        Encode.object
                                            [ ( "parse_error", Encode.null )
                                            , ( "value", Encode.null )
                                            , ( "error", Encode.string ("parse_error: " ++ error) )
                                            , ( "steps", Encode.int 0 )
                                            , ( "initial", Encode.null )
                                            , ( "trace", Encode.list identity [] )
                                            ]
                                    Ok expression ->
                                        if input.trace then
                                            trace input.maxSteps program expression 0 []
                                                |> encodeReport (Print.source expression)
                                        else
                                            ( Eval.evaluate input.maxSteps program expression, [] )
                                                |> encodeReport ""
            in
            Encode.object [ ( "requestId", Encode.int input.requestId ), ( "result", result ) ]


encodeReport : String -> ( Eval.Outcome, List Encode.Value ) -> Encode.Value
encodeReport initial ( outcome, events ) =
    Encode.object
        [ ( "parse_error", Encode.null )
        , ( "value", if outcome.error == Nothing then Encode.string (Print.canonical outcome.expression) else Encode.null )
        , ( "error", Maybe.map Encode.string outcome.error |> Maybe.withDefault Encode.null )
        , ( "steps", Encode.int outcome.steps )
        , ( "initial", Encode.string initial )
        , ( "trace", Encode.list identity events )
        ]


trace : Int -> Ast.Program -> Ast.Expr -> Int -> List Encode.Value -> ( Eval.Outcome, List Encode.Value )
trace limit program expression count previous =
    let
        finish error =
            ( { expression = expression, steps = count, error = error }, List.reverse previous )
    in
    if Ast.isValue expression then
        finish Nothing
    else if count >= limit then
        finish (Just "step_limit")
    else
        case Eval.step program expression of
            Err error -> finish (Just error)
            Ok Nothing -> finish (Just "runtime_error: stuck expression")
            Ok (Just reduction) ->
                let
                    activity =
                        reduction.activity
                            |> Maybe.map
                                (\active ->
                                    Encode.object
                                        [ ( "name", Encode.string active.name )
                                        , ( "items", Encode.list (Print.canonical >> Encode.string) active.items )
                                        , ( "index", Maybe.map Encode.int active.index |> Maybe.withDefault Encode.null )
                                        , ( "accumulator", Maybe.map (Print.canonical >> Encode.string) active.accumulator |> Maybe.withDefault Encode.null )
                                        ]
                                )
                            |> Maybe.withDefault Encode.null

                    event =
                        Encode.object
                            [ ( "step", Encode.int (count + 1) )
                            , ( "before", Encode.string (Print.source expression) )
                            , ( "after", Encode.string (Print.source reduction.expression) )
                            , ( "rule", Encode.string reduction.rule )
                            , ( "focus", Encode.list Encode.int reduction.focus )
                            , ( "activity", activity )
                            ]
                in
                trace limit program reduction.expression (count + 1) (event :: previous)
