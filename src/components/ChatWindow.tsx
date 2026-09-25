import { useEffect, useState } from 'react';
import type { ChatError, ChatStatus, Message } from '../types';
import ChatMessage from './ChatMessage';
import ErrorBanner from './ErrorBanner';
import ThinkingIndicator from './ThinkingIndicator';

interface ChatWindowProps {
  messages: Message[];
  status: ChatStatus;
  error: ChatError | null;
  onRetry: () => void;
}

export default function ChatWindow({ messages, status, error, onRetry }: ChatWindowProps) {
  const lastAssistantMessage = [...messages].reverse().find((message) => message.role === 'assistant');
  const lastAssistantId = lastAssistantMessage?.id;
  const lastAssistantContent = lastAssistantMessage?.content;
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (lastAssistantContent) {
      setAnnouncement(`CA Assist replied: ${lastAssistantContent}`);
    } else {
      setAnnouncement('');
    }
  }, [lastAssistantId, lastAssistantContent]);

  return (
    <section className="conversation" aria-label="Conversation">
      <div className="conversation-scroll">
        {messages.length === 0 ? (
          <div className="welcome-state">
            <div className="welcome-mark" aria-hidden="true">
              <span className="welcome-mark-inner">C</span>
              <span className="welcome-spark">✳</span>
            </div>
            <p className="eyebrow">YOUR INDIAN TAX &amp; ACCOUNTING GUIDE</p>
            <h1>Good questions deserve<br />clear answers.</h1>
            <p className="welcome-description">
              Ask a general question about income tax, GST, TDS, ITR filing, or accounting.
              I’ll help you find your way.
            </p>
            <div className="topic-chips" aria-label="Topics I can help with">
              <span>Income tax</span>
              <span>GST</span>
              <span>TDS</span>
              <span>ITR filing</span>
              <span>Accounting</span>
            </div>
          </div>
        ) : (
          <ol className="message-list" aria-label="Messages">
            {messages.map((message) => <ChatMessage key={message.id} message={message} />)}
            {status === 'loading' && <ThinkingIndicator />}
          </ol>
        )}
        {messages.length > 0 && status === 'error' && error && (
          <ErrorBanner error={error} onRetry={onRetry} />
        )}
        {messages.length === 0 && status === 'loading' && (
          <div className="empty-pending" role="status">Thinking...</div>
        )}
        {messages.length === 0 && status === 'error' && error && (
          <ErrorBanner error={error} onRetry={onRetry} />
        )}
      </div>
      <div className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</div>
    </section>
  );
}
