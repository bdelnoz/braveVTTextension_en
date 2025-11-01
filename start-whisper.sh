#!/bin/bash

################################################################################
# Script name       : start-whisper.sh
# Author            : Bruno DELNOZ  
# Email             : bruno.delnoz@protonmail.com
# Full path         : /mnt/data2_78g/Security/scripts/Projects_web/braveVTTextension/start-whisper.sh
# Target usage      : Starting whisper.cpp server for STT extension
# Version           : 3.0.0
# Date              : 2025-11-01
#
# CHANGELOG:
# ----------
# v3.0.0 - 2025-11-01
#   - Version bump for v3.0.0 release (floating widget)
#   - No functional changes
# 
# v2.3.0 - 2025-10-31
#   - Full English translation of script
#   - Updated all help messages and output
#   - Maintained all functionality
# 
# v2.2.0 - 2025-10-31
#   - Changed default model: medium instead of large-v3
#   - Faster and still good quality
# 
# v2.1.0 - 2025-10-31
#   - Added --whisper-path option to specify whisper.cpp path
#   - Default path kept if not specified
# 
# v2.0.0 - 2025-10-31
#   - Added --listmodel option to list available models
#   - Added --model option to select specific model
#   - Added --test option to test connection
#   - Improved information display
#   - Support for standard arguments (--help, --exec, etc.)
# 
# v1.0.0 - 2025-10-31
#   - Initial startup script
#   - LD_LIBRARY_PATH configuration
#   - Default model support
################################################################################

################################################################################
# CONFIGURATION
################################################################################

# Default paths
DEFAULT_WHISPER_DIR="/mnt/data2_78g/Security/scripts/AI_Projects/DeepEcho_whisper/whisper.cpp"
WHISPER_DIR="$DEFAULT_WHISPER_DIR"
MODELS_DIR="$WHISPER_DIR/models"

# Default configuration
DEFAULT_MODEL="ggml-medium.bin"
MODEL="$DEFAULT_MODEL"
PORT=8080
HOST="127.0.0.1"

# Mode
EXEC_MODE=false
LIST_MODELS=false
TEST_CONNECTION=false

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

################################################################################
# HELP
################################################################################

show_help() {
    cat << EOF
${CYAN}╔══════════════════════════════════════════════════════════════════════════╗
║              Whisper Server Launcher v3.0.0                              ║
║                   Bruno DELNOZ - 2025-11-01                              ║
╚══════════════════════════════════════════════════════════════════════════╝${NC}

${GREEN}DESCRIPTION:${NC}
    Starts whisper.cpp server for Whisper Local STT extension

${GREEN}USAGE:${NC}
    $0 [OPTIONS]

${GREEN}OPTIONS:${NC}
    ${YELLOW}--help, -h${NC}
        Display this help

    ${YELLOW}--exec, -exe${NC}
        Start whisper server

    ${YELLOW}--model MODEL${NC}
        Select a specific model
        Default: ${DEFAULT_MODEL}
        Examples: ggml-base.bin, ggml-medium.bin, ggml-large-v3.bin

    ${YELLOW}--whisper-path PATH${NC}
        Specify path to whisper.cpp
        Default: ${DEFAULT_WHISPER_DIR}
        Example: /home/user/whisper.cpp

    ${YELLOW}--listmodel${NC}
        List all available models in $MODELS_DIR

    ${YELLOW}--test${NC}
        Test connection to server (if already started)

    ${YELLOW}--changelog, -ch${NC}
        Display version history

${GREEN}EXAMPLES:${NC}
    ${CYAN}# List available models${NC}
    $0 --listmodel

    ${CYAN}# Start with default model (medium)${NC}
    $0 --exec

    ${CYAN}# Start with specific model${NC}
    $0 --exec --model ggml-medium.bin

    ${CYAN}# Start with custom whisper path${NC}
    $0 --exec --whisper-path /home/user/whisper.cpp

    ${CYAN}# Test connection${NC}
    $0 --test

${GREEN}WHISPER MODELS:${NC}
    tiny        (75 MB)    - Very fast, less accurate
    base        (147 MB)   - Good balance
    small       (487 MB)   - More accurate
    medium      (1.5 GB)   - High quality (default)
    large-v3    (3 GB)     - Best quality (recommended)

${GREEN}AUTHOR:${NC}
    Bruno DELNOZ - bruno.delnoz@protonmail.com

EOF
}

