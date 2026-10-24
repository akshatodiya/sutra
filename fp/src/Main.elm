module Main exposing (main)

import Browser
import Browser.Dom
import Browser.Events
import Html exposing (Html, button, code, div, footer, h1, h2, h3, header, input, label, main_, option, p, section, select, span, text, textarea)
import Html.Attributes as A
import Html.Events exposing (onClick, onInput)
import Json.Decode as Decode
import Sutra.Ast as Ast
import Sutra.Examples as Examples
import Sutra.ExpressionView as ExpressionView
import Sutra.Print as Print
import Sutra.Session as Session exposing (Session)
import Sutra.Showcase as Showcase
import Task
import Time


type Page
    = Playground
    | ModelAnswers


type alias AnswerContext =
    { task : String, model : String, verdict : String, expect : String }


type alias Model =
    { program : String
    , expression : String
    , example : String
    , limit : String
    , interval : Int
    , session : Maybe Session
    , error : Maybe String
    , playing : Bool
    , page : Page
    , showcase : Showcase.Data
    , showcaseError : Maybe String
    , selectedTask : Int
    , answerContext : Maybe AnswerContext
    }


type Msg
    = EditProgram String
    | EditExpression String
    | ChooseExample String
    | EditLimit String
    | ChangeSpeed String
    | Next
    | Previous
    | ToggleRun
    | Reset
    | Tick Time.Posix
    | ShowPage Page
    | ChooseTask String
    | InspectAnswer Int Int
    | FocusFinished


main : Program Decode.Value Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = \message model ->
            ( update message model
            , case message of
                InspectAnswer _ _ -> Browser.Dom.focus "control-step" |> Task.attempt (\_ -> FocusFinished)
                _ -> Cmd.none
            )
        , subscriptions = \model ->
            if model.page == ModelAnswers then Sub.none
            else Sub.batch [ Browser.Events.onKeyDown keyboardShortcut, if model.playing then Time.every (toFloat model.interval) Tick else Sub.none ]
        }


init : Decode.Value -> ( Model, Cmd Msg )
init flags =
    let
        initial = exampleModel Examples.first
        loaded =
            case Showcase.decode flags of
                Ok data -> { initial | showcase = data }
                Err error -> { initial | showcaseError = Just error }
    in
    ( load loaded, Cmd.none )


keyboardShortcut : Decode.Decoder Msg
keyboardShortcut =
    Decode.map3
        (\key blocked editing -> { key = key, blocked = blocked, editing = editing })
        (Decode.field "key" Decode.string)
        (Decode.map5 (\ctrl alt meta shift consumed -> ctrl || alt || meta || shift || consumed)
            (Decode.field "ctrlKey" Decode.bool)
            (Decode.field "altKey" Decode.bool)
            (Decode.field "metaKey" Decode.bool)
            (Decode.field "shiftKey" Decode.bool)
            (Decode.field "defaultPrevented" Decode.bool)
        )
        (Decode.field "target"
            (Decode.map2
                (\tag editable -> editable || List.member (String.toUpper tag) [ "INPUT", "TEXTAREA", "SELECT", "OPTION" ])
                (Decode.field "tagName" Decode.string)
                (Decode.oneOf [ Decode.field "isContentEditable" Decode.bool, Decode.succeed False ])
            )
        )
        |> Decode.andThen
            (\event ->
                if event.blocked || event.editing then Decode.fail "keep the native editing shortcut"
                else
                    case event.key of
                        "ArrowRight" -> Decode.succeed Next
                        "ArrowLeft" -> Decode.succeed Previous
                        _ -> Decode.fail "not a playback shortcut"
            )


exampleModel : Examples.Example -> Model
exampleModel example =
    { program = example.program, expression = example.expression, example = example.id
    , limit = "10000", interval = 220, session = Nothing, error = Nothing, playing = False
    , page = Playground, showcase = Showcase.empty, showcaseError = Nothing, selectedTask = 0, answerContext = Nothing
    }


