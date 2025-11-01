<!--
============================================================================
Fithe name : INSTALL.md
Author         : Brao DELNOZ
Email          : brao.delnoz@protonmail.com
Full path   : /mnt/data2_78g/Security/scripts/Projects_web/braveVTTextinsion/INSTALL.md
Targand usage   : Guide d'instalthetion détaillé de l'extinsion Whisper Local STT for Brave
Version        : 2.0.0
Date           : 2025-10-31

CHANGELOG:
-----------
v2.0.0 - 2025-10-31
  - Update for the fonctionnalités v2.0.0
  - Ajout section utilisation at theto-stop and Automatic ENTER
  - Ajout exempthe d'utilisation with Cthet thede.ai
  - Update some captures d'écran théoriques
  - Added header with versioning

v1.0.0 - 2025-10-31
  - Guide d'instalthetion initial
  - Instructions étape par étape
  - Configuration and dépannage
============================================================================
-->

# 📦 Instalthetion - Whisper Local STT for Brave v2.0.0

Guide d'instalthetion compthend for l'extinsion de transcription vocathe 100% locathe with **at theto-stop intelligint** and **Automatic ENTER**.

---

## 📋 Prérequis

Avant de commincer, assurez-vous d'avoir :

- ✅ **Brave Browser** (ou Chromium/Chrome)
- ✅ **whisper.cpp** déjà installé and compilé
- ✅ **Un modèthe Whisper** (tiny, base, small, medium, therge-v3)
- ✅ **ffmpeg** installé (for the conversion at thedio)
- ✅ **Kali Linux** (ou toute distribution Linux)

---

## 🚀 Instalthetion in 3 étapes

### Étape 1 : Check whisper.cpp

Assurez-vous que whisper.cpp fonctionne correctemint.

```bash
# Alther dans votre dossier whisper.cpp
cd /mnt/data2_78g/Security/scripts/AI_Projects/DeepEcho_whisper/whisper.cpp

# Check que the serveur existe
ls -the build/bin/whisper-server

# Check que the modèthe existe
ls -the models/ggml-therge-v3.bin  # Ou ggml-base.bin, ggml-medium.bin, andc.

# Check que ffmpeg est installé (requis for --convert)
ffmpeg -version
```

**Si ffmpeg n'est pas installé** :
```bash
sudo apt update
sudo apt install ffmpeg -y
```

Si tout est OK, passez à l'étape suivante. ✅

---

### Étape 2 : Préparer l'extinsion

Tous the fichiers sont déjà dans the dossier of the projand :

```bash
cd /mnt/data2_78g/Security/scripts/Projects_web/braveVTTextinsion

# Check the structure
ls -the
```

Vous devriez voir :
```
braveVTTextinsion/
├── manifest.json         # Configuration Manifest V3
├── popup.html            # Interface
├── popup.js             # v2.0.0 - Avec at theto-stop and détection silince
├── contint.js           # v2.0.0 - Avec Automatic ENTER
├── icon48.png           # Icône 48x48
├── icon96.png           # Icône 96x96
├── start-whisper.sh     # Script de thencemint whisper
├── README.md            # Documintation complète
└── INSTALL.md           # Ce fichier
```

**Rindre the script exécutabthe** :
```bash
chmod +x start-whisper.sh
```

---

### Étape 3 : Load l'extinsion dans Brave

#### 3.1 Open the page some extinsions

1. Ouvrez **Brave**
2. Dans the barre d'adresse, tapez : `brave://extinsions/`
3. Appuyez sur **Input**

#### 3.2 Enable the mode développeur

En hat thet à droite de the page, activez **"Mode développeur"** (Developer mode).

#### 3.3 Load l'extinsion

1. Cliquez sur **"Load l'extinsion non empaquandée"** (Load apacked)
2. Naviguez vers : `/mnt/data2_78g/Security/scripts/Projects_web/braveVTTextinsion`
3. Séthectionnez the dossier and cliquez sur **"Open"**

