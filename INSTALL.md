<!--
============================================================================
Filename       : INSTALL.md
Author         : Bruno DELNOZ
Email          : bruno.delnoz@protonmail.com
Full path      : /mnt/data2_78g/Security/scripts/Projects_web/braveVTTextension/INSTALL.md
Target usage   : Detailed installation guide for Whisper Local STT Brave extension
Version        : 2.1.0
Date           : 2025-10-31

CHANGELOG:
-----------
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

# 📦 Installation - Whisper Local STT for Brave v2.1.0

Complete installation guide for the 100% local voice transcription extension with **intelligent auto-stop** and **automatic ENTER**.

---

## 📋 Prerequisites

Before starting, make sure you have:

- ✅ **Brave Browser** (or Chromium/Chrome)
- ✅ **whisper.cpp** already installed and compiled
- ✅ **A Whisper model** (tiny, base, small, medium, large-v3)
- ✅ **ffmpeg** installed (for audio conversion)
- ✅ **Kali Linux** (or any Linux distribution)

---

## 🚀 Installation in 3 Steps

### Step 1: Verify whisper.cpp

Make sure whisper.cpp works correctly.

```bash
# Go to your whisper.cpp folder
cd /mnt/data2_78g/Security/scripts/AI_Projects/DeepEcho_whisper/whisper.cpp

# Check that the server exists
ls -la build/bin/whisper-server

# Check that the model exists
ls -la models/ggml-large-v3.bin  # Or ggml-base.bin, ggml-medium.bin, etc.

# Check that ffmpeg is installed (required for --convert)
ffmpeg -version
```

**If ffmpeg is not installed**:
```bash
sudo apt update
sudo apt install ffmpeg -y
```

If everything is OK, proceed to the next step. ✅

---

### Step 2: Prepare the Extension

All files are already in the project folder:

```bash
cd /mnt/data2_78g/Security/scripts/Projects_web/braveVTTextension

# Check the structure
ls -la
```

You should see:
```
braveVTTextension/
├── manifest.json         # Manifest V3 configuration
├── popup.html            # Interface
├── popup.js             # v2.2.0 - With auto-stop and silence detection
├── content.js           # v2.2.0 - With automatic ENTER
├── icon48.png           # 48x48 icon
├── icon96.png           # 96x96 icon
├── start-whisper.sh     # Whisper launch script
├── README.md            # Complete documentation
└── INSTALL.md           # This file
```

**Make the script executable**:
```bash
chmod +x start-whisper.sh
```

---

### Step 3: Load the Extension in Brave

#### 3.1 Open the Extensions Page

1. Open **Brave**
2. In the address bar, type: `brave://extensions/`
3. Press **Enter**

#### 3.2 Enable Developer Mode

In the top right of the page, enable **"Developer mode"**.

#### 3.3 Load the Extension

1. Click on **"Load unpacked"**
2. Navigate to: `/mnt/data2_78g/Security/scripts/Projects_web/braveVTTextension`
3. Select the folder and click **"Open"**

✅ The extension is now installed!

You should see the 🎤 icon in Brave's toolbar.

---

## 🎯 Startup and Usage

### Start the Whisper Server

**Option A: With the provided script (recommended)**

```bash
cd /mnt/data2_78g/Security/scripts/Projects_web/braveVTTextension
./start-whisper.sh --exec
```

The script:
- ✅ Checks that everything is in place
- ✅ Automatically configures libraries
- ✅ Launches the server with large-v3 model on http://127.0.0.1:8080
- ✅ Enables automatic audio conversion (--convert)

**Option B: Manually**

```bash
cd /mnt/data2_78g/Security/scripts/AI_Projects/DeepEcho_whisper/whisper.cpp
LD_LIBRARY_PATH=./build/src:./build/ggml/src:$LD_LIBRARY_PATH \
./build/bin/whisper-server \
    -m models/ggml-large-v3.bin \
    --port 8080 \
    --host 127.0.0.1 \
    --convert
```

**The server is ready when you see**:
```
whisper server listening at http://127.0.0.1:8080
```

⚠️ **Keep this terminal open** as long as you use the extension!

---

### Use the Extension - Conversational Mode v2.0.0

#### 🎤 Example: Discussion with Claude.ai

1. **Open Claude.ai** in Brave
2. **Click** on the 🎤 extension icon
3. **Test the connection**: click "Test connection"
   - ✅ You should see: "Connected to Whisper server"
4. **Select "French"** in the dropdown menu
   - ⚠️ Important to prevent whisper from translating to English
5. **Click in the chat field** of Claude
6. **Click** on "Start recording"
7. **Speak clearly**: "Hello Claude, explain general relativity to me"
8. **Stop speaking** and wait...
   - You will see the countdown: "auto-stop in 10s... 9s... 8s..."
