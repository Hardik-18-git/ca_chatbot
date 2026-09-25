# Implementation Plan: CA Assist Chatbot

**Branch**: `001-ca-assist-chatbot` | **Date**: 2026-09-25 | **Spec**: [specs/001-ca-assist-chatbot/spec.md](specs/001-ca-assist-chatbot/spec.md)

**Input**: Feature specification from `/specs/001-ca-assist-chatbot/spec.md`

## Summary

CA Assist is a production-ready conversational assistant that answers Chartered Accountant queries on Indian income tax, GST, TDS, ITR filing, and accounting. It is delivered as a static Vite + React + TypeScript single-page application (SPA) hosted on GitHub Pages, powered by Google AI Studio's `gemma-4-26b-a4b-it` model via direct REST `fetch` calls, with automated CI/CD via GitHub Actions.

## Technical Context

**Language/Version**: TypeScript 5.x (Strict mode enabled, no `any`), Node.js 20+

**Primary Dependencies**: React 18/19, Vite, `react-markdown` (zero UI component or styling libraries; plain CSS only)

**Storage**: None (Strictly ephemeral in-memory React state; zero persistence across browser sessions)

**Testing**: Lint (`eslint`), Type-check (`tsc --noEmit`), and Build verification (`vite build`)

**Target Platform**: Web (Modern desktop and mobile evergreen browsers), hosted statically on GitHub Pages

**Project Type**: Static Single-Page Application (SPA)

**Performance Goals**: First-load under 2 seconds on 4G; production bundle size under 300 KB gzipped

**Constraints**:
- Single fixed model: `gemma-4-26b-a4b-it` called via Google AI Studio Gemini `generateContent` REST endpoint
- 30-second request timeout enforced via `AbortController`
- HTTP 429 rate-limit specific handling with user-safe messaging and retry
- WCAG 2.1 AA accessibility (full keyboard navigation, `:focus-visible`, ARIA live region for streaming/new messages)
- Persistent footer disclaimer: "For general information only. Consult a qualified CA for advice."
- No backend, serverless functions, database, or login
- API key read strictly from `import.meta.env.VITE_GEMINI_API_KEY` (injected via GitHub Actions CI secret `GEMINI_API_KEY`; never hard-coded or logged)

**Scale/Scope**: Single-page conversational UI with message history, thinking state, error handling, retry actions, and "New Chat" reset.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I: Indian CA Domain and Responsible Guidance**: PASS. System prompt enforces strict Indian tax, GST, TDS, ITR, and accounting boundaries, polite refusal/redirection for off-topic queries, and the exact required disclaimer.
- **Principle II: Fixed Model and Typed Integration**: PASS. Exclusively `gemma-4-26b-a4b-it` defined as a single constant in a dedicated, strictly typed client module (`src/services/gemini.ts`). Zero `any`.
- **Principle III: Static-First, Minimal Architecture**: PASS. Pure Vite + React + TypeScript SPA without backend, database, or UI libraries (plain CSS only; `react-markdown` for formatting).
- **Principle IV: User Safety, Privacy, and Accessibility**: PASS. API key managed via `import.meta.env.VITE_GEMINI_API_KEY` with `.env.local` git-ignored. 30s timeout, HTTP 429 handling, retry path, visible focus, ARIA live region, and keyboard navigation.
- **Principle V: Verifiable Quality and Simple Change**: PASS. Strict TypeScript, ESLint, production bundle target < 300 KB gzipped, and automated GitHub Actions CI/CD deployment to GitHub Pages.

*Re-check after Phase 1 Design*: All design artifacts (`research.md`, `data-model.md`, `contracts/gemini-api.md`, `quickstart.md`) strictly conform to all 5 constitutional principles.

## Project Structure

### Documentation (this feature)

```text
specs/001-ca-assist-chatbot/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── gemini-api.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
.github/
├── workflows/
│   └── deploy.yml          # GitHub Actions CI/CD: lint, type-check, build, deploy to Pages
src/
├── assets/                 # Static brand assets / icons if needed
├── components/
│   ├── ChatInput.tsx       # Textarea, Send button, Enter-key handler, New Chat button
│   ├── ChatMessage.tsx     # Message bubble, react-markdown rendering
│   ├── ChatWindow.tsx      # Scrollable message list container
│   ├── Disclaimer.tsx      # Persistent footer disclaimer
│   ├── ErrorBanner.tsx     # Error alerts and Retry action
│   └── ThinkingIndicator.tsx # "Thinking..." indicator with ARIA live region
├── services/
│   └── gemini.ts           # Dedicated, typed Gemini API client for gemma-4-26b-a4b-it
├── types/
│   └── index.ts            # Strictly typed interfaces (Message, ChatStatus, Gemini API schemas)
├── App.tsx                 # Root component orchestrating chat state and layout
├── main.tsx                # React DOM entry point
└── index.css               # Plain CSS styles (responsive, theme, typography, focus-visible)
index.html
vite.config.ts              # Vite configuration with base path for GitHub Pages
tsconfig.json               # Strict TypeScript configuration
eslint.config.js            # ESLint rules
package.json
```

**Structure Decision**: Single static web application root layout (Vite + React + TypeScript SPA) as defined above.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No violations. Clean zero-backend static SPA adhering to all constitutional constraints.*
