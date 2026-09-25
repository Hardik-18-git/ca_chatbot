# Interface Contract: Gemini API Client & UI Component Boundaries

**Feature**: `001-ca-assist-chatbot`
**Date**: 2026-09-25

---

## 1. External REST Contract: Google AI Studio / Gemini

### 1.1 Endpoint
- **URL**: `https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent`
- **Method**: `POST`
- **Query Parameter**: `key={VITE_GEMINI_API_KEY}`
- **Headers**:
  - `Content-Type: application/json`

### 1.2 Request Payload
```json
{
  "systemInstruction": {
    "parts": [
      {
        "text": "You are CA Assist, an expert Chartered Accountant chatbot specializing in Indian taxation, GST, TDS, ITR filing, and accounting principles..."
      }
    ]
  },
  "contents": [
    {
      "role": "user",
      "parts": [{ "text": "What is the due date for filing ITR for salaried individuals?" }]
    },
    {
      "role": "model",
      "parts": [{ "text": "For salaried individuals (non-audit cases), the normal due date for filing Income Tax Return (ITR) is July 31st of the relevant Assessment Year..." }]
    },
    {
      "role": "user",
      "parts": [{ "text": "What if I miss this due date?" }]
    }
  ]
}
```

### 1.3 Response Payloads

#### Success (HTTP 200 OK)
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "If you miss the July 31 due date, you can still file a belated return under Section 139(4) until December 31 of the Assessment Year..."
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP"
    }
  ]
}
```

#### Rate Limit Exceeded (HTTP 429)
```json
{
  "error": {
    "code": 429,
    "message": "Resource has been exhausted (e.g. check quota).",
    "status": "RESOURCE_EXHAUSTED"
  }
}
```

---

## 2. Internal Client API: `src/services/gemini.ts`

The dedicated, strictly typed client module exposes the following programmatic contract:

```typescript
import { Message } from '../types';

export interface SendMessageOptions {
  history: Message[];
  prompt: string;
  signal?: AbortSignal;
}

export interface SendMessageResult {
  reply: string;
}

/**
 * Sends a conversation turn to gemma-4-26b-a4b-it via the Gemini generateContent REST endpoint.
 *
 * @throws {GeminiError} when HTTP 429, timeout, network failure, or API error occurs.
 */
export function sendChatMessage(options: SendMessageOptions): Promise<SendMessageResult>;
```

---

## 3. UI Component Structure Contract

| Component | Props | Purpose |
|-----------|-------|---------|
| `App` | None | Root container, handles banner/header, layout, and footer disclaimer. |
| `ChatWindow` | `messages: Message[]`, `status: ChatStatus`, `error: ChatError | null`, `onRetry: () => void` | Renders scrollable message stream, thinking indicator, and error banner. |
| `ChatMessage` | `message: Message` | Renders individual bubble (`user` vs `assistant`), renders Markdown via `react-markdown`. |
| `ChatInput` | `onSend: (text: string) => void`, `onNewChat: () => void`, `disabled: boolean` | Message textarea / input with Enter submission, Send button, and New Chat button. |
| `ThinkingIndicator` | None | Visually indicates waiting state ("Thinking...") with appropriate ARIA live region. |
| `Disclaimer` | None | Persistent footer disclaimer: "For general information only. Consult a qualified CA for advice." |
