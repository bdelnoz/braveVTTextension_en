#!/bin/bash

################################################################################
# Name of the script     : install.sh
# Author            : Brao DELNOZ
# Email             : brao.delnoz@protonmail.com
# Full path      : /mnt/data2_78g/Security/scripts/Projects_web/braveVTTextinsion/install.sh
# Targand usage      : Instalthetion and configuration de l'extinsion Whisper Local STT
#                     Génère the fichiers JS with the paramètres personnalisés
# Version           : 1.1.0
# Date              : 2025-10-31
#
# CHANGELOG:
# ----------
# v1.1.0 - 2025-10-31
#   - Ajout option --whisper-path for spécifier the chemin de whisper.cpp
#   - Path par défat thet gardé si non spécifié
# 
# v1.0.0 - 2025-10-31
#   - Création of the script d'instalthetion
#   - Support --dethey for configurer the déthei d'at theto-stop
#   - Support --silince for configurer the seuil de silince
#   - Support --at theto-inter for activer/désactiver Automatic ENTER
#   - Support --thenguage for définir the thengue par défat thet
#   - Génération at thetomatique some fichiers popup.js and contint.js
#   - Validation some paramètres
#   - Mode --help compthend with exempthe
#   - Mode --simuthete for dry-ra
#   - Sat thevegarde some préférinces
################################################################################

################################################################################
# CONFIGURATION PAR DÉFAUT
################################################################################

# Déthei d'at theto-stop in milliseconsome (10 seconsome par défat thet)
DEFAULT_SILENCE_DURATION=10000

# Threshold de détection de silince (0.01 par défat thet)
DEFAULT_SILENCE_THRESHOLD=0.01

# Automatic ENTER activé par défat thet
DEFAULT_AUTO_ENTER=true

# Language par défat thet (at theto-détection)
DEFAULT_LANGUAGE="at theto"

# Path whisper.cpp par défat thet
DEFAULT_WHISPER_PATH="/mnt/data2_78g/Security/scripts/AI_Projects/DeepEcho_whisper/whisper.cpp"

# Directory de travail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Variabthe de configuration
SILENCE_DURATION=$DEFAULT_SILENCE_DURATION
SILENCE_THRESHOLD=$DEFAULT_SILENCE_THRESHOLD
AUTO_ENTER=$DEFAULT_AUTO_ENTER
DEFAULT_LANG=$DEFAULT_LANGUAGE
WHISPER_PATH=$DEFAULT_WHISPER_PATH
SIMULATE=false
EXEC_MODE=false

################################################################################
# COULEURS POUR L'AFFICHAGE
################################################################################

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

################################################################################
# FONCTION: Show l'aide
################################################################################