load : Model -> Model
load model =
    let
        parsed =
            case String.toInt model.limit of
                Just limit -> Session.start limit model.program model.expression
                Nothing -> Err "input_error: enter a step limit from 0 to 10000"
    in
    case parsed of
        Ok session -> { model | session = Just session, error = Nothing, playing = False }
        Err error -> { model | session = Nothing, error = Just error, playing = False }


invalidate : Model -> Model
invalidate model =
    { model | session = Nothing, error = Nothing, playing = False }


prepared : Model -> Model
prepared model =
    if model.session == Nothing then load model else model


next : Model -> Model
next model =
    let
        ready = prepared model
    in
    case ready.session of
        Nothing -> ready
        Just session ->
            let
                advanced = Session.advance session
            in
            { ready | session = Just advanced, playing = model.playing && not (Session.finished advanced) }


update : Msg -> Model -> Model
update message model =
    case message of
        EditProgram source -> invalidate { model | program = source, example = "custom", answerContext = Nothing }
        EditExpression source -> invalidate { model | expression = source, example = "custom", answerContext = Nothing }
        EditLimit source -> invalidate { model | limit = source }
        ChangeSpeed source -> { model | interval = String.toInt source |> Maybe.withDefault 220 }
        ChooseExample key ->
            case Examples.find key of
                Just example ->
                    load { model | program = example.program, expression = example.expression, example = example.id, answerContext = Nothing }
                Nothing -> model
        Next -> next { model | playing = False }
        Previous -> { model | session = Maybe.map Session.back model.session, playing = False }
        Reset -> load model
        ToggleRun ->
            if model.playing then { model | playing = False }
            else
                let
                    ready = prepared model
                in
                { ready | playing = ready.session |> Maybe.map (not << Session.finished) |> Maybe.withDefault False }
        Tick _ -> if model.playing && model.page == Playground then next model else model
        ShowPage page -> { model | page = page, playing = False }
        ChooseTask source ->
            case String.toInt source of
                Just index ->
                    case Showcase.entryAt index model.showcase of
                        Just _ -> { model | selectedTask = index }
                        Nothing -> model
                Nothing -> model
        InspectAnswer taskIndex answerIndex ->
            case Showcase.entryAt taskIndex model.showcase of
                Nothing -> model
                Just entry ->
                    case Showcase.answerAt answerIndex entry of
                        Nothing -> model
                        Just answer ->
                            load { model | program = answer.program, expression = entry.expr, example = "custom"
                                 , limit = "10000", page = Playground, selectedTask = taskIndex
                                 , answerContext = Just { task = entry.task, model = answer.model, verdict = answer.verdict, expect = entry.expect }
                                 }
        FocusFinished -> model


view : Model -> Html Msg
view model =
    div [ A.class "app-shell" ]
        [ header [ A.class "masthead" ]
            [ div [ A.class "brand" ]
                [ span [ A.class "brand-symbol", A.attribute "aria-hidden" "true" ] [ text "λ" ]
                , span [ A.class "brand-name" ] [ text "Sutra" ]
                , span [ A.class "brand-divider" ] []
                , span [ A.class "brand-caption" ] [ text "A language, made visible." ]
                ]
            , div [ A.class "local-badge" ] [ span [ A.class "status-dot" ] [], text "Runs entirely in your browser" ]
            ]
        , main_ []
            [ section [ A.class "intro" ]
                [ p [ A.class "eyebrow" ] [ text "THE SMALL-STEP PLAYGROUND" ]
                , h1 [] [ text "See how a program", Html.br [] [], span [] [ text "becomes a value." ] ]
                , p [ A.class "intro-copy" ] [ text "A tiny functional language. Every rewrite in the open. Pick an example, follow a function, and watch the cells move." ]
                , div [ A.class "intro-note" ] [ span [] [ text "01" ], text " Edit", span [] [ text "02" ], text " Step", span [] [ text "03" ], text " Understand" ]
                ]
            , div [ A.class "view-switch", A.attribute "role" "group", A.attribute "aria-label" "Visualizer view" ]
                [ viewSwitch model.page Playground "Playground", viewSwitch model.page ModelAnswers "Model answers" ]
            , case model.page of
                Playground ->
                    div []
                        [ viewAnswerContext model
                        , div [ A.class "workspace" ] [ viewEditor model, viewExecution model ]
                        ]
                ModelAnswers ->
                    case model.showcaseError of
                        Nothing -> Showcase.view ChooseTask InspectAnswer model.selectedTask model.showcase
                        Just error ->
                            div [ A.class "error-panel", A.attribute "role" "alert" ]
                                [ h2 [] [ text "Could not load model answers" ]
                                , p [] [ text "Check assets/showcase.json and run npm run build:showcase. The playground is still available." ]
                                , code [] [ text error ]
                                ]
            ]
        , footer [ A.class "footer" ]
            [ span [] [ text "SUTRA", span [ A.class "footer-separator" ] [ text "/" ], text "Pure functions. Visible computation." ]
            , span [] [ text "Written in Elm · Syntax Error 2026" ]
            ]
        ]


