<!--
============================================================================
Filename       : INSTALL.md
Author         : Bruno DELNOZ
Email          : bruno.delnoz@protonmail.com
Version        : 3.0.1
Date           : 2025-11-02

CHANGELOG:
-----------
v3.0.1 - 2025-11-02
  - Added v3.0.1 bug fixes section
  - Updated troubleshooting for insertion
  - Added "click in field first" instructions
  - Known issues documented

v3.0.0 - 2025-11-01
  - Complete rewrite for v3.0.0 floating widget
  - Native Messaging Host installation guide
  - Model selection usage documentation
  - Updated all installation steps
  - New troubleshooting for Native Host
============================================================================
-->

# 📦 Installation - Whisper Local STT for Brave v3.0.1

Complete installation guide for the 100% local voice transcription extension with **floating widget** and **fixed text insertion**.

---

## 📋 Prerequisites

Before starting, make sure you have:

- ✅ **Brave Browser** (or Chromium/Chrome)
- ✅ **whisper.cpp** already installed and compiled
- ✅ **Multiple Whisper models** (tiny, base, medium, large-v3)
- ✅ **ffmpeg** installed (for audio conversion)
- ✅ **Kali Linux** (or any Linux distribution)

---

## 🚀 Installation in 4 Steps

### Step 1: Verify whisper.cpp

```bash
# Go to your whisper.cpp folder
cd /path/to/whisper.cpp

# Check server exists
ls -la build/bin/whisper-server

# Check models exist
ls -la models/ggml-*.bin

# Check ffmpeg
ffmpeg -version
```

**If ffmpeg missing:**
```bash
sudo apt update
sudo apt install ffmpeg -y
```

✅ All good? Continue!

---

### Step 2: Load Extension in Brave

#### 2.1 Open Extensions Page

```
brave://extensions/
```

#### 2.2 Enable Developer Mode

Toggle "Developer mode" in top-right corner.

#### 2.3 Load Extension

1. Click "Load unpacked"
2. Navigate to your extension folder
3. Select and open

✅ Extension installed!

---

### Step 3: Install Native Messaging Host (Optional)

**Only needed for model selection feature!**

```bash
cd /path/to/braveVTTextension

# Run installer
./install.sh --install-native

# Follow prompts:
# - Browser: Brave
# - Extension ID: [copy from brave://extensions/]
```

**Finding Extension ID:**
1. Go to `brave://extensions/`
2. Find "Whisper Local STT - Brave - En"
3. Copy the long ID (e.g., `abcdef...`)

**Verify installation:**
```bash
ls -la ~/.config/BraveSoftware/Brave-Browser/NativeMessagingHosts/com.whisper.control.json
```

⚠️ **Important:** Restart Brave completely after installation!

---

### Step 4: Start Whisper Server

```bash
cd /path/to/braveVTTextension
./start-whisper.sh --exec
```

**Server ready when you see:**
```
whisper server listening at http://127.0.0.1:8080
```

⚠️ Keep this terminal open while using extension!

---

## 🎯 First Use - v3.0.1 Important!

### 1. Open any webpage

Example: claude.ai, google.com, etc.

### 2. Widget appears automatically

Purple floating widget in bottom-right corner:
```
┌──────────────────────┐
│ 🎤 Whisper STT  [─] │
├──────────────────────┤
│ 🟢 Connected        │
│ 🤖 Model: medium    │
│ 🇫🇷 Language: French│
│ ⏱️  Delay: 10s      │
│ [🎤 START]          │
└──────────────────────┘
```

Widget width: **280px** (compact!)

### 3. ⚠️ IMPORTANT v3.0.1: Click in field FIRST!

**This is critical for text insertion to work:**

```
✅ CORRECT ORDER:
1. Click in text field (Google search, Claude chat, etc.)
2. Click START in widget
3. Speak
4. Text inserts correctly!

❌ WRONG ORDER:
1. Click START first
2. Then click in field
3. Text won't insert!
```

**Why?** The widget tracks your last clicked field.

### 4. Test recording

1. **Click in a text field**
2. **Click START** in widget
3. **Speak clearly** for 2-3 seconds
4. **Stay silent 10 seconds** → Auto-stop
5. **Text appears** in the field
6. **ENTER pressed** automatically

✅ It works!

---

## 🎨 Widget Features v3.0.1

### Compact Size ✨ NEW!

- **Width:** 280px (reduced from 350px)
- **Minimized:** 50x50px (reduced from 70x70px)
- Takes less screen space!

### Minimizing

1. Click **[─]** button
2. Widget becomes small 🎤 icon
3. Click icon to expand

### Position

⚠️ Drag not working in v3.0.1 (known issue)

Position auto-saved for each domain.

---

## 🎯 Usage Examples

### Example 1: Claude.ai Conversation

```
1. Open https://claude.ai
2. Widget visible in bottom-right
3. Click in Claude's chat field ← IMPORTANT!
4. Select: 🇫🇷 French
5. Select: ⏱️ 10 seconds
6. Click START 🎤
7. Speak: "Hello Claude, explain photosynthesis"
8. Stay silent 10 seconds
9. → Auto-stop, transcription, automatic ENTER
10. Claude responds!
```

### Example 2: Google Search