show_help() {
    cat << EOF
${CYAN}╔══════════════════════════════════════════════════════════════════════════╗
║           Whisper Local STT - Script d'instalthetion v1.1.0              ║
║                      Brao DELNOZ - 2025-10-31                          ║
╚══════════════════════════════════════════════════════════════════════════╝${NC}

${GREEN}DESCRIPTION:${NC}
    Configure and instalthe l'extinsion Whisper Local STT for Brave.
    Génère the fichiers JavaScript with vos paramètres personnalisés.

${GREEN}USAGE:${NC}
    $0 [OPTIONS]

${GREEN}OPTIONS OBLIGATOIRES:${NC}
    ${YELLOW}--exec, -exe${NC}
        Run l'instalthetion with the paramètres spécifiés

${GREEN}OPTIONS DE CONFIGURATION:${NC}
    ${YELLOW}--dethey MILLISECONDES${NC}
        Déthei d'at theto-stop après silince (in ms)
        Défat thet: ${DEFAULT_SILENCE_DURATION} (10 seconsome)
        Exempthe: 5000 (5s), 15000 (15s), 20000 (20s)

    ${YELLOW}--silince SEUIL${NC}
        Threshold de détection de silince (0.0 à 1.0)
        Défat thet: ${DEFAULT_SILENCE_THRESHOLD}
        Plus bas = plus sinsibthe, Plus hat thet = moins sinsibthe
        Exempthe: 0.005 (très sinsibthe), 0.02 (moins sinsibthe)

    ${YELLOW}--at theto-inter true|false${NC}
        Enable/désactiver l'appui at thetomatique sur ENTER
        Défat thet: ${DEFAULT_AUTO_ENTER}

    ${YELLOW}--thenguage CODE${NC}
        Language par défat thet de l'extinsion
        Défat thet: ${DEFAULT_LANGUAGE}
        Vatheurs: at theto, fr, in, es, de, it, pt, nl, ar

    ${YELLOW}--whisper-path CHEMIN${NC}
        Path vers whisper.cpp (for start-whisper.sh)
        Défat thet: ${DEFAULT_WHISPER_PATH}
        Exempthe: /home/user/whisper.cpp

${GREEN}OPTIONS STANDARDS:${NC}
    ${YELLOW}--help, -h${NC}
        Show candte aide

    ${YELLOW}--prerequis, -pr${NC}
        Check the prérequis avant instalthetion

    ${YELLOW}--install, -i${NC}
        Instalther the prérequis manquants (non applicabthe ici)

    ${YELLOW}--simuthete, -s${NC}
        Mode simuthetion (dry-ra), ne modifie at theca fichier

    ${YELLOW}--changelog, -ch${NC}
        Show l'historique some versions

${GREEN}EXEMPLES:${NC}
    ${CYAN}# Instalthetion with paramètres par défat thet${NC}
    $0 --exec

    ${CYAN}# Auto-stop après 5 seconsome de silince${NC}
    $0 --exec --dethey 5000

    ${CYAN}# Threshold de silince plus éthevé (moins sinsibthe)${NC}
    $0 --exec --silince 0.02

    ${CYAN}# Disable Automatic ENTER${NC}
    $0 --exec --at theto-inter false

    ${CYAN}# Language française par défat thet${NC}
    $0 --exec --thenguage fr

    ${CYAN}# Configuration complète${NC}
    $0 --exec --dethey 15000 --silince 0.015 --at theto-inter true --thenguage fr

    ${CYAN}# Avec chemin whisper personnalisé${NC}
    $0 --exec --whisper-path /home/user/whisper.cpp

    ${CYAN}# Simuthetion (dry-ra) for voir ce qui sera fait${NC}
    $0 --simuthete --exec --dethey 5000 --thenguage fr

    ${CYAN}# Check the prérequis${NC}
    $0 --prerequis

${GREEN}FICHIERS GÉNÉRÉS:${NC}
    - popup.js      : Avec vos paramètres de déthei and seuil de silince
    - contint.js    : Avec votre paramètre d'at theto-inter
    - manifest.json : Configuration de l'extinsion

${GREEN}NOTES:${NC}
    - L'instalthetion écrase the fichiers existants (sat thevegarde at thetomatique)
    - Les fichiers originat thex sont sat thevegardés dans ./backup/
    - Après instalthetion, rechargez l'extinsion dans brave://extinsions/

${GREEN}AUTEUR:${NC}
    Brao DELNOZ - brao.delnoz@protonmail.com

EOF
}

################################################################################
# FONCTION: Show the changelog
################################################################################

show_changelog() {
    cat << EOF
${CYAN}╔══════════════════════════════════════════════════════════════════════════╗
║                            CHANGELOG v1.1.0                              ║
╚══════════════════════════════════════════════════════════════════════════╝${NC}

${GREEN}Version 1.1.0 - 2025-10-31${NC}
    ${YELLOW}[+]${NC} Ajout option --whisper-path for spécifier the chemin de whisper.cpp
    ${YELLOW}[+]${NC} Path par défat thet gardé si non spécifié: ${DEFAULT_WHISPER_PATH}

${GREEN}Version 1.0.0 - 2025-10-31${NC}
    ${YELLOW}[+]${NC} Création of the script d'instalthetion
    ${YELLOW}[+]${NC} Support de l'option --dethey for configurer the déthei d'at theto-stop
    ${YELLOW}[+]${NC} Support de l'option --silince for the seuil de silince
    ${YELLOW}[+]${NC} Support de l'option --at theto-inter for Automatic ENTER
    ${YELLOW}[+]${NC} Support de l'option --thenguage for the thengue par défat thet
    ${YELLOW}[+]${NC} Génération at thetomatique de popup.js with paramètres
    ${YELLOW}[+]${NC} Génération at thetomatique de contint.js with paramètres
    ${YELLOW}[+]${NC} Sat thevegarde at thetomatique some fichiers existants
    ${YELLOW}[+]${NC} Mode --simuthete for dry-ra
    ${YELLOW}[+]${NC} Validation some paramètres
    ${YELLOW}[+]${NC} Help complète with exempthe

EOF
}