viewSwitch : Page -> Page -> String -> Html Msg
viewSwitch current target name =
    button [ A.type_ "button", A.classList [ ( "view-button", True ), ( "is-selected", current == target ) ]
           , A.attribute "aria-pressed" (if current == target then "true" else "false"), onClick (ShowPage target)
           ] [ text name ]


viewAnswerContext : Model -> Html Msg
viewAnswerContext model =
    case model.answerContext of
        Nothing -> text ""
        Just context ->
            div [ A.class "answer-context", A.attribute "data-testid" "answer-context" ]
                [ div []
                    [ p [ A.class "field-label" ] [ text ("INSPECTING " ++ String.toUpper context.model) ]
                    , h2 [] [ text context.task ]
                    , p [] [ text "Reported verdict: ", span [ A.class ("verdict-badge verdict-" ++ context.verdict) ] [ text (Showcase.verdictLabel context.verdict) ], text " · Expected example value: ", code [] [ text context.expect ] ]
                    ]
                , button [ A.type_ "button", A.class "control-button button-secondary", onClick (ShowPage ModelAnswers) ] [ text "Back to model answers" ]
                ]


viewEditor : Model -> Html Msg
viewEditor model =
    section [ A.class "panel editor-panel", A.attribute "aria-label" "Program editor" ]
        [ div [ A.class "panel-heading" ]
            [ div [ A.class "section-title" ] [ span [] [ text "01" ], h2 [] [ text "The program" ] ]
            , span [ A.class "language-tag" ] [ text "SUTRA" ]
            ]
        , div [ A.class "editor-body" ]
            [ label [ A.for "example-picker", A.class "field-label" ] [ text "START WITH AN EXAMPLE" ]
            , select [ A.id "example-picker", A.class "example-picker", A.value model.example, onInput ChooseExample, A.attribute "aria-label" "Example program" ]
                (option [ A.value "custom", A.disabled True, A.selected (model.example == "custom") ] [ text "Custom program" ]
                    :: List.map (\example -> option [ A.value example.id, A.selected (model.example == example.id) ] [ text example.name ]) Examples.all
                )
            , p [ A.class "example-description" ]
                [ text (Examples.find model.example |> Maybe.map .description |> Maybe.withDefault "Your own definitions and expression. Step or Run to begin.") ]
            , div [ A.class "field-heading" ]
                [ label [ A.for "program-source", A.class "field-label" ] [ text "DEFINITIONS" ]
                , span [] [ text "editable" ]
                ]
            , div [ A.class "code-editor" ]
                [ div [ A.class "editor-gutter", A.attribute "aria-hidden" "true" ]
                    (List.range 1 (max 8 (List.length (String.lines model.program))) |> List.map (\number -> div [] [ text (String.fromInt number) ]))
                , textarea
                    [ A.id "program-source", A.value model.program, onInput EditProgram
                    , A.rows 8, A.spellcheck False, A.attribute "aria-label" "Program"
                    , A.attribute "autocapitalize" "off", A.attribute "autocomplete" "off"
                    ] []
                ]
            , label [ A.for "expression-source", A.class "field-label expression-label" ] [ text "EXPRESSION TO EVALUATE" ]
            , div [ A.class "expression-input-wrap" ]
                [ span [ A.attribute "aria-hidden" "true" ] [ text "›" ]
                , input [ A.id "expression-source", A.value model.expression, onInput EditExpression, A.spellcheck False, A.attribute "aria-label" "Expression", A.attribute "autocapitalize" "off" ] []
                ]
            , div [ A.class "editor-settings" ]
                [ label [ A.for "step-limit" ] [ text "Step limit" ]
                , input [ A.id "step-limit", A.type_ "number", A.min "0", A.max "10000", A.step "1", A.value model.limit, onInput EditLimit, A.attribute "aria-label" "Maximum steps" ] []
                , span [] [ text "up to 10,000" ]
                ]
            , div [ A.class "language-note" ]
                [ span [ A.attribute "aria-hidden" "true" ] [ text "↳" ]
                , p [] [ text "Numbers, lists, lambdas, local bindings, and recursion. Small pieces; interesting behavior." ]
                ]
            ]
        ]


