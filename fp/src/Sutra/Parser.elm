module Sutra.Parser exposing (parseExpression, parseProgram)

import Char
import Dict
import Set
import Sutra.Ast exposing (Expr(..), Program)


type TokenKind
    = NumberToken Float
    | NameToken String
    | SymbolToken String


type Token
    = Token TokenKind Int Int


kindOf : Token -> TokenKind
kindOf (Token kind _ _) =
    kind


type alias OperatorInfo =
    { name : String, precedence : Int, rightAssociative : Bool, comparison : Bool }


type alias Parsed =
    Result String ( Expr, List Token )


type alias Chunk =
    { line : Int, source : String }


parseExpression : String -> Result String Expr
parseExpression source =
    tokenize source
        |> Result.andThen expression
        |> Result.andThen complete


complete : ( Expr, List Token ) -> Result String Expr
complete ( value, remaining ) =
    case remaining of
        [] -> Ok value
        token :: _ -> Err (at token "unexpected token after expression")


parseProgram : String -> Result String Program
parseProgram source =
    layout source
        |> Result.andThen
            (List.foldl
                (\chunk result ->
                    result |> Result.andThen
                        (\definitions ->
                            tokenize chunk.source
                                |> Result.andThen definition
                                |> Result.andThen
                                    (\( name, body ) ->
                                        if Dict.member name definitions then
                                            Err ("duplicate definition: " ++ name)
                                        else
                                            Ok (Dict.insert name body definitions)
                                    )
                                |> Result.mapError (\message -> "definition at line " ++ String.fromInt chunk.line ++ ": " ++ message)
                        )
                )
                (Ok Dict.empty)
            )


layout : String -> Result String (List Chunk)
layout source =
    let
        addLine ( number, raw ) result =
            result |> Result.andThen
                (\chunks ->
                    let
                        clean = raw |> String.split "--" |> List.head |> Maybe.withDefault "" |> String.trimRight
                        continuation = String.startsWith " " clean || String.startsWith "\t" clean
                    in
                    if String.isEmpty (String.trim clean) then
                        Ok chunks
                    else if continuation then
                        case chunks of
                            previous :: rest -> Ok ({ previous | source = previous.source ++ " " ++ String.trim clean } :: rest)
                            [] -> Err ("indented continuation without a definition at line " ++ String.fromInt number)
                    else
                        Ok ({ line = number, source = clean } :: chunks)
                )
    in
    source
        |> String.lines
        |> List.indexedMap (\index line -> ( index + 1, line ))
        |> List.foldl addLine (Ok [])
        |> Result.map List.reverse


definition : List Token -> Result String ( String, Expr )
definition tokens =
    takeName tokens |> Result.andThen
        (\( name, remaining ) ->
            parameters "=" remaining |> Result.andThen
                (\( arguments, bodyTokens ) ->
                    expression bodyTokens
                        |> Result.andThen complete
                        |> Result.map (\body -> ( name, List.foldr Lambda body arguments ))
                )
        )


parameters : String -> List Token -> Result String ( List String, List Token )
parameters delimiter tokens =
    collectParameters delimiter [] tokens


collectParameters : String -> List String -> List Token -> Result String ( List String, List Token )
collectParameters delimiter found tokens =
    case tokens of
        token :: rest ->
            if (kindOf token) == SymbolToken delimiter then
                Ok ( List.reverse found, rest )
            else
                takeName tokens |> Result.andThen
                    (\( name, after ) ->
                        if List.member name found then
                            Err (at token ("duplicate parameter: " ++ name))
                        else
                            collectParameters delimiter (name :: found) after
                    )
        [] -> Err ("expected '" ++ delimiter ++ "'")


expression : List Token -> Parsed
expression tokens =
    binary 1 tokens


binary : Int -> List Token -> Parsed
binary minimum tokens =
    operand tokens |> Result.andThen (\( left, remaining ) -> binaryTail minimum left remaining)


binaryTail : Int -> Expr -> List Token -> Parsed
binaryTail minimum left tokens =
    case tokens of
        token :: rest ->
            case operatorInfo (kindOf token) of
                Just info ->
                    let
                        name = info.name
                        precedence = info.precedence
                        rightAssociative = info.rightAssociative
                        comparison = info.comparison
                    in
                    if precedence < minimum then
                        Ok ( left, tokens )
                    else
                        binary (if rightAssociative then precedence else precedence + 1) rest
                            |> Result.andThen
                                (\( right, after ) ->
                                    if comparison && startsComparison after then
                                        Err (at token "comparisons are non-associative; use parentheses")
                                    else
                                        binaryTail minimum (Binary name left right) after
                                )
                Nothing -> Ok ( left, tokens )
        [] -> Ok ( left, [] )