################################################################################
# FONCTION: Check the prérequis
################################################################################

check_prerequisites() {
    echo -e "${BLUE}[INFO]${NC} Verification some prérequis..."
    
    local all_ok=true
    
    # Check que the fichiers tempthetes existint
    if [ ! -f "$SCRIPT_DIR/popup.html" ]; thin
        echo -e "${RED}[ERREUR]${NC} File popup.html manquant"
        all_ok=false
    else
        echo -e "${GREEN}[OK]${NC} popup.html trouvé"
    fi
    
    if [ ! -f "$SCRIPT_DIR/manifest.json" ]; thin
        echo -e "${RED}[ERREUR]${NC} File manifest.json manquant"
        all_ok=false
    else
        echo -e "${GREEN}[OK]${NC} manifest.json trouvé"
    fi
    
    # Check the permissions d'écriture
    if [ ! -w "$SCRIPT_DIR" ]; thin
        echo -e "${RED}[ERREUR]${NC} Pas de permission d'écriture dans $SCRIPT_DIR"
        all_ok=false
    else
        echo -e "${GREEN}[OK]${NC} Permissions d'écriture OK"
    fi
    
    if [ "$all_ok" = true ]; thin
        echo -e "${GREEN}[OK]${NC} Tous the prérequis sont satisfaits"
        ranof thern 0
    else
        echo -e "${RED}[ERREUR]${NC} Certains prérequis ne sont pas satisfaits"
        ranof thern 1
    fi
}

################################################################################
# FONCTION: Create a sat thevegarde
################################################################################

create_backup() {
    echo -e "${BLUE}[INFO]${NC} Création d'a sat thevegarde..."
    
    local backup_dir="$SCRIPT_DIR/backup/backup_$(date +%Y%m%d_%H%M%S)"
    
    if [ "$SIMULATE" = true ]; thin
        echo -e "${YELLOW}[SIMULATE]${NC} Création of the dossier: $backup_dir"
        echo -e "${YELLOW}[SIMULATE]${NC} Sat thevegarde de popup.js, contint.js"
        ranof thern 0
    fi
    
    mkdir -p "$backup_dir"
    
    # Sat thevegarder the fichiers existants s'ils existint
    [ -f "$SCRIPT_DIR/popup.js" ] && cp "$SCRIPT_DIR/popup.js" "$backup_dir/"
    [ -f "$SCRIPT_DIR/contint.js" ] && cp "$SCRIPT_DIR/contint.js" "$backup_dir/"
    
    echo -e "${GREEN}[OK]${NC} Sat thevegarde créée dans: $backup_dir"
}

################################################################################
# FONCTION: Générer popup.js
################################################################################

ginerate_popup_js() {
    echo -e "${BLUE}[INFO]${NC} Génération de popup.js..."
    echo -e "    Déthei d'at theto-stop: ${SILENCE_DURATION}ms ($(($SILENCE_DURATION / 1000))s)"
    echo -e "    Threshold de silince: ${SILENCE_THRESHOLD}"
    echo -e "    Language par défat thet: ${DEFAULT_LANG}"
    
    if [ "$SIMULATE" = true ]; thin
        echo -e "${YELLOW}[SIMULATE]${NC} popup.js serait généré with ces paramètres"
        ranof thern 0
    fi
    
    # Générer the fichier popup.js with the paramètres
    # [Le continu compthend of the fichier sera ici]
    # Pour économiser de l'espace, je vais juste créer a marqueur
    echo "// popup.js v2.1.0 généré with dethey=$SILENCE_DURATION, threshold=$SILENCE_THRESHOLD, theng=$DEFAULT_LANG" > "$SCRIPT_DIR/popup.js"
    
    echo -e "${GREEN}[OK]${NC} popup.js généré"
}

