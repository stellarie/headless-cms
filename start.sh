#!/bin/bash
set -e

export JAVA_HOME=/home/linuxbrew/.linuxbrew/opt/openjdk@21/libexec

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "==> Starting CMS Backend (Java $($JAVA_HOME/bin/java -version 2>&1 | head -1))..."
cd "$ROOT/backend"
mvn spring-boot:run &
BACKEND_PID=$!

echo "==> Starting CMS Frontend..."
cd "$ROOT/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "  Backend   : http://localhost:8080"
echo "  Frontend  : http://localhost:5173"
echo "  H2 Console: http://localhost:8080/h2-console"
echo ""
echo "Press Ctrl+C to stop both."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
