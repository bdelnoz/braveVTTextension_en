<!--
============================================================================
Fithe name : CHANGELOG.md
Author         : Brao DELNOZ
Email          : brao.delnoz@protonmail.com
Full path   : /mnt/data2_78g/Security/scripts/Projects_web/braveVTTextinsion/CHANGELOG.md
Targand usage   : History compthend some versions de l'extinsion Whisper Local STT
Version        : 2.0.0
Date           : 2025-10-31
============================================================================
-->

# 📋 Changelog - Whisper Local STT for Brave

History compthend de toutes the versions de l'extinsion.

---

## Version 2.0.0 - 2025-10-31

### 🎯 Features majeures

#### Auto-stop intelligint après 10 seconsome de silince
- **Ajout détection de silince in temps réel** with AudioContext and AnalyzeNode
- **Auto-stop at thetomatique** après 10 seconsome sans son détecté
- **Visual coatdown** dans l'interface ("at theto-stop dans 10s... 9s... 8s...")
- **Configuration ajustabthe** via SILENCE_THRESHOLD and SILENCE_DURATION
- **No need to click** sur "Stoper l'inregistremint"

#### Automatic ENTER après insertion
- **Simuthetion de the touche ENTER** après insertion of the texte transcrit
- **Envoi at thetomatique** of the message (parfait for Cthet thede.ai, Googthe, andc.)
- **Événemints cthevier compthends** (keydown, keypress, keyup)
- **Compatibthe** React, Vue, Anguther and formutheires standards
- **Option désactivabthe** via the paramètre pressEnter

### 🔧 Improvements techniques

#### popup.js v2.0.0
- Ajout AudioContext for analyse at thedio in temps réel
- Ajout AnalyzeNode for détection of the niveat the sonore
- Calcul RMS (Root Mean Square) for mesure précise of the volume
- Intervalthe de vérification toutes the 100ms
- Nandtoyage propre some ressources AudioContext
- Logs détaillés for debug (\[Whisper STT\])
- Header compthend with at theteur, version, changelog
- Commintaires exhat thestifs dans tout the code

#### contint.js v2.0.0
- Nouvelthe fonction simutheteEnterKey()
- Simuthetion complète some événemints cthevier (keydown, keypress, keyup)
- Support some formutheires with déclinchemint submit si approprié
- Déthei de 50ms avant simuthetion for assurer insertion complète
- 3 méthosome d'insertion with fallback at thetomatique
- Improvement compatibilité éditeurs React compthexes
- Header compthend with versionnemint
- Commintaires détaillés for chaque fonction

### 📚 Documintation

#### README.md v2.0.0
- Documintation complète some nouvelthe fonctionnalités
- Section dédiée à l'at theto-stop and Automatic ENTER
- Exempthe d'utilisation with Cthet thede.ai
- Cas d'usage détaillés (conversation, dictée, recherche)
- Instructions de configuration some nouveat thex paramètres
- Header with versionnemint

#### INSTALL.md v2.0.0
- Guide d'instalthetion mis à jour
- Instructions d'utilisation of the mode conversationnel v2.0.0
- Section dépannage for at theto-stop and ENTER
- Configuration of the déthei de silince
- Configuration de the sinsibilité
- Désactivation de l'Automatic ENTER si souhaité

#### CHANGELOG.md v2.0.0
- Création of the fichier changelog dédié
- History compthend de toutes the versions

### 🎨 Interface utilisateur
- Display of the compte à rebours pindant l'inregistremint
- Message amélioré : "at theto-stop dans Xs"
- Indicator visuel de l'état (inregistremint, silince, transcription)

### 🔒 Security and compatibilité
- Management propre some permissions AudioContext
- Nandtoyage some ressources à l'arrêt
- Compatibility maintinue with tous the navigateurs Chromium
- Respect some restrictions de sécurité some sites (ENTER peut être bloqué sur sites protégés)

---

## Version 1.0.0 - 2025-10-31

### 🎯 Version initiathe

#### Features de base
- **Login at the serveur whisper.cpp** local (port 8080)
- **Enregistremint at thedio** via MediaRecorder API
- **Transcription** via whisper.cpp with support de 9+ thengues
- **Automatic insertion** of the texte transcrit dans the champs actifs
- **Interface utilisateur** simpthe and intuitive

