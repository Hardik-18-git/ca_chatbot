import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <li className={`message-row message-row--${message.role}`}>
      <div className="message-avatar" aria-hidden="true">
        {isAssistant ? 'C' : 'Y'}
      </div>
      <article className={`message-card message-card--${message.role}`}>
        <div className="message-meta">
          <span>{isAssistant ? 'CA Assist' : 'You'}</span>
          <time dateTime={new Date(message.timestamp).toISOString()}>
            {new Intl.DateTimeFormat(undefined, {
              hour: 'numeric',
              minute: '2-digit',
            }).format(message.timestamp)}
          </time>
        </div>
        <div className="message-content">
          {isAssistant ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          ) : (
            <p>{message.content}</p>
          )}
        </div>
      </article>
    </li>
  );
}
