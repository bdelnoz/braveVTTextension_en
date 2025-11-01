<!--
============================================================================
Filename       : README.md
Author         : Bruno DELNOZ
Email          : bruno.delnoz@protonmail.com
Version        : 3.0.0
Date           : 2025-11-01

CHANGELOG:
-----------
v3.0.0 - 2025-11-01
  - Complete rewrite for floating widget architecture
  - Native Messaging Host documentation
  - Model selection feature documentation
  - Updated installation instructions
  - New UI/UX documentation

v2.1.0 - 2025-10-31
  - Full English translation of documentation
  - Updated all examples and use cases
  - Maintained all original features and structure

v2.0.0 - 2025-10-31
  - Documentation of new v2.0.0 features
  - Added auto-stop after 10s of silence section
  - Added automatic ENTER section
  - Updated usage examples
  - Added header with versioning

v1.0.0 - 2025-10-31
  - Initial extension documentation
  - Installation and configuration
  - Basic usage
  - Troubleshooting
============================================================================
-->

# 🎤 Whisper Local STT - Brave Extension v3.0.0

Brave extension for 100% local voice transcription using whisper.cpp. No data is sent to the internet, everything stays on your machine.

**Version 3.0.0** - Complete floating widget with dynamic model selection!

---

## ✨ Features v3.0.0

### 🎯 Main Features
- ✅ **Floating widget** - Always visible on all pages, never closes
- ✅ **Dynamic model selection** - Switch Whisper models on-the-fly
- ✅ **Server status monitoring** - Real-time connection status
- ✅ **Draggable & minimizable** - Position it anywhere, minimize when not needed
- ✅ **Fully local voice transcription** - Zero cloud, zero external API
- ✅ **Auto-stop after silence** - Configurable 5s to 30s
- ✅ **Automatic ENTER** - Message sent automatically after transcription
- ✅ **Support for 9+ languages** - French, English, Spanish, etc.
- ✅ **Automatic insertion** - Into any text field
- ✅ **Compatible with complex editors** - Claude.ai, Gmail, WhatsApp Web, etc.
- ✅ **Total privacy** - No data sent online

### 🆕 New in v3.0.0

#### 🎪 Floating Widget
- Always visible on **all web pages**
- **Never closes** when you click elsewhere
- **Draggable** - move it anywhere you want
- **Minimizable** - small 🎤 icon when minimized
- **Position remembered** - reopens where you left it

#### 🤖 Model Selection
- **See current model** running on server
- **Switch models** directly from widget (tiny, base, small, medium, large-v3)
- **Automatic restart** - Whisper server restarts with selected model
- **No terminal needed** - everything from the UI

#### 🟢 Server Status
- **Real-time monitoring** - connection status every 3 seconds
- 🟢 **Connected** (model name) - Ready to record
- 🔴 **Disconnected** - Server not running
- 🟡 **Restarting...** - Model switch in progress

---

## 📋 Prerequisites

- **Brave Browser** (or Chromium/Chrome)
- **whisper.cpp** installed and compiled
- **Multiple Whisper models** (optional but recommended)
- **ffmpeg** for audio conversion
- **Kali Linux** (or any Linux distribution)

---

## 🚀 Quick Installation

### Step 1: Load Extension

```bash
# 1. Open Brave
brave://extensions/

# 2. Enable "Developer mode" (top right)

# 3. Click "Load unpacked"

# 4. Select folder: /path/to/braveVTTextension
```

### Step 2: Install Native Messaging Host

**This step is REQUIRED for model selection feature!**

```bash
cd /path/to/braveVTTextension

# Run installer (interactive)
./install.sh --install-native

# It will:
# - Detect your browser (Brave/Chrome/Chromium)
# - Ask for your extension ID
# - Install the Native Host
# - Configure everything automatically
```

