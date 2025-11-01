#!/bin/bash

################################################################################
# Script name       : install.sh
# Author            : Bruno DELNOZ
# Email             : bruno.delnoz@protonmail.com
# Full path         : [TO BE DEFINED BY USER]
# Target usage      : Installation and configuration of Whisper Local STT extension
# Version           : 3.0.0
# Date              : 2025-11-01
#
# CHANGELOG:
# ----------
# v3.0.0 - 2025-11-01
#   - Added Native Messaging Host installation support
#   - Auto-detection of Brave/Chrome/Chromium
#   - Native Host installation with --install-native
#   - Verification of Native Host installation
#   - Skip if already installed
#   - Full v3.0.0 floating widget support
# 
# v1.2.0 - 2025-10-31
#   - Full English translation of script
#   - Updated all help messages and output
#   - Maintained all functionality
# 
# v1.1.0 - 2025-10-31
#   - Added --whisper-path option to specify whisper.cpp path
#   - Default path kept if not specified
# 
# v1.0.0 - 2025-10-31
#   - Script creation
#   - Support --delay to configure auto-stop delay
#   - Support --silence to configure silence threshold
#   - Support --auto-enter to enable/disable automatic ENTER
#   - Support --language to define default language
#   - Automatic generation of popup.js and content.js files
#   - Parameter validation
#   - Complete --help mode with examples
#   - --simulate mode for dry-run
#   - Preferences saving
################################################################################

################################################################################
# DEFAULT CONFIGURATION
################################################################################

# Working directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Configuration variables
INSTALL_NATIVE=false
SIMULATE=false

################################################################################
# COLORS FOR DISPLAY
################################################################################

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

################################################################################
# FUNCTION: Display help
################################################################################

show_help() {
    cat << EOF
${CYAN}╔══════════════════════════════════════════════════════════════════════════╗
║           Whisper Local STT - Installation Script v3.0.0                 ║
║                      Bruno DELNOZ - 2025-11-01                           ║
╚══════════════════════════════════════════════════════════════════════════╝${NC}

${GREEN}DESCRIPTION:${NC}
    Installation script for Whisper Local STT extension v3.0.0
    Floating widget with model selection and Native Messaging Host

${GREEN}USAGE:${NC}
    $0 [OPTIONS]

${GREEN}OPTIONS:${NC}
    ${YELLOW}--help, -h${NC}
        Display this help

    ${YELLOW}--install-native${NC}
        Install Native Messaging Host (required for model switching)
        This will:
          - Detect your browser (Brave/Chrome/Chromium)
          - Ask for extension ID
          - Install com.whisper.control native host
          - Make whisper-control.sh executable

    ${YELLOW}--prerequis, -pr${NC}
        Check prerequisites before installation

    ${YELLOW}--simulate, -s${NC}
        Simulation mode (dry-run), doesn't modify any files

    ${YELLOW}--changelog, -ch${NC}
        Display version history

${GREEN}EXAMPLES:${NC}
    ${CYAN}# Check prerequisites${NC}
    $0 --prerequis

    ${CYAN}# Install Native Messaging Host (interactive)${NC}
    $0 --install-native

    ${CYAN}# Simulation mode${NC}
    $0 --simulate --install-native

${GREEN}EXTENSION STRUCTURE v3.0.0:${NC}
    - manifest.json       : Extension manifest (v3.0.0)
    - content-widget.js   : Floating widget (replaces popup.js)
    - widget-style.css    : Widget styles
    - background.js       : Service worker for Native Messaging
    - whisper-control.sh  : Native Host for model switching
    - start-whisper.sh    : Whisper server launcher
    - icon48.png / icon96.png

${GREEN}NOTES:${NC}
    - v3.0.0 uses floating widget instead of popup
    - Native Host allows model switching from widget
    - Extension loads automatically on all pages
    - After installation, reload extension in brave://extensions/

${GREEN}AUTHOR:${NC}
    Bruno DELNOZ - bruno.delnoz@protonmail.com

EOF
}

################################################################################
# FUNCTION: Display changelog
################################################################################

