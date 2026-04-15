#!/data/data/com.termux/files/usr/bin/bash
ROOT=~/profit-workspace
PIDS_FILE="$ROOT/weave/.pids"

if [ ! -f "$PIDS_FILE" ]; then
  echo "No PID file found at $PIDS_FILE"
  exit 1
fi

while read -r pid; do
  if [ -n "$pid" ]; then
    kill "$pid" 2>/dev/null || true
  fi
done < "$PIDS_FILE"

rm -f "$PIDS_FILE"

echo "Stopped all Weaver services"