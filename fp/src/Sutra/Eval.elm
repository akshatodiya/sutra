module Sutra.Eval exposing (Activity, Outcome, Reduction, evaluate, step)

import Dict
import Sutra.Ast exposing (Expr(..), Program, isValue, substitute)


type alias Activity =
    { name : String, items : List Expr, index : Maybe Int, accumulator : Maybe Expr }


type alias Reduction =
    { expression : Expr, rule : String, focus : List Int, activity : Maybe Activity }


type alias Outcome =
    { expression : Expr, steps : Int, error : Maybe String }


evaluate : Int -> Program -> Expr -> Outcome
evaluate maxSteps program expression =
    evaluateHelp (max 0 maxSteps) program expression 0


evaluateHelp : Int -> Program -> Expr -> Int -> Outcome
evaluateHelp limit program expression count =
    if isValue expression then
        { expression = expression, steps = count, error = Nothing }
    else if count >= limit then
        { expression = expression, steps = count, error = Just "step_limit" }
    else
        case step program expression of
            Err message -> { expression = expression, steps = count, error = Just message }
            Ok Nothing -> { expression = expression, steps = count, error = Just "runtime_error: stuck expression" }
            Ok (Just reduction) -> evaluateHelp limit program reduction.expression (count + 1)


step : Program -> Expr -> Result String (Maybe Reduction)
step program expression =
    stepAt 0 program expression


stepAt : Int -> Program -> Expr -> Result String (Maybe Reduction)
stepAt depth program expression =
    let
        descend index rebuild child =
            stepAt (depth + 1) program child
                |> Result.andThen
                    (\result ->
                        case result of
                            Just reduction -> Ok (Just { reduction | expression = rebuild reduction.expression, focus = index :: reduction.focus })
                            Nothing -> Err "runtime_error: expected a reducible child"
                    )

        reduceList index previous remaining =
            case remaining of
                first :: rest ->
                    if isValue first then reduceList (index + 1) (first :: previous) rest
                    else descend index (\next -> ListLiteral (List.reverse previous ++ (next :: rest))) first
                [] -> Ok Nothing
    in
    if depth > 512 then
        Err "runtime_error: expression nesting exceeds 512"
    else
        case expression of
            Variable name ->
                case Dict.get name program of
                    Just body -> reduced "definition" body
                    Nothing ->
                        case arity name of
                            Just _ -> reduced "builtin_reference" (Native name [])
                            Nothing -> Err ("unbound: " ++ name)

            Call function argument ->
                if not (isValue function) then descend 0 (\next -> Call next argument) function
                else if not (isValue argument) then descend 1 (Call function) argument
                else
                    case function of
                        Lambda name body -> reduced "beta" (substitute name argument body)
                        Native name previous ->
                            let
                                arguments = previous ++ [ argument ]
                            in
                            case arity name of
                                Just count ->
                                    if List.length arguments < count then reduced "partial_application" (Native name arguments)
                                    else invoke name arguments
                                Nothing -> Err ("unbound: " ++ name)
                        _ -> Err "type_error: application requires a function"

            Let name value body ->
                if isValue value then reduced "let" (substitute name value body)
                else descend 0 (\next -> Let name next body) value

            If condition yes no ->
                if not (isValue condition) then descend 0 (\next -> If next yes no) condition
                else
                    case condition of
                        Boolean True -> reduced "if_true" yes
                        Boolean False -> reduced "if_false" no
                        _ -> Err "type_error: if condition must be a boolean"

            ListLiteral values -> reduceList 0 [] values

            Binary operator left right ->
                if not (isValue left) then descend 0 (\next -> Binary operator next right) left
                else if operator == "&&" || operator == "||" then
                    case left of
                        Boolean boolean ->
                            if (operator == "&&" && not boolean) || (operator == "||" && boolean) then
                                reduced "short_circuit" left
                            else if not (isValue right) then
                                descend 1 (Binary operator left) right
                            else
                                case right of
                                    Boolean _ -> reduced "boolean_operator" right
                                    _ -> Err "type_error: boolean operator needs booleans"
                        _ -> Err "type_error: boolean operator needs booleans"
                else if not (isValue right) then descend 1 (Binary operator left) right
                else binaryOperator operator left right |> Result.andThen (reduced "operator")

            _ -> Ok Nothing


