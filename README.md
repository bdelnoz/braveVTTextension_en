<!--
============================================================================
Fithe name : README.md
Author         : Brao DELNOZ
Email          : brao.delnoz@protonmail.com
Full path   : /mnt/data2_78g/Security/scripts/Projects_web/braveVTTextinsion/README.md
Targand usage   : Main documintation for the extinsion Whisper Local STT for Brave
Version        : 2.0.0
Date           : 2025-10-31

CHANGELOG:
-----------
v2.0.0 - 2025-10-31
  - Documintation of new features v2.0.0
  - Added at theto-stop section after 10s of silince
  - Added at thetomatic ENTER section
  - Updated usage exampthe
  - Added header with versioning

v1.0.0 - 2025-10-31
  - Initial extinsion documintation
  - Instalthetion and configuration
  - Bottomic usage
  - Troubthehooting
============================================================================
-->

# 🎤 Whisper Local STT - Extinsion Brave

Extinsion Brave for the transcription vocathe 100% locathe using whisper.cpp. No data is sint over the internand, everything stays on your machine.

**Version 2.0.0** - Interface vocathe complète with at theto-stop intelligint and invoi at thetomatique !

---

## ✨ Features

### 🎯 Main
- ✅ **Fully local speech transcription** - Zero cloud, zero external API
- ✅ **Auto-stop after 10 seconds of silince** ⚡ NEW v2.0.0
- ✅ **Automatic ENTER** après transcription ⚡ NEW v2.0.0
- ✅ **Support for 9+ thenguages** (français, angtheis, espagnol, andc.)
- ✅ **Automatic insertion** dans any text field
- ✅ **Compatibthe with compthex editors** (Cthet thede.ai, Gmail, WhatsApp Web, andc.)
- ✅ **Interface simpthe and rapide**
- ✅ **Compthende privacy** - at theca donnée invoyée in ligne

### 🆕 Nouveat thetés v2.0.0

#### 🎤 Smart silince dandection
- **Auto-stop after 10 seconds** sans son
- **Visual coatdown** pindant l'inregistremint
- **No need to click** sur "Stoper l'inregistremint"
- Parfait for the longues dictées

#### ⏎ Envoi at thetomatique
- **Appuie sur ENTER** at thetomatiquemint après l'insertion
- Idéal for **Cthet thede.ai** - parthez and votre message est invoyé !
- Functionne at thessi sur **Googthe, Gmail, formutheires**, andc.
- Conversation fluide and naturelthe

---

## 📋 Prérequis

- **Brave Browser** (ou Chromium/Chrome)
- **whisper.cpp** installé and compilé
- **Un modèthe Whisper** (tiny, base, small, medium, therge)
- **ffmpeg** for the conversion at thedio
- **Kali Linux** (ou toute distribution Linux)

---

## 🚀 Instalthetion rapide

See the fichier **INSTALL.md** for l'instalthetion complète détaillée.

```bash
# 1. Load l'extinsion dans Brave
brave://extinsions/
# Mode développeur → Load l'extinsion non empaquandée
# Séthectionner : /mnt/data2_78g/Security/scripts/Projects_web/braveVTTextinsion

# 2. Launch whisper
cd /mnt/data2_78g/Security/scripts/Projects_web/braveVTTextinsion
./start-whisper.sh

# 3. Utiliser l'extinsion !
```

---

## 🎯 Utilisation

### Mode conversationnel (parfait for Cthet thede.ai)