################################################################################
# CHANGELOG
################################################################################

show_changelog() {
    cat << EOF
${CYAN}╔══════════════════════════════════════════════════════════════════════════╗
║                            CHANGELOG v3.0.0                              ║
╚══════════════════════════════════════════════════════════════════════════╝${NC}

${GREEN}Version 3.0.0 - 2025-11-01${NC}
    ${YELLOW}[*]${NC} Version bump for v3.0.0 release (floating widget)
    ${YELLOW}[*]${NC} No functional changes

${GREEN}Version 2.3.0 - 2025-10-31${NC}
    ${YELLOW}[*]${NC} Full English translation of script
    ${YELLOW}[*]${NC} Updated all help messages and output
    ${YELLOW}[*]${NC} Maintained all functionality

${GREEN}Version 2.2.0 - 2025-10-31${NC}
    ${YELLOW}[*]${NC} Changed default model: medium instead of large-v3
    ${YELLOW}[*]${NC} Faster (2-3x) and still excellent quality

${GREEN}Version 2.1.0 - 2025-10-31${NC}
    ${YELLOW}[+]${NC} Added --whisper-path option to specify whisper.cpp path
    ${YELLOW}[+]${NC} Default path kept if not specified: ${DEFAULT_WHISPER_DIR}

${GREEN}Version 2.0.0 - 2025-10-31${NC}
    ${YELLOW}[+]${NC} Added --listmodel option to list models
    ${YELLOW}[+]${NC} Added --model option to select a model
    ${YELLOW}[+]${NC} Added --test option to test connection
    ${YELLOW}[+]${NC} Improved information display
    ${YELLOW}[+]${NC} Support for standard arguments (--help, --exec, etc.)

${GREEN}Version 1.0.0 - 2025-10-31${NC}
    ${YELLOW}[+]${NC} Initial startup script
    ${YELLOW}[+]${NC} LD_LIBRARY_PATH configuration
    ${YELLOW}[+]${NC} Default model support

EOF
}

################################################################################
# LIST MODELS
################################################################################

list_models() {
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                    Available Whisper Models                              ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    if [ ! -d "$MODELS_DIR" ]; then
        echo -e "${RED}[ERROR]${NC} Models directory not found: $MODELS_DIR"
        exit 1
    fi
    
    echo -e "${GREEN}Models found in:${NC} $MODELS_DIR"
    echo ""
    
    # List all .bin files
    local count=0
    while IFS= read -r -d '' model_file; do
        local filename=$(basename "$model_file")
        local size=$(du -h "$model_file" | cut -f1)
        
        # Determine type
        local type=""
        if [[ $filename == *"tiny"* ]]; then
            type="${YELLOW}[TINY]${NC}     - Very fast"
        elif [[ $filename == *"base"* ]]; then
            type="${GREEN}[BASE]${NC}     - Balanced"
        elif [[ $filename == *"small"* ]]; then
            type="${BLUE}[SMALL]${NC}    - Good compromise"
        elif [[ $filename == *"medium"* ]]; then
            type="${CYAN}[MEDIUM]${NC}   - High quality"
        elif [[ $filename == *"large"* ]]; then
            type="${GREEN}[LARGE]${NC}    - Best quality ⭐"
        else
            type="${NC}[OTHER]${NC}"
        fi
        
        echo -e "  ${type}"
        echo -e "    File: ${YELLOW}$filename${NC}"
        echo -e "    Size:  $size"
        echo ""
        
        ((count++))
    done < <(find "$MODELS_DIR" -maxdepth 1 -name "ggml-*.bin" -type f -print0 | sort -z)
    
    if [ $count -eq 0 ]; then
        echo -e "${RED}[ERROR]${NC} No models found in $MODELS_DIR"
        echo -e "${YELLOW}[INFO]${NC} Download a model with:"
        echo -e "  cd $WHISPER_DIR"
        echo -e "  bash ./models/download-ggml-model.sh base"
    else
        echo -e "${GREEN}Total:${NC} $count model(s) available"
    fi
    
    echo ""
}

################################################################################
# TEST CONNECTION
################################################################################

