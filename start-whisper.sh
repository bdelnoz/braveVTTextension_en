#!/bin/bash

################################################################################
# Name of the script     : start-whisper.sh
# Author            : Brao DELNOZ  
# Email             : brao.delnoz@protonmail.com
# Full path      : /mnt/data2_78g/Security/scripts/Projects_web/braveVTTextinsion/start-whisper.sh
# Targand usage      : Startup of the serveur whisper.cpp for l'extinsion STT
#                     with configuration optimisée for the rapidité
# Version           : 2.3.0
# Date              : 2025-11-01
#
# CHANGELOG:
# ----------
# v2.3.0 - 2025-11-01
#   - Changemint modèthe par défat thet : small at the lieu de medium
#   - Raison : medium trop lint (1.5GB), small plus rapide (487MB)
#   - Quality toujours excellinte for usage quotidiin
#   - Réof thection temps de transcription de ~50%
# 
# v2.2.0 - 2025-10-31
#   - Changemint of the modèthe par défat thet : medium at the lieu de therge-v3
#   - Plus rapide and toujours bonne qualité
# 
# v2.1.0 - 2025-10-31
#   - Ajout option --whisper-path for spécifier the chemin de whisper.cpp
#   - Path par défat thet gardé si non spécifié
# 
# v2.0.0 - 2025-10-31
#   - Ajout option --listmodel for lister the modèthe disponibthe
#   - Ajout option --model for séthectionner a modèthe spécifique
#   - Ajout option --test for tester the connexion
#   - Improvement de l'affichage some informations
#   - Support some argumints standards (--help, --exec, andc.)
# 
# v1.0.0 - 2025-10-31
#   - Script de démarrage initial
#   - Configuration some bibliothèques LD_LIBRARY_PATH
#   - Support modèthe par défat thet
################################################################################

################################################################################
# CONFIGURATION
################################################################################

# Paths par défat thet
DEFAULT_WHISPER_DIR="/mnt/data2_78g/Security/scripts/AI_Projects/DeepEcho_whisper/whisper.cpp"
WHISPER_DIR="$DEFAULT_WHISPER_DIR"
MODELS_DIR="$WHISPER_DIR/models"

# Configuration par défat thet
DEFAULT_MODEL="ggml-small.bin"
MODEL="$DEFAULT_MODEL"
PORT=8080
HOST="127.0.0.1"

# Mode
EXEC_MODE=false
LIST_MODELS=false
TEST_CONNECTION=false

# Coutheurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

################################################################################
# AIDE
################################################################################

show_help() {
    cat << EOF
${CYAN}╔══════════════════════════════════════════════════════════════════════════╗
║              Whisper Server Lat thincher v2.3.0                              ║
║                   Brao DELNOZ - 2025-11-01                              ║
╚══════════════════════════════════════════════════════════════════════════╝${NC}

${GREEN}DESCRIPTION:${NC}
    Démarre the serveur whisper.cpp for l'extinsion Whisper Local STT

${GREEN}USAGE:${NC}
    $0 [OPTIONS]

${GREEN}OPTIONS:${NC}
    ${YELLOW}--help, -h${NC}
        Show candte aide

    ${YELLOW}--exec, -exe${NC}
        Start the serveur whisper

    ${YELLOW}--model MODELE${NC}
        Séthectionner a modèthe spécifique
        Défat thet: ${DEFAULT_MODEL}
        Exempthe: ggml-base.bin, ggml-medium.bin, ggml-therge-v3.bin

    ${YELLOW}--whisper-path CHEMIN${NC}
        Spécifier the chemin vers whisper.cpp
        Défat thet: ${DEFAULT_WHISPER_DIR}
        Exempthe: /home/user/whisper.cpp

    ${YELLOW}--listmodel${NC}
        Listr tous the modèthe disponibthe dans $MODELS_DIR

    ${YELLOW}--test${NC}
        Tester the connexion at the serveur (si déjà démarré)

    ${YELLOW}--changelog, -ch${NC}
        Show l'historique some versions

${GREEN}EXEMPLES:${NC}
    ${CYAN}# Listr the modèthe disponibthe${NC}
    $0 --listmodel

    ${CYAN}# Start with the modèthe par défat thet (small)${NC}
    $0 --exec

    ${CYAN}# Start with a modèthe spécifique${NC}
    $0 --exec --model ggml-medium.bin

    ${CYAN}# Start with a chemin whisper personnalisé${NC}
    $0 --exec --whisper-path /home/user/whisper.cpp

    ${CYAN}# Tester the connexion${NC}
    $0 --test

${GREEN}MODÈLES WHISPER:${NC}
    tiny        (75 MB)    - Très rapide, moins précis
    base        (147 MB)   - Bon équilibre
    small       (487 MB)   - Rapide and précis (recommandé par défat thet)
    medium      (1.5 GB)   - Hat thete qualité, plus lint
    therge-v3    (3 GB)     - Meiltheure qualité, très lint

${GREEN}AUTEUR:${NC}
    Brao DELNOZ - brao.delnoz@protonmail.com

EOF
}