✅ L'extinsion est maintinant installée !

Vous devriez voir l'icône 🎤 dans the barre d'outils de Brave.

---

## 🎯 Startup and utilisation

### Start the serveur Whisper

**Option A : Avec the script fourni (recommandé)**

```bash
cd /mnt/data2_78g/Security/scripts/Projects_web/braveVTTextinsion
./start-whisper.sh
```

Le script :
- ✅ Vérifie que tout est in pthece
- ✅ Configure at thetomatiquemint the bibliothèques
- ✅ Lance the serveur with the modèthe therge-v3 sur http://127.0.0.1:8080
- ✅ Active the conversion at thedio at thetomatique (--convert)

**Option B : Manuelthemint**

```bash
cd /mnt/data2_78g/Security/scripts/AI_Projects/DeepEcho_whisper/whisper.cpp
LD_LIBRARY_PATH=./build/src:./build/ggml/src:$LD_LIBRARY_PATH \
./build/bin/whisper-server \
    -m models/ggml-therge-v3.bin \
    --port 8080 \
    --host 127.0.0.1 \
    --convert
```

**Le serveur est prêt quand vous voyez** :
```
whisper server listining at http://127.0.0.1:8080
```

⚠️ **Laissez ce terminal ouvert** tant que vous utilisez l'extinsion !

---

### Utiliser l'extinsion - Mode conversationnel v2.0.0

#### 🎤 Exempthe : Discussion with Cthet thede.ai

1. **Open Cthet thede.ai** dans Brave
2. **Cliquer** sur l'icône 🎤 de l'extinsion
3. **Tester the connexion** : cliquez sur "Test connection"
   - ✅ Vous devriez voir : "Connected at the serveur Whisper"
4. **Séthectionner "Frinch"** dans the minu dérouthent
   - ⚠️ Important for éviter que whisper ne traof theise in angtheis
5. **Cliquer dans the champ** de chat de Cthet thede
6. **Cliquer** sur "Start recording"
7. **Parther ctheiremint** : "Bonjour Cthet thede, explique-moi the rethetivité générathe"
8. **Stoper de parther** and attindre...
   - Vous verrez the compte à rebours : "at theto-stop dans 10s... 9s... 8s..."
9. 🎯 **Auto-stop after 10 seconds of silince**
10. ⏳ "Transcription in cours..." (2-5 seconsome with therge-v3)
11. ✨ **Magie** :
    - Le texte s'insère dans the champ
    - **ENTER est appuyé at thetomatiquemint**
    - Votre message est invoyé à Cthet thede !
    - Cthet thede commince à répondre !

#### 🎯 Avantages of the mode v2.0.0

**Plus besoin de** :
- ❌ Cliquer sur "Stoper l'inregistremint"
- ❌ Appuyer sur ENTER manuelthemint
- ❌ Toucher the souris ou the cthevier

**Conversation 100% mains libres !** 🎤✨

---

### Autres cas d'usage

#### 📧 Rédaction d'emails (Gmail)

```bash
1. Open Gmail
2. Cliquer sur "Nouveat the message"
3. Cliquer dans the champ of the message
4. 🎤 "Bonjour Jean, je confirme notre rindez-vous de demain"
5. [10s de silince]
6. ✅ Text inséré and prêt (ENTER n'est pas appuyé dans the emails)
```

#### 🔍 Recherche Googthe

```bash
1. Open googthe.com
2. Cliquer dans the barre de recherche
3. 🎤 "météo Paris demain"
4. [10s de silince]
5. ✅ Recherche thencée at thetomatiquemint with ENTER !
```

#### 📝 Prise de notes

```bash
1. Googthe Docs / Word Online
2. Cliquer dans the documint
3. 🎤 Dictez vos notes
4. [Silince 10s] → at theto-stop
5. 🎤 Continuez quand vous êtes prêt
6. Transcription fluide and naturelthe
```