```
1. Open google.com
2. Click in search bar ← IMPORTANT!
3. Click START in widget
4. Say: "Weather in Paris tomorrow"
5. Wait 10s → Auto-stop
6. Search launched automatically!
```

### Example 3: Email (Gmail)

```
1. Open Gmail → New message
2. Click in message body ← IMPORTANT!
3. Click START
4. Dictate your email
5. Auto-stop after 10s silence
6. Text inserted (ENTER not pressed in emails)
```

---

## ⚙️ Configuration

### Change Default Model

Edit `start-whisper.sh`:

```bash
# Change from:
DEFAULT_MODEL="ggml-medium.bin"

# To:
DEFAULT_MODEL="ggml-large-v3.bin"
```

Or start with option:
```bash
./start-whisper.sh --exec --model ggml-large-v3.bin
```

### Add More Models

```bash
cd /path/to/whisper.cpp

# Download model
bash ./models/download-ggml-model.sh large-v3

# Verify
ls -la models/ggml-*.bin
```

---

## 🛠 Troubleshooting v3.0.1

### ❌ Widget not appearing

**Solutions:**
```
1. Ctrl+Shift+R (hard reload)
2. brave://extensions/ → Reload extension
3. F5 on webpage
4. F12 → Console → Look for "[Whisper Widget]" messages
```

### ❌ Text not inserting ✨ v3.0.1 Fix

**This should be FIXED in v3.0.1!**

**Make sure you:**
```
1. Click in text field FIRST
2. THEN click START
3. Widget tracks your click
```

**Check console (F12):**
```
You should see:
[Whisper Widget] Focus tracked: INPUT
or
[Whisper Widget] Click tracked: TEXTAREA
```

**If you see:**
```
[Whisper Widget] No suitable field
```

**Then:** Click in field before recording!

### ❌ Widget too large

**Fixed in v3.0.1!**

If still shows old size:
```
Ctrl+Shift+R (multiple times)

Or:
brave://extensions/ → Remove → Load unpacked
```

### ❌ Cannot drag widget

**Known issue in v3.0.1** - Will be fixed in v3.0.2.

Widget position is saved automatically per domain.

### ❌ Model selection doesn't work

**Cause:** Native Host not installed

**Solution:**
```bash
./install.sh --install-native
# Restart Brave completely
```

**Check logs:**
```bash
tail -f /tmp/whisper-control.log
```

### ❌ Server disconnected (🔴)

**Solution:**
```bash
# Start server
./start-whisper.sh --exec

# Or check if port blocked
lsof -i :8080
```

### ❌ Transcription wrong language

**Solution:** Select your language in widget (don't use "Auto-detection")

### ❌ ENTER doesn't press

**Normal on some sites** (banking, secure forms) for security.

On these sites, text inserts but you must press ENTER manually.

---

## 🔄 Extension Update v3.0.1

If updating from v3.0.0:

```bash
cd /path/to/braveVTTextension

# Copy new files
cp /path/to/content-widget.js ./
cp /path/to/widget-style.css ./

# Reload extension
brave://extensions/ → Reload

# Or remove + reload:
brave://extensions/ → Remove → Load unpacked

# Hard reload pages
Ctrl+Shift+R
```

---

## 🚀 Automatic Startup (Optional)

Create systemd service:

```bash
sudo nano /etc/systemd/system/whisper-stt.service
```

Content:
```ini
[Unit]
Description=Whisper.cpp Server for STT Extension
After=network.target

[Service]
Type=simple
User=YOUR_USER
WorkingDirectory=/path/to/whisper.cpp
Environment="LD_LIBRARY_PATH=/path/to/whisper.cpp/build/src:/path/to/whisper.cpp/build/ggml/src"
ExecStart=/path/to/whisper.cpp/build/bin/whisper-server -m models/ggml-large-v3.bin --port 8080 --host 127.0.0.1 --convert
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable:
```bash
sudo systemctl daemon-reload
sudo systemctl enable whisper-stt
sudo systemctl start whisper-stt
sudo systemctl status whisper-stt
```

---

## 🎉 Done!

### Quick Summary v3.0.1

```
1. Load extension in Brave
2. (Optional) Install Native Host
3. Start whisper server
4. Open webpage → Widget appears
5. Click in text field FIRST ← Important!
6. Click START, speak, wait 10s
7. Text inserts + ENTER → Done!
```

---

## 📝 Important Notes v3.0.1

### Text Insertion ✅ FIXED
- Widget now tracks focus and clicks
- Always click in field BEFORE recording
- Check console for "Focus tracked" messages

### Widget Size ✅ REDUCED
- 280px width (was 350px)
- 50x50px minimized (was 70x70px)
- More compact!

### Known Issues ⚠️
- Drag functionality not working
- Will be fixed in v3.0.2

### Privacy 🔒
- 100% local processing
- No data sent to internet
- Zero tracking
- Open source

---

## 🆘 Support

**Problems?**
1. Check server logs: `tail -f /tmp/whisper-server.log`
2. Check Native Host logs: `tail -f /tmp/whisper-control.log`
3. Check browser console: F12 → Console
4. Check README.md for more info

---

**Enjoy your voice interface v3.0.1! 🎤✨**

**Author**: Bruno DELNOZ - bruno.delnoz@protonmail.com  
**Version**: 3.0.1 - 2025-11-02
