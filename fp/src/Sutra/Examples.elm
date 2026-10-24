module Sutra.Examples exposing (Example, all, first, find)


type alias Example =
    { id : String, name : String, description : String, program : String, expression : String }


first : Example
first =
    { id = "map", name = "Map · double each number"
    , description = "Apply a function to each cell, one at a time."
    , program = "-- A small function, applied to every cell.\ndouble x = x * 2"
    , expression = "map double [1, 2, 3, 4]"
    }


all : List Example
all =
    [ first
    , { id = "filter", name = "Filter · keep even numbers"
      , description = "Test each cell and keep the ones that match."
      , program = "isEven x = x % 2 == 0", expression = "filter isEven [1, 2, 3, 4, 5, 6]"
      }
    , { id = "foldl", name = "Fold left · build a sum"
      , description = "Carry an accumulator from the leftmost cell to the right."
      , program = "add acc x = acc + x", expression = "foldl add 0 [1, 2, 3, 4]"
      }
    , { id = "foldr", name = "Fold right · rebuild a list"
      , description = "Unfold the list, then combine cells from right to left."
      , program = "prepend x acc = x : acc", expression = "foldr prepend [] [1, 2, 3, 4]"
      }
    , { id = "factorial", name = "Recursion · factorial"
      , description = "Follow a recursive definition down to its base case and back."
      , program = "fact n =\n    if n <= 1 then 1\n    else n * fact (n - 1)", expression = "fact 5"
      }
    , { id = "let", name = "Let · a local binding"
      , description = "Evaluate a local value, substitute it, and keep reducing."
      , program = "-- This expression needs no top-level definitions.", expression = "let doubled = 3 * 2 in doubled + 1"
      }
    ]


find : String -> Maybe Example
find key =
    List.filter (\example -> example.id == key) all |> List.head
