# Research & Architecture Decisions: CA Assist Chatbot

**Feature**: `001-ca-assist-chatbot`
**Date**: 2026-09-25
**Scope**: Vite + React + TypeScript static SPA on GitHub Pages using `gemma-4-26b-a4b-it` via Gemini `generateContent` REST endpoint.

---

### Decision 1: Model Choice and API Integration

- **Decision**: Use solely `gemma-4-26b-a4b-it` over the Google AI Studio / Gemini REST endpoint (`https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent?key=${API_KEY}`) using native browser `fetch`.
- **Rationale**: Mandated explicitly by Constitution Principle II and PRD Tech Stack. No other model or provider is permitted. A single constant in `src/services/gemini.ts` ensures zero configuration ambiguity.
- **Payload Schema**:
  - `systemInstruction`: `{ parts: [{ text: FIXED_SYSTEM_PROMPT }] }`
  - `contents`: array of turns mapping `{ role: "user" | "model", parts: [{ text: string }] }` representing full session history.
- **Alternatives Considered**:
  - `@google/genai` or `@google/generative-ai` SDK: Rejected to minimize bundle footprint, avoid transitive dependencies, prevent version conflicts, and strictly comply with the PRD constraint ("called with fetch").

---

### Decision 2: System Prompt & Guardrails for Indian CA Domain

- **Decision**: Define a single immutable system prompt string loaded into `systemInstruction`.
  - Prompt instructs the model to act as a knowledgeable Chartered Accountant focused exclusively on Indian Income Tax (IT Act 1961), Goods and Services Tax (GST Act 2017), Tax Deducted at Source (TDS), Income Tax Return (ITR 1 through 7) filing, and Indian Accounting Standards.
  - Mandates polite refusal and redirection for non-domain questions (e.g. general chit-chat, programming, foreign tax law, cooking recipes).
  - Explicitly instructs the assistant to frame all responses as general informational guidance and avoid claiming to provide personalized, legally binding professional representation.
- **Rationale**: Fulfills Constitution Principle I (Indian CA Domain and Responsible Guidance) and PRD FR-3, FR-4.
- **Alternatives Considered**:
  - Dynamic user-prompt prefixing: Rejected because `systemInstruction` is natively supported by the Gemini `generateContent` API and cleanly separates instruction from conversational turns.

---

### Decision 3: Client State Management & Request Lifecycle

- **Decision**: Manage conversation and request states using React built-in hooks (`useState`, `useRef`, `useCallback`) in a clean custom hook or modular app state.
  - Session state consists of `messages: Message[]`, `status: 'idle' | 'loading' | 'error'`, `errorMessage: string | null`, and `pendingRetryPrompt: string | null`.
  - Enforce a 30-second timeout using `AbortController` passed to `fetch`.
  - Categorize HTTP 429 errors into a specific, actionable rate-limit message: "Request limit reached. Google AI Studio rate limit exceeded. Please wait a moment and try again."
  - When an error occurs, preserve the user's last message in input or retry state so the user can re-trigger without retyping (PRD FR-6).
  - "New Chat" clears `messages`, aborts any pending `fetch`, and resets state to clean idle (PRD FR-9).
- **Rationale**: Complies with Constitution Principle III (minimal static SPA without external state management libraries like Redux/Zustand) and Principle IV (safety, 30s timeout, HTTP 429 clarity).
- **Alternatives Considered**:
  - Storing chat in `localStorage`: Rejected as the PRD explicitly non-goals chat persistence and Constitution Principle I/III forbids retaining conversation across sessions.

---

### Decision 4: Markdown & Formatting Rendering

- **Decision**: Render assistant responses using `react-markdown` with plain CSS styling for Markdown elements (`table`, `th`, `td`, `ul`, `ol`, `code`, `blockquote`, `strong`).
- **Rationale**: Mandated by PRD FR-7 and Tech Stack table ("Plain CSS (no UI library)", "react-markdown").
- **Alternatives Considered**:
  - Full component library (Tailwind, MUI, Chakra): Strictly forbidden by Constitution Principle III and PRD.

---

### Decision 5: Accessibility & WCAG 2.1 AA Compliance

- **Decision**:
  - Output an ARIA live region (`aria-live="polite"` or `role="status"`) for new assistant responses so screen readers announce incoming answers.
  - Implement full keyboard accessibility: Enter key sends message (Shift+Enter inserts newline in textarea), focus visible rings on buttons and inputs (`:focus-visible`), and accessible labels (`aria-label`) on all interactive controls.
  - Persistent footer disclaimer visibly rendered in HTML markup across all viewports.
- **Rationale**: Enforces Constitution Principle IV and PRD Non-functional requirement "WCAG 2.1 AA".
- **Alternatives Considered**:
  - Modal popups for disclaimer: Rejected because PRD FR-8 specifically mandates a persistent footer disclaimer.

---

### Decision 6: Environment, Secrets, and GitHub Pages Deployment

- **Decision**:
  - Browser API key resolved from `import.meta.env.VITE_GEMINI_API_KEY`.
  - Local development uses `.env.local` (checked in `.gitignore`).
  - Production build in GitHub Actions (`.github/workflows/deploy.yml`) injects `VITE_GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}`.
  - `vite.config.ts` sets `base: '/<repo-name>/'` (or dynamically `./` / repo name) to ensure all assets resolve on GitHub Pages.
  - Readme and setup docs explicitly document that any client-injected key is visible in client JS bundles and advise setting Google Cloud API restrictions / quotas.
- **Rationale**: Enforces Constitution Principle IV, Delivery Gates, and PRD Configuration section.
