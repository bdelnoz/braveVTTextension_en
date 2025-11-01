#!/bin/bash

################################################################################
# Script name       : install-native-host.sh
# Author            : Bruno DELNOZ
# Email             : bruno.delnoz@protonmail.com
# Version           : 3.0.0
# Date              : 2025-11-01
# Target usage      : Automatic installation of Native Messaging Host
#                     for Whisper STT extension (Brave/Chrome/Chromium)
#
# CHANGELOG:
# ----------
# v3.0.0 - 2025-11-01
#   - Initial Native Host installer
#   - Detects browser type (Brave/Chrome/Chromium)
#   - Asks for extension ID
#   - Creates manifest with correct paths
#   - Installs in appropriate directory
#   - Makes whisper-control.sh executable
#   - Verifies installation
################################################################################

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONTROL_SCRIPT="$SCRIPT_DIR/whisper-control.sh"
MANIFEST_TEMPLATE="$SCRIPT_DIR/com.whisper.control.json"

# Native Messaging Hosts directories
BRAVE_DIR="$HOME/.config/BraveSoftware/Brave-Browser/NativeMessagingHosts"
CHROME_DIR="$HOME/.config/google-chrome/NativeMessagingHosts"
CHROMIUM_DIR="$HOME/.config/chromium/NativeMessagingHosts"

################################################################################
# DISPLAY FUNCTIONS
################################################################################

