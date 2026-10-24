module Sutra.Ast exposing (Expr(..), Program, allNames, freeVariables, isValue, substitute)

import Dict exposing (Dict)
import Set exposing (Set)


type Expr
    = Integer Float
    | Boolean Bool
    | ListLiteral (List Expr)
    | Variable String
    | Lambda String Expr
    | Call Expr Expr
    | Let String Expr Expr
    | If Expr Expr Expr
    | Binary String Expr Expr
    | Native String (List Expr)


type alias Program =
    Dict String Expr


isValue : Expr -> Bool
isValue expression =
    case expression of
        Integer _ -> True
        Boolean _ -> True
        Lambda _ _ -> True
        Native _ _ -> True
        ListLiteral values -> List.all isValue values
        _ -> False


freeVariables : Expr -> Set String
freeVariables expression =
    case expression of
        Variable name -> Set.singleton name
        Lambda name body -> Set.remove name (freeVariables body)
        Let name value body -> Set.union (freeVariables value) (Set.remove name (freeVariables body))
        _ -> children expression |> List.map freeVariables |> List.foldl Set.union Set.empty


allNames : Expr -> Set String
allNames expression =
    let
        below = children expression |> List.map allNames |> List.foldl Set.union Set.empty
    in
    case expression of
        Variable name -> Set.insert name below
        Lambda name _ -> Set.insert name below
        Let name _ _ -> Set.insert name below
        _ -> below


children : Expr -> List Expr
children expression =
    case expression of
        ListLiteral values -> values
        Lambda _ body -> [ body ]
        Call function argument -> [ function, argument ]
        Let _ value body -> [ value, body ]
        If condition yes no -> [ condition, yes, no ]
        Binary _ left right -> [ left, right ]
        Native _ arguments -> arguments
        _ -> []


substitute : String -> Expr -> Expr -> Expr
substitute target replacement expression =
    replace target replacement (freeVariables replacement) expression


replace : String -> Expr -> Set String -> Expr -> Expr
replace target replacement replacementFree expression =
    let
        go = replace target replacement replacementFree

        underBinder name body =
            if name == target || not (Set.member target (freeVariables body)) then
                ( name, body )
            else if Set.member name replacementFree then
                let
                    taken = Set.insert target (Set.union (allNames body) (allNames replacement))
                    fresh = freshName name taken 1
                    renamed = substitute name (Variable fresh) body
                in
                ( fresh, go renamed )
            else
                ( name, go body )
    in
    case expression of
        Variable name -> if name == target then replacement else expression
        Lambda name body ->
            let
                ( safeName, safeBody ) = underBinder name body
            in
            Lambda safeName safeBody
        Let name value body ->
            let
                ( safeName, safeBody ) = underBinder name body
            in
            Let safeName (go value) safeBody
        ListLiteral values -> ListLiteral (List.map go values)
        Call function argument -> Call (go function) (go argument)
        If condition yes no -> If (go condition) (go yes) (go no)
        Binary operator left right -> Binary operator (go left) (go right)
        Native name arguments -> Native name (List.map go arguments)
        _ -> expression


freshName : String -> Set String -> Int -> String
freshName base taken number =
    let
        candidate = base ++ "_" ++ String.fromInt number
    in
    if Set.member candidate taken then freshName base taken (number + 1) else candidate