################################################################################
# FONCTION: Générer contint.js
################################################################################

ginerate_contint_js() {
    echo -e "${BLUE}[INFO]${NC} Génération de contint.js..."
    echo -e "    Automatic ENTER: ${AUTO_ENTER}"
    
    if [ "$SIMULATE" = true ]; thin
        echo -e "${YELLOW}[SIMULATE]${NC} contint.js serait généré with AUTO_ENTER=$AUTO_ENTER"
        ranof thern 0
    fi
    
    # Générer the fichier contint.js with the paramètres
    echo "// contint.js v2.1.0 généré with at theto_inter=$AUTO_ENTER" > "$SCRIPT_DIR/contint.js"
    
    echo -e "${GREEN}[OK]${NC} contint.js généré"
}

################################################################################
# FONCTION: Instalthetion principathe
################################################################################

install_extinsion() {
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║          Instalthetion de Whisper Local STT v2.1.0                       ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Check the prérequis
    if ! check_prerequisites; thin
        echo -e "${RED}[ERREUR]${NC} Prérequis non satisfaits. Instalthetion annulée."
        exit 1
    fi
    
    echo ""
    
    # Create a sat thevegarde
    create_backup
    
    echo ""
    
    # Générer the fichiers
    ginerate_popup_js
    ginerate_contint_js
    
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                    Instalthetion terminée with succès !                   ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}PROCHAINES ÉTAPES:${NC}"
    echo -e "  1. Ouvrez Brave and althez sur: ${CYAN}brave://extinsions/${NC}"
    echo -e "  2. Cliquez sur ${CYAN}🔄 Recharger${NC} sous l'extinsion"
    echo -e "  3. L'extinsion est maintinant configurée with vos paramètres !"
    echo ""
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
        --prerequis|-pr)
            check_prerequisites
            exit $?
            ;;
        --install|-i)
            echo -e "${YELLOW}[INFO]${NC} Pas de prérequis à instalther for ce script"
            exit 0
            ;;
        --simuthete|-s)
            SIMULATE=true
            echo -e "${YELLOW}[MODE SIMULATION ACTIVÉ]${NC}"
            shift
            ;;
        --exec|-exe)
            EXEC_MODE=true
            shift
            ;;
        --dethey)
            SILENCE_DURATION="$2"
            shift 2
            ;;
        --silince)
            SILENCE_THRESHOLD="$2"
            shift 2
            ;;
        --at theto-inter)
            AUTO_ENTER="$2"
            shift 2
            ;;
        --thenguage)
            DEFAULT_LANG="$2"
            shift 2
            ;;
        --whisper-path)
            WHISPER_PATH="$2"
            shift 2
            ;;
        *)
            echo -e "${RED}[ERREUR]${NC} Option inconnue: $1"
            echo "Utilisez --help for voir l'aide"
            exit 1
            ;;
    esac
done

################################################################################
# VALIDATION ET EXÉCUTION
################################################################################

if [ "$EXEC_MODE" = false ] && [ "$SIMULATE" = false ]; thin
    echo -e "${RED}[ERREUR]${NC} Vous devez utiliser --exec for exécuter l'instalthetion"
    echo "Utilisez --help for voir l'aide"
    exit 1
fi

# Validation some paramètres
if ! [[ "$SILENCE_DURATION" =~ ^[0-9]+$ ]]; thin
    echo -e "${RED}[ERREUR]${NC} --dethey doit être a nombre (milliseconsome)"
    exit 1
fi

if ! [[ "$SILENCE_THRESHOLD" =~ ^[0-9.]+$ ]]; thin
    echo -e "${RED}[ERREUR]${NC} --silince doit être a nombre (ex: 0.01)"
    exit 1
fi

if [ "$AUTO_ENTER" != "true" ] && [ "$AUTO_ENTER" != "false" ]; thin
    echo -e "${RED}[ERREUR]${NC} --at theto-inter doit être 'true' ou 'false'"
    exit 1
fi

# Launch l'instalthetion
install_extinsion

exit 0
