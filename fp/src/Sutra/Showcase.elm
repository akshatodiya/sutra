module Sutra.Showcase exposing (Answer, Data, Entry, answerAt, decode, empty, entryAt, verdictLabel, view)

import Html exposing (Html, button, code, div, h2, h3, label, option, p, pre, section, select, span, text)
import Html.Attributes as A
import Html.Events exposing (onClick, onInput)
import Json.Decode as Decode


type alias Answer =
    { model : String, program : String, verdict : String }


type alias Entry =
    { task : String, expr : String, expect : String, answers : List Answer }


type alias Data =
    { entries : List Entry, isSample : Bool }


empty : Data
empty =
    { entries = [], isSample = False }


decode : Decode.Value -> Result String Data
decode value =
    Decode.decodeValue
        (Decode.map2 Data
            (Decode.field "entries" (Decode.list entryDecoder))
            (Decode.field "isSample" Decode.bool)
        )
        value
        |> Result.mapError Decode.errorToString


entryDecoder : Decode.Decoder Entry
entryDecoder =
    Decode.map4 Entry
        (Decode.field "task" Decode.string)
        (Decode.field "expr" Decode.string)
        (Decode.field "expect" Decode.string)
        (Decode.field "answers" (Decode.list answerDecoder))


answerDecoder : Decode.Decoder Answer
answerDecoder =
    Decode.map3 Answer
        (Decode.field "model" Decode.string)
        (Decode.field "program" Decode.string)
        (Decode.field "verdict"
            (Decode.string
                |> Decode.andThen
                    (\verdict ->
                        if List.member verdict [ "pass", "parse_error", "unbound", "type_error", "runtime_error", "step_limit", "wrong_answer" ] then
                            Decode.succeed verdict
                        else
                            Decode.fail ("Unknown verdict: " ++ verdict)
                    )
            )
        )


entryAt : Int -> Data -> Maybe Entry
entryAt index data =
    at index data.entries


answerAt : Int -> Entry -> Maybe Answer
answerAt index entry =
    at index entry.answers


at : Int -> List a -> Maybe a
at index items =
    if index < 0 then Nothing else List.head (List.drop index items)


verdictLabel : String -> String
verdictLabel verdict =
    case verdict of
        "pass" -> "Pass"
        "parse_error" -> "Parse error"
        "unbound" -> "Unbound name"
        "type_error" -> "Type error"
        "runtime_error" -> "Runtime error"
        "step_limit" -> "Step limit"
        "wrong_answer" -> "Wrong answer"
        _ -> verdict


describe : String -> String
describe model =
    case model of
        "base" -> "NO TRAINING"
        "raw" -> "TRAINED ON UNCHECKED DATA"
        "curated" -> "TRAINED ON CHECKED DATA"
        _ -> ""


view : (String -> msg) -> (Int -> Int -> msg) -> Int -> Data -> Html msg
view choose inspect selected data =
    section [ A.class "panel showcase-panel", A.attribute "aria-label" "Model answers" ]
        [ div [ A.class "panel-heading" ]
            [ div [ A.class "section-title" ] [ span [] [ text "03" ], h2 [] [ text "Model answers" ] ]
            , span [ A.class "language-tag" ] [ text (String.fromInt (List.length data.entries) ++ " TASKS") ]
            ]
        , div [ A.class "showcase-body" ]
            [ if data.isSample then
                p [ A.class "sample-notice", A.attribute "data-testid" "sample-notice" ]
                    [ span [] [ text "Sample data" ], text ": illustrative programs, not model results. These two tasks are made up for the tests." ]
              else text ""
            , if List.isEmpty data.entries then
                p [ A.class "showcase-empty" ] [ text "No model answers yet. Add tasks to assets/showcase.json and rebuild the showcase." ]
              else
                div []
                    [ label [ A.for "showcase-task", A.class "field-label" ] [ text "PICK A TASK (NONE OF THESE WERE IN TRAINING)" ]
                    , select [ A.id "showcase-task", A.class "example-picker", A.attribute "aria-label" "Showcase task", A.value (String.fromInt selected), onInput choose ]
                        (List.indexedMap (\index entry -> option [ A.value (String.fromInt index), A.selected (index == selected) ] [ text entry.task ]) data.entries)
                    , case entryAt selected data of
                        Nothing -> text ""
                        Just entry ->
                            div []
                                [ div [ A.class "task-detail" ]
                                    [ h3 [] [ text entry.task ]
                                    , div [ A.class "task-examples" ]
                                        [ div [] [ span [ A.class "field-label" ] [ text "INPUT" ], code [ A.attribute "data-testid" "showcase-expression" ] [ text entry.expr ] ]
                                        , div [] [ span [ A.class "field-label" ] [ text "EXPECTED ANSWER" ], code [ A.attribute "data-testid" "showcase-expected" ] [ text entry.expect ] ]
                                        ]
                                    ]
                                , p [ A.class "showcase-copy" ] [ text "The same 1.5B model, trained three ways, tried this task. Press the button under any answer to run it step by step." ]
                                , if List.isEmpty entry.answers then
                                    p [ A.class "showcase-empty" ] [ text "This task has no model answers yet." ]
                                  else
                                    div [ A.class "model-grid" ]
                                        (List.indexedMap
                                            (\index answer ->
                                                section [ A.class "model-card", A.attribute "aria-label" (answer.model ++ " answer"), A.attribute "data-testid" "model-card" ]
                                                    [ div [ A.class "model-card-heading" ]
                                                        [ h3 [] [ text answer.model ]
                                                        , span [ A.class ("verdict-badge verdict-" ++ answer.verdict), A.attribute "data-verdict" answer.verdict, A.title "Reported verdict" ] [ text (verdictLabel answer.verdict) ]
                                                        ]
                                                    , p [ A.class "field-label verdict-caption" ] [ text (describe answer.model) ]
                                                    , pre [ A.class "model-source" ] [ code [] [ text answer.program ] ]
                                                    , if String.isEmpty answer.program then p [ A.class "empty-program" ] [ text "Empty program" ] else text ""
                                                    , button [ A.type_ "button", A.class "control-button button-primary inspect-answer", A.attribute "aria-label" ("Inspect " ++ answer.model), onClick (inspect selected index) ] [ text "Run it step by step", span [ A.attribute "aria-hidden" "true" ] [ text "→" ] ]
                                                    ]
                                            )
                                            entry.answers
                                        )
                                ]
                    ]
            ]
        ]