**How to find Extension ID:**
1. Go to `brave://extensions/`
2. Find "Whisper Local STT - Brave - En"
3. Copy the long ID (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

### Step 3: Start Whisper Server

```bash
cd /path/to/braveVTTextension
./start-whisper.sh --exec

# Or with specific model:
./start-whisper.sh --exec --model ggml-large-v3.bin
```

### Step 4: Use the Widget!

1. Open any webpage (e.g., claude.ai)
2. You'll see the **floating widget** in bottom-right corner
3. Widget shows:
   - 🟢 Server status
   - 🤖 Current model
   - 🇫🇷 Language selector
   - ⏱️ Delay selector
   - 🎤 START button

---

## 🎯 Usage

### Conversational Mode (Claude.ai)

1. **Open Claude.ai**
2. **Click in chat field**
3. **Widget is already visible** (no need to click extension icon!)
4. **Select language**: French
5. **Select delay**: 10 seconds
6. **Click START** 🎤
7. **Speak**: "Hello Claude, explain quantum physics"
8. **Stay silent 10s** → Auto-stop ⚡
9. ✨ **Message automatically sent!**

### Changing Whisper Model

1. **Open widget**
2. **Click model dropdown** 🤖
3. **Select new model** (e.g., large-v3)
4. **Wait 5-15 seconds** → 🟡 Restarting...
5. **Done!** → 🟢 Connected (large-v3)

No need to touch the terminal! 🎉

### Dragging the Widget

- **Click and hold** on the title bar "🎤 Whisper STT"
- **Drag** to desired position
- **Release** - position is saved automatically
- Widget will reopen at same position next time!

### Minimizing the Widget

- **Click [─] button** in top-right
- Widget becomes small 🎤 icon
- **Click icon** to expand again

---

## ⚙️ Configuration

### Available Models

| Model | Size | Speed | Quality | Recommendation |
|-------|------|-------|---------|----------------|
| tiny | 75 MB | ⚡⚡⚡⚡⚡ | ⭐⭐ | Quick tests |
| base | 147 MB | ⚡⚡⚡⚡ | ⭐⭐⭐ | Daily usage |
| small | 487 MB | ⚡⚡⚡ | ⭐⭐⭐⭐ | Good balance |
| medium | 1.5 GB | ⚡⚡ | ⭐⭐⭐⭐⭐ | High quality |
| **large-v3** | **3 GB** | **⚡** | **⭐⭐⭐⭐⭐⭐** | **Best** |

Switch models directly from widget dropdown! 🎯

### Auto-stop Delays

- **5 seconds** - Fast dictation
- **10 seconds** - Default, good for most uses
- **15 seconds** - Longer thinking time
- **20 seconds** - Long dictation
- **30 seconds** - Very long dictation

Change from widget dropdown! ⏱️

### Languages

- 🇫🇷 French
- 🇬🇧 English
- 🇪🇸 Spanish
- 🇩🇪 German
- 🇮🇹 Italian
- 🇵🇹 Portuguese
- 🇳🇱 Dutch
- 🇸🇦 Arabic
- 🌍 Auto-detection

⚠️ **Always select your language** to avoid auto-translation!

---

## 🔧 Technical Architecture v3.0.0

### Components

```
Extension (Manifest V3)
├── content-widget.js (v3.0.0)
│   ├── Floating widget UI
│   ├── Audio recording (MediaRecorder)
│   ├── Silence detection (AudioContext)
│   ├── Drag & drop
│   ├── Transcription
│   └── Text insertion
│
├── background.js (v3.0.0)
│   └── Native Messaging relay
│
├── widget-style.css (v3.0.0)
│   └── Widget styles
│
└── Native Messaging Host
    ├── whisper-control.sh
    │   ├── List models
    │   ├── Switch model
    │   └── Get status
    │
    └── whisper.cpp server
        ├── Port 8080
        └── Selected model
```

### Data Flow

```
User clicks START
       ↓
MediaRecorder → AudioContext → Silence detection
       ↓
Auto-stop after 10s silence
       ↓
Audio blob (webm) → Whisper server (localhost:8080)
       ↓
Transcription → Content Widget
       ↓
Insert text + Press ENTER
       ↓
Done! ✅
```

### Model Switching Flow

```
User selects new model in dropdown
       ↓
content-widget.js → background.js → Native Host
       ↓
whisper-control.sh:
  1. Kill whisper-server
  2. Start with new model
  3. Wait for ready
       ↓
background.js → content-widget.js
       ↓
Widget shows: 🟢 Connected (new-model)
```

---

## 🛠 Troubleshooting

### ❌ "Whisper server unavailable"

**Solution**:
```bash
# Check if whisper is running
curl http://localhost:8080/health

# If no response, start it
./start-whisper.sh --exec
```

### ❌ Widget not appearing

**Solutions**:
1. Check extension is loaded: `brave://extensions/`
2. Reload the extension (🔄 button)
3. Reload the webpage (F5)
4. Check browser console (F12) for errors

### ❌ Model selection doesn't work

**Cause**: Native Messaging Host not installed

**Solution**:
```bash
# Install Native Host
./install.sh --install-native

# Then restart Brave completely
```

### ❌ Model switch stays at "Restarting..."

**Causes**:
- Model file doesn't exist
- Whisper server failed to start
- Port 8080 already in use

**Solutions**:
```bash
# 1. Check models available
./start-whisper.sh --listmodel

# 2. Check logs
tail -f /tmp/whisper-control.log
tail -f /tmp/whisper-server.log

# 3. Kill all whisper processes and restart
pkill -f whisper-server
./start-whisper.sh --exec --model ggml-medium.bin
```

### ❌ Widget is in the way

**Solutions**:
- **Drag it** to another corner
- **Minimize it** (click [─])
- **Position is saved** automatically

---

## 📁 Project Structure v3.0.0

```
braveVTTextension/
├── manifest.json          # v3.0.0 - Native Messaging
├── content-widget.js      # v3.0.0 - Floating widget
├── widget-style.css       # v3.0.0 - Widget styles
├── background.js          # v3.0.0 - Service worker
├── whisper-control.sh     # v3.0.0 - Native Host
├── com.whisper.control.json  # Native Host manifest
├── install-native-host.sh # Native Host installer
├── install.sh             # v3.0.0 - Main installer
├── start-whisper.sh       # v3.0.0 - Server launcher
├── icon48.png             # Icon
├── icon96.png             # Icon
├── README.md              # This file (v3.0.0)
├── INSTALL.md             # Installation guide (v3.0.0)
└── CHANGELOG.md           # Version history (v3.0.0)
```

---

## 🔒 Privacy and Security

- ✅ **100% local** - No internet connection required
- ✅ **Zero tracking** - No data collected
- ✅ **Zero cloud** - Everything processed on your machine
- ✅ **Open source** - Fully auditable code
- ✅ **Manifest V3** - Latest security standards

**Audio data is never**:
- Sent to the internet
- Stored on a server
- Shared with third parties
- Used for AI training

**Native Messaging Host**:
- Only communicates with this extension
- Only controls local whisper server
- No network access
- Fully auditable bash script

---

## 🆚 v3.0.0 vs v2.x

| Feature | v2.x | v3.0.0 |
|---------|------|--------|
| Interface | Popup (closes) | Floating widget (stays) |
| Model selection | Terminal only | Widget dropdown ✨ |
| Position | Fixed | Draggable ✨ |
| Minimizable | No | Yes ✨ |
| Server status | Manual check | Real-time ✨ |
| Architecture | Popup-based | Widget + Native Host |

**Migration**: No data loss, just better UX! 🎉

---

## 🤝 Contribution

Contributions are welcome! To contribute:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

[To be defined - MIT, GPL, Apache, etc.]

---

## 🙏 Acknowledgments

- [whisper.cpp](https://github.com/ggerganov/whisper.cpp) by Georgi Gerganov
- [OpenAI Whisper](https://github.com/openai/whisper) for the model
- The Brave community for extension support

---

## 📞 Support

For any questions or issues:
- Check **INSTALL.md** for installation
- Review the **Troubleshooting** section above
- Check logs: `/tmp/whisper-control.log` and `/tmp/whisper-server.log`
- Open an issue on GitHub

---

## 🎯 Roadmap

### Planned for v3.1.0
- [ ] Keyboard shortcuts (e.g., Ctrl+Shift+M to start/stop)
- [ ] Multiple microphone selection
- [ ] Custom widget themes
- [ ] Recording history

### Planned for v4.0.0
- [ ] Continuous dictation mode (no time limit)
- [ ] Export transcriptions (TXT, JSON)
- [ ] Usage statistics
- [ ] Multi-language support in same recording

---

**Privacy note**: This extension collects no data. All audio processing is done locally on your machine. No data is sent to the internet.

**Author**: Bruno DELNOZ - bruno.delnoz@protonmail.com  
**Version**: 3.0.0 - 2025-11-01  
**License**: [To be defined]
