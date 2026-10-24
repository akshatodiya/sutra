module Sutra.Session exposing (Frame, Session, VisualActivity, advance, back, current, finished, previous, start)

import Array exposing (Array)
import Sutra.Ast exposing (Expr(..), Program, isValue)
import Sutra.Eval as Eval
import Sutra.Parser as Parser


type alias VisualActivity =
    { name : String
    , original : List Expr
    , remaining : List Expr
    , index : Maybe Int
    , accumulator : Maybe Expr
    , base : List Int
    , scope : List Int
    , phase : String
    }


type alias PendingFold =
    { path : List Int, visual : VisualActivity }


type alias Frame =
    { expression : Expr
    , steps : Int
    , rule : Maybe String
    , focus : Maybe (List Int)
    , activity : Maybe VisualActivity
    , operations : List VisualActivity
    , pendingFolds : List PendingFold
    , combiningFold : Maybe PendingFold
    , error : Maybe String
    }


type alias Session =
    { program : Program, frames : Array Frame, cursor : Int, limit : Int }


start : Int -> String -> String -> Result String Session
start limit source expressionSource =
    if limit < 0 || limit > 10000 then
        Err "input_error: enter a step limit from 0 to 10000"
    else
        Parser.parseProgram source
            |> Result.mapError ((++) "parse_error: program: ")
            |> Result.andThen
                (\program ->
                    Parser.parseExpression expressionSource
                        |> Result.mapError ((++) "parse_error: expression: ")
                        |> Result.map
                            (\expression ->
                                { program = program
                                , frames = Array.fromList
                                    [ { expression = expression, steps = 0, rule = Nothing, focus = Nothing
                                      , activity = Nothing, operations = [], pendingFolds = [], combiningFold = Nothing
                                      , error = if limit == 0 && not (isValue expression) then Just "step_limit" else Nothing
                                      }
                                    ]
                                , cursor = 0
                                , limit = limit
                                }
                            )
                )


current : Session -> Frame
current session =
    -- Every constructed session starts with a frame; the fallback is never a valid cursor.
    Array.get session.cursor session.frames
        |> Maybe.withDefault
            { expression = ListLiteral [], steps = 0, rule = Nothing, focus = Nothing
            , activity = Nothing, operations = [], pendingFolds = [], combiningFold = Nothing
            , error = Just "runtime_error: invalid history cursor"
            }


previous : Session -> Maybe Frame
previous session =
    Array.get (session.cursor - 1) session.frames


finished : Session -> Bool
finished session =
    let
        frame = current session
    in
    frame.error /= Nothing || isValue frame.expression


back : Session -> Session
back session =
    { session | cursor = max 0 (session.cursor - 1) }


advance : Session -> Session
advance session =
    if session.cursor + 1 < Array.length session.frames then
        { session | cursor = session.cursor + 1 }
    else if finished session then
        session
    else
        let
            frame = current session
            append next = { session | frames = Array.push next session.frames, cursor = session.cursor + 1 }
        in
        case Eval.step session.program frame.expression of
            Err message -> append { frame | error = Just message, rule = Nothing, focus = Nothing }
            Ok Nothing -> append { frame | error = Just "runtime_error: stuck expression", rule = Nothing, focus = Nothing }
            Ok (Just reduction) ->
                let
                    count = frame.steps + 1
                    next = updateActivity frame reduction
                    result =
                        { next | expression = reduction.expression, steps = count
                            , rule = Just reduction.rule, focus = Just reduction.focus
                            , error = if count >= session.limit && not (isValue reduction.expression) then Just "step_limit" else Nothing
                        }
                    terminalActivity =
                        if isValue result.expression then
                            result.activity |> Maybe.map
                                (\active ->
                                    { active | index = Nothing, phase = "Complete"
                                        , accumulator =
                                            if List.member active.name [ "foldl", "foldr" ] && active.base == [] then
                                                Just result.expression
                                            else active.accumulator
                                    }
                                )
                        else result.activity
                in
                append { result | activity = terminalActivity }