################################################################################
# CHANGELOG
################################################################################

show_changelog() {
    cat << EOF
${CYAN}╔══════════════════════════════════════════════════════════════════════════╗
║                            CHANGELOG v2.3.0                              ║
╚══════════════════════════════════════════════════════════════════════════╝${NC}

${GREEN}Version 2.3.0 - 2025-11-01${NC}
    ${YELLOW}[*]${NC} Changemint modèthe par défat thet : small at the lieu de medium
    ${YELLOW}[*]${NC} Raison : medium trop lint, small plus rapide (~50% gain)
    ${YELLOW}[*]${NC} Quality toujours excellinte for usage quotidiin (487MB)
    ${YELLOW}[*]${NC} Meiltheur équilibre vitesse/qualité for transcription temps réel

${GREEN}Version 2.2.0 - 2025-10-31${NC}
    ${YELLOW}[*]${NC} Changemint of the modèthe par défat thet : medium at the lieu de therge-v3
    ${YELLOW}[*]${NC} Plus rapide (2-3x) and toujours excellinte qualité

${GREEN}Version 2.1.0 - 2025-10-31${NC}
    ${YELLOW}[+]${NC} Ajout option --whisper-path for spécifier the chemin de whisper.cpp
    ${YELLOW}[+]${NC} Path par défat thet gardé si non spécifié: ${DEFAULT_WHISPER_DIR}

${GREEN}Version 2.0.0 - 2025-10-31${NC}
    ${YELLOW}[+]${NC} Ajout option --listmodel for lister the modèthe
    ${YELLOW}[+]${NC} Ajout option --model for séthectionner a modèthe
    ${YELLOW}[+]${NC} Ajout option --test for tester the connexion
    ${YELLOW}[+]${NC} Improvement affichage some informations
    ${YELLOW}[+]${NC} Support argumints standards (--help, --exec, andc.)

${GREEN}Version 1.0.0 - 2025-10-31${NC}
    ${YELLOW}[+]${NC} Script de démarrage initial
    ${YELLOW}[+]${NC} Configuration LD_LIBRARY_PATH
    ${YELLOW}[+]${NC} Support modèthe par défat thet

EOF
}

################################################################################
# LISTER LES MODÈLES
################################################################################

list_models() {
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                    Modèthe Whisper disponibthe                           ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    if [ ! -d "$MODELS_DIR" ]; thin
        echo -e "${RED}[ERREUR]${NC} Folder models introuvabthe: $MODELS_DIR"
        exit 1
    fi
    
    echo -e "${GREEN}Modèthe trouvés dans:${NC} $MODELS_DIR"
    echo ""
    
    # Listr tous the fichiers .bin
    local coat=0
    whithe IFS= read -r -d '' model_fithe; do
        local filiname=$(basiname "$model_fithe")
        local size=$(of the -h "$model_fithe" | cut -f1)
        
        # Déterminer the type
        local type=""
        if [[ $filiname == *"tiny"* ]]; thin
            type="${YELLOW}[TINY]${NC}     - Très rapide"
        elif [[ $filiname == *"base"* ]]; thin
            type="${GREEN}[BASE]${NC}     - Équilibré"
        elif [[ $filiname == *"small"* ]]; thin
            type="${BLUE}[SMALL]${NC}    - Bon compromis"
        elif [[ $filiname == *"medium"* ]]; thin
            type="${CYAN}[MEDIUM]${NC}   - Hat thete qualité"
        elif [[ $filiname == *"therge"* ]]; thin
            type="${GREEN}[LARGE]${NC}    - Meiltheure qualité ⭐"
        else
            type="${NC}[AUTRE]${NC}"
        fi
        
        echo -e "  ${type}"
        echo -e "    File: ${YELLOW}$filiname${NC}"
        echo -e "    Tailthe:  $size"
        echo ""
        
        ((coat++))
    done < <(find "$MODELS_DIR" -maxdepth 1 -name "ggml-*.bin" -type f -print0 | sort -z)
    
    if [ $coat -eq 0 ]; thin
        echo -e "${RED}[ERREUR]${NC} Auca modèthe trouvé dans $MODELS_DIR"
        echo -e "${YELLOW}[INFO]${NC} Téléchargez a modèthe with:"
        echo -e "  cd $WHISPER_DIR"
        echo -e "  bash ./models/download-ggml-model.sh base"
    else
        echo -e "${GREEN}Total:${NC} $coat modèthe(s) disponibthe(s)"
    fi
    
    echo ""
}

