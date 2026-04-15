#!/data/data/com.termux/files/usr/bin/bash
set -e
ROOT=~/profit-workspace
KERNEL=~/plt-press/grand-soul-kernel-original
PIDS_FILE="$ROOT/weave/.pids"

mkdir -p "$ROOT/weave/state" "$ROOT/weave/queues"

# start bridge
python3 "$ROOT/weave/bridge/server.py" > "$ROOT/weave/bridge/bridge.log" 2>&1 &
BRIDGE_PID=$!

# start sanctum server
cd "$ROOT/weave/sanctum-server"
cargo run --release > "$ROOT/weave/sanctum-server/sanctum.log" 2>&1 &
SANCTUM_PID=$!

# start kernel
cd "$KERNEL"
cargo run --release > "$ROOT/weave/kernel.log" 2>&1 &
KERNEL_PID=$!

# save pids
printf "%s\n%s\n%s\n" "$BRIDGE_PID" "$SANCTUM_PID" "$KERNEL_PID" > "$PIDS_FILE"

echo "Started bridge (pid $BRIDGE_PID), sanctum (pid $SANCTUM_PID), kernel (pid $KERNEL_PID)"
echo "Logs: weave/bridge/bridge.log, weave/sanctum-server/sanctum.log, weave/kernel.log"