viewExecution : Model -> Html Msg
viewExecution model =
    let
        frame = Maybe.map Session.current model.session
        count = frame |> Maybe.map .steps |> Maybe.withDefault 0
        error = model.error |> orElse (frame |> Maybe.andThen .error)
        done = frame |> Maybe.map (\current -> current.error == Nothing && Ast.isValue current.expression) |> Maybe.withDefault False
        status = if error /= Nothing then "Stopped" else if done then "Complete" else if model.playing then "Running" else if count > 0 then "Paused" else "Ready"
        terminal = model.session |> Maybe.map Session.finished |> Maybe.withDefault False
        canBack = model.session |> Maybe.map (\session -> session.cursor > 0) |> Maybe.withDefault False
    in
    section [ A.class "panel execution-panel", A.attribute "aria-label" "Execution visualizer" ]
        [ div [ A.class "panel-heading" ]
            [ div [ A.class "section-title" ] [ span [] [ text "02" ], h2 [] [ text "The reduction" ] ]
            , span [ A.classList [ ( "execution-status", True ), ( "is-running", model.playing ), ( "is-complete", done ), ( "is-error", error /= Nothing ) ], A.attribute "role" "status", A.attribute "aria-live" "polite" ]
                [ span [ A.class "status-dot" ] [], text status ]
            ]
        , div [ A.class "execution-body" ]
            [ div [ A.class "control-bar" ]
                [ div [ A.class "playback-controls" ]
                    [ control "Back" "←" "button-secondary" (not canBack) Previous
                    , control "Step" "→" "button-primary" terminal Next
                    , control (if model.playing then "Pause" else "Run") (if model.playing then "Ⅱ" else "▷") "button-secondary" (terminal && not model.playing) ToggleRun
                    , control "Reset" "↺" "button-reset" False Reset
                    ]
                , div [ A.class "speed-setting" ]
                    [ label [ A.for "playback-speed" ] [ text "Speed" ]
                    , select [ A.id "playback-speed", A.value (String.fromInt model.interval), onInput ChangeSpeed, A.attribute "aria-label" "Playback speed" ]
                        [ option [ A.value "600", A.selected (model.interval == 600) ] [ text "Slow" ], option [ A.value "220", A.selected (model.interval == 220) ] [ text "Normal" ], option [ A.value "40", A.selected (model.interval == 40) ] [ text "Fast" ] ]
                    ]
                ]
            , div [ A.class "keyboard-hints", A.attribute "role" "note", A.attribute "aria-label" "Keyboard shortcuts" ]
                [ Html.kbd [] [ text "←" ], text "Back"
                , Html.kbd [] [ text "→" ], text "Step"
                , span [] [ text "when not editing" ]
                ]
            , div [ A.class "trace-heading" ]
                [ div [ A.class "step-count" ] [ span [ A.attribute "data-testid" "step-counter", A.attribute "data-step" (String.fromInt count) ] [ text (String.padLeft 2 '0' (String.fromInt count)) ], text " reductions" ]
                , span [ A.class "rule-pill", A.attribute "data-testid" "reduction-rule" ]
                    [ text (frame |> Maybe.andThen .rule |> Maybe.map ruleLabel |> Maybe.withDefault "Initial expression") ]
                ]
            , viewCurrent model frame
            , div [ A.class "highlight-key" ] [ span [] [], text "Highlighted: the term rewritten in the last step" ]
            , viewActivity (frame |> Maybe.andThen .activity)
            , case error of
                Just message -> viewError message
                Nothing ->
                    if done then
                        div [ A.class "result-panel", A.attribute "data-testid" "result-panel", A.attribute "aria-live" "polite" ]
                            [ div [] [ span [ A.class "result-icon" ] [ text "✓" ], span [ A.class "field-label" ] [ text "FINAL VALUE" ] ]
                            , code [ A.attribute "data-testid" "final-value" ] [ text (frame |> Maybe.map (.expression >> Print.canonical) |> Maybe.withDefault "") ]
                            , case model.answerContext of
                                Nothing -> text ""
                                Just context ->
                                    let
                                        value = frame |> Maybe.map (.expression >> Print.canonical) |> Maybe.withDefault ""
                                    in
                                    p [ A.class "example-outcome", A.attribute "data-testid" "example-outcome" ]
                                        [ text (if value == context.expect then "Matches this example." else "Does not match this example. Expected " ++ context.expect ++ ".") ]
                            ]
                    else
                        p [ A.class "execution-hint" ] [ text (if model.session == Nothing then "Your edits are ready. Step or Run to evaluate them." else "Step changes one term. Back returns to the exact previous state.") ]
            ]
        ]


