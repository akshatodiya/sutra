module Sutra.ExpressionView exposing (view)

import Html exposing (Html, mark, span, text)
import Html.Attributes as A
import Sutra.Ast exposing (Expr(..))
import Sutra.Print as Print


view : Maybe (List Int) -> Expr -> Html msg
view selected expression =
    render selected [] expression


render : Maybe (List Int) -> List Int -> Expr -> Html msg
render selected path expression =
    let
        child index value = render selected (path ++ [ index ]) value
        token className tokenText = span [ A.class className ] [ text tokenText ]
        argument index value =
            case value of
                Integer number ->
                    if number < 0 then [ text "(", child index value, text ")" ] else [ child index value ]
                _ -> [ child index value ]
        separated children =
            children |> List.intersperse [ text ", " ] |> List.concat
        content =
            case expression of
                Integer _ -> [ token "syntax-number" (Print.canonical expression) ]
                Boolean _ -> [ token "syntax-boolean" (Print.canonical expression) ]
                Variable name -> [ token "syntax-name" name ]
                ListLiteral values ->
                    [ text "[" ] ++ separated (List.indexedMap (\index value -> [ child index value ]) values) ++ [ text "]" ]
                Lambda name body ->
                    [ text "(", token "syntax-keyword" "\\", token "syntax-name" name, text " ", token "syntax-keyword" "->", text " ", child 0 body, text ")" ]
                Call function value ->
                    [ text "(", child 0 function, text " " ] ++ argument 1 value ++ [ text ")" ]
                Let name value body ->
                    [ text "(", token "syntax-keyword" "let", text " ", token "syntax-name" name, text " = ", child 0 value, text " ", token "syntax-keyword" "in", text " ", child 1 body, text ")" ]
                If condition yes no ->
                    [ text "(", token "syntax-keyword" "if", text " ", child 0 condition, text " ", token "syntax-keyword" "then", text " ", child 1 yes, text " ", token "syntax-keyword" "else", text " ", child 2 no, text ")" ]
                Binary operator left right ->
                    [ text "(", child 0 left, text " ", token "syntax-operator" operator, text " ", child 1 right, text ")" ]
                Native name [] -> [ token "syntax-name" name ]
                Native name values ->
                    [ text "(", token "syntax-name" name, text " " ]
                        ++ (List.indexedMap argument values |> List.intersperse [ text " " ] |> List.concat)
                        ++ [ text ")" ]
    in
    if selected == Just path then
        mark [ A.class "reduced-expression", A.attribute "data-testid" "reduced-expression" ] content
    else
        span [ A.class "expression-node" ] content
