port module Worker exposing (main)

import Json.Decode as Decode
import Json.Encode as Encode
import Platform
import Sutra.Ast
import Sutra.Eval as Eval
import Sutra.Parser as Parser
import Sutra.Print as Print


port requests : (Decode.Value -> msg) -> Sub msg
port responses : Encode.Value -> Cmd msg


type Msg = Request Decode.Value


type alias Input =
    { id : Int, program : String, expression : String, maxSteps : Int, trace : Bool }


decoder : Decode.Decoder Input
decoder =
    Decode.map5 Input
        (Decode.field "id" Decode.int)
        (Decode.field "program" Decode.string)
        (Decode.field "expr" Decode.string)
        (Decode.oneOf [ Decode.field "maxSteps" Decode.int, Decode.succeed 10000 ])
        (Decode.oneOf [ Decode.field "trace" Decode.bool, Decode.succeed False ])


main : Program () () Msg
main =
    Platform.worker
        { init = \_ -> ( (), Cmd.none )
        , subscriptions = \_ -> requests Request
        , update = \(Request value) _ -> ( (), responses (run value) )
        }


run : Decode.Value -> Encode.Value
run value =
    case Decode.decodeValue decoder value of
        Err error -> Encode.object [ ( "error", Encode.string (Decode.errorToString error) ) ]
        Ok input ->
            case Parser.parseProgram input.program |> Result.andThen (\program -> Parser.parseExpression input.expression |> Result.map (\expression -> ( program, expression ))) of
                Err error -> Encode.object [ ( "id", Encode.int input.id ), ( "error", Encode.string ("parse_error: " ++ error) ), ( "steps", Encode.int 0 ) ]
                Ok ( program, expression ) ->
                    let
                        outcome = Eval.evaluate input.maxSteps program expression
                        reductions = if input.trace then trace input.maxSteps program expression [] else []
                    in
                    Encode.object
                        [ ( "id", Encode.int input.id )
                        , ( "value", if outcome.error == Nothing then Encode.string (Print.canonical outcome.expression) else Encode.null )
                        , ( "error", Maybe.map Encode.string outcome.error |> Maybe.withDefault Encode.null )
                        , ( "steps", Encode.int outcome.steps )
                        , ( "trace", Encode.list identity reductions )
                        ]


trace : Int -> Sutra.Ast.Program -> Sutra.Ast.Expr -> List Encode.Value -> List Encode.Value
trace remaining program expression previous =
    if remaining <= 0 then List.reverse previous
    else
        case Eval.step program expression of
            Ok (Just reduction) ->
                let
                    activity =
                        reduction.activity |> Maybe.map
                            (\active -> Encode.object
                                [ ( "name", Encode.string active.name )
                                , ( "items", Encode.list (Print.canonical >> Encode.string) active.items )
                                , ( "index", Maybe.map Encode.int active.index |> Maybe.withDefault Encode.null )
                                , ( "accumulator", Maybe.map (Print.canonical >> Encode.string) active.accumulator |> Maybe.withDefault Encode.null )
                                ]) |> Maybe.withDefault Encode.null
                    event = Encode.object
                        [ ( "rule", Encode.string reduction.rule )
                        , ( "expression", Encode.string (Print.source reduction.expression) )
                        , ( "focus", Encode.list Encode.int reduction.focus )
                        , ( "activity", activity )
                        ]
                in
                trace (remaining - 1) program reduction.expression (event :: previous)
            _ -> List.reverse previous