reduced : String -> Expr -> Result String (Maybe Reduction)
reduced rule expression =
    Ok (Just { expression = expression, rule = rule, focus = [], activity = Nothing })


unfold : String -> Expr -> List Expr -> Maybe Expr -> Result String (Maybe Reduction)
unfold name expression items accumulator =
    Ok
        (Just
            { expression = expression
            , rule = name ++ (if List.isEmpty items then "_empty" else "_cons")
            , focus = []
            , activity = Just { name = name, items = items, index = if List.isEmpty items then Nothing else Just 0, accumulator = accumulator }
            }
        )


arity : String -> Maybe Int
arity name =
    if List.member name [ "map", "filter", "range", "min", "max" ] then Just 2
    else if List.member name [ "foldl", "foldr" ] then Just 3
    else if List.member name [ "length", "head", "tail", "null", "reverse", "sum", "not" ] then Just 1
    else Nothing


callable : Expr -> Bool
callable expression =
    case expression of
        Lambda _ _ -> True
        Native _ _ -> True
        _ -> False


invoke : String -> List Expr -> Result String (Maybe Reduction)
invoke name arguments =
    case ( name, arguments ) of
        ( "map", [ function, ListLiteral items ] ) ->
            if not (callable function) then Err "type_error: map needs a function"
            else
                case items of
                    [] -> unfold name (ListLiteral []) items Nothing
                    first :: rest -> unfold name (Binary ":" (Call function first) (Call (Native name [ function ]) (ListLiteral rest))) items Nothing

        ( "filter", [ predicate, ListLiteral items ] ) ->
            if not (callable predicate) then Err "type_error: filter needs a function"
            else
                let
                    restExpression rest = Call (Native name [ predicate ]) (ListLiteral rest)
                in
                case items of
                    [] -> unfold name (ListLiteral []) items Nothing
                    first :: rest -> unfold name (If (Call predicate first) (Binary ":" first (restExpression rest)) (restExpression rest)) items Nothing

        ( "foldl", [ function, accumulator, ListLiteral items ] ) ->
            if not (callable function) then Err "type_error: foldl needs a function"
            else
                case items of
                    [] -> unfold name accumulator items (Just accumulator)
                    first :: rest ->
                        unfold name
                            (Call (Call (Native name [ function ]) (Call (Call function accumulator) first)) (ListLiteral rest))
                            items (Just accumulator)

        ( "foldr", [ function, accumulator, ListLiteral items ] ) ->
            if not (callable function) then Err "type_error: foldr needs a function"
            else
                case items of
                    [] -> unfold name accumulator items (Just accumulator)
                    first :: rest ->
                        unfold name
                            (Call (Call function first) (Call (Native name [ function, accumulator ]) (ListLiteral rest)))
                            items (Just accumulator)

        ( "length", [ ListLiteral items ] ) -> reduced "length" (Integer (toFloat (List.length items)))
        ( "null", [ ListLiteral items ] ) -> reduced "null" (Boolean (List.isEmpty items))
        ( "reverse", [ ListLiteral items ] ) -> reduced "reverse" (ListLiteral (List.reverse items))
        ( "head", [ ListLiteral (first :: _) ] ) -> reduced "head" first
        ( "head", [ ListLiteral [] ] ) -> Err "runtime_error: head of empty list"
        ( "tail", [ ListLiteral (_ :: rest) ] ) -> reduced "tail" (ListLiteral rest)
        ( "tail", [ ListLiteral [] ] ) -> Err "runtime_error: tail of empty list"
        ( "not", [ Boolean boolean ] ) -> reduced "not" (Boolean (not boolean))
        ( "min", [ Integer left, Integer right ] ) -> reduced "min" (Integer (min left right))
        ( "max", [ Integer left, Integer right ] ) -> reduced "max" (Integer (max left right))

        ( "sum", [ ListLiteral items ] ) ->
            List.foldl
                (\item accumulated ->
                    accumulated |> Result.andThen
                        (\total ->
                            case item of
                                Integer number -> checkedInteger (total + number) |> Result.map integerNumber
                                _ -> Err "type_error: sum needs a list of integers"
                        )
                )
                (Ok 0)
                items
                |> Result.map Integer
                |> Result.andThen (reduced "sum")

        ( "range", [ Integer first, Integer last ] ) ->
            let
                count = max 0 (last - first + 1)
            in
            if count > 10000 then Err "runtime_error: range exceeds 10000 elements"
            else
                List.range 0 (floor count - 1)
                    |> List.map (\offset -> Integer (first + toFloat offset))
                    |> ListLiteral
                    |> reduced "range"

        _ -> Err ("type_error: wrong argument types for " ++ name)


