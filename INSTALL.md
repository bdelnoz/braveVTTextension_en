<!--
============================================================================
Filename       : INSTALL.md
Author         : Bruno DELNOZ
Email          : bruno.delnoz@protonmail.com
Version        : 3.0.0
Date           : 2025-11-01

CHANGELOG:
-----------
v3.0.0 - 2025-11-01
  - Complete rewrite for v3.0.0 floating widget
  - Native Messaging Host installation guide
  - Model selection usage documentation
  - Updated all installation steps
  - New troubleshooting for Native Host

v2.1.0 - 2025-10-31
  - Full English translation of installation guide
  - Updated all instructions and examples
  - Maintained all original features and structure

v2.0.0 - 2025-10-31
  - Updated for v2.0.0 features
  - Added auto-stop and automatic ENTER usage section
  - Added Claude.ai usage examples
  - Updated theoretical screenshots
  - Added header with versioning

v1.0.0 - 2025-10-31
  - Initial installation guide
  - Step-by-step instructions
  - Configuration and troubleshooting
============================================================================
-->

# 📦 Installation - Whisper Local STT for Brave v3.0.0

Complete installation guide for the 100% local voice transcription extension with **floating widget** and **dynamic model selection**.

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

Make sure whisper.cpp works correctly.

```bash
# Go to your whisper.cpp folder
cd /mnt/data2_78g/Security/scripts/AI_Projects/DeepEcho_whisper/whisper.cpp

# Check that the server exists
ls -la build/bin/whisper-server

# Check that models exist
ls -la models/ggml-*.bin

# Check that ffmpeg is installed
ffmpeg -version
```

**If ffmpeg is not installed**:
```bash
sudo apt update
sudo apt install ffmpeg -y
```

If everything is OK, proceed to the next step. ✅

---

### Step 2: Load the Extension in Brave

#### 2.1 Open the Extensions Page

1. Open **Brave**
2. In the address bar, type: `brave://extensions/`
3. Press **Enter**

#### 2.2 Enable Developer Mode

In the top right of the page, enable **"Developer mode"**.

#### 2.3 Load the Extension

1. Click on **"Load unpacked"**
2. Navigate to: `/mnt/data2_78g/Security/scripts/Projects_web/braveVTTextension`
3. Select the folder and click **"Open"**

✅ The extension is now installed!

You should NOT see an icon in the toolbar (v3.0.0 uses floating widget).

---

### Step 3: Install Native Messaging Host

**This step is REQUIRED for model selection feature!**

#### 3.1 What is Native Messaging Host?

It's a bridge that allows the extension to:
- List available Whisper models
- Switch models dynamically
- Control the whisper server

Without it, you can still use the extension, but model selection won't work.

#### 3.2 Automatic Installation

```bash
cd /mnt/data2_78g/Security/scripts/Projects_web/braveVTTextension

# Run installer
./install.sh --install-native
```

The installer will:
1. **Detect your browser** (Brave/Chrome/Chromium)
2. **Ask for Extension ID**
3. **Install Native Host** in correct directory
4. **Configure everything** automatically

#### 3.3 Finding Extension ID

When the installer asks for Extension ID:

1. Go to `brave://extensions/`
2. Find "Whisper Local STT - Brave - En"
3. Enable "Developer mode" if not already enabled
4. **Copy the ID** (long alphanumeric string)

Example: `abcdefghijklmnopqrstuvwxyz123456`

#### 3.4 Verification

After installation, verify:

```bash
# Check Native Host manifest exists
ls -la ~/.config/BraveSoftware/Brave-Browser/NativeMessagingHosts/com.whisper.control.json

# Check control script is executable
ls -la whisper-control.sh
```

✅ If both exist, Native Host is installed correctly!

**Important**: Restart Brave completely after Native Host installation.

---

### Step 4: Start the Whisper Server

```bash
cd /mnt/data2_78g/Security/scripts/Projects_web/braveVTTextension
./start-whisper.sh --exec
```

**Options**:

```bash
# Start with specific model
./start-whisper.sh --exec --model ggml-large-v3.bin

# List available models
./start-whisper.sh --listmodel

# Test connection
./start-whisper.sh --test
```

**The server is ready when you see**:
```
whisper server listening at http://127.0.0.1:8080
```

⚠️ **Keep this terminal open** as long as you use the extension!

---

## 🎯 First Use

### 1. Open any webpage

Open any website in Brave (e.g., claude.ai, google.com, etc.)

### 2. Widget appears automatically

You should see a **purple floating widget** in the bottom-right corner:

```
┌─────────────────────────────┐
│  🎤 Whisper STT        [─] │
├─────────────────────────────┤
│  🟢 Connected (medium)      │
│                             │
│  🤖 [medium ▼]              │
│  🇫🇷 [French ▼]             │
│  ⏱️  [10 seconds ▼]         │
│                             │
│      [🎤 START]             │
└─────────────────────────────┘
```

If you don't see it:
- Check extension is loaded: `brave://extensions/`
- Reload the extension
- Reload the webpage (F5)

### 3. Configure the widget