show_changelog() {
    cat << EOF
${CYAN}╔══════════════════════════════════════════════════════════════════════════╗
║                            CHANGELOG v3.0.0                              ║
╚══════════════════════════════════════════════════════════════════════════╝${NC}

${GREEN}Version 3.0.0 - 2025-11-01${NC}
    ${YELLOW}[+]${NC} Added Native Messaging Host installation
    ${YELLOW}[+]${NC} Auto-detection of Brave/Chrome/Chromium
    ${YELLOW}[+]${NC} Floating widget support (no more popup)
    ${YELLOW}[+]${NC} Model selection from widget
    ${YELLOW}[*]${NC} Complete architecture refactoring

${GREEN}Version 1.2.0 - 2025-10-31${NC}
    ${YELLOW}[*]${NC} Full English translation of script
    ${YELLOW}[*]${NC} Updated all help messages and output
    ${YELLOW}[*]${NC} Maintained all functionality

${GREEN}Version 1.1.0 - 2025-10-31${NC}
    ${YELLOW}[+]${NC} Added --whisper-path option to specify whisper.cpp path
    ${YELLOW}[+]${NC} Default path kept if not specified

${GREEN}Version 1.0.0 - 2025-10-31${NC}
    ${YELLOW}[+]${NC} Script creation
    ${YELLOW}[+]${NC} Support for various configuration options
    ${YELLOW}[+]${NC} --simulate mode for dry-run

EOF
}

################################################################################
# FUNCTION: Check prerequisites
################################################################################

check_prerequisites() {
    echo -e "${BLUE}[INFO]${NC} Checking prerequisites..."
    
    local all_ok=true
    
    # Check that required files exist
    if [ ! -f "$SCRIPT_DIR/manifest.json" ]; then
        echo -e "${RED}[ERROR]${NC} manifest.json file missing"
        all_ok=false
    else
        echo -e "${GREEN}[OK]${NC} manifest.json found"
    fi
    
    if [ ! -f "$SCRIPT_DIR/content-widget.js" ]; then
        echo -e "${RED}[ERROR]${NC} content-widget.js file missing"
        all_ok=false
    else
        echo -e "${GREEN}[OK]${NC} content-widget.js found"
    fi
    
    if [ ! -f "$SCRIPT_DIR/widget-style.css" ]; then
        echo -e "${RED}[ERROR]${NC} widget-style.css file missing"
        all_ok=false
    else
        echo -e "${GREEN}[OK]${NC} widget-style.css found"
    fi
    
    if [ ! -f "$SCRIPT_DIR/background.js" ]; then
        echo -e "${RED}[ERROR]${NC} background.js file missing"
        all_ok=false
    else
        echo -e "${GREEN}[OK]${NC} background.js found"
    fi
    
    if [ ! -f "$SCRIPT_DIR/whisper-control.sh" ]; then
        echo -e "${YELLOW}[WARNING]${NC} whisper-control.sh not found (Native Host won't work)"
    else
        echo -e "${GREEN}[OK]${NC} whisper-control.sh found"
    fi
    
    # Check write permissions
    if [ ! -w "$SCRIPT_DIR" ]; then
        echo -e "${RED}[ERROR]${NC} No write permission in $SCRIPT_DIR"
        all_ok=false
    else
        echo -e "${GREEN}[OK]${NC} Write permissions OK"
    fi
    
    if [ "$all_ok" = true ]; then
        echo -e "${GREEN}[OK]${NC} All prerequisites satisfied"
        return 0
    else
        echo -e "${RED}[ERROR]${NC} Some prerequisites not satisfied"
        return 1
    fi
}

################################################################################
# FUNCTION: Install Native Messaging Host
################################################################################

install_native_host() {
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║          Installing Native Messaging Host                                ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    if [ "$SIMULATE" = true ]; then
        echo -e "${YELLOW}[SIMULATE]${NC} Would run install-native-host.sh"
        return 0
    fi
    
    # Check if install-native-host.sh exists
    if [ ! -f "$SCRIPT_DIR/install-native-host.sh" ]; then
        echo -e "${RED}[ERROR]${NC} install-native-host.sh not found!"
        echo -e "${YELLOW}[INFO]${NC} This file is required for Native Host installation"
        return 1
    fi
    
    # Make it executable
    chmod +x "$SCRIPT_DIR/install-native-host.sh"
    
    # Run it
    "$SCRIPT_DIR/install-native-host.sh"
    
    return $?
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
        --prerequis|-pr)
            check_prerequisites
            exit $?
            ;;
        --install-native)
            INSTALL_NATIVE=true
            shift
            ;;
        --simulate|-s)
            SIMULATE=true
            echo -e "${YELLOW}[SIMULATION MODE ENABLED]${NC}"
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
# VALIDATION AND EXECUTION
################################################################################

if [ "$INSTALL_NATIVE" = true ]; then
    install_native_host
    exit $?
fi

echo -e "${YELLOW}[INFO]${NC} Nothing to do. Use --help to see available options"
exit 0
