# Quickstart & Validation Guide: CA Assist Chatbot

**Feature**: `001-ca-assist-chatbot`
**Date**: 2026-09-25

This document outlines how to set up, build, test, and validate CA Assist end-to-end.

---

## 1. Prerequisites

- **Node.js**: v20+ LTS
- **npm**: v10+
- **Google AI Studio API Key**: An active Gemini API key from Google AI Studio.

---

## 2. Local Setup & Execution

### 2.1 Clone & Install
```bash
npm install
```

### 2.2 Configure Local Environment
Create `.env.local` in the project root and set `VITE_GEMINI_API_KEY` to your local
Google AI Studio key. Do not paste the key into committed files or logs. Verify
`.env.local` is ignored in `.gitignore`.

### 2.3 Run Development Server
```bash
npm run dev
```
Open browser at `http://localhost:5173`.

---

## 3. End-to-End Validation Scenarios

### Scenario 1: Supported Indian Tax Query (P1)
1. In the chat input, type: `What is the due date for filing ITR for salaried individuals?`
2. Press `Enter` or click `Send`.
3. **Verify**:
   - The user message appears immediately in the conversation view.
   - The "Thinking..." indicator appears while waiting.
   - Within seconds, a relevant response mentioning July 31st of the Assessment Year appears.
   - The response is rendered with Markdown formatting (bullet points/bold text).
   - The persistent disclaimer is visible at the bottom of the page.

### Scenario 2: Conversational Multi-turn Context (P1)
1. Following Scenario 1, type: `What happens if I miss that date?`
2. Press `Enter`.
3. **Verify**:
   - The assistant understands "that date" refers to the July 31st ITR filing due date and explains belated returns under Section 139(4) and late filing fees under Section 234F.

### Scenario 3: Polite Refusal of Off-topic Query (P1)
1. In the chat input, type: `Can you give me a recipe for chocolate cake?`
2. Press `Enter`.
3. **Verify**:
   - The assistant politely declines to provide cooking recipes.
   - The assistant redirects the user to Indian tax, GST, TDS, ITR filing, or accounting topics.

### Scenario 4: Error Handling & Rate Limit Recovery (P2)
1. Simulate a network failure or invalid key.
2. Submit a question.
3. **Verify**:
   - An informative, user-safe error message appears (e.g., explaining rate limits or connection failure).
   - A "Retry" button is provided.
   - Clicking "Retry" resubmits the query without requiring retyping.

### Scenario 5: New Chat & State Clearing (P3)
1. With several messages in the chat, click the "New Chat" button.
2. **Verify**:
   - The chat window clears completely.
   - The input is reset to empty.
   - Any pending request is canceled immediately.

### Scenario 6: Keyboard Navigation & Screen Reader Accessibility (P3)
1. Navigate the interface using only `Tab`, `Shift+Tab`, and `Enter`.
2. **Verify**:
   - All interactive controls have distinct visible focus outlines (`:focus-visible`).
   - The ARIA live region announces the incoming assistant response.

---

## 4. Production Quality Gates

Run the verification pipeline locally:
```bash
# 1. Type-checking
npm run type-check   # or npx tsc --noEmit

# 2. Linting
npm run lint

# 3. Production Build
npm run build
```
Verify the build output bundle in `dist/` is under 300 KB gzipped.
