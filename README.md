# CA Assist

CA Assist is a static, responsive conversational assistant for general Chartered Accountant queries in India. It covers income tax, GST, TDS, ITR filing, and accounting, and is designed for deployment to GitHub Pages.

> **Disclaimer:** For general information only. Consult a qualified CA for advice.

## Features

- Conversational chat powered by the Gemma model through the Google Gemini API.
- Indian tax and accounting domain guidance, with polite redirection for off-topic questions.
- Markdown-formatted responses, request status, retryable errors, and rate-limit messaging.
- Responsive layout, keyboard-friendly controls, and accessible announcements.
- New-chat control to clear the current conversation; chat history is not persisted.

## Technology

- Vite, React, and TypeScript (strict mode)
- Plain CSS
- `react-markdown`
- Google Gemini `generateContent` REST API using `gemma-4-26b-a4b-it`
- GitHub Pages and GitHub Actions

## Requirements

- Node.js 20 or later and npm
- A Google AI Studio API key for local development and API access

## Local development

1. Install dependencies with `npm install`.
2. Create `.env.local` in the project root and set `VITE_GEMINI_API_KEY` to your Google AI Studio API key. This file is ignored by Git; never commit or print the key.
3. Start the Vite development server with `npm run dev`.

The API key is consumed by the browser application. Any `VITE_` environment variable is embedded in the static JavaScript bundle and is visible to site visitors; build-time injection does **not** make the key confidential. Use provider-supported website/referrer and API restrictions appropriate to the deployed site, monitor usage, and configure conservative quotas. Never use an unrestricted key or commit it to source control.

## Build and checks

Run `npm run lint` and `npm run type-check` before building. Create a production build with `npm run build`; Vite writes the static site to `dist/`.

## Deploy to GitHub Pages

The GitHub Actions workflow at `.github/workflows/deploy.yml` deploys on pushes to `main` and on manual dispatch. Configure the repository as follows:

1. Add a repository Actions secret named `GEMINI_API_KEY` containing the Google AI Studio key.
2. The workflow exposes it only to the production build step as `VITE_GEMINI_API_KEY`.
3. Set the Vite `base` path to `/<repo-name>/` for a project site.
4. In repository Settings → Pages, select **GitHub Actions** as the deployment source.

The workflow installs dependencies, runs lint and type checks, builds the site, uploads the Pages artifact, and deploys it. A failed check prevents deployment. The published URL has the form `https://<username>.github.io/<repo-name>/`.

## Product scope

The app is a static client-side SPA. It does not provide accounts, persistent chat history, uploads, streaming, backend/serverless services, or support for another model or provider. The approved model is `gemma-4-26b-a4b-it`.
