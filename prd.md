PRD: CA Assist, Chartered Accountant Chatbot on GitHub Pages
Date: Sep 24, 2026 | Author: Ruthran Raghavan

## Overview and goals
CA Assist is a production-ready conversational assistant that answers Chartered Accountant queries on Indian income tax, GST, TDS, ITR filing and accounting. It ships as a static Vite + React + TypeScript single-page application, released to GitHub Pages through an automated GitHub Actions CI/CD pipeline on every push to main.

- Deliver a reliable, domain-scoped assistant with consistent, professional responses.
- Standardise on Google AI Studio with gemma-4-26b-a4b-it as the single approved model.
- Zero-touch build and release with no infrastructure to manage.
- Modular, strictly typed, maintainable codebase.

## Users and use cases
The primary user is an individual or small business owner in India with a quick tax or accounting question.

- “What is the due date for filing ITR for salaried individuals?”
- “Which ITR form should I use for freelance income?”
- “When do I need to register for GST?”
- “How is TDS on rent calculated?”
- “What deductions are available under Section 80C?”

## Functional requirements
- **FR-1**: Chat window with message list, text input and Send button (Enter also sends).
- **FR-2**: Each user message is sent to Gemma via Google AI Studio Gemini `generateContent` REST endpoint with the full conversation history.
- **FR-3**: A fixed system prompt makes the bot act as a Chartered Accountant focused on Indian tax, GST, TDS and accounting.
- **FR-4**: Off-topic questions get a polite refusal that redirects to CA topics.
- **FR-5**: Show a “Thinking...” indicator while waiting for a reply.
- **FR-6**: Show a clear, user-safe error message with a Retry action if the API call fails or times out.
- **FR-7**: Render bot replies as Markdown (lists, bold, tables).
- **FR-8**: Persistent footer disclaimer: “For general information only. Consult a qualified CA for advice.”
- **FR-9**: “New chat” button clears the conversation.
- **FR-10**: Responsive layout that works on mobile and desktop.

## Non-functional requirements
- **Performance**: First load under 2 s on 4G; production bundle under 300 KB gzipped.
- **Reliability**: 30 s request timeout; handles HTTP 429 rate-limit responses with a clear message.
- **Accessibility**: WCAG 2.1 AA: full keyboard navigation, visible focus, ARIA live region for new replies.
- **Code quality**: TypeScript strict mode, ESLint, a dedicated typed API client module, no `any`.
- **Security**: API key supplied only through a CI secret; no secrets in source control.
- **Compliance**: Answers limited to general information, with a persistent disclaimer.

## Tech stack and model constraints
The fixed model is gemma-4-26b-a4b-it via the Gemini API. No other model or provider may be used.

- Framework: Vite + React + TypeScript
- Styling: Plain CSS (no UI library)
- Markdown rendering: react-markdown
- API: Gemini `generateContent` REST endpoint called with fetch
- API key: Created at Google AI Studio API keys page
- Hosting: GitHub Pages
- CI/CD: GitHub Actions

The model name lives in one constant; no model picker in the UI. The system prompt is passed as `systemInstruction`. No backend, database or server code.

## Configuration and deployment
The API key is stored as a GitHub Actions repository secret and injected at build time; it is never committed to the repository.

- `GEMINI_API_KEY`: repository Actions secret containing the key from Google AI Studio.
- `VITE_GEMINI_API_KEY`: workflow build-step environment value from `${{ secrets.GEMINI_API_KEY }}`.
- Vite base: `/<repo-name>/`.
- Pages source: GitHub Actions.
- Local key: `.env.local`, ignored by Git.
- Workflow: `.github/workflows/deploy.yml`, triggered by pushes to `main` and `workflow_dispatch`.
- Workflow permissions: `contents: read`, `pages: write`, `id-token: write`.

The build job uses checkout, setup-node, configure-pages and upload-pages-artifact; the deploy job uses deploy-pages. Lint and type-check run before build/deployment. A failed lint or type-check stops deployment.

## Non-goals and acceptance criteria
Non-goals: user login, chat history storage, file or document upload, streaming responses, backend/serverless functions, and any model other than gemma-4-26b-a4b-it.

- `npm run dev` runs the chatbot locally using `.env.local`.
- A push to `main` triggers the workflow and it finishes green.
- The site loads at `https://<username>.github.io/<repo-name>/` with no broken assets.
- A salaried ITR due-date query returns a relevant CA-style answer.
- An off-topic recipe question receives a polite redirect.
- The disclaimer is visible on every screen size.
- No API key string appears in any committed file.