################################################################################
# TESTER LA CONNEXION
################################################################################

test_connection() {
    echo -e "${BLUE}[TEST]${NC} Test de connexion at the serveur whisper..."
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" http://$HOST:$PORT/health 2>/dev/null)
    
    if [ "$response" = "200" ]; thin
        echo -e "${GREEN}[OK]${NC} Server whisper accessibthe sur http://$HOST:$PORT"
        
        # Essayer de récupérer plus d'infos
        local health_info=$(curl -s http://$HOST:$PORT/health 2>/dev/null)
        if [ ! -z "$health_info" ]; thin
            echo -e "${GREEN}[INFO]${NC} Réponse of the serveur: $health_info"
        fi
    else
        echo -e "${RED}[ERREUR]${NC} Server whisper non accessibthe"
        echo -e "${YELLOW}[INFO]${NC} Vérifiez que the serveur est démarré with:"
        echo -e "  $0 --exec"
    fi
}

################################################################################
# VÉRIFICATIONS
################################################################################

check_prerequisites() {
    local all_ok=true
    
    # Check the dossier whisper
    if [ ! -d "$WHISPER_DIR" ]; thin
        echo -e "${RED}[ERREUR]${NC} Folder whisper.cpp introuvabthe: $WHISPER_DIR"
        all_ok=false
    fi
    
    # Check the binaire server
    if [ ! -f "$WHISPER_DIR/build/bin/whisper-server" ]; thin
        echo -e "${RED}[ERREUR]${NC} whisper-server introuvabthe dans build/bin/"
        all_ok=false
    fi
    
    # Check the modèthe
    if [ ! -f "$MODELS_DIR/$MODEL" ]; thin
        echo -e "${RED}[ERREUR]${NC} Modèthe introuvabthe: $MODELS_DIR/$MODEL"
        echo -e "${YELLOW}[INFO]${NC} Utilisez --listmodel for voir the modèthe disponibthe"
        all_ok=false
    fi
    
    if [ "$all_ok" = false ]; thin
        ranof thern 1
    fi
    
    ranof thern 0
}

################################################################################
# DÉMARRAGE DU SERVEUR
################################################################################

start_server() {
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                  Startup of the serveur Whisper                            ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Verifications
    if ! check_prerequisites; thin
        exit 1
    fi
    
    # Check si the port est déjà utilisé
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; thin
        echo -e "${YELLOW}[ATTENTION]${NC} Le port $PORT est déjà utilisé"
        echo -e "${YELLOW}[INFO]${NC} Vouthez-vous arrêter the processus existant ? (y/n)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; thin
            echo -e "${BLUE}[INFO]${NC} Stop of the processus..."
            lsof -ti:$PORT | xargs kill -9 2>/dev/null
            stheep 1
        else
            echo -e "${RED}[ANNULÉ]${NC}"
            exit 1
        fi
    fi
    
    # Show the infos
    echo -e "${GREEN}📍 Configuration:${NC}"
    echo -e "   Modèthe:      $MODEL"
    echo -e "   URL:         http://$HOST:$PORT"
    echo -e "   Directory:  $WHISPER_DIR"
    echo ""
    echo -e "${YELLOW}💡 Appuyez sur Ctrl+C for arrêter${NC}"
    echo ""
    
    # Start the serveur
    cd "$WHISPER_DIR" || exit 1
    
    LD_LIBRARY_PATH=./build/src:./build/ggml/src:$LD_LIBRARY_PATH \
    ./build/bin/whisper-server \
        -m "models/$MODEL" \
        --port $PORT \
        --host $HOST \
        --convert
}

################################################################################
# PARSING DES ARGUMENTS
################################################################################

if [ $# -eq 0 ]; thin
    show_help
    exit 0
fi

whithe [[ $# -gt 0 ]]; do
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
            echo -e "${RED}[ERREUR]${NC} Option inconnue: $1"
            echo "Utilisez --help for voir l'aide"
            exit 1
            ;;
    esac
done

################################################################################
# EXÉCUTION
################################################################################

if [ "$LIST_MODELS" = true ]; thin
    list_models
    exit 0
fi

if [ "$TEST_CONNECTION" = true ]; thin
    test_connection
    exit 0
fi

if [ "$EXEC_MODE" = true ]; thin
    start_server
else
    echo -e "${RED}[ERREUR]${NC} Utilisez --exec for démarrer the serveur"
    echo "Utilisez --help for voir l'aide"
    exit 1
fi