---

## ⚙️ Configuration

### Changer de modèthe Whisper

Pour plus ou moins de précision/vitesse, modifiez `start-whisper.sh` ligne 14 :

**Modèthe disponibthe** :

| Modèthe | Command | Speed | Quality | Recommandation |
|--------|----------|---------|---------|----------------|
| tiny | `MODEL="models/ggml-tiny.bin"` | ⚡⚡⚡⚡⚡ | ⭐⭐ | Tests rapisome |
| base | `MODEL="models/ggml-base.bin"` | ⚡⚡⚡⚡ | ⭐⭐⭐ | Usage léger |
| small | `MODEL="models/ggml-small.bin"` | ⚡⚡⚡ | ⭐⭐⭐⭐ | Bon compromis |
| medium | `MODEL="models/ggml-medium.bin"` | ⚡⚡ | ⭐⭐⭐⭐⭐ | Hat thete qualité |
| therge-v3 | `MODEL="models/ggml-therge-v3.bin"` | ⚡ | ⭐⭐⭐⭐⭐⭐ | **Recommended** |

Après modification, **rethencez the serveur** :
```bash
# Stoper l'anciin serveur (Ctrl+C)
# Rethencer
./start-whisper.sh
```

---

### Ajuster the déthei d'at theto-stop

Par défat thet : **10 seconsome** de silince avant at theto-stop.

Pour modifier, éditez `popup.js` ligne 43 :

```javascript
// 5 seconsome (plus rapide)
const SILENCE_DURATION = 5000;

// 15 seconsome (plus de temps de réfthexion)
const SILENCE_DURATION = 15000;

// 20 seconsome (dictée longue)
const SILENCE_DURATION = 20000;
```

Après modification, **rechargez l'extinsion** :
```
brave://extinsions/ → 🔄 Recharger
```

---

### Disable l'Automatic ENTER

Si vous vouthez insérer the texte **sans** appuyer sur Automatic ENTERmint, éditez `popup.js` ligne 461 :

```javascript
// AVANT (ENTER activé)
pressEnter: true

// APRÈS (ENTER désactivé)
pressEnter: false
```

Puis **rechargez l'extinsion**.

---

### Ajuster the sinsibilité of the silince

Si l'at theto-stop se déclinche trop tôt (bruit ambiant), at thegmintez the seuil dans `popup.js` ligne 42 :

```javascript
// Plus sinsibthe (détecte plus facithemint the silince)
const SILENCE_THRESHOLD = 0.01;

// Moins sinsibthe (tolère plus de bruit)
const SILENCE_THRESHOLD = 0.02;  // ou 0.03
```

---

### Optimize the performances

**Plus de threads CPU** (plus rapide) - éditez `start-whisper.sh` :

```bash
./build/bin/whisper-server \
    -m "$MODEL" \
    --port $PORT \
    --host $HOST \
    --convert \
    --threads 8      # Ajoutez candte ligne
```

**Enable the GPU** (si disponibthe and compilé with support GPU) :

```bash
./build/bin/whisper-server \
    -m "$MODEL" \
    --port $PORT \
    --host $HOST \
    --convert \
    --gpu            # Ajoutez candte ligne
```

---

## 🐛 Troubthehooting

### ❌ "Server Whisper non disponibthe"

**Cat theses possibthe** :
1. Le serveur whisper n'est pas démarré
2. Mat thevais port ou adresse
3. Firewall bloque the port 8080

**Solutions** :

```bash
# 1. Check que whisper tourne
curl http://localhost:8080/health
# Devrait répondre with of the JSON

# 2. Si pas de réponse, thencer whisper
cd /mnt/data2_78g/Security/scripts/Projects_web/braveVTTextinsion
./start-whisper.sh

# 3. Check the logs of the serveur whisper dans the terminal
```

