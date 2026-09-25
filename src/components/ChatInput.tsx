import { useEffect, useState, type FormEvent, type KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (value: string) => void;
  onNewChat: () => void;
  disabled: boolean;
  clearSignal: number;
  hasConversation: boolean;
}

export default function ChatInput({
  onSend,
  onNewChat,
  disabled,
  clearSignal,
  hasConversation,
}: ChatInputProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue('');
  }, [clearSignal]);

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmed = value.trim();
    if (disabled || !trimmed) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div className="composer-wrap">
      <form className="composer" onSubmit={submit}>
        <label className="sr-only" htmlFor="chat-question">Ask a tax or accounting question</label>
        <textarea
          id="chat-question"
          name="question"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about income tax, GST, TDS..."
          rows={2}
          disabled={disabled}
          maxLength={4000}
        />
        <div className="composer-footer">
          <div className="composer-hint">
            <span className="keyboard-hint"><kbd>Enter</kbd> to send</span>
            <span className="keyboard-hint"><kbd>Shift</kbd> + <kbd>Enter</kbd> for a new line</span>
          </div>
          <button className="button button--send" type="submit" disabled={disabled || !value.trim()}>
            <span>Send</span>
            <span className="send-arrow" aria-hidden="true">↑</span>
          </button>
        </div>
      </form>
      <div className="composer-bottom">
        <span>CA Assist can make mistakes. Check important details with a qualified CA.</span>
        <button
          className="new-chat-button"
          type="button"
          onClick={onNewChat}
          disabled={!hasConversation && !disabled}
          aria-label="Start a new chat and clear this conversation"
        >
          <span aria-hidden="true">＋</span> New chat
        </button>
      </div>
    </div>
  );
}