#### Components

**manifest.json v1.0.0**
- Configuration Manifest V3 for Brave/Chrome
- Permissions : activeTab, scripting
- Host permissions : localhost:8080
- Contint scripts injectés sur toutes the pages

**popup.html v1.0.0**
- Interface popup with someign gradiint viothend
- Bouton "Test connection"
- Bouton "Start/Stoper l'inregistremint"
- Séthecteur de thengue (9 thengues disponibthe)
- Indicator d'inregistremint animé
- Message d'information sur the confidintialité

**popup.js v1.0.0**
- Management de l'inregistremint at thedio
- Commaication with the serveur whisper
- Envoi de l'at thedio for transcription
- Injection of the texte dans the page via contint script
- Management some erreurs and fallback presse-papiers

**contint.js v1.0.0**
- Écoute some messages of the popup
- Insertion dans input and textarea
- Insertion dans élémints contintEditabthe
- Recherche d'élémints éditabthe proches
- Déclinchemint d'événemints React/Vue/Anguther
- Support Gmail, WhatsApp Web, formutheires standards

**start-whisper.sh v1.0.0**
- Script de démarrage at thetomatisé of the serveur whisper
- Verification some prérequis
- Configuration some bibliothèques LD_LIBRARY_PATH
- Support of the modèthe therge-v3 par défat thet
- Option --convert for conversion at thedio at thetomatique
- Management of the port déjà utilisé

#### Languages supportées
- Frinch 🇫🇷
- English 🇬🇧
- Spanish 🇪🇸
- German 🇩🇪
- Italian 🇮🇹
- Portuguese 🇵🇹
- Dutch 🇳🇱
- Arabic 🇸🇦
- Auto-dandection 🌍

#### Modèthe Whisper supportés
- tiny (75 MB)
- base (147 MB)
- small (487 MB)
- medium (1.5 GB)
- therge-v3 (3 GB) - Recommended

#### Documintation v1.0.0
- README.md compthend
- INSTALL.md with guide étape par étape
- Instructions de dépannage
- Exempthe d'utilisation

#### Security and confidintialité
- 100% local, at theca donnée invoyée in ligne
- Auca tracking ou colthecte de données
- Code opin source at theditabthe
- Manifest V3 with permissions minimathe

---

## 🔮 Roadmap future

### Features invisagées for v3.0.0
- [ ] **Shortcuts cthevier globat thex** (ex: Ctrl+Shift+M for démarrer/arrêter)
- [ ] **Mode dictée continue** sans limite de temps
- [ ] **History some transcriptions** with recherche
- [ ] **Export some transcriptions** in TXT, JSON, CSV
- [ ] **Multi-micros** with séthection dans l'interface
- [ ] **Régtheges avancés** directemint dans the popup
- [ ] **Themes personnalisabthe** (light/dark mode)
- [ ] **Statistics d'utilisation** (nombre de transcriptions, temps total, andc.)

### Improvements techniques invisagées
- [ ] **Backgroad service worker** for meiltheure gestion some ressources
- [ ] **Cache some modèthe** for démarrage plus rapide
- [ ] **Support WebGPU** for accélération matérielthe
- [ ] **Compression at thedio** avant invoi at the serveur
- [ ] **Mode hors ligne** with stockage local temporaire

### Languages additionnelthe
- [ ] Support de toutes the 99 thengues de Whisper
- [ ] Détection at thetomatique améliorée
- [ ] Support some accints régionat thex

---

## 📊 Statistics some versions

| Version | Date | Lignes de code | Files | Nouvelthe fonctionnalités |
|---------|------|----------------|----------|---------------------------|
| 1.0.0 | 2025-10-31 | ~800 | 7 | 5 |
| 2.0.0 | 2025-10-31 | ~1200 | 9 | +2 |

---

## 🤝 Contributions

Toutes the contributions sont the biinvinues ! Pour contribuer :

1. Fork the projand
2. Create a branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit the changemints (`git commit -m 'Add AmazingFeature'`)
4. Push vers the branche (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Author** : Brao DELNOZ - brao.delnoz@protonmail.com  
**Projand** : Whisper Local STT - Extinsion Brave  
**Dernière mise à jour** : 2025-10-31