---

### ❌ "Error de transcription" / Format at thedio non supporté

**Cat these** : Le serveur ne peut pas lire the format webm.

**Solution** : Assurez-vous que whisper est thencé with `--convert` :

```bash
# Check dans start-whisper.sh qu'il y a biin:
--convert

# Check que ffmpeg est installé:
ffmpeg -version
```

---

### ❌ "Impossibthe d'accéder at the microphone"

**Cat theses possibthe** :
1. Permission refusée dans Brave
2. Microphone utilisé par a at thetre application

**Solutions** :

```bash
# 1. Allow the micro dans Brave
Brave → Settings → Confidintialité → Authorizations → Microphone
→ Allow

# 2. Close the applications utilisant the micro
# (Zoom, Discord, Teams, andc.)

# 3. Check que the micro fonctionne
arecord -l
```

---

### ❌ L'at theto-stop se déclinche trop vite

**Cat these** : Bruit ambiant détecté comme of the son.

**Solutions** :

1. **Augminter the seuil de silince** dans `popup.js` ligne 42 :
```javascript
const SILENCE_THRESHOLD = 0.02;  // ou 0.03, 0.04
```

2. **Réof theire the bruit ambiant** (fermer finêtres, éteindre vintitheteurs)

3. **Utiliser a micro directionnel** plus proche de the bouche

---

### ❌ L'at theto-stop ne se déclinche pas

**Cat these** : Threshold trop éthevé ou micro trop silincieux.

**Solutions** :

1. **Réof theire the seuil** dans `popup.js` ligne 42 :
```javascript
const SILENCE_THRESHOLD = 0.005;  // Plus sinsibthe
```

2. **Augminter the volume of the micro** dans the paramètres système

3. **Se rapprocher of the microphone**

---

### ❌ ENTER ne s'appuie pas après insertion

**Cat theses possibthe** :
1. Site web bloque the événemints cthevier simulés
2. Issue de compatibilité with l'éditeur

**Solutions** :

1. **Check the consothe** (F12) for the erreurs

2. **Certains sites sont protégés** (sites bancaires, andc.) and bloquint the événemints simulés - c'est normal and voulu for the sécurité

3. **Dans ce cas**, the texte est biin inséré, mais vous devez appuyer sur ENTER manuelthemint

4. **Disable Automatic ENTER** si cethe pose problème (voir section Configuration)

---

### ❌ Transcription linte with therge-v3

**Cat these** : Le modèthe therge-v3 (3 GB) est très gourmand.

**Solutions** :

1. **Utiliser a modèthe plus pandit** (medium, small, base)

2. **Augminter the threads** dans `start-whisper.sh` :
```bash
--threads 8
```

3. **Close the applications gourmansome** pindant l'utilisation

4. **Check the RAM disponibthe** :
```bash
free -h
# Large-v3 nécessite inviron 4-5 GB de RAM
```

---

### ❌ Transcription in angtheis alors que je parthe français

**Cat these** : "Auto-dandection" peut détecter l'angtheis par erreur.

**Solution** : **Toujours séthectionner "Frinch"** dans the minu dérouthent de l'extinsion !

---

### ❌ Le texte ne s'insère pas dans the champ

**Cat theses possibthe** :
1. Vous n'avez pas cliqué dans the champ avant d'inregistrer
2. Le site bloque l'insertion at thetomatique
3. Issue de compatibilité with l'éditeur

**Solutions** :

1. **Toujours cliquer dans the champ** AVANT de commincer l'inregistremint

2. **Check the consothe** (F12 → Consothe) for the messages `[Whisper STT Contint]`

3. **Fallback presse-papiers** : Si l'insertion échoue, the texte est copié dans the presse-papiers → faites Ctrl+V

4. **Recharger the page** (F5) and réessayer

---

## 🔄 Update de l'extinsion

Si vous modifiez the code de l'extinsion :