test_connection() {
    echo -e "${BLUE}[TEST]${NC} Testing connection to whisper server..."
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" http://$HOST:$PORT/health 2>/dev/null)
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}[OK]${NC} Whisper server accessible at http://$HOST:$PORT"
        
        # Try to get more info
        local health_info=$(curl -s http://$HOST:$PORT/health 2>/dev/null)
        if [ ! -z "$health_info" ]; then
            echo -e "${GREEN}[INFO]${NC} Server response: $health_info"
        fi
    else
        echo -e "${RED}[ERROR]${NC} Whisper server not accessible"
        echo -e "${YELLOW}[INFO]${NC} Check that server is started with:"
        echo -e "  $0 --exec"
    fi
}

################################################################################
# CHECKS
################################################################################

check_prerequisites() {
    local all_ok=true
    
    # Check whisper directory
    if [ ! -d "$WHISPER_DIR" ]; then
        echo -e "${RED}[ERROR]${NC} whisper.cpp directory not found: $WHISPER_DIR"
        all_ok=false
    fi
    
    # Check server binary
    if [ ! -f "$WHISPER_DIR/build/bin/whisper-server" ]; then
        echo -e "${RED}[ERROR]${NC} whisper-server not found in build/bin/"
        all_ok=false
    fi
    
    # Check model
    if [ ! -f "$MODELS_DIR/$MODEL" ]; then
        echo -e "${RED}[ERROR]${NC} Model not found: $MODELS_DIR/$MODEL"
        echo -e "${YELLOW}[INFO]${NC} Use --listmodel to see available models"
        all_ok=false
    fi
    
    if [ "$all_ok" = false ]; then
        return 1
    fi
    
    return 0
}

################################################################################
# SERVER STARTUP
################################################################################

start_server() {
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                  Starting Whisper Server                                 ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Checks
    if ! check_prerequisites; then
        exit 1
    fi
    
    # Check if port is already in use
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}[WARNING]${NC} Port $PORT is already in use"
        echo -e "${YELLOW}[INFO]${NC} Do you want to stop existing process? (y/n)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            echo -e "${BLUE}[INFO]${NC} Stopping process..."
            lsof -ti:$PORT | xargs kill -9 2>/dev/null
            sleep 1
        else
            echo -e "${RED}[CANCELLED]${NC}"
            exit 1
        fi
    fi
    
    # Display info
    echo -e "${GREEN}🔧 Configuration:${NC}"
    echo -e "   Model:      $MODEL"
    echo -e "   URL:        http://$HOST:$PORT"
    echo -e "   Directory:  $WHISPER_DIR"
    echo ""
    echo -e "${YELLOW}💡 Press Ctrl+C to stop${NC}"
    echo ""
    
    # Start server
    cd "$WHISPER_DIR" || exit 1
    
    LD_LIBRARY_PATH=./build/src:./build/ggml/src:$LD_LIBRARY_PATH \
    ./build/bin/whisper-server \
        -m "models/$MODEL" \
        --port $PORT \
        --host $HOST \
        --convert
}

################################################################################
# ARGUMENT PARSING
################################################################################

if [ $# -eq 0 ]; then
    show_help
    exit 0
fi

while [[ $# -gt 0 ]]; do
    case $1 in
        --help|-h)
            show_help
            exit 0
            ;;
        --changelog|-ch)
            show_changelog
            exit 0
            ;;
        --exec|-exe)
            EXEC_MODE=true
            shift
            ;;
        --model)
            MODEL="$2"
            shift 2
            ;;
        --whisper-path)
            WHISPER_DIR="$2"
            MODELS_DIR="$WHISPER_DIR/models"
            shift 2
            ;;
        --listmodel)
            LIST_MODELS=true
            shift
            ;;
        --test)
            TEST_CONNECTION=true
            shift
            ;;
        *)
            echo -e "${RED}[ERROR]${NC} Unknown option: $1"
            echo "Use --help to see help"
            exit 1
            ;;
    esac
done

################################################################################
# EXECUTION
################################################################################

if [ "$LIST_MODELS" = true ]; then
    list_models
    exit 0
fi

if [ "$TEST_CONNECTION" = true ]; then
    test_connection
    exit 0
fi

if [ "$EXEC_MODE" = true ]; then
    start_server
else
    echo -e "${RED}[ERROR]${NC} Use --exec to start server"
    echo "Use --help to see help"
    exit 1
fi