startsComparison : List Token -> Bool
startsComparison tokens =
    case tokens of
        token :: _ ->
            operatorInfo (kindOf token) |> Maybe.map .comparison |> Maybe.withDefault False
        [] -> False


operatorInfo : TokenKind -> Maybe OperatorInfo
operatorInfo kind =
    case kind of
        SymbolToken name ->
            if name == "||" then Just { name = name, precedence = 1, rightAssociative = False, comparison = False }
            else if name == "&&" then Just { name = name, precedence = 2, rightAssociative = False, comparison = False }
            else if List.member name [ "==", "/=", "<", "<=", ">", ">=" ] then Just { name = name, precedence = 3, rightAssociative = False, comparison = True }
            else if name == ":" then Just { name = name, precedence = 4, rightAssociative = True, comparison = False }
            else if List.member name [ "+", "-" ] then Just { name = name, precedence = 5, rightAssociative = False, comparison = False }
            else if List.member name [ "*", "/", "%" ] then Just { name = name, precedence = 6, rightAssociative = False, comparison = False }
            else Nothing
        _ -> Nothing


operand : List Token -> Parsed
operand tokens =
    case tokens of
        Token kind _ _ :: rest ->
            case kind of
                NameToken "if" ->
                    expression rest |> Result.andThen
                        (\( condition, afterCondition ) ->
                            expectName "then" afterCondition |> Result.andThen expression |> Result.andThen
                                (\( yes, afterYes ) ->
                                    expectName "else" afterYes |> Result.andThen expression
                                        |> Result.map (\( no, afterNo ) -> ( If condition yes no, afterNo ))
                                )
                        )
                NameToken "let" ->
                    takeName rest |> Result.andThen
                        (\( name, afterName ) ->
                            expectSymbol "=" afterName |> Result.andThen expression |> Result.andThen
                                (\( value, afterValue ) ->
                                    expectName "in" afterValue |> Result.andThen expression
                                        |> Result.map (\( body, afterBody ) -> ( Let name value body, afterBody ))
                                )
                        )
                SymbolToken "\\" ->
                    parameters "->" rest |> Result.andThen
                        (\( arguments, bodyTokens ) ->
                            if List.isEmpty arguments then Err "a lambda needs at least one parameter"
                            else expression bodyTokens |> Result.map (\( body, remaining ) -> ( List.foldr Lambda body arguments, remaining ))
                        )
                _ -> application tokens
        [] -> Err "expected an expression"


application : List Token -> Parsed
application tokens =
    atom True tokens |> Result.andThen (\( first, rest ) -> applicationTail first rest)


applicationTail : Expr -> List Token -> Parsed
applicationTail function tokens =
    if startsAtom tokens then
        atom False tokens |> Result.andThen (\( argument, rest ) -> applicationTail (Call function argument) rest)
    else
        Ok ( function, tokens )


startsAtom : List Token -> Bool
startsAtom tokens =
    case tokens of
        Token kind _ _ :: _ ->
            case kind of
                NumberToken _ -> True
                NameToken name -> not (Set.member name reserved)
                SymbolToken name -> name == "(" || name == "["
        [] -> False


atom : Bool -> List Token -> Parsed
atom allowNegative tokens =
    case tokens of
        token :: rest ->
            case (kindOf token) of
                NumberToken number -> Ok ( Integer number, rest )
                NameToken "True" -> Ok ( Boolean True, rest )
                NameToken "False" -> Ok ( Boolean False, rest )
                NameToken name ->
                    if Set.member name reserved then Err (at token ("expected expression, found '" ++ name ++ "'"))
                    else Ok ( Variable name, rest )
                SymbolToken "-" ->
                    case rest of
                        Token (NumberToken number) _ _ :: after ->
                            if allowNegative then Ok ( Integer (-number), after )
                            else Err (at token "parenthesize a negative function argument")
                        _ -> Err (at token "unary minus is allowed only on an integer literal")
                SymbolToken "(" ->
                    expression rest |> Result.andThen
                        (\( inner, after ) -> expectSymbol ")" after |> Result.map (\remaining -> ( inner, remaining )))
                SymbolToken "[" -> listLiteral [] rest
                _ -> Err (at token "expected an expression")
        [] -> Err "expected an expression"