show_header() {
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║         Whisper STT - Native Messaging Host Installer v3.0.0            ║${NC}"
    echo -e "${CYAN}║                      Bruno DELNOZ - 2025-11-01                           ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

################################################################################
# BROWSER DETECTION
################################################################################

detect_browser() {
    echo -e "${BLUE}[INFO]${NC} Detecting browsers..."
    echo ""
    
    local browsers=()
    
    if [ -d "$HOME/.config/BraveSoftware/Brave-Browser" ]; then
        browsers+=("Brave")
    fi
    
    if [ -d "$HOME/.config/google-chrome" ]; then
        browsers+=("Chrome")
    fi
    
    if [ -d "$HOME/.config/chromium" ]; then
        browsers+=("Chromium")
    fi
    
    if [ ${#browsers[@]} -eq 0 ]; then
        echo -e "${RED}[ERROR]${NC} No compatible browser found (Brave/Chrome/Chromium)"
        exit 1
    fi
    
    echo -e "${GREEN}[OK]${NC} Found browsers: ${browsers[*]}"
    echo ""
    
    # Ask user which browser to use
    if [ ${#browsers[@]} -eq 1 ]; then
        SELECTED_BROWSER="${browsers[0]}"
        echo -e "${GREEN}[INFO]${NC} Using ${SELECTED_BROWSER}"
    else
        echo -e "${YELLOW}[SELECT]${NC} Multiple browsers found. Which one are you using?"
        select browser in "${browsers[@]}"; do
            if [ -n "$browser" ]; then
                SELECTED_BROWSER="$browser"
                break
            fi
        done
    fi
    
    # Set target directory
    case "$SELECTED_BROWSER" in
        Brave)
            TARGET_DIR="$BRAVE_DIR"
            ;;
        Chrome)
            TARGET_DIR="$CHROME_DIR"
            ;;
        Chromium)
            TARGET_DIR="$CHROMIUM_DIR"
            ;;
    esac
    
    echo -e "${GREEN}[OK]${NC} Target directory: $TARGET_DIR"
    echo ""
}

################################################################################
# EXTENSION ID
################################################################################

get_extension_id() {
    echo -e "${YELLOW}[INPUT REQUIRED]${NC} Extension ID"
    echo ""
    echo -e "To find your extension ID:"
    echo -e "  1. Open ${CYAN}brave://extensions/${NC} (or chrome://extensions/)"
    echo -e "  2. Enable 'Developer mode' (top right)"
    echo -e "  3. Find 'Whisper Local STT' extension"
    echo -e "  4. Copy the ID (long alphanumeric string)"
    echo ""
    echo -e "Example: ${CYAN}abcdefghijklmnopqrstuvwxyz123456${NC}"
    echo ""
    
    read -p "Enter Extension ID: " EXTENSION_ID
    
    # Validate format (32 characters, alphanumeric)
    if [[ ! "$EXTENSION_ID" =~ ^[a-z]{32}$ ]]; then
        echo -e "${YELLOW}[WARNING]${NC} Extension ID format looks unusual (should be 32 lowercase letters)"
        echo -e "${YELLOW}[WARNING]${NC} Continuing anyway..."
    fi
    
    echo -e "${GREEN}[OK]${NC} Extension ID: $EXTENSION_ID"
    echo ""
}

################################################################################
# INSTALLATION
################################################################################

install_native_host() {
    echo -e "${BLUE}[INFO]${NC} Installing Native Messaging Host..."
    echo ""
    
    # Create target directory if needed
    if [ ! -d "$TARGET_DIR" ]; then
        echo -e "${BLUE}[INFO]${NC} Creating directory: $TARGET_DIR"
        mkdir -p "$TARGET_DIR"
    fi
    
    # Make whisper-control.sh executable
    echo -e "${BLUE}[INFO]${NC} Making whisper-control.sh executable"
    chmod +x "$CONTROL_SCRIPT"
    
    # Create manifest with correct paths and extension ID
    echo -e "${BLUE}[INFO]${NC} Creating manifest: com.whisper.control.json"
    
    cat > "$TARGET_DIR/com.whisper.control.json" << EOF
{
  "name": "com.whisper.control",
  "description": "Native Messaging Host for Whisper STT Extension - Model switching and server control",
  "path": "$CONTROL_SCRIPT",
  "type": "stdio",
  "allowed_origins": [
    "chrome-extension://$EXTENSION_ID/"
  ]
}
EOF
    
    echo -e "${GREEN}[OK]${NC} Manifest created"
    echo ""
}

################################################################################
# VERIFICATION
################################################################################

verify_installation() {
    echo -e "${BLUE}[INFO]${NC} Verifying installation..."
    echo ""
    
    # Check manifest exists
    if [ ! -f "$TARGET_DIR/com.whisper.control.json" ]; then
        echo -e "${RED}[ERROR]${NC} Manifest not found!"
        return 1
    fi
    echo -e "${GREEN}[OK]${NC} Manifest exists"
    
    # Check control script exists and is executable
    if [ ! -x "$CONTROL_SCRIPT" ]; then
        echo -e "${RED}[ERROR]${NC} Control script not executable!"
        return 1
    fi
    echo -e "${GREEN}[OK]${NC} Control script executable"
    
    # Check manifest content
    local manifest_path=$(cat "$TARGET_DIR/com.whisper.control.json" | grep -oP '"path":\s*"\K[^"]+')
    if [ "$manifest_path" != "$CONTROL_SCRIPT" ]; then
        echo -e "${YELLOW}[WARNING]${NC} Manifest path mismatch"
    else
        echo -e "${GREEN}[OK]${NC} Manifest path correct"
    fi
    
    # Check extension ID
    local manifest_ext_id=$(cat "$TARGET_DIR/com.whisper.control.json" | grep -oP 'chrome-extension://\K[^/]+')
    if [ "$manifest_ext_id" != "$EXTENSION_ID" ]; then
        echo -e "${YELLOW}[WARNING]${NC} Extension ID mismatch"
    else
        echo -e "${GREEN}[OK]${NC} Extension ID correct"
    fi
    
    echo ""
    return 0
}

################################################################################
# MAIN
################################################################################

show_header

# Check prerequisites
if [ ! -f "$CONTROL_SCRIPT" ]; then
    echo -e "${RED}[ERROR]${NC} whisper-control.sh not found in $SCRIPT_DIR"
    exit 1
fi

if [ ! -f "$MANIFEST_TEMPLATE" ]; then
    echo -e "${RED}[ERROR]${NC} com.whisper.control.json not found in $SCRIPT_DIR"
    exit 1
fi

# Detect browser
detect_browser

# Check if already installed
if [ -f "$TARGET_DIR/com.whisper.control.json" ]; then
    echo -e "${YELLOW}[WARNING]${NC} Native Messaging Host already installed"
    echo ""
    read -p "Do you want to reinstall? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}[INFO]${NC} Installation cancelled"
        exit 0
    fi
    echo ""
fi

# Get extension ID
get_extension_id

# Install
install_native_host

# Verify
if verify_installation; then
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                    Installation Successful!                              ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}NEXT STEPS:${NC}"
    echo -e "  1. Restart ${SELECTED_BROWSER} completely"
    echo -e "  2. Reload the Whisper STT extension"
    echo -e "  3. Open any webpage and look for the floating widget"
    echo -e "  4. The widget should show the current Whisper model"
    echo ""
    echo -e "${BLUE}[TIP]${NC} You can now switch Whisper models directly from the widget!"
    echo ""
else
    echo -e "${RED}╔══════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                    Installation Failed!                                  ║${NC}"
    echo -e "${RED}╚══════════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}[INFO]${NC} Check the errors above and try again"
    exit 1
fi