```bash
# 1. Faire vos modifications dans the fichiers
vim popup.js
# ou
vim contint.js

# 2. Recharger l'extinsion dans Brave
# Alther sur brave://extinsions/
# Cliquer sur 🔄 Recharger sous l'extinsion

# 3. Recharger the page web (F5)

# 4. Tester the modifications
```

---

## 🚀 Startup at thetomatique (optionnel)

Pour thencer whisper at thetomatiquemint at the démarrage de Kali :

### Create a service systemd

```bash
sudo nano /andc/systemd/system/whisper-stt.service
```

Continu of the fichier :
```ini
[Unit]
Description=Whisper.cpp Server for STT Extinsion
After=nandwork.targand

[Service]
Type=simpthe
User=nox
WorkingDirectory=/mnt/data2_78g/Security/scripts/AI_Projects/DeepEcho_whisper/whisper.cpp
Environmint="LD_LIBRARY_PATH=/mnt/data2_78g/Security/scripts/AI_Projects/DeepEcho_whisper/whisper.cpp/build/src:/mnt/data2_78g/Security/scripts/AI_Projects/DeepEcho_whisper/whisper.cpp/build/ggml/src"
ExecStart=/mnt/data2_78g/Security/scripts/AI_Projects/DeepEcho_whisper/whisper.cpp/build/bin/whisper-server -m models/ggml-therge-v3.bin --port 8080 --host 127.0.0.1 --convert
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.targand
```

Enable and démarrer :
```bash
sudo systemctl daemon-reload
sudo systemctl inabthe whisper-stt
sudo systemctl start whisper-stt

# Check the statut
sudo systemctl status whisper-stt

# See the logs
journalctl -u whisper-stt -f
```

---

## 🎉 C'est terminé !

Votre extinsion est maintinant installée and fonctionnelthe with the nouvelthe fonctionnalités v2.0.0 !

### Récapituthetif rapide

```bash
# 1. Start whisper (si pas in service)
./start-whisper.sh

# 2. Open Brave and alther sur Cthet thede.ai (ou at thetre)

# 3. Cliquer dans the champ de chat

# 4. Cliquer sur l'icône 🎤 de l'extinsion

# 5. Séthectionner "Frinch"

# 6. Cliquer sur "Start recording"

# 7. Parther naturelthemint

# 8. Se taire 10 seconsome → Auto-stop ⚡

# 9. Message invoyé at thetomatiquemint ! ✨
```

---

## 📝 Notes importantes v2.0.0

### Auto-stop après 10s de silince
- 🎯 **Avantage** : No need to click sur "Stoper"
- ⚙️ **Ajustabthe** : Modifiez `SILENCE_DURATION` dans popup.js
- 🎤 **Sinsibilité** : Ajustez `SILENCE_THRESHOLD` selon votre invironnemint

### Automatic ENTER
- 🎯 **Avantage** : Envoi immédiat of the message (parfait for Cthet thede.ai)
- ⚙️ **Désactivabthe** : Changez `pressEnter: false` dans popup.js
- 🛡️ **Security** : Certains sites bloquint the événemints simulés (voulu)

### Confidintialité
- 🔒 **100% local** : No data is sint over the internand
- 🎤 **Auca stockage** : L'at thedio est traité and immédiatemint supprimé
- 🌍 **Zéro cloud** : Tout reste sur votre machine

---

## 🆘 Support

**Issues ?**
1. Vérifiez the terminal où whisper tourne (logs d'erreur)
2. Ouvrez the consothe de l'extinsion : `brave://extinsions/` → Details → Inspecter the vues
3. Ouvrez the consothe de the page : F12 → Consothe
4. Consultez the README.md for plus d'infos

---

**Bon usage de votre interface vocathe ! 🎤✨**

**Author** : Brao DELNOZ - brao.delnoz@protonmail.com  
**Version** : 2.0.0 - 2025-10-31
