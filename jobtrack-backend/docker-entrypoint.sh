#!/bin/sh
set -e

# Render sets $PORT (defaults to 10000) and expects the container to bind
# to it. --server.port as a CLI arg overrides application.properties
# regardless of what's in there, so no backend source changes are needed.
exec java -jar app.jar --server.port="${PORT:-8081}"