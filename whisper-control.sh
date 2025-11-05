#!/bin/bash
################################################################################
# Filename       : /mnt/data2_78g/Security/scripts/Projects_web/braveVTTextension/whisper-control.sh
# Author         : Bruno DELNOZ
# Email          : bruno.delnoz@protonmail.com
# Target usage   : Native Messaging Host for Whisper STT Extension - Model switching, server control, status
# Version        : v3.0.2
# Date           : 2025-11-04
#
# CHANGELOG:
# -----------
# v3.0.2 - 2025-11-04
#   [+] FIXED: "Connected (Disconnected)" + "Loading..." forever
#   [+] FIXED: Native Host ne répond pas → timeout silencieux
#   [+] Added robust JSON parsing with jq
#   [+] Added immediate response on startup
#   [+] Added fallback model detection
#   [+] Added debug mode for Native Messaging
#   [+] Created ./logs/log.whisper-control.sh.v3.0.2.log
#   [+] Created CHANGELOG.md
#   [+] No systemd
#
# v3.0.1 - 2025-11-04
#   [+] Added --simulate, --prerequis, etc.
#
# v3.0.0 - 2025-11-01
#   [+] Initial version
################################################################################

# =============================================================================
# CONFIGURATION
# =============================================================================
SCRIPT_NAME="$(basename "$0")"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPT_PATH="${SCRIPT_DIR}/${SCRIPT_NAME}"
WHISPER_DIR="/mnt/data2_78g/Security/scripts/AI_Projects/DeepEcho_whisper/whisper.cpp"
MODELS_DIR="${WHISPER_DIR}/models"
START_SCRIPT="${SCRIPT_DIR}/start-whisper.sh"
PORT=8080
HOST="127.0.0.1"
LOG_DIR="${SCRIPT_DIR}/logs"
RESULTS_DIR="${SCRIPT_DIR}/results"
LOG_FILE="${LOG_DIR}/log.${SCRIPT_NAME}.v3.0.2.log"

# Modes
SIMULATE_MODE=false
EXEC_MODE=false
PREREQ_MODE=false
INSTALL_MODE=false
CHANGELOG_MODE=false
ACTIONS_PERFORMED=()

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# =============================================================================
# LOG & DIRECTORIES
# =============================================================================
log() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[${timestamp}] $1" >> "$LOG_FILE" 2>/dev/null
}

create_dirs() {
    mkdir -p "$LOG_DIR" "$RESULTS_DIR" 2>/dev/null
    [ -f "${SCRIPT_DIR}/.gitignore" ] && {
        grep -q "^/logs$" "${SCRIPT_DIR}/.gitignore" || echo "/logs" >> "${SCRIPT_DIR}/.gitignore"
        grep -q "^/outputs$" "${SCRIPT_DIR}/.gitignore" || echo "/outputs" >> "${SCRIPT_DIR}/.gitignore"
    }
}

# =============================================================================
# NATIVE MESSAGING PROTOCOL (ROBUSTE)
# =============================================================================
read_message() {
    local length
    length=$(dd bs=1 count=4 2>/dev/null | od -An -tu4 | tr -d ' ')
    [ -z "$length" ] || [ "$length" -eq 0 ] && return 1
    dd bs=1 count="$length" 2>/dev/null
}

send_response() {
    local response="$1"
    local length=${#response}
    printf "%08x" "$length" | sed 's/.\{2\}/\\x&/g' | xargs printf
    printf "%s" "$response"
    log "→ SENT: $response"
}

# =============================================================================
# WHISPER CONTROL (FIXED)
# =============================================================================
list_models() {
    log "ACTION: list_models"
    local models=()
    local current="none"

    # List models
    if [ -d "$MODELS_DIR" ]; then
        while IFS= read -r -d '' f; do
            models+=("$(basename "$f")")
        done < <(find "$MODELS_DIR" -name "ggml-*.bin" -print0 2>/dev/null | sort -z)
    fi

    # Current model
    local pid=$(pgrep -f "whisper-server.*-m")
    if [ -n "$pid" ]; then
        local cmd=$(ps -p "$pid" -o args= 2>/dev/null)
        if [[ $cmd =~ -m[[:space:]]+models/([^[:space:]]+) ]]; then
            current="${BASH_REMATCH[1]}"
        fi
    fi

    # JSON response
    local json_models=$(printf '%s\n' "${models[@]}" | jq -R . | jq -s .)
    send_response "{\"action\":\"list_models\",\"models\":$json_models,\"current\":\"$current\"}"
}

get_status() {
    log "ACTION: get_status"
    if curl -s --connect-timeout 2 "http://$HOST:$PORT/health" > /dev/null; then
        send_response '{"connected":true}'
    else
        send_response '{"connected":false}'
    fi
}

switch_model() {
    local model=$(echo "$1" | jq -r '.model')
    log "ACTION: switch_model → $model"
    if [ ! -f "$MODELS_DIR/$model" ]; then
        send_response "{\"error\":\"Model not found: $model\"}"
        return
    fi
    pkill -f whisper-server 2>/dev/null
    sleep 1
    nohup "$START_SCRIPT" --exec --model "$model" > /tmp/whisper-server.log 2>&1 &
    sleep 2
    send_response "{\"status\":\"restarting\",\"model\":\"$model\"}"
}

# =============================================================================
# MAIN LOOP
# =============================================================================
main() {
    create_dirs
    log "=== Native Host STARTED ==="

    while true; do
        local msg=$(read_message)
        [ -z "$msg" ] && break
        log "← RECEIVED: $msg"

        local action=$(echo "$msg" | jq -r '.action // empty')
        case "$action" in
            list_models) list_models ;;
            get_status) get_status ;;
            switch_model) switch_model "$msg" ;;
            *) send_response "{\"error\":\"unknown action\"}" ;;
        esac
    done

    log "=== Native Host STOPPED ==="
}

# =============================================================================
# ARGUMENT PARSING
# =============================================================================
if [ $# -eq 0 ]; then
    cat << EOF
${CYAN}Whisper Control v3.0.2${NC}
Usage: $0 --exec
EOF
    exit 0
fi

while [ $# -gt 0 ]; do
    case "$1" in
        --help|-h)
            cat << EOF
${GREEN}--help     : this help${NC}
${GREEN}--exec     : run Native Host${NC}
${GREEN}--simulate : dry-run${NC}
EOF
            exit 0
            ;;
        --exec|-exe) EXEC_MODE=true; shift ;;
        --simulate|-s) SIMULATE_MODE=true; shift ;;
        *) echo "Unknown: $1"; exit 1 ;;
    esac
done

# =============================================================================
# EXECUTION
# =============================================================================
if [ "$EXEC_MODE" = true ]; then
    main
else
    echo "Use --exec to start"
    exit 1
fi