orElse : Maybe a -> Maybe a -> Maybe a
orElse fallback preferred =
    case preferred of
        Just _ -> preferred
        Nothing -> fallback


control : String -> String -> String -> Bool -> Msg -> Html Msg
control name icon className disabled message =
    button
        ([ A.id ("control-" ++ String.toLower name), A.type_ "button", A.class ("control-button " ++ className), A.disabled disabled, onClick message
         , A.attribute "aria-label" name, A.title (name ++ (if name == "Step" then " (→)" else if name == "Back" then " (←)" else ""))
         ]
            ++ (if name == "Step" then [ A.attribute "aria-keyshortcuts" "ArrowRight" ]
                else if name == "Back" then [ A.attribute "aria-keyshortcuts" "ArrowLeft" ] else [])
        )
        [ span [ A.attribute "aria-hidden" "true" ] [ text icon ], text name ]


viewCurrent : Model -> Maybe Session.Frame -> Html Msg
viewCurrent model frame =
    div [ A.class "expression-stage" ]
        [ div [ A.class "stage-label" ] [ text "CURRENT EXPRESSION" ]
        , div [ A.class "current-expression", A.attribute "data-testid" "current-expression", A.attribute "aria-label" "Current expression" ]
            [ case frame of
                Just current -> ExpressionView.view current.focus current.expression
                Nothing -> span [ A.class "empty-expression" ] [ text "Your next reduction starts here." ]
            ]
        , case model.session |> Maybe.andThen Session.previous of
            Nothing -> text ""
            Just before ->
                div [ A.class "previous-expression" ]
                    [ span [ A.class "stage-label" ] [ text "BEFORE THIS STEP" ]
                    , code [ A.attribute "aria-label" "Previous expression" ] [ text (Print.source before.expression) ]
                    ]
        ]


