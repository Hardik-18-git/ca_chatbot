# Tasks: CA Assist Chatbot

**Input**: Design documents from `specs/001-ca-assist-chatbot/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/gemini-api.md`, `quickstart.md`

**Tests**: No standalone test tasks are included because the feature specification does not explicitly request a test-first workflow. Each story includes independently verifiable acceptance criteria, and project lint, type-check, build, and quickstart validation are included as delivery tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and validation after shared setup and foundation tasks.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the planned static web application and its shared quality tooling.

- [x] T001 Create the Vite + React + TypeScript project manifest with `dev`, `build`, `lint`, and `type-check` scripts and only approved runtime dependencies in `package.json` and `package-lock.json`
- [x] T002 [P] Configure strict TypeScript compilation for browser application code in `tsconfig.json` and `tsconfig.app.json`
- [x] T003 [P] Configure ESLint for TypeScript and React in `eslint.config.js`
- [x] T004 [P] Ignore local environment files and generated build output in `.gitignore`
- [x] T005 Create the HTML document shell and Vite/React entry point in `index.html` and `src/main.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared types, application shell, base styling, and static-hosting configuration before story implementation.

**⚠️ CRITICAL**: Complete this phase before starting any user story.

- [x] T006 [P] Define `Message`, `MessageRole`, `ChatStatus`, `ChatError`, and typed Gemini request/response shapes in `src/types/index.ts`; require message `id` to be non-empty, reject whitespace-only submitted user content, and constrain chat status to `'idle' | 'loading' | 'error'`
- [x] T007 Create the shared app shell, in-memory state owner, and feature component mount points in `src/App.tsx`
- [x] T008 [P] Establish plain CSS design tokens, responsive page layout, readable typography, and visible `:focus-visible` baseline in `src/index.css`
- [x] T009 [P] Configure the repository-specific GitHub Pages base path in `vite.config.ts`

**Checkpoint**: The app builds as a static SPA with shared typed state and styles; user-story work can begin.

---

## Phase 3: User Story 1 - Get Indian Tax and Accounting Guidance (Priority: P1) 🎯 MVP

**Goal**: Let users ask supported Indian CA questions, receive relevant general information, get a polite redirect for off-topic questions, and continue with conversation context.

**Independent Test**: Ask a salaried ITR due-date question and a contextual follow-up; verify relevant responses reflect prior turns. Ask for a recipe; verify polite redirection. Confirm model selection is not offered and the persistent disclaimer is present.

### Implementation for User Story 1

- [x] T010 [US1] Implement the dedicated typed Gemini REST client in `src/services/gemini.ts` using only `gemma-4-26b-a4b-it` from one model constant, `generateContent`, the fixed CA system instruction, the full conversation history, and a fixed prompt that limits answers to Indian income tax, GST, TDS, ITR filing, and accounting, politely redirects off-topic questions, and avoids personalized professional advice
- [x] T011 [P] [US1] Implement assistant message rendering with Markdown support using `react-markdown` in `src/components/ChatMessage.tsx`
- [x] T012 [P] [US1] Implement the persistent exact-text general-information disclaimer in `src/components/Disclaimer.tsx`
- [x] T013 [US1] Connect conversation submission and typed Gemini responses to in-memory message state in `src/App.tsx`, preserving prior turns for contextual follow-ups and providing no model/service selector
- [x] T014 [US1] Render user and assistant message sequence with role-specific accessible structure in `src/components/ChatWindow.tsx`
- [x] T015 [P] [US1] Style user/assistant bubbles and Markdown lists, emphasis, and tables in `src/index.css`

**Checkpoint**: User can ask supported questions, receive context-aware formatted answers or an off-topic redirect, and see the disclaimer.

---

## Phase 4: User Story 2 - Understand Waiting and Recover from Errors (Priority: P2)

**Goal**: Communicate pending requests and recover from timeout, API, network, missing-configuration, and rate-limit failures without losing the submitted question.

**Independent Test**: Simulate a pending request, a request exceeding 30 seconds, a generic failure, and HTTP 429. Verify a thinking state, appropriately specific safe errors, preserved original prompt, and a working retry when service becomes available.

### Implementation for User Story 2

- [x] T016 [P] [US2] Implement a visible and screen-reader-announced “Thinking...” state in `src/components/ThinkingIndicator.tsx`
- [x] T017 [P] [US2] Implement user-safe error presentation and an accessible Retry action in `src/components/ErrorBanner.tsx`, with a specific rate-limit explanation for HTTP 429
- [x] T018 [US2] Add a 30-second `AbortController` timeout and typed classification for timeout, HTTP 429, network, missing-key, and API failures in `src/services/gemini.ts`
- [x] T019 [US2] Coordinate pending status, safe error state, preservation of the original prompt, retry, and pending-request cleanup in `src/App.tsx`
- [x] T020 [US2] Integrate the thinking state and error/retry banner with the conversation view in `src/components/ChatWindow.tsx`
- [x] T021 [P] [US2] Style pending and error/retry states with clear visual hierarchy and focus indication in `src/index.css`

**Checkpoint**: Slow and failed requests give users understandable feedback and a retry path without exposing credential values.

---

## Phase 5: User Story 3 - Manage and Access a Conversation (Priority: P3)

**Goal**: Support keyboard and on-screen message submission, responsive and accessible reading, New Chat clearing, and ephemeral conversation history.

**Independent Test**: Complete a chat using keyboard only at desktop and mobile viewport sizes. Verify visible focus, announcement of new replies, readable Markdown without horizontal overflow, New Chat clears messages and pending requests, and refreshing does not restore prior messages.

### Implementation for User Story 3

- [x] T022 [P] [US3] Implement the labelled message input, Enter-to-send behavior, Send action, disabled pending state, and New Chat control in `src/components/ChatInput.tsx`
- [x] T023 [US3] Wire message submission, input clearing, New Chat state reset, and cancellation/ignoring of prior in-flight responses in `src/App.tsx`
- [x] T024 [US3] Add a polite ARIA live region for newly received assistant replies and preserve keyboard-readable conversation semantics in `src/components/ChatWindow.tsx`
- [x] T025 [P] [US3] Implement mobile and desktop layouts, narrow-screen Markdown table handling, and responsive disclaimer placement in `src/index.css`
- [x] T026 [US3] Verify that conversation state uses memory only and add no browser storage or persistence in `src/App.tsx`

**Checkpoint**: The complete chat flow works with keyboard, assistive technology, and mobile/desktop layouts; New Chat and session end do not retain conversation history.

---

## Phase 6: Polish & Cross-Cutting Delivery

**Purpose**: Complete deployment and user-facing setup guidance, then validate end-to-end product and quality requirements.

- [x] T027 [P] Configure GitHub Pages deployment on `main` pushes and `workflow_dispatch`, with required permissions, Node 20, dependency install, lint/type-check gates, secret-to-build-time environment injection, artifact upload, and Pages deploy in `.github/workflows/deploy.yml`
- [x] T028 [P] Document local setup, `.env.local` configuration, GitHub Pages deployment, and the fact that a browser-exposed `VITE_` key is observable (with API/referrer restriction and quota guidance) in `README.md`
- [x] T029 Verify ESLint, strict type-check, production build, and gzip bundle size against the under-300-KB target using `package.json` scripts and the production `dist/` output
- [x] T030 Run the end-to-end scenarios and expected outcomes documented in `specs/001-ca-assist-chatbot/quickstart.md`

**Checkpoint**: The site is deployable by GitHub Actions with its API key sourced from an Actions secret and all validation gates passing.

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; establish project scripts, compiler/linter configuration, and browser entry point.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user-story implementation.
- **User Stories (Phases 3–5)**: Depend on the shared foundation. Recommended delivery order is P1 → P2 → P3. The stories are priority-ordered and can be implemented in parallel after foundation only where file ownership is coordinated; shared `src/App.tsx`, `src/ChatWindow.tsx`, and `src/index.css` integrations must be sequenced to avoid conflicts.
- **Polish (Phase 6)**: Deployment documentation and final end-to-end validation follow implementation; deployment workflow may be authored in parallel with UI work.

### User Story Dependencies

- **User Story 1 (P1)**: Depends on the shared foundation; no dependency on later stories. Delivers the core value and is the MVP.
- **User Story 2 (P2)**: Depends on the chat/API foundation and integrates with the P1 request flow; it can be validated independently by exercising request state and recovery.
- **User Story 3 (P3)**: Depends on the shared conversation state and integrates with P1/P2 UI; it can be validated independently for keyboard, responsiveness, new-chat reset, and ephemeral history.

### Parallel Opportunities

- Setup: T002, T003, and T004 can proceed in parallel once T001's project manifest choices are settled; T005 follows the package/project initialization.
- Foundation: T006, T008, and T009 touch separate files and can proceed in parallel; T007 consumes shared types and follows T006.
- US1: T010, T011, and T012 touch separate files and can proceed in parallel after foundational types exist; T013–T015 integrate the client, conversation rendering, and styling.
- US2: T016, T017, and T021 can proceed in parallel; T018 precedes T019, and T020 integrates both UI states.
- US3: T022 and T025 can proceed in parallel; T023 integrates input and state, and T024 integrates the live announcement behavior.
- Polish: T027 and T028 can proceed in parallel with one another; T029 and T030 require a buildable implementation.

## Parallel Example: User Story 1

```text
Parallel group: T010 typed Gemini client, T011 Markdown message renderer, and
T012 persistent disclaimer (separate files). Then integrate the app in T013–T014
and apply cross-message styling in T015.
```

## Parallel Example: User Story 2

```text
Parallel group: T016 thinking indicator, T017 error/retry banner, and T021
pending/error styling (separate files).
Then implement timeout/error classification in T018 and connect lifecycle state in T019–T020.
```

## Parallel Example: User Story 3

```text
Parallel group: T022 chat input and T025 responsive styling (separate files).
Then integrate New Chat/cancellation in T023 and live-region semantics in T024.
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational phases.
2. Implement User Story 1: supported CA guidance, conversation context, off-topic redirection, Markdown answers, and disclaimer.
3. Independently validate the P1 story against its acceptance criteria.
4. Add User Story 2 recovery behavior and User Story 3 accessibility/conversation management incrementally.
5. Complete deployment, security documentation, and final quality gates before release.

### Incremental Delivery

1. Setup + foundation → buildable static SPA baseline.
2. Add US1 → independently demonstrate CA-topic assistance (MVP).
3. Add US2 → independently demonstrate pending, timeout, rate-limit, and retry behavior.
4. Add US3 → independently demonstrate keyboard/mobile accessibility and clean conversation reset.
5. Complete delivery gates and deploy through GitHub Pages.

## Notes

- Every task uses the required checkbox, sequential ID, applicable `[P]` and `[US#]` labels, and an explicit file path.
- `[P]` is used only for tasks that can be worked on concurrently in separate files without depending on incomplete tasks.
- No test-writing tasks are included because the spec did not explicitly request a TDD/test-first approach.
- Never commit, print, or log an API key; a client-side `VITE_` key is observable by site visitors.
- The quickstart flows were exercised with browser-mocked Gemini success and rate-limit responses; a live provider request was not made because no real API key is configured.
