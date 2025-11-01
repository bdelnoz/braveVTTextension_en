<!--
============================================================================
Filename       : README.md
Author         : Bruno DELNOZ
Email          : bruno.delnoz@protonmail.com
Full path      : /mnt/data2_78g/Security/scripts/Projects_web/braveVTTextension/README.md
Target usage   : Main documentation for Whisper Local STT extension for Brave
Version        : 2.1.0
Date           : 2025-10-31

CHANGELOG:
-----------
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

# 🎤 Whisper Local STT - Brave Extension

Brave extension for 100% local voice transcription using whisper.cpp. No data is sent to the internet, everything stays on your machine.

**Version 2.1.0** - Complete voice interface with intelligent auto-stop and automatic submission!

---

## ✨ Features

### 🎯 Main Features
- ✅ **Fully local voice transcription** - Zero cloud, zero external API
- ✅ **Auto-stop after 10 seconds of silence** ⚡ NEW v2.0.0
- ✅ **Automatic ENTER** after transcription ⚡ NEW v2.0.0
- ✅ **Support for 9+ languages** (French, English, Spanish, etc.)
- ✅ **Automatic insertion** into any text field
- ✅ **Compatible with complex editors** (Claude.ai, Gmail, WhatsApp Web, etc.)
- ✅ **Simple and fast interface**
- ✅ **Total privacy** - no data sent online

### 🆕 New in v2.0.0

#### 🎤 Intelligent silence detection
- **Auto-stop after 10 seconds** without sound
- **Visual countdown** during recording
- **No need to click** "Stop recording"
- Perfect for long dictations

#### ⏎ Automatic submission
- **Presses ENTER** automatically after insertion
- Ideal for **Claude.ai** - speak and your message is sent!
- Also works on **Google, Gmail, forms**, etc.
- Fluid and natural conversation

---

## 📋 Prerequisites

- **Brave Browser** (or Chromium/Chrome)
- **whisper.cpp** installed and compiled
- **A Whisper model** (tiny, base, small, medium, large)
- **ffmpeg** for audio conversion
- **Kali Linux** (or any Linux distribution)

---

## 🚀 Quick Installation

See **INSTALL.md** file for complete detailed installation.

```bash
# 1. Load the extension in Brave
brave://extensions/
# Developer mode → Load unpacked extension
# Select: /mnt/data2_78g/Security/scripts/Projects_web/braveVTTextension

# 2. Start whisper
cd /mnt/data2_78g/Security/scripts/Projects_web/braveVTTextension
./start-whisper.sh --exec

# 3. Use the extension!
```

---

## 🎯 Usage

### Conversational mode (perfect for Claude.ai)

1. **Open Claude.ai** (or any website)
2. **Click in the chat field**
3. **Click on the extension icon** 🎤
4. **Select "French"** in the dropdown menu
5. **Click "Start recording"**
6. **Speak naturally**: "Hello Claude, explain photosynthesis to me"
7. **Stay silent for 10 seconds** → Automatic auto-stop ⚡
8. **Wait 2-3 seconds** → Transcription
9. ✨ **Message automatically sent to Claude!**

### Dictation mode (for forms, emails, etc.)

1. **Click in a text field**
2. **Record your dictation**
3. **Auto-stop after 10s** of silence
4. Text is inserted and **ENTER is pressed**

### Advanced configuration

#### Disable automatic ENTER
If you don't want the extension to press ENTER automatically, you can modify the `popup.js` file line 461:

```javascript
// Change from:
pressEnter: true

// To:
pressEnter: false
```

Then reload the extension in `brave://extensions/`.

#### Adjust silence delay
Default: 10 seconds. To modify, edit `popup.js` line 43:

```javascript
// 5 seconds
const SILENCE_DURATION = 5000;

// 15 seconds
const SILENCE_DURATION = 15000;
```

---

## 🎨 Use Cases

### 💬 Voice discussion with Claude
```
You: 🎤 "Claude, write me a poem about autumn"
[10 seconds of silence]
→ Automatic transcription
→ Automatic ENTER
→ Claude responds!
```

### 📧 Email writing
```
Gmail → New message
🎤 "Hello John, I'm confirming our meeting tomorrow at 2pm"
→ Auto-stop after silence
→ Text inserted and ready
```

### 🔍 Google searches
```
Google.com → Search bar
🎤 "Paris weather tomorrow"
→ Auto-stop
→ Automatic ENTER
→ Results displayed!
```

### 📝 Note-taking
```
Google Docs / Word Online
🎤 Dictate your long notes
→ Auto-stop when you think
→ Continue when ready
```

---

## ⚙️ Configuration

### Change Whisper model

**Available models** (increasing quality):

