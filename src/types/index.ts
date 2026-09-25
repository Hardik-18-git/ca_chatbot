export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export type ChatStatus = 'idle' | 'loading' | 'error';

export type ChatErrorType =
  | 'rate_limit'
  | 'timeout'
  | 'network'
  | 'missing_key'
  | 'api_error'
  | 'aborted';

export interface ChatError {
  type: ChatErrorType;
  message: string;
  retryable: boolean;
  statusCode?: number;
}

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
  systemInstruction: GeminiSystemInstruction;
  contents: GeminiContent[];
}

export interface GeminiCandidate {
  content?: {
    role?: string;
    parts?: GeminiPart[];
  };
  finishReason?: string;
}

export interface GeminiGenerateContentResponse {
  candidates?: GeminiCandidate[];
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
}
