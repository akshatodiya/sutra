module Sutra.Print exposing (canonical, source)

import Sutra.Ast exposing (Expr(..))


canonical : Expr -> String
canonical expression =
    case expression of
        Integer number -> numberText number
        Boolean boolean -> if boolean then "True" else "False"
        ListLiteral items -> "[" ++ String.join ", " (List.map canonical items) ++ "]"
        Lambda _ _ -> "<function>"
        Native _ _ -> "<function>"
        _ -> source expression


numberText : Float -> String
numberText number =
    if number == 0 then "0" else String.fromFloat number


source : Expr -> String
source expression =
    case expression of
        Integer number -> numberText number
        Boolean boolean -> if boolean then "True" else "False"
        ListLiteral items -> "[" ++ String.join ", " (List.map source items) ++ "]"
        Variable name -> name
        Lambda name body -> "(\\" ++ name ++ " -> " ++ source body ++ ")"
        Call function value -> "(" ++ source function ++ " " ++ argument value ++ ")"
        Let name value body -> "(let " ++ name ++ " = " ++ source value ++ " in " ++ source body ++ ")"
        If condition yes no -> "(if " ++ source condition ++ " then " ++ source yes ++ " else " ++ source no ++ ")"
        Binary operator left right -> "(" ++ source left ++ " " ++ operator ++ " " ++ source right ++ ")"
        Native name [] -> name
        Native name arguments -> "(" ++ name ++ " " ++ String.join " " (List.map argument arguments) ++ ")"


argument : Expr -> String
argument expression =
    case expression of
        Integer number ->
            if number < 0 then "(" ++ source expression ++ ")" else source expression
        _ -> source expression