integerNumber : Expr -> Float
integerNumber expression =
    case expression of
        Integer number -> number
        _ -> 0


checkedInteger : Float -> Result String Expr
checkedInteger number =
    if isNaN number || isInfinite number || abs number > 9007199254740991 then
        Err "runtime_error: integer outside the safe 53-bit range"
    else
        Ok (Integer number)


quotient : Float -> Float -> Float
quotient numerator denominator =
    let
        a = abs numerator
        b = abs denominator
        estimate = toFloat (floor (a / b))
        product = estimate * b
        corrected =
            if product > a then estimate - 1
            else if a - product >= b then estimate + 1
            else estimate
    in
    if (numerator < 0) /= (denominator < 0) then -corrected else corrected


binaryOperator : String -> Expr -> Expr -> Result String Expr
binaryOperator operator left right =
    if operator == ":" then
        case right of
            ListLiteral items -> Ok (ListLiteral (left :: items))
            _ -> Err "type_error: the right operand of ':' must be a list"
    else if operator == "==" || operator == "/=" then
        equal left right |> Result.map (\same -> Boolean (if operator == "==" then same else not same))
    else
        case ( left, right ) of
            ( Integer a, Integer b ) ->
                case operator of
                    "+" -> checkedInteger (a + b)
                    "-" -> checkedInteger (a - b)
                    "*" -> checkedInteger (a * b)
                    "/" ->
                        if b == 0 then Err "runtime_error: division by zero"
                        else checkedInteger (quotient a b)
                    "%" ->
                        if b == 0 then Err "runtime_error: modulo by zero"
                        else checkedInteger (a - quotient a b * b)
                    "<" -> Ok (Boolean (a < b))
                    "<=" -> Ok (Boolean (a <= b))
                    ">" -> Ok (Boolean (a > b))
                    ">=" -> Ok (Boolean (a >= b))
                    _ -> Err ("type_error: unknown operator " ++ operator)
            _ -> Err ("type_error: operator '" ++ operator ++ "' needs integers")


equal : Expr -> Expr -> Result String Bool
equal left right =
    case ( left, right ) of
        ( Integer a, Integer b ) -> Ok (a == b)
        ( Boolean a, Boolean b ) -> Ok (a == b)
        ( ListLiteral a, ListLiteral b ) -> equalLists a b
        _ -> Err "type_error: equality requires matching, non-function values"


equalLists : List Expr -> List Expr -> Result String Bool
equalLists left right =
    case ( left, right ) of
        ( [], [] ) -> Ok True
        ( [], _ ) -> Ok False
        ( _, [] ) -> Ok False
        ( a :: aa, b :: bb ) ->
            equal a b |> Result.andThen (\same -> if same then equalLists aa bb else Ok False)