9. 🎯 **Auto-stop after 10 seconds of silence**
10. ⏳ "Transcription in progress..." (2-5 seconds with large-v3)
11. ✨ **Magic**:
    - Text is inserted in the field
    - **ENTER is automatically pressed**
    - Your message is sent to Claude!
    - Claude starts responding!

#### 🎯 Advantages of v2.0.0 Mode

**No need to**:
- ❌ Click "Stop recording"
- ❌ Press ENTER manually
- ❌ Touch the mouse or keyboard

**100% hands-free conversation!** 🎤✨

---

### Other Use Cases

#### 📧 Email Writing (Gmail)

```bash
1. Open Gmail
2. Click "New message"
3. Click in the message field
4. 🎤 "Hello John, I'm confirming our meeting tomorrow"
5. [10s of silence]
6. ✅ Text inserted and ready (ENTER not pressed in emails)
```

#### 🔍 Google Search

```bash
1. Open google.com
2. Click in the search bar
3. 🎤 "Paris weather tomorrow"
4. [10s of silence]
5. ✅ Search automatically launched with ENTER!
```

#### 📝 Note-Taking

```bash
1. Google Docs / Word Online
2. Click in the document
3. 🎤 Dictate your notes
4. [Silence 10s] → auto-stop
5. 🎤 Continue when ready
6. Fluid and natural transcription
```

---

## ⚙️ Configuration

### Change Whisper Model

For more or less precision/speed, modify `start-whisper.sh` line 14:

**Available models**:

| Model | Command | Speed | Quality | Recommendation |
|-------|---------|-------|---------|----------------|
| tiny | `MODEL="models/ggml-tiny.bin"` | ⚡⚡⚡⚡⚡ | ⭐⭐ | Quick tests |
| base | `MODEL="models/ggml-base.bin"` | ⚡⚡⚡⚡ | ⭐⭐⭐ | Light usage |
| small | `MODEL="models/ggml-small.bin"` | ⚡⚡⚡ | ⭐⭐⭐⭐ | Good compromise |
| medium | `MODEL="models/ggml-medium.bin"` | ⚡⚡ | ⭐⭐⭐⭐⭐ | High quality |
| large-v3 | `MODEL="models/ggml-large-v3.bin"` | ⚡ | ⭐⭐⭐⭐⭐⭐ | **Recommended** |

After modification, **restart the server**:
```bash
# Stop the old server (Ctrl+C)
# Restart
./start-whisper.sh --exec
```

---

### Adjust Auto-Stop Delay

Default: **10 seconds** of silence before auto-stop.

To modify, edit `popup.js` line 43:

```javascript
// 5 seconds (faster)
const SILENCE_DURATION = 5000;

// 15 seconds (more thinking time)
const SILENCE_DURATION = 15000;

// 20 seconds (long dictation)
const SILENCE_DURATION = 20000;
```

After modification, **reload the extension**:
```
brave://extensions/ → 🔄 Reload
```

---

### Disable Automatic ENTER

If you want to insert text **without** automatically pressing ENTER, edit `popup.js` line 461:

```javascript
// BEFORE (ENTER enabled)
pressEnter: true

// AFTER (ENTER disabled)
pressEnter: false
```

Then **reload the extension**.

---

### Adjust Silence Sensitivity

If auto-stop triggers too early (ambient noise), increase the threshold in `popup.js` line 42:

```javascript
// More sensitive (detects silence more easily)
const SILENCE_THRESHOLD = 0.01;

// Less sensitive (tolerates more noise)
const SILENCE_THRESHOLD = 0.02;  // or 0.03
```

---

### Optimize Performance

**More CPU threads** (faster) - edit `start-whisper.sh`:

```bash
./build/bin/whisper-server \
    -m "$MODEL" \
    --port $PORT \
    --host $HOST \
    --convert \
    --threads 8      # Add this line
```

**Enable GPU** (if available and compiled with GPU support):

```bash
./build/bin/whisper-server \
    -m "$MODEL" \
    --port $PORT \
    --host $HOST \
    --convert \
    --gpu            # Add this line
```

---

## 🛠 Troubleshooting

### ❌ "Whisper server unavailable"

**Possible causes**:
1. Whisper server not started
2. Wrong port or address
3. Firewall blocking port 8080

**Solutions**:

```bash
# 1. Check if whisper is running
curl http://localhost:8080/health
# Should respond with JSON

# 2. If no response, start whisper
cd /mnt/data2_78g/Security/scripts/Projects_web/braveVTTextension
./start-whisper.sh --exec

# 3. Check whisper server logs in terminal
```

---

### ❌ "Transcription error" / Audio format not supported

**Cause**: Server cannot read webm format.

**Solution**: Make sure whisper is launched with `--convert`:

```bash
# Check in start-whisper.sh that there is:
--convert

# Check that ffmpeg is installed:
ffmpeg -version
```

