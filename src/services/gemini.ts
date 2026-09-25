import type {
  ChatErrorType,
  GeminiContent,
  GeminiGenerateContentRequest,
  GeminiGenerateContentResponse,
  Message,
} from '../types';

const MODEL_NAME = 'gemma-4-26b-a4b-it';
const REQUEST_TIMEOUT_MS = 30_000;
const SYSTEM_PROMPT = `You are CA Assist, a professional assistant for general Indian Chartered Accountant topics. Answer only questions about Indian income tax, goods and services tax (GST), tax deducted at source (TDS), income tax return (ITR) filing, and accounting. If asked about anything unrelated, politely decline and redirect the person to one of those topics. Provide clear, balanced general information, distinguish general rules from exceptions, and encourage checking current official rules or consulting a qualified Chartered Accountant for individual circumstances. Never claim that your response is personalized professional advice, a substitute for a qualified CA, or legally binding. Do not invent facts, rates, forms, deadlines, or statutory references; state uncertainty when needed.`;
const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export interface SendMessageOptions {
  history: Message[];
  prompt: string;
  signal?: AbortSignal;
}

export interface SendMessageResult {
  reply: string;
}

export class GeminiApiError extends Error {
  readonly type: ChatErrorType;
  readonly retryable: boolean;
  readonly statusCode?: number;

  constructor(
    type: ChatErrorType,
    message: string,
    retryable = true,
    statusCode?: number,
  ) {
    super(message);
    this.name = 'GeminiApiError';
    this.type = type;
    this.retryable = retryable;
    this.statusCode = statusCode;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseResponse(value: unknown): GeminiGenerateContentResponse | null {
  if (!isRecord(value)) return null;

  const candidatesValue = value['candidates'];
  if (!Array.isArray(candidatesValue)) return null;

  const candidates: NonNullable<GeminiGenerateContentResponse['candidates']> = [];
  candidatesValue.forEach((candidate) => {
    if (!isRecord(candidate)) return;
    const contentValue = candidate['content'];
    if (!isRecord(contentValue)) return;
    const partsValue = contentValue['parts'];
    if (!Array.isArray(partsValue)) return;

    const parts = partsValue.flatMap((part) => {
      if (!isRecord(part) || typeof part['text'] !== 'string') return [];
      return [{ text: part['text'] }];
    });

    candidates.push({
      content: {
        role: typeof contentValue['role'] === 'string' ? contentValue['role'] : undefined,
        parts,
      },
      finishReason: typeof candidate['finishReason'] === 'string'
        ? candidate['finishReason']
        : undefined,
    });
  });

  return { candidates };
}

function toGeminiContent(message: Message): GeminiContent {
  return {
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.content }],
  };
}

export async function sendChatMessage({
  history,
  prompt,
  signal,
}: SendMessageOptions): Promise<SendMessageResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiApiError(
      'missing_key',
      'The assistant is not configured yet. Please try again later or contact the site owner.',
      true,
    );
  }

  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) {
    throw new GeminiApiError('api_error', 'Enter a question before sending.', false);
  }

  const controller = new AbortController();
  let didTimeout = false;
  let didAbortExternally = false;
  const handleExternalAbort = (): void => {
    didAbortExternally = true;
    controller.abort();
  };

  if (signal?.aborted) {
    throw new GeminiApiError('aborted', 'Request cancelled.', false);
  }

  signal?.addEventListener('abort', handleExternalAbort, { once: true });
  const timeoutId = globalThis.setTimeout(() => {
    didTimeout = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  const request: GeminiGenerateContentRequest = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [
      ...history.map(toGeminiContent),
      { role: 'user', parts: [{ text: trimmedPrompt }] },
    ],
  };

  try {
    const url = new URL(`${API_BASE_URL}/${MODEL_NAME}:generateContent`);
    url.searchParams.set('key', apiKey);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    if (response.status === 429) {
      throw new GeminiApiError(
        'rate_limit',
        'Request limit reached. Please wait a moment before trying again.',
        true,
        429,
      );
    }

    if (!response.ok) {
      throw new GeminiApiError(
        'api_error',
        'The assistant could not complete that request. Please try again.',
        true,
        response.status,
      );
    }

    let responseBody: unknown;
    try {
      responseBody = await response.json() as unknown;
    } catch {
      throw new GeminiApiError(
        'api_error',
        'The assistant returned an unreadable response. Please try again.',
        true,
        response.status,
      );
    }

    const data = parseResponse(responseBody);
    const reply = data?.candidates
      ?.flatMap((candidate) => candidate.content?.parts ?? [])
      .map((part) => part.text.trim())
      .filter(Boolean)
      .join('\n\n');

    if (!reply) {
      throw new GeminiApiError(
        'api_error',
        'The assistant returned an empty response. Please try again.',
        true,
        response.status,
      );
    }

    return { reply };
  } catch (error: unknown) {
    if (error instanceof GeminiApiError) throw error;
    if (didAbortExternally) {
      throw new GeminiApiError('aborted', 'Request cancelled.', false);
    }
    if (didTimeout) {
      throw new GeminiApiError(
        'timeout',
        'This request took too long. Please try again.',
        true,
      );
    }
    throw new GeminiApiError(
      'network',
      'Unable to reach the assistant. Check your connection and try again.',
      true,
    );
  } finally {
    globalThis.clearTimeout(timeoutId);
    signal?.removeEventListener('abort', handleExternalAbort);
  }
}
