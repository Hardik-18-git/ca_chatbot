import type { ChatError } from '../types';

interface ErrorBannerProps {
  error: ChatError;
  onRetry: () => void;
}

export default function ErrorBanner({ error, onRetry }: ErrorBannerProps) {
  return (
    <div className="error-banner" role="alert">
      <span className="error-icon" aria-hidden="true">!</span>
      <div className="error-copy">
        <strong>
          {error.type === 'rate_limit' ? 'A short pause is needed' : 'We couldn’t get an answer'}
        </strong>
        <p>{error.message}</p>
      </div>
      {error.retryable && (
        <button className="button button--retry" type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
