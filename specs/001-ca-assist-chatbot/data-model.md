# Data Model: CA Assist Chatbot

**Feature**: `001-ca-assist-chatbot`
**Date**: 2026-09-25
**Scope**: In-memory TypeScript data models and state representations for CA Assist SPA.

---

## 1. Entities & Types

### 1.1 `Role`
Represents the speaker of a message.
```typescript
export type MessageRole = 'user' | 'assistant';
```

### 1.2 `Message`
Represents an individual turn in the active conversation.
```typescript
export interface Message {
  id: string;              // Unique identifier (e.g., crypto.randomUUID() or timestamp-based)
  role: MessageRole;       // 'user' | 'assistant'
  content: string;         // Plaintext (user) or Markdown text (assistant)
  timestamp: number;       // Epoch milliseconds when created
}
```

**Validation & Invariants**:
- `id` must be non-empty string.
- `content` must not be whitespace-only when submitted by the user.
- Messages are ephemeral and retained in React state only during the active browser session.

---

### 1.3 `ChatStatus`
Represents the current lifecycle status of conversational interaction.
```typescript
export type ChatStatus = 'idle' | 'loading' | 'error';
```

### 1.4 `ChatError`
Detailed error representation when an interaction fails.
```typescript
export interface ChatError {
  type: 'rate_limit' | 'timeout' | 'network' | 'missing_key' | 'api_error';
  message: string;
  retryable: boolean;
  statusCode?: number;
}
```

---

### 1.5 Gemini API Contract Types
Strict TypeScript interfaces mirroring the Gemini REST API (`generateContent`) specification:

```typescript
export interface GeminiPart {
  text: string;
}

export interface GeminiContent {
  role: 'user' | 'model';
  parts: GeminiPart[];
}

export interface GeminiSystemInstruction {
  parts: GeminiPart[];
}

export interface GeminiGenerateContentRequest {
  systemInstruction?: GeminiSystemInstruction;
  contents: GeminiContent[];
}

export interface GeminiCandidate {
  content?: {
    role: string;
    parts: GeminiPart[];
  };
  finishReason?: string;
}

export interface GeminiGenerateContentResponse {
  candidates?: GeminiCandidate[];
  error?: {
    code: number;
    message: string;
    status: string;
  };
}
```

---

## 2. State Transitions

```
[Initial / Idle]
       │
       ▼ (User submits non-empty question)
[Loading (Thinking...)]
       │
       ├───► Success (HTTP 200, valid candidate) ───► [Idle] (Assistant message appended)
       │
       ├───► Timeout (30s elapsed) ────────────────► [Error: timeout] (Retry available)
       │
       ├───► Rate Limited (HTTP 429) ──────────────► [Error: rate_limit] (Retry available)
       │
       └───► Network / API Failure ────────────────► [Error: api_error] (Retry available)

[Any State]
       │
       ▼ (User clicks "New Chat")
[Initial / Idle] (Pending requests aborted, messages cleared)
```

---

## 3. Storage & Retention Policy

- **No persistent storage**: No `localStorage`, `sessionStorage`, IndexedDB, or server database is used.
- Refreshing the page or closing the tab cleanly purges all conversation history.
- Clicking "New Chat" resets the in-memory array to empty.