updateActivity : Frame -> Eval.Reduction -> Frame
updateActivity frame reduction =
    let
        withUnfold =
            case reduction.activity of
                Nothing -> frame
                Just active ->
                    let
                        matches old =
                            old.name == active.name
                                && List.length old.remaining == List.length active.items + 1
                                && List.drop 1 old.remaining == active.items
                                && (reduction.focus == old.scope || reduction.focus == old.scope ++ [ 1 ])
                        prior = List.filter matches frame.operations |> List.head
                        original = prior |> Maybe.map .original |> Maybe.withDefault active.items
                        base = prior |> Maybe.map .base |> Maybe.withDefault reduction.focus
                        visual =
                            { name = active.name, original = original, remaining = active.items
                            , index = if List.isEmpty active.items then Nothing else Just (List.length original - List.length active.items)
                            , accumulator = active.accumulator, base = base, scope = reduction.focus
                            , phase = if active.name == "foldr" && not (List.isEmpty active.items) then "Unfolding" else if List.isEmpty active.items then "Complete" else "Processing"
                            }
                        operations = visual :: List.filter (\old -> old.name /= visual.name || old.base /= visual.base) frame.operations
                        pending =
                            if active.name == "foldr" && not (List.isEmpty active.items) then
                                { path = reduction.focus, visual = visual } :: frame.pendingFolds
                            else frame.pendingFolds
                    in
                    { frame | activity = Just visual, operations = operations, pendingFolds = pending }

        readyFold =
            if reduction.activity /= Nothing then Nothing
            else
                List.filter (\pending -> pending.path == reduction.focus) frame.pendingFolds
                    |> List.head
                    |> Maybe.andThen
                        (\pending ->
                            case atPath pending.path frame.expression of
                                Just (Call function argument) ->
                                    if isValue function && isValue argument then Just ( pending, argument ) else Nothing
                                _ -> Nothing
                        )

        withCombine =
            case readyFold of
                Nothing -> withUnfold
                Just ( pending, argument ) ->
                    let
                        old = pending.visual
                        visual = { old | accumulator = Just argument, phase = "Combining from the right" }
                    in
                    { withUnfold | activity = Just visual, combiningFold = Just { pending | visual = visual }
                        , pendingFolds = List.filter (\item -> item.path /= pending.path) withUnfold.pendingFolds
                    }

        withResult =
            case withCombine.combiningFold of
                Nothing -> withCombine
                Just pending ->
                    case atPath pending.path reduction.expression of
                        Just value ->
                            if isValue value then
                                let
                                    old = pending.visual
                                in
                                { withCombine | activity = Just { old | accumulator = Just value, phase = "Accumulated" }, combiningFold = Nothing }
                            else withCombine
                        Nothing -> withCombine
    in
    case withResult.activity of
        Just active ->
            if active.name == "foldl" then
                case atPath active.scope reduction.expression |> Maybe.andThen foldlAccumulator of
                    Just accumulator -> { withResult | activity = Just { active | accumulator = Just accumulator } }
                    Nothing -> withResult
            else withResult
        Nothing -> withResult


foldlAccumulator : Expr -> Maybe Expr
foldlAccumulator expression =
    case expression of
        Call (Native "foldl" [ _, accumulator ]) _ -> Just accumulator
        Call (Call (Native "foldl" [ _ ]) accumulator) _ ->
            if isValue accumulator then Just accumulator else Nothing
        _ -> Nothing


atPath : List Int -> Expr -> Maybe Expr
atPath path expression =
    case path of
        [] -> Just expression
        index :: rest ->
            let
                children =
                    case expression of
                        Call a b -> [ a, b ]
                        Binary _ a b -> [ a, b ]
                        Let _ a b -> [ a, b ]
                        If a b c -> [ a, b, c ]
                        ListLiteral values -> values
                        Lambda _ body -> [ body ]
                        Native _ values -> values
                        _ -> []
            in
            List.drop index children |> List.head |> Maybe.andThen (atPath rest)