---

### ❌ "Cannot access microphone"

**Possible causes**:
1. Permission denied in Brave
2. Microphone used by another application

**Solutions**:

```bash
# 1. Allow microphone in Brave
Brave → Settings → Privacy → Permissions → Microphone
→ Allow

# 2. Close applications using the microphone
# (Zoom, Discord, Teams, etc.)

# 3. Check that microphone works
arecord -l
```

---

### ❌ Auto-stop triggers too fast

**Cause**: Ambient noise detected as sound.

**Solutions**:

1. **Increase silence threshold** in `popup.js` line 42:
```javascript
const SILENCE_THRESHOLD = 0.02;  // or 0.03, 0.04
```

2. **Reduce ambient noise** (close windows, turn off fans)

3. **Use a directional microphone** closer to mouth

---

### ❌ Auto-stop doesn't trigger

**Cause**: Threshold too high or microphone too quiet.

**Solutions**:

1. **Reduce threshold** in `popup.js` line 42:
```javascript
const SILENCE_THRESHOLD = 0.005;  // More sensitive
```

2. **Increase microphone volume** in system settings

3. **Get closer to microphone**

---

### ❌ ENTER doesn't press after insertion

**Possible causes**:
1. Website blocks simulated keyboard events
2. Compatibility issue with editor

**Solutions**:

1. **Check console** (F12) for errors

2. **Some sites are protected** (banking sites, etc.) and block simulated events - this is normal and intended for security

3. **In this case**, text is inserted, but you must press ENTER manually

4. **Disable automatic ENTER** if it causes problems (see Configuration section)

---

### ❌ Slow transcription with large-v3

**Cause**: large-v3 model (3 GB) is very demanding.

**Solutions**:

1. **Use a smaller model** (medium, small, base)

2. **Increase threads** in `start-whisper.sh`:
```bash
--threads 8
```

3. **Close demanding applications** during use

4. **Check available RAM**:
```bash
free -h
# large-v3 requires about 4-5 GB of RAM
```

---

### ❌ Transcription in English when I speak French

**Cause**: "Auto-detection" may detect English by mistake.

**Solution**: **Always select "French"** in the extension dropdown menu!

---

### ❌ Text doesn't insert in field

**Possible causes**:
1. You didn't click in the field before recording
2. Website blocks automatic insertion
3. Compatibility issue with editor

**Solutions**:

1. **Always click in the field** BEFORE starting recording

2. **Check console** (F12 → Console) for `[Whisper STT Content]` messages

3. **Clipboard fallback**: If insertion fails, text is copied to clipboard → do Ctrl+V

4. **Reload page** (F5) and try again

---

## 🔄 Extension Update

If you modify the extension code:

```bash
# 1. Make your modifications to files
vim popup.js
# or
vim content.js

# 2. Reload the extension in Brave
# Go to brave://extensions/
# Click 🔄 Reload under the extension

# 3. Reload the webpage (F5)

# 4. Test modifications
```

---

## 🚀 Automatic Startup (optional)

To launch whisper automatically at Kali startup:

### Create a systemd service

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

Your extension is now installed and functional with the new v2.0.0 features!

### Quick Summary

```bash
# 1. Start whisper (if not in service)
./start-whisper.sh --exec

# 2. Open Brave and go to Claude.ai (or other)

# 3. Click in the chat field

# 4. Click on the 🎤 extension icon

# 5. Select "French"

# 6. Click "Start recording"

# 7. Speak naturally

# 8. Stay silent 10 seconds → Automatic auto-stop ⚡

# 9. Message automatically sent! ✨
```

---

## 📝 Important Notes v2.0.0

### Auto-stop after 10s of silence
- 🎯 **Advantage**: No need to click "Stop"
- ⚙️ **Adjustable**: Modify `SILENCE_DURATION` in popup.js
- 🎤 **Sensitivity**: Adjust `SILENCE_THRESHOLD` according to your environment

### Automatic ENTER
- 🎯 **Advantage**: Immediate message sending (perfect for Claude.ai)
- ⚙️ **Disableable**: Change `pressEnter: false` in popup.js
- 🛡️ **Security**: Some sites block simulated events (intended)

### Privacy
- 🔒 **100% local**: No data sent to internet
- 🎤 **No storage**: Audio is processed and immediately deleted
- 🌍 **Zero cloud**: Everything stays on your machine

---

## 🆘 Support

**Problems?**
1. Check the terminal where whisper is running (error logs)
2. Open extension console: `brave://extensions/` → Details → Inspect views
3. Open page console: F12 → Console
4. Check README.md for more info

---

**Enjoy your voice interface! 🎤✨**

**Author**: Bruno DELNOZ - bruno.delnoz@protonmail.com  
**Version**: 2.1.0 - 2025-10-31
