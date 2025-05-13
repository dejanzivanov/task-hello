#!/usr/bin/env bash
set -e

BASE="https://task.dejanzivanov.com"
ADDR="Dqwo6BYyJ3hUDKBCKVaWZUtgpRzo928TjrAPuFBGTKb6"
HASH="5GRcJvEm2nepdhEkWgp49sKWt8x87dkHVmcci1Ta9mCSreAxQctcyVnHV9NvT7GiKmk6MDgbiriqne3RpuVuamLt"

echo "Testing /webhook..."
STATUS=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/webhook" \
  -H 'Content-Type: application/json' \
  -d "{\"address\":\"$ADDR\",\"tokenSymbol\":\"USDC\",\"amount\":\"0.01\",\"transactionHash\":\"TEST123\"}")
[[ "$STATUS" == "200" ]] && echo "✅ /webhook OK" || (echo "❌ /webhook $STATUS"; exit 1)

echo "Testing /tx/:hash..."
RESP=$(curl -s "$BASE/tx/$HASH")
echo "$RESP" | grep -q "\"hash\":\"$HASH\"" \
  && echo "✅ /tx returned hash" \
  || (echo "❌ /tx mismatch"; exit 1)

echo "All tests passed! 🎉"

