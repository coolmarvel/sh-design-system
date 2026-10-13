#!/bin/bash
# PostToolUse hook: 편집한 파일을 prettier 로 정리한다 (build/·showcase/·tokens/ 의 js·mjs·css·html·json 만).
# 생성물(dist/)·문서(*.md)는 건드리지 않는다.
set -uo pipefail

INPUT="$(cat 2>/dev/null || true)"
[[ -z "$INPUT" ]] && INPUT="${CLAUDE_TOOL_INPUT:-{\}}"
FILE_PATH=$(printf '%s' "$INPUT" | python3 -c "
import json, sys
d = json.load(sys.stdin)
print((d.get('tool_input') or d).get('file_path', ''))
" 2>/dev/null) || exit 0

[[ -z "$FILE_PATH" || ! -f "$FILE_PATH" ]] && exit 0
case "$FILE_PATH" in
  */dist/*|*/node_modules/*) exit 0 ;;
  */build/*|*/showcase/*|*/tokens/*) ;;
  *) exit 0 ;;
esac
case "$FILE_PATH" in
  *.js|*.mjs|*.cjs|*.css|*.html|*.json) npx --no-install prettier --write "$FILE_PATH" >/dev/null 2>&1 || true ;;
esac
exit 0
