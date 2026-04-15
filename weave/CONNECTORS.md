# CONNECTORS

## Overview
This repo is the Weaver hub.

## Ports
- Bridge http://localhost:5004
- Sanctum ws://127.0.0.1:9001

## Files
- `weave/state/log.json` (written by kernel)
- `weave/queues/commands.jsonl` (written by bridge)

## Start order commands (manual)
- python3 weave/bridge/server.py
- cd weave/sanctum-server && cargo run --release
- In external repo uncommonpope-png/plt-press: cd grand-soul-kernel-original && cargo run --release
- Open web-ecosystem/plt-press/dashboard.html

## One command (Termux)
- bash weave/run_all.sh

## Stop all (Termux)
- bash weave/stop_all.sh

## Note
Dashboard targets localhost:5004