| Model | Size | Speed | Quality | Usage |
|-------|------|-------|---------|-------|
| tiny | 75 MB | ⚡⚡⚡⚡⚡ | ⭐⭐ | Quick tests |
| base | 147 MB | ⚡⚡⚡⚡ | ⭐⭐⭐ | Daily usage |
| small | 487 MB | ⚡⚡⚡ | ⭐⭐⭐⭐ | Good compromise |
| medium | 1.5 GB | ⚡⚡ | ⭐⭐⭐⭐⭐ | High quality |
| **large-v3** | **3 GB** | **⚡** | **⭐⭐⭐⭐⭐⭐** | **Recommended** |

To change model, edit `start-whisper.sh` line 14:

```bash
MODEL="models/ggml-large-v3.bin"
```

### Force a language

In the extension interface:
- 🇫🇷 French (recommended for French)
- 🇬🇧 English
- 🇪🇸 Spanish
- 🌍 Auto-detection (may translate)

⚠️ **Important**: Always select "French" to prevent whisper from translating your speech to English!

---

## 🔧 Technical Architecture

### Components

```
Brave Extension (Manifest V3)
├── popup.js (v2.2.0)
│   ├── Audio recording (MediaRecorder)
│   ├── Silence detection (AudioContext + AnalyserNode)
│   ├── Auto-stop after 10s
│   └── Communication with whisper.cpp
│
├── content.js (v2.2.0)
│   ├── Text insertion (3 methods)
│   ├── React/Vue/Angular support
│   ├── ENTER key simulation
│   └── contentEditable compatibility
│
└── whisper.cpp (local server)
    ├── Port 8080
    ├── large-v3 model (3GB)
    └── Automatic audio conversion
```

### Data Flow

```
Microphone → MediaRecorder → AudioContext
                                  ↓
                            Sound analysis
                                  ↓
                    10s silence? → Auto-stop
                                  ↓
                          Audio blob (webm)
                                  ↓
                    whisper.cpp (localhost:8080)
                                  ↓
                            Transcription
                                  ↓
                    Content Script (injection)
                                  ↓
                        Insertion + ENTER
```

---

## 🛠 Troubleshooting

### ❌ "Whisper server unavailable"

**Solution**:
```bash
# Check if whisper is running
curl http://localhost:8080/health

# If no response, start whisper
./start-whisper.sh --exec
```

### ❌ Auto-stop not working

**Possible causes**:
- Too much ambient noise
- Microphone too sensitive

**Solutions**:
1. Increase silence threshold in `popup.js` line 42:
```javascript
const SILENCE_THRESHOLD = 0.02; // Increase to 0.02 or 0.03
```

2. Check microphone level in system settings

### ❌ ENTER not pressing after insertion

**Solutions**:
1. Check browser console (F12) for errors
2. Some sites block simulated keyboard events
3. In this case, text is inserted but you must press ENTER manually

### ❌ Slow transcription with large-v3

**Solutions**:
1. Use a smaller model (medium or small)
2. Increase CPU threads in `start-whisper.sh`:
```bash
--threads 8
```

---

## 📁 Project Structure

```
braveVTTextension/
├── manifest.json          # Manifest V3 configuration
├── popup.html             # User interface
├── popup.js              # Main logic (v2.2.0)
├── content.js            # Text injection (v2.2.0)
├── icon48.png            # 48x48 icon
├── icon96.png            # 96x96 icon
├── start-whisper.sh      # Whisper startup script
├── README.md             # This file (v2.1.0)
└── INSTALL.md            # Detailed installation guide
```

---

## 🔒 Privacy and Security

- ✅ **100% local** - No internet connection required
- ✅ **Zero tracking** - No data collected
- ✅ **Zero cloud** - Everything processed on your machine
- ✅ **Open source** - Fully auditable code
- ✅ **Manifest V3** - Brave's new secure permissions

**Audio data is never**:
- Sent to the internet
- Stored on a server
- Shared with third parties
- Used for AI training

---

## 🤝 Contribution

Contributions are welcome! Feel free to:
- Open an issue to report a bug
- Propose improvements
- Submit a pull request

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
- Open an issue on GitHub

---

## 🎯 Roadmap

### Planned future features
- [ ] Support for more languages
- [ ] Customizable keyboard shortcuts
- [ ] Continuous dictation mode (no time limit)
- [ ] Transcription history
- [ ] Export transcriptions
- [ ] Multi-microphone support
- [ ] Advanced settings in interface

---

**Privacy note**: This extension collects no data. All audio processing is done locally on your machine. No data is sent to the internet.

**Author**: Bruno DELNOZ - bruno.delnoz@protonmail.com
**Version**: 2.1.0 - 2025-10-31
