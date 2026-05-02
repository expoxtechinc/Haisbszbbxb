#!/bin/bash
set -e
pnpm install --frozen-lockfile
# Push DB schema with a timeout so this never blocks indefinitely
timeout 15 pnpm --filter @workspace/db run push || echo "DB push skipped (timeout or no changes)"