listLiteral : List Expr -> List Token -> Parsed
listLiteral previous tokens =
    case tokens of
        Token (SymbolToken "]") _ _ :: rest -> Ok ( ListLiteral (List.reverse previous), rest )
        _ ->
            expression tokens |> Result.andThen
                (\( value, remaining ) ->
                    case remaining of
                        Token (SymbolToken "]") _ _ :: rest -> Ok ( ListLiteral (List.reverse (value :: previous)), rest )
                        Token (SymbolToken ",") _ _ :: rest ->
                            case rest of
                                Token (SymbolToken "]") _ _ :: _ -> Err "trailing list comma is not allowed"
                                _ -> listLiteral (value :: previous) rest
                        token :: _ -> Err (at token "expected ',' or ']' in a list")
                        [] -> Err "expected ']'"
                )


reserved : Set.Set String
reserved =
    Set.fromList [ "if", "then", "else", "let", "in" ]


takeName : List Token -> Result String ( String, List Token )
takeName tokens =
    case tokens of
        token :: rest ->
            case (kindOf token) of
                NameToken name ->
                    if Set.member name reserved || name == "True" || name == "False" then Err (at token "expected a binding name")
                    else Ok ( name, rest )
                _ -> Err (at token "expected a binding name")
        [] -> Err "expected a binding name"


expectName : String -> List Token -> Result String (List Token)
expectName name tokens =
    expect (NameToken name) name tokens


expectSymbol : String -> List Token -> Result String (List Token)
expectSymbol name tokens =
    expect (SymbolToken name) name tokens


expect : TokenKind -> String -> List Token -> Result String (List Token)
expect wanted label tokens =
    case tokens of
        token :: rest -> if (kindOf token) == wanted then Ok rest else Err (at token ("expected '" ++ label ++ "'"))
        [] -> Err ("expected '" ++ label ++ "'")


at : Token -> String -> String
at (Token _ row column) message =
    message ++ " at " ++ String.fromInt row ++ ":" ++ String.fromInt column


tokenize : String -> Result String (List Token)
tokenize source =
    if String.length source > 100000 then Err "source exceeds 100000 characters"
    else lex 1 1 (String.toList source) []


lex : Int -> Int -> List Char -> List Token -> Result String (List Token)
lex row column characters previous =
    case characters of
        [] -> Ok (List.reverse previous)
        '\n' :: rest -> lex (row + 1) 1 rest previous
        '-' :: '-' :: rest ->
            let
                ( _, after ) = span (\c -> c /= '\n') rest
            in
            lex row column after previous
        first :: rest ->
            if List.member first [ ' ', '\t', '\r' ] then
                lex row (column + 1) rest previous
            else if Char.isDigit first then
                let
                    ( digits, after ) = span Char.isDigit characters
                    text = String.fromList digits
                in
                case String.toFloat text of
                    Just number ->
                        if number <= 9007199254740991 then
                            lex row (column + List.length digits) after (Token (NumberToken number) row column :: previous)
                        else Err ("integer outside the safe 53-bit range at " ++ String.fromInt row ++ ":" ++ String.fromInt column)
                    Nothing -> Err "invalid integer"
            else if Char.isAlpha first || first == '_' then
                let
                    ( name, after ) = span (\c -> Char.isAlphaNum c || c == '_' || c == '\'') characters
                in
                lex row (column + List.length name) after (Token (NameToken (String.fromList name)) row column :: previous)
            else
                let
                    pair = String.fromList (List.take 2 characters)
                    two = List.member pair [ "->", "==", "/=", "<=", ">=", "&&", "||" ]
                    symbol = if two then pair else String.fromChar first
                    width = if two then 2 else 1
                in
                if two || List.member first [ '+', '-', '*', '/', '%', ':', '(', ')', '[', ']', ',', '=', '\\', '<', '>' ] then
                    lex row (column + width) (List.drop width characters) (Token (SymbolToken symbol) row column :: previous)
                else Err ("unexpected character '" ++ String.fromChar first ++ "' at " ++ String.fromInt row ++ ":" ++ String.fromInt column)


span : (Char -> Bool) -> List Char -> ( List Char, List Char )
span predicate characters =
    spanHelp predicate characters []


spanHelp : (Char -> Bool) -> List Char -> List Char -> ( List Char, List Char )
spanHelp predicate characters found =
    case characters of
        first :: rest ->
            if predicate first then spanHelp predicate rest (first :: found)
            else ( List.reverse found, characters )
        [] -> ( List.reverse found, [] )
