import { useCallback, useRef, useState } from 'react';
import ChatInput from './components/ChatInput';
import ChatWindow from './components/ChatWindow';
import Disclaimer from './components/Disclaimer';
import { GeminiApiError, sendChatMessage } from './services/gemini';
import type { ChatError, ChatStatus, Message } from './types';

interface RetryContext {
  history: Message[];
  prompt: string;
}

function createMessage(role: Message['role'], content: string): Message {
  return {
    id: globalThis.crypto.randomUUID(),
    role,
    content,
    timestamp: Date.now(),
  };
}

function getChatError(error: unknown): ChatError {
  if (error instanceof GeminiApiError) {
    return {
      type: error.type,
      message: error.message,
      retryable: error.retryable,
      ...(error.statusCode === undefined ? {} : { statusCode: error.statusCode }),
    };
  }

  return {
    type: 'api_error',
    message: 'Something went wrong. Please try again.',
    retryable: true,
  };
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesRef = useRef<Message[]>([]);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [error, setError] = useState<ChatError | null>(null);
  const [clearSignal, setClearSignal] = useState(0);
  const [retryContext, setRetryContext] = useState<RetryContext | null>(null);
  const activeControllerRef = useRef<AbortController | null>(null);
  const requestVersionRef = useRef(0);

  const updateMessages = useCallback((nextMessages: Message[]): void => {
    messagesRef.current = nextMessages;
    setMessages(nextMessages);
  }, []);

  const requestReply = useCallback(async (context: RetryContext): Promise<void> => {
    activeControllerRef.current?.abort();
    const controller = new AbortController();
    activeControllerRef.current = controller;
    const requestVersion = requestVersionRef.current;
    setStatus('loading');
    setError(null);

    try {
      const result = await sendChatMessage({
        history: context.history,
        prompt: context.prompt,
        signal: controller.signal,
      });
      if (requestVersion !== requestVersionRef.current) return;
      updateMessages([...messagesRef.current, createMessage('assistant', result.reply)]);
      setRetryContext(null);
      setStatus('idle');
    } catch (requestError: unknown) {
      if (requestVersion !== requestVersionRef.current) return;
      const chatError = getChatError(requestError);
      if (chatError.type === 'aborted') return;
      setRetryContext(context);
      setError(chatError);
      setStatus('error');
    } finally {
      if (requestVersion === requestVersionRef.current) {
        activeControllerRef.current = null;
      }
    }
  }, [updateMessages]);

  const handleSend = useCallback((rawPrompt: string): void => {
    const prompt = rawPrompt.trim();
    if (!prompt || status === 'loading') return;

    const history = messagesRef.current;
    updateMessages([...history, createMessage('user', prompt)]);
    setRetryContext({ history, prompt });
    void requestReply({ history, prompt });
  }, [requestReply, status, updateMessages]);

  const handleRetry = useCallback((): void => {
    if (!retryContext || status === 'loading') return;
    void requestReply(retryContext);
  }, [requestReply, retryContext, status]);

  const handleNewChat = useCallback((): void => {
    requestVersionRef.current += 1;
    activeControllerRef.current?.abort();
    activeControllerRef.current = null;
    updateMessages([]);
    setStatus('idle');
    setError(null);
    setRetryContext(null);
    setClearSignal((current) => current + 1);
  }, [updateMessages]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand" aria-label="CA Assist home">
          <div className="brand-mark" aria-hidden="true">C</div>
          <div className="brand-copy">
            <span className="brand-name">CA Assist</span>
            <span className="brand-caption">Clarity for your finances</span>
          </div>
        </div>
        <div className="topbar-badge">Made for India</div>
      </header>

      <main className="main-content">
        <section className="chat-panel" aria-label="CA Assist chat">
          <div className="panel-topline">
            <div className="panel-heading">
              <span className="assistant-dot" aria-hidden="true" />
              <span className="panel-title">Your CA assistant</span>
              <span className="panel-status">· General guidance</span>
            </div>
            <div className="privacy-label">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3.5 7V5.2a4.5 4.5 0 0 1 9 0V7m-9 0h9v6h-9V7Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                <circle cx="8" cy="9.8" r=".8" fill="currentColor" />
              </svg>
              Session only
            </div>
          </div>
          <ChatWindow messages={messages} status={status} error={error} onRetry={handleRetry} />
          <ChatInput
            onSend={handleSend}
            onNewChat={handleNewChat}
            disabled={status === 'loading'}
            clearSignal={clearSignal}
            hasConversation={messages.length > 0 || status !== 'idle'}
          />
        </section>
        <Disclaimer />
      </main>
    </div>
  );
}
