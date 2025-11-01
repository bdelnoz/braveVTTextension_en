#!/bin/bash

################################################################################
# Script name       : whisper-control.sh
# Author            : Bruno DELNOZ
# Email             : bruno.delnoz@protonmail.com
# Version           : 3.0.0
# Date              : 2025-11-01
# Full path         : [TO BE DEFINED BY USER]
# Target usage      : Native Messaging Host for Whisper STT extension
#                     Handles model switching, server control, and status
#
# CHANGELOG:
# ----------
# v3.0.0 - 2025-11-01
#   - Initial Native Messaging Host
#   - Support for list_models action
#   - Support for switch_model action
#   - Support for get_status action
#   - JSON input/output via stdin/stdout
#   - Automatic whisper server management
################################################################################

# Configuration
WHISPER_DIR="/mnt/data2_78g/Security/scripts/AI_Projects/DeepEcho_whisper/whisper.cpp"
MODELS_DIR="$WHISPER_DIR/models"
START_SCRIPT="$(dirname "$0")/start-whisper.sh"
PORT=8080

# Logging (to file, not stdout - stdout is reserved for Native Messaging)
LOG_FILE="/tmp/whisper-control.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# ============================================================================
# NATIVE MESSAGING PROTOCOL
# ============================================================================

# Read message length (4 bytes, little-endian)
read_message_length() {
    local length=0
    for i in {0..3}; do
        IFS= read -r -n1 -d '' byte
        if [ -z "$byte" ]; then
            echo 0
            return
        fi
        local value=$(printf '%d' "'$byte")
        length=$((length + value * (256 ** i)))
    done
    echo $length
}

# Read JSON message from stdin
read_message() {
    local length=$(read_message_length)
    if [ $length -eq 0 ]; then
        echo ""
        return
    fi
    
    local message=""
    for ((i=0; i<length; i++)); do
        IFS= read -r -n1 -d '' char
        message="${message}${char}"
    done
    echo "$message"
}

# Send JSON response to stdout
send_response() {
    local response="$1"
    local length=${#response}
    
    # Send length (4 bytes, little-endian)
    printf "$(printf '\\x%02x' $((length % 256)))"
    printf "$(printf '\\x%02x' $((length / 256 % 256)))"
    printf "$(printf '\\x%02x' $((length / 65536 % 256)))"
    printf "$(printf '\\x%02x' $((length / 16777216 % 256)))"
    
    # Send message
    printf "%s" "$response"
}

# ============================================================================
# WHISPER CONTROL FUNCTIONS
# ============================================================================

list_models() {
    log "Action: list_models"
    
    if [ ! -d "$MODELS_DIR" ]; then
        send_response '{"error": "Models directory not found"}'
        return
    fi
    
    # Find all ggml-*.bin files
    local models=()
    while IFS= read -r -d '' model_file; do
        local filename=$(basename "$model_file")
        models+=("\"$filename\"")
    done < <(find "$MODELS_DIR" -maxdepth 1 -name "ggml-*.bin" -type f -print0 | sort -z)
    
    # Get current model (from running process or default)
    local current_model=$(get_current_model)
    
    # Build JSON response
    local models_json=$(IFS=,; echo "${models[*]}")
    local response="{\"models\": [$models_json], \"current\": \"$current_model\"}"
    
    log "Response: $response"
    send_response "$response"
}

get_current_model() {
    # Check if whisper-server is running
    local pid=$(pgrep -f "whisper-server.*-m models")
    if [ -z "$pid" ]; then
        echo "unknown"
        return
    fi
    
    # Extract model from command line
    local cmdline=$(ps -p $pid -o args= 2>/dev/null)
    if [[ $cmdline =~ -m[[:space:]]+models/([^[:space:]]+) ]]; then
        echo "${BASH_REMATCH[1]}"
    else
        echo "unknown"
    fi
}

switch_model() {
    local model="$1"
    log "Action: switch_model to $model"
    
    # Validate model exists
    if [ ! -f "$MODELS_DIR/$model" ]; then
        send_response "{\"error\": \"Model not found: $model\"}"
        return
    fi
    
    # Kill existing whisper server
    log "Killing existing whisper server"
    pkill -f whisper-server
    sleep 1
    
    # Start new server with selected model
    log "Starting whisper with model: $model"
    if [ -f "$START_SCRIPT" ]; then
        # Use start-whisper.sh script
        nohup "$START_SCRIPT" --exec --model "$model" > /tmp/whisper-server.log 2>&1 &
    else
        # Direct start
        cd "$WHISPER_DIR" || exit 1
        nohup LD_LIBRARY_PATH=./build/src:./build/ggml/src:$LD_LIBRARY_PATH \
              ./build/bin/whisper-server \
              -m "models/$model" \
              --port $PORT \
              --host 127.0.0.1 \
              --convert > /tmp/whisper-server.log 2>&1 &
    fi
    
    # Wait for server to be ready (max 15 seconds)
    log "Waiting for server to be ready"
    for i in {1..30}; do
        sleep 0.5
        if curl -s http://127.0.0.1:$PORT/health > /dev/null 2>&1; then
            log "Server ready after ${i}x0.5s"
            local model_name=$(echo "$model" | sed 's/ggml-//;s/.bin//')
            send_response "{\"status\": \"success\", \"model\": \"$model_name\"}"
            return
        fi
    done
    
    # Timeout
    log "Server start timeout"
    send_response '{"error": "Server start timeout"}'
}

get_status() {
    log "Action: get_status"
    
    # Check if server is responding
    if curl -s http://127.0.0.1:$PORT/health > /dev/null 2>&1; then
        local current_model=$(get_current_model)
        send_response "{\"connected\": true, \"model\": \"$current_model\"}"
    else
        send_response '{"connected": false}'
    fi
}

# ============================================================================
# MAIN LOOP
# ============================================================================

log "Native Messaging Host started"

while true; do
    # Read incoming message
    message=$(read_message)
    
    if [ -z "$message" ]; then
        log "Empty message, exiting"
        break
    fi
    
    log "Received: $message"
    
    # Parse action from JSON (simple parsing, assumes well-formed JSON)
    action=$(echo "$message" | grep -oP '"action":\s*"\K[^"]+')
    
    case "$action" in
        list_models)
            list_models
            ;;
        switch_model)
            model=$(echo "$message" | grep -oP '"model":\s*"\K[^"]+')
            switch_model "$model"
            ;;
        get_status)
            get_status
            ;;
        *)
            log "Unknown action: $action"
            send_response "{\"error\": \"Unknown action: $action\"}"
            ;;
    esac
done

log "Native Messaging Host stopped"