viewActivity : Maybe Session.VisualActivity -> Html Msg
viewActivity activity =
    div [ A.class "activity-panel", A.attribute "data-testid" "list-activity" ]
        [ div [ A.class "activity-heading" ]
            [ span [ A.class "field-label" ] [ text "LIST ACTIVITY" ]
            , activity |> Maybe.map (\active -> code [ A.class "operation-tag", A.attribute "data-testid" "active-operation" ] [ text active.name ]) |> Maybe.withDefault (span [ A.class "activity-empty-tag" ] [ text "waiting for a list" ])
            ]
        , case activity of
            Nothing ->
                div [ A.class "activity-placeholder" ]
                    [ div [ A.class "placeholder-cells", A.attribute "aria-hidden" "true" ] [ span [] [], span [] [], span [] [], span [] [] ]
                    , p [] [ text "Map, filter, and fold make their next move here." ]
                    ]
            Just active ->
                let
                    count = List.length active.original
                    windowStart = if count <= 7 then 0 else active.index |> Maybe.map (\index -> max 0 (index - 2)) |> Maybe.withDefault 0
                    visibleItems = List.drop windowStart active.original |> List.take 7
                    windowEnd = windowStart + List.length visibleItems
                    processed index =
                        case active.index of
                            Nothing -> True
                            Just current -> if active.name == "foldr" && active.phase /= "Unfolding" then index > current else index < current
                    cell index value =
                        let
                            current = active.index == Just index
                        in
                        div
                            [ A.classList [ ( "list-cell", True ), ( "is-active", current ), ( "is-processed", processed index ) ]
                            , A.attribute "role" "listitem", A.attribute "data-cell-index" (String.fromInt index)
                            , A.attribute "aria-current" (if current then "step" else "false")
                            , A.title ("Cell " ++ String.fromInt (index + 1) ++ ": " ++ Print.canonical value)
                            ]
                            [ span [ A.class "cell-index" ] [ text (String.fromInt (index + 1)) ]
                            , code [] [ text (Print.canonical value) ]
                            , span [ A.class "cell-marker", A.attribute "aria-hidden" "true" ] [ text (if current then "↑" else if processed index then "·" else "") ]
                            ]
                in
                div []
                    [ div [ A.class "activity-caption" ]
                        [ span [] [ text active.phase ]
                        , span [] [ text (active.index |> Maybe.map (\index -> "cell " ++ String.fromInt (index + 1) ++ " / " ++ String.fromInt count) |> Maybe.withDefault (String.fromInt count ++ " cells")) ]
                        ]
                    , div [ A.class "list-cells", A.attribute "role" "list", A.attribute "aria-label" "Input list" ]
                        (if List.isEmpty active.original then [ code [ A.class "empty-list" ] [ text "[] · empty list" ] ]
                         else (if windowStart > 0 then [ span [ A.class "more-cells" ] [ text ("… " ++ String.fromInt windowStart ++ " earlier") ] ] else [])
                            ++ List.indexedMap (\index item -> cell (windowStart + index) item) visibleItems
                            ++ (if count > windowEnd then [ span [ A.class "more-cells" ] [ text ("+" ++ String.fromInt (count - windowEnd) ++ " cells") ] ] else [])
                        )
                    , case active.accumulator of
                        Nothing -> text ""
                        Just accumulator ->
                            div [ A.class "accumulator" ]
                                [ span [ A.class "field-label" ] [ text "ACCUMULATOR" ]
                                , code [ A.attribute "data-testid" "accumulator" ] [ text (Print.canonical accumulator) ]
                                ]
                    ]
        ]


viewError : String -> Html Msg
viewError message =
    let
        title =
            if message == "step_limit" then "Step limit reached"
            else if String.startsWith "parse_error:" message then "Parse error"
            else if String.startsWith "type_error:" message then "Type error"
            else if String.startsWith "unbound:" message then "Unbound name"
            else if String.startsWith "input_error:" message then "Check the step limit"
            else "Runtime error"
    in
    div [ A.class "error-panel", A.attribute "role" "alert", A.attribute "data-testid" "error-panel" ]
        [ h3 [] [ text title ], code [] [ text message ]
        , p [] [ text (if message == "step_limit" then "Use Back or Reset to inspect this computation." else "Edit your program or expression, then Step or Reset to try again.") ]
        ]


ruleLabel : String -> String
ruleLabel rule =
    case rule of
        "definition" -> "Unfold definition"
        "builtin_reference" -> "Resolve built-in"
        "partial_application" -> "Apply one argument"
        "beta" -> "Substitute argument"
        "let" -> "Substitute local value"
        "operator" -> "Evaluate operator"
        "short_circuit" -> "Short-circuit branch"
        "boolean_operator" -> "Evaluate boolean"
        "if_true" -> "Choose true branch"
        "if_false" -> "Choose false branch"
        _ -> String.replace "_cons" " · visit cell" rule |> String.replace "_empty" " · empty list"
