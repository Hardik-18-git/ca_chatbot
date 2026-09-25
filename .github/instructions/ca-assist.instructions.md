---
description: "Use when implementing or changing CA Assist's React chat, Gemini API client, styling, build configuration, or GitHub Pages deployment. Enforces the PRD's Indian CA domain, approved model, security, accessibility, and static-hosting constraints."
applyTo:
  - "src/**"
  - "vite.config.*"
  - "tsconfig*.json"
  - "eslint.config.*"
  - "package.json"
  - ".github/workflows/**"
---
# CA Assist Project Instructions

Treat `prd.md` as the product and acceptance-criteria source of truth.

- Keep the app a static Vite + React + TypeScript SPA for GitHub Pages. Do not add a backend, database, serverless function, login, stored chat history, uploads, streaming, or another model/provider.
- Use strict TypeScript and avoid `any`. Keep Gemini request/response handling in a dedicated, typed API client module.
- Use only `gemma-4-26b-a4b-it` through the Gemini `generateContent` REST endpoint. Define the model name once; do not add a model picker. Send the fixed CA-focused system prompt as `systemInstruction` and include the conversation history in requests.
- Keep advice scoped to general Indian income tax, GST, TDS, ITR filing, and accounting. Prompt the assistant to politely redirect unrelated questions and avoid presenting responses as personalized professional advice.
- Use plain CSS and `react-markdown`; do not add a UI component or styling library. Preserve responsive mobile/desktop behavior, keyboard operation, visible focus, an ARIA live region for new responses, and the persistent disclaimer: “For general information only. Consult a qualified CA for advice.”
- Show a thinking state while requests are pending. Enforce a 30-second request timeout, provide a clear retry path for failures, and give HTTP 429 a rate-limit-specific explanation.
- Read the browser-side key from `import.meta.env.VITE_GEMINI_API_KEY`. Never hard-code, commit, print, or log the key; keep `.env.local` ignored and inject the value into the production build from the GitHub Actions `GEMINI_API_KEY` secret.
- Be explicit that a `VITE_` value is embedded in downloadable client JavaScript and is therefore observable by site visitors; build-time injection prevents committing the key but does not make it confidential. Recommend appropriate API/referrer restrictions and quotas, and do not claim the static frontend can keep the key secret.
- Keep the Actions workflow on pushes to `main` and `workflow_dispatch`; run lint and type-check before building/deploying. Configure Vite's `base` for the repository's GitHub Pages path and preserve the required Pages permissions and artifact/deploy flow.
- Keep changes within the PRD's scope and dependencies. Update or add checks when changing behavior, and verify lint, type-check, and production build where available.
