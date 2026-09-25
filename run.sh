#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-5173}"
URL="http://${HOST}:${PORT}/ca_chatbot/"

cd "$ROOT_DIR"

if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm is required. Install Node.js 20 or later." >&2
  exit 1
fi

if [[ ! -d node_modules ]]; then
  echo "Installing project dependencies..."
  npm ci
fi

BROWSER=""
for candidate in google-chrome google-chrome-stable; do
  if command -v "$candidate" >/dev/null 2>&1; then
    BROWSER="$(command -v "$candidate")"
    break
  fi
done

if [[ -z "$BROWSER" ]]; then
  echo "Error: Google Chrome was not found. Install Chrome and run this script again." >&2
  exit 1
fi

npm run dev -- --host "$HOST" --port "$PORT" --strictPort &
SERVER_PID=$!

cleanup() {
  if kill -0 "$SERVER_PID" 2>/dev/null; then
    kill -INT "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

if ! node --input-type=module - "$URL" "$SERVER_PID" <<'NODE'
const [url, pid] = process.argv.slice(2);
const deadline = Date.now() + 30_000;

while (Date.now() < deadline) {
  try {
    const response = await fetch(url);
    if (response.ok) process.exit(0);
  } catch {
    // The Vite server may still be starting.
  }

  try {
    process.kill(Number(pid), 0);
  } catch {
    console.error('Error: The Vite development server stopped before becoming ready.');
    process.exit(1);
  }

  await new Promise((resolve) => setTimeout(resolve, 250));
}

console.error(`Error: The development server did not respond at ${url} within 30 seconds.`);
process.exit(1);
NODE
then
  exit 1
fi

printf 'Opening CA Assist in Google Chrome: %s\n' "$URL"
"$BROWSER" --new-window "$URL" >/dev/null 2>&1 &
BROWSER_PID=$!

printf 'CA Assist is running. Press Ctrl+C here to stop the server.\n'
wait "$SERVER_PID"