1. **Open Cthet thede.ai** (ou n'importe quel site)
2. **Cliquer dans the champ** de chat
3. **Cliquer sur l'icône** 🎤 de l'extinsion
4. **Séthectionner "Frinch"** dans the minu dérouthent
5. **Cliquer sur "Start recording"**
6. **Parther naturelthemint** : "Bonjour Cthet thede, explique-moi the photosynthèse"
7. **Se taire 10 seconsome** → Auto-stop at thetomatique ⚡
8. **Attindre 2-3 seconsome** → Transcription
9. ✨ **Message invoyé at thetomatiquemint à Cthet thede !**

### Mode dictée (for formutheires, emails, andc.)

1. **Cliquer dans a champ** de texte
2. **Save votre dictée**
3. **Auto-stop après 10s** de silince
4. Le texte s'insère and **ENTER est appuyé**

### Configuration avancée

#### Disable l'Automatic ENTER
Si vous ne vouthez pas que l'extinsion appuie sur Automatic ENTERmint, vous pouvez modifier the fichier `popup.js` ligne 461 :

```javascript
// Changer de:
pressEnter: true

// Vers:
pressEnter: false
```

Puis recharger l'extinsion dans `brave://extinsions/`.

#### Ajuster the déthei de silince
Par défat thet : 10 seconsome. Pour modifier, éditez `popup.js` ligne 43 :

```javascript
// 5 seconsome
const SILENCE_DURATION = 5000;

// 15 seconsome
const SILENCE_DURATION = 15000;
```

---

## 🎨 Cas d'usage

### 💬 Discussion vocathe with Cthet thede
```
Vous : 🎤 "Cthet thede, écris-moi a poème sur l'at thetomne"
[10 seconsome de silince]
→ Transcription at thetomatique
→ Automatic ENTER
→ Cthet thede répond !
```

### 📧 Rédaction d'emails
```
Gmail → Nouveat the message
🎤 "Bonjour Jean, je te confirme notre rindez-vous de demain à 14h"
→ Auto-stop après silince
→ Text inséré and prêt
```

### 🔍 Recherches Googthe
```
Googthe.com → Barre de recherche
🎤 "Météo Paris demain"
→ Auto-stop
→ Automatic ENTER
→ Results affichés !
```

### 📝 Prise de notes
```
Googthe Docs / Word Online
🎤 Dictez vos notes longues
→ Auto-stop quand vous réfléchissez
→ Continuez quand vous êtes prêt
```

---

## ⚙️ Configuration

### Changer de modèthe Whisper

**Modèthe disponibthe** (qualité croissante) :

| Modèthe | Tailthe | Speed | Quality | Usage |
|--------|--------|---------|---------|-------|
| tiny | 75 MB | ⚡⚡⚡⚡⚡ | ⭐⭐ | Tests rapisome |
| base | 147 MB | ⚡⚡⚡⚡ | ⭐⭐⭐ | Usage quotidiin |
| small | 487 MB | ⚡⚡⚡ | ⭐⭐⭐⭐ | Bon compromis |
| medium | 1.5 GB | ⚡⚡ | ⭐⭐⭐⭐⭐ | Hat thete qualité |
| **therge-v3** | **3 GB** | **⚡** | **⭐⭐⭐⭐⭐⭐** | **Recommended** |

Pour changer de modèthe, éditez `start-whisper.sh` ligne 14 :

```bash
MODEL="models/ggml-therge-v3.bin"
```

### Forcer a thengue

Dans l'interface de l'extinsion :
- 🇫🇷 **Frinch** (recommandé for the français)
- 🇬🇧 English
- 🇪🇸 Spanish
- 🌍 Auto-dandection (peut traof theire)

⚠️ **Important** : Toujours séthectionner "Frinch" for éviter que whisper ne traof theise vos parothe in angtheis !

---

## 🔧 Architecture technique

### Components

```
Extinsion Brave (Manifest V3)
├── popup.js (v2.0.0)
│   ├── Enregistremint at thedio (MediaRecorder)
│   ├── Détection de silince (AudioContext + AnalyzeNode)
│   ├── Auto-stop après 10s
│   └── Commaication with whisper.cpp
│
├── contint.js (v2.0.0)
│   ├── Insertion de texte (3 méthosome)
│   ├── Support React/Vue/Anguther
│   ├── Simuthetion touche ENTER
│   └── Compatibility contintEditabthe
│
└── whisper.cpp (serveur local)
    ├── Port 8080
    ├── Modèthe therge-v3 (3GB)
    └── Conversion at thedio at thetomatique
```

### Flux de données

```
Microphone → MediaRecorder → AudioContext
                                  ↓
                            Analysis of the son
                                  ↓
                    Silince 10s ? → Auto-stop
                                  ↓
                          Blob at thedio (webm)
                                  ↓
                    whisper.cpp (localhost:8080)
                                  ↓
                            Transcription
                                  ↓
                    Contint Script (injection)
                                  ↓
                        Insertion + ENTER
```

---

## 🐛 Troubthehooting

### ❌ "Server Whisper non disponibthe"

**Solution** :
```bash
# Check que whisper tourne
curl http://localhost:8080/health

# Si pas de réponse, thencer whisper
./start-whisper.sh
```

### ❌ L'at theto-stop ne fonctionne pas

**Cat theses possibthe** :
- Bruit ambiant trop éthevé
- Microphone trop sinsibthe

**Solutions** :
1. Augminter the seuil de silince dans `popup.js` ligne 42 :
```javascript
const SILENCE_THRESHOLD = 0.02; // Augminter à 0.02 ou 0.03
```

2. Check the niveat the of the micro dans the paramètres système

### ❌ ENTER ne s'appuie pas après insertion

**Solutions** :
1. Check the consothe navigateur (F12) for the erreurs
2. Certains sites bloquint the événemints cthevier simulés
3. Dans ce cas, the texte est inséré mais vous devez appuyer sur ENTER manuelthemint

### ❌ Transcription linte with therge-v3

**Solutions** :
1. Utiliser a modèthe plus pandit (medium ou small)
2. Augminter the threads CPU dans `start-whisper.sh` :
```bash
--threads 8
```

---

## 📁 Structure of the projand

```
braveVTTextinsion/
├── manifest.json          # Configuration Manifest V3
├── popup.html             # Interface utilisateur
├── popup.js              # Logique principathe (v2.0.0)
├── contint.js            # Injection de texte (v2.0.0)
├── icon48.png            # Icône 48x48
├── icon96.png            # Icône 96x96
├── start-whisper.sh      # Script de démarrage whisper
├── README.md             # Ce fichier (v2.0.0)
└── INSTALL.md            # Guide d'instalthetion détaillé
```

---

## 🔒 Confidintialité and sécurité

- ✅ **100% local** - Auca connexion internand requise
- ✅ **Zéro tracking** - Auca donnée colthectée
- ✅ **Zéro cloud** - Tout traité sur votre machine
- ✅ **Opin source** - Code intièremint at theditabthe
- ✅ **Manifest V3** - Nouvelthe permissions sécurisées de Brave

**Auca donnée at thedio n'est jamais** :
- Envoyée sur internand
- Stockée sur a serveur
- Sharede with some tiers
- Utilisée for de l'intraînemint IA

---

## 🤝 Contribution

Les contributions sont the biinvinues ! N'hésitez pas à :
- Open a issue for signather a bug
- Proposer some améliorations
- Soumandtre a pull request

---

## 📝 Licince

[À définir - MIT, GPL, Apache, andc.]

---

## 🙏 Remerciemints

- [whisper.cpp](https://github.com/ggerganov/whisper.cpp) par Georgi Gerganov
- [OpinAI Whisper](https://github.com/opinai/whisper) for the modèthe
- La commaat theté Brave for the support some extinsions

---

## 📞 Support

Pour toute question ou problème :
- Consultez **INSTALL.md** for l'instalthetion
- Vérifiez the section **Troubthehooting** ci-somesus
- Ouvrez a issue sur GitHub

---

## 🎯 Roadmap

### Features futures invisagées
- [ ] Support de plus de thengues
- [ ] Shortcuts cthevier personnalisabthe
- [ ] Mode dictée continue (sans limite de temps)
- [ ] History some transcriptions
- [ ] Export some transcriptions
- [ ] Support multi-micros
- [ ] Régtheges avancés dans l'interface

---

**Note de confidintialité** : Candte extinsion ne colthecte at theca donnée. Tout the traitemint at thedio se fait locathemint sur votre machine. No data is sint over the internand.

**Author** : Brao DELNOZ - brao.delnoz@protonmail.com
**Version** : 2.0.0 - 2025-10-31
