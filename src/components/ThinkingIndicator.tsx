export default function ThinkingIndicator() {
  return (
    <li className="thinking-row" role="status" aria-label="CA Assist is preparing a response">
      <span className="thinking-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span>Thinking...</span>
    </li>
  );
}