**Server Status**:
- 🟢 **Connected** - Ready to use
- 🔴 **Disconnected** - Start whisper server
- 🟡 **Restarting...** - Model switch in progress

**Model Selection** 🤖:
- Click dropdown to see available models
- Select a model → Whisper restarts automatically
- Wait 5-15 seconds for restart

**Language** 🇫🇷:
- Always select your language!
- Don't use "Auto-detection" unless necessary

**Delay** ⏱️:
- Choose auto-stop delay (5s to 30s)
- Default: 10 seconds

### 4. Test recording

1. **Click in a text field** (e.g., Google search bar)
2. **Click START** 🎤 in widget
3. **Speak clearly**: "Hello, this is a test"
4. **Stay silent 10 seconds** → Auto-stop
5. **Text appears** in the field
6. **ENTER is pressed** automatically

✅ It works! 🎉

---

## 🎨 Widget Features

### Dragging the Widget

1. **Click and hold** on "🎤 Whisper STT" title bar
2. **Drag** to desired position
3. **Release** - position is saved automatically

Next time you open a page, widget appears at same position!

### Minimizing the Widget

1. **Click [─]** button in top-right
2. Widget becomes a small 🎤 icon
3. **Click icon** to expand again

Minimized state is also saved!

### Widget States

**Normal**:
- Full interface visible
- All controls accessible

**Recording** 🔴:
- Shows "RECORDING"
- Countdown: "Auto-stop in: 8s..."
- STOP button replaces START button

**Minimized**:
- Small 🎤 icon (70x70px)
- Click to expand
- Still functional!

---

## 🎯 Usage Examples

### Example 1: Conversation with Claude.ai

```bash
1. Open https://claude.ai
2. Widget is already visible in bottom-right
3. Status shows: 🟢 Connected (medium)
4. Select: 🇫🇷 French
5. Select: ⏱️ 10 seconds
6. Click in Claude's chat field
7. Click START 🎤
8. Speak: "Hello Claude, explain photosynthesis"
9. Stay silent 10 seconds
10. → Auto-stop, transcription, automatic ENTER
11. Claude responds!
```

**No need to touch the widget again!** Just keep talking and waiting 10s between sentences.

### Example 2: Switching Models

```bash
1. Open any webpage
2. Widget shows: 🟢 Connected (medium)
3. Click model dropdown: 🤖 [medium ▼]
4. Select: "large-v3 (best)"
5. Widget shows: 🟡 Restarting...
6. Wait 10-15 seconds
7. Widget shows: 🟢 Connected (large-v3)
8. Done! Now using large-v3 for better quality
```

**No terminal commands needed!** Everything from the UI.

### Example 3: Google Search

```bash
1. Open google.com
2. Click in search bar
3. Click START 🎤 in widget
4. Say: "Weather in Paris tomorrow"
5. Wait 10s → Auto-stop
6. Search automatically launched with ENTER!
```

### Example 4: Email Writing

```bash
1. Open Gmail → New message
2. Click in message body
3. Click START 🎤
4. Dictate your email
5. Auto-stop after 10s silence
6. Text inserted (ENTER not pressed in emails - that's intentional)
```

---

## ⚙️ Configuration

### Changing Default Model at Startup

Edit `start-whisper.sh` line 14:

```bash
# Change from:
DEFAULT_MODEL="ggml-medium.bin"

# To:
DEFAULT_MODEL="ggml-large-v3.bin"
```

Or always start with `--model` option:

```bash
./start-whisper.sh --exec --model ggml-large-v3.bin
```

### Adding More Whisper Models

```bash
cd /mnt/data2_78g/Security/scripts/AI_Projects/DeepEcho_whisper/whisper.cpp

# Download a model
bash ./models/download-ggml-model.sh large-v3

# Verify
ls -la models/ggml-*.bin

# Restart extension to see new model in dropdown
```

### Optimizing Performance

**More CPU threads** (faster transcription):

Edit `start-whisper.sh` and add:

```bash
./build/bin/whisper-server \
    -m "models/$MODEL" \
    --port $PORT \
    --host $HOST \
    --convert \
    --threads 8      # Add this line
```

**Enable GPU** (if available):

```bash
./build/bin/whisper-server \
    -m "models/$MODEL" \
    --port $PORT \
    --host $HOST \
    --convert \
    --gpu            # Add this line
```

---

## 🛠 Troubleshooting

### ❌ Widget not appearing

**Possible causes**:
1. Extension not loaded
2. Content script blocked
3. JavaScript error

**Solutions**:

```bash
# 1. Check extension is loaded
brave://extensions/
# Look for "Whisper Local STT - Brave - En"

# 2. Reload extension
# Click 🔄 "Reload" button under extension

# 3. Reload webpage
# Press F5

# 4. Check browser console
# Press F12 → Console tab
# Look for "[Whisper Widget]" messages
```

### ❌ Model selection doesn't work

**Possible causes**:
1. Native Host not installed
2. Wrong extension ID in manifest
3. Native Host path incorrect

**Solutions**:

```bash
# 1. Check Native Host is installed
ls -la ~/.config/BraveSoftware/Brave-Browser/NativeMessagingHosts/com.whisper.control.json

# 2. If not installed, run:
./install.sh --install-native

# 3. Verify extension ID in manifest
cat ~/.config/BraveSoftware/Brave-Browser/NativeMessagingHosts/com.whisper.control.json
# Check "allowed_origins" has correct extension ID

# 4. Restart Brave completely
```

### ❌ "🔴 Disconnected" status

**Cause**: Whisper server not running

**Solution**:

```bash
# Start whisper server
./start-whisper.sh --exec

# Or check if port is blocked
lsof -i :8080
```

### ❌ Model switch stuck at "🟡 Restarting..."

**Possible causes**:
1. Model file doesn't exist
2. Whisper failed to start
3. Port already in use

**Solutions**:

```bash
# 1. Check logs
tail -f /tmp/whisper-control.log
tail -f /tmp/whisper-server.log

# 2. Check model exists
ls -la /path/to/whisper.cpp/models/ggml-*.bin

# 3. Kill all whisper processes
pkill -f whisper-server

# 4. Manually restart with desired model
./start-whisper.sh --exec --model ggml-medium.bin

# 5. Reload widget (refresh page)
```

### ❌ Widget position resets

**Cause**: localStorage cleared or different domain

**Note**: Widget position is saved **per domain**. If you visit a different site, widget may appear at default position.

**Solution**: Just drag it where you want - position will be saved for that domain.

### ❌ Transcription in wrong language

**Cause**: Language set to "Auto-detection" or wrong language

**Solution**:
1. Open widget
2. Change language dropdown to your language (e.g., French)
3. Language preference is saved automatically

### ❌ ENTER doesn't press after insertion

**Cause**: Some websites block simulated keyboard events for security

**This is NORMAL and INTENDED** on:
- Banking websites
- Payment pages
- Secure forms

**Solution**: On these sites, text is inserted but you must press ENTER manually.

---

## 🔄 Extension Update

If you modify the extension code:

```bash
# 1. Make your modifications
vim content-widget.js

# 2. Reload extension in Brave
brave://extensions/
# Click 🔄 "Reload" under the extension

# 3. Reload webpage
# Press F5

# 4. Test modifications
```

---

## 🚀 Automatic Startup (Optional)

To launch whisper automatically at system startup:

### Create systemd service

```bash
sudo nano /etc/systemd/system/whisper-stt.service
```

File content:
```ini
[Unit]
Description=Whisper.cpp Server for STT Extension
After=network.target

[Service]
Type=simple
User=nox
WorkingDirectory=/mnt/data2_78g/Security/scripts/AI_Projects/DeepEcho_whisper/whisper.cpp
Environment="LD_LIBRARY_PATH=/mnt/data2_78g/Security/scripts/AI_Projects/DeepEcho_whisper/whisper.cpp/build/src:/mnt/data2_78g/Security/scripts/AI_Projects/DeepEcho_whisper/whisper.cpp/build/ggml/src"
ExecStart=/mnt/data2_78g/Security/scripts/AI_Projects/DeepEcho_whisper/whisper.cpp/build/bin/whisper-server -m models/ggml-large-v3.bin --port 8080 --host 127.0.0.1 --convert
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable whisper-stt
sudo systemctl start whisper-stt

# Check status
sudo systemctl status whisper-stt

# View logs
journalctl -u whisper-stt -f
```

---

## 🎉 Done!

Your extension v3.0.0 is now installed and fully functional!

### Quick Summary

```bash
# 1. Load extension in Brave
brave://extensions/ → Load unpacked

# 2. Install Native Host (REQUIRED for model selection)
./install.sh --install-native

# 3. Restart Brave

# 4. Start whisper server
./start-whisper.sh --exec

# 5. Open any webpage → Widget appears!

# 6. Configure: language, delay, model

# 7. Click START, speak, wait 10s, done!
```

---

## 📝 Important Notes v3.0.0

### Floating Widget
- ✅ Always visible on all pages
- ✅ Never closes when clicking elsewhere
- ✅ Draggable and minimizable
- ✅ Position saved per domain

### Model Selection
- ✅ Requires Native Messaging Host
- ✅ Install with `./install.sh --install-native`
- ✅ Restart Brave after installation
- ✅ Switch models directly from widget

### Privacy
- 🔒 **100% local** - No data sent to internet
- 🎤 **No storage** - Audio processed and immediately deleted
- 🌍 **Zero cloud** - Everything stays on your machine
- 🔐 **Open source** - Fully auditable code

---

## 🆘 Support

**Problems?**
1. Check whisper server logs: `tail -f /tmp/whisper-server.log`
2. Check Native Host logs: `tail -f /tmp/whisper-control.log`
3. Check browser console: F12 → Console
4. Check README.md for more info

---

**Enjoy your voice interface v3.0.0! 🎤✨**

**Author**: Bruno DELNOZ - bruno.delnoz@protonmail.com  
**Version**: 3.0.0 - 2025-11-01
