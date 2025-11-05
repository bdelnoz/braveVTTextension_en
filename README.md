<!--
============================================================================
Filename       : README.md
Author         : Bruno DELNOZ
Email          : bruno.delnoz@protonmail.com
Version        : 3.0.1
Date           : 2025-11-02

CHANGELOG:
-----------
v3.0.1 - 2025-11-02
  - Updated for bug fixes (insertion + size)
  - Added known issues section
  - Minor corrections

v3.0.0 - 2025-11-01
  - Complete rewrite for floating widget architecture
  - Native Messaging Host documentation
  - Model selection feature documentation
  - Updated installation instructions
  - New UI/UX documentation
============================================================================
-->

# 🎤 Whisper Local STT - Brave Extension v3.0.1

Brave extension for 100% local voice transcription using whisper.cpp. No data is sent to the internet, everything stays on your machine.

**Version 3.0.1** - Bug fixes for text insertion and widget size!

---

## ✨ Features v3.0.1

### 🎯 Main Features
- ✅ **Floating widget** - Always visible on all pages, never closes
- ✅ **Text insertion fixed** - Now correctly detects focused fields
- ✅ **Compact size** - Reduced widget footprint (280px width)
- ✅ **Dynamic model selection** - Switch Whisper models on-the-fly
- ✅ **Server status monitoring** - Real-time connection status
- ✅ **Minimizable** - Reduces to small 🎤 icon (50x50px)
- ✅ **Fully local voice transcription** - Zero cloud, zero external API
- ✅ **Auto-stop after silence** - Configurable 5s to 30s
- ✅ **Automatic ENTER** - Message sent automatically after transcription
- ✅ **Support for 9+ languages** - French, English, Spanish, etc.
- ✅ **Compatible with complex editors** - Claude.ai, Gmail, WhatsApp Web, etc.
- ✅ **Total privacy** - No data sent online

### 🐛 Fixed in v3.0.1

- ✅ **Text insertion now works** - Added focus tracking on all clicks
- ✅ **Widget size reduced** - 350px → 280px (-20%)
- ✅ **Minimized size reduced** - 70x70px → 50x50px (-28%)

### ⚠️ Known Issues v3.0.1

- ❌ **Widget drag not working** - Will be fixed in v3.0.2
- ⚠️ **Model switching** - May fail if Native Host not configured

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

### Step 2: Install Native Messaging Host (Optional)

**Only needed for model selection feature!**

```bash
cd /path/to/braveVTTextension

# Run installer (interactive)
./install.sh --install-native

# Follow prompts:
# - Browser: Brave
# - Extension ID: [copy from brave://extensions/]
```

### Step 3: Start Whisper Server

```bash
cd /path/to/braveVTTextension
./start-whisper.sh --exec

# Or with specific model:
./start-whisper.sh --exec --model ggml-large-v3.bin
```

### Step 4: Use the Widget!

1. Open any webpage (e.g., claude.ai)
2. Widget appears automatically in bottom-right corner
3. **Click in a text field FIRST** (important!)
4. Click START in widget
5. Speak naturally
6. Auto-stop after 10s silence
7. Text inserts automatically! ✨

---

## 🎯 Usage

### Conversational Mode (Claude.ai)

1. **Open Claude.ai**
2. **Widget is already visible**
3. **Click in chat field** ← Important!
4. **Select language**: French
5. **Select delay**: 10 seconds
6. **Click START** 🎤
7. **Speak**: "Hello Claude, explain quantum physics"
8. **Stay silent 10s** → Auto-stop ⚡
9. ✨ **Message automatically sent!**

### Important v3.0.1 Note

⚠️ **Always click in the text field BEFORE starting recording!**

The widget tracks your last clicked field to insert text correctly.

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

## 🛠 Troubleshooting v3.0.1

### ❌ Text not inserting

**Solution v3.0.1:**
```
1. Click in the text field FIRST
2. THEN click START in widget
3. The widget now tracks your click!
```

**Check console (F12):**
```
Should see:
[Whisper Widget] Focus tracked: INPUT
[Whisper Widget] Click tracked: TEXTAREA
[Whisper Widget] Using lastFocusedElement: INPUT
```

### ❌ Widget too large

**Fixed in v3.0.1!** Hard reload if still shows old size:
```
Ctrl+Shift+R (multiple times)
```

### ❌ Cannot drag widget

**Known issue in v3.0.1** - Will be fixed in v3.0.2.

Workaround: Widget position is saved automatically.

### ❌ Model switching doesn't work

**Cause:** Native Host not installed

**Solution:**
```bash
./install.sh --install-native
# Then restart Brave completely
```

---

## 🔧 Technical Architecture v3.0.1

### Components

```
Extension (Manifest V3)
├── content-widget.js (v3.0.1)
│   ├── Floating widget UI
│   ├── Focus tracking (NEW!)
│   ├── Audio recording
│   ├── Silence detection
│   └── Text insertion (FIXED!)
│
├── widget-style.css (v3.0.1)
│   └── Reduced sizes (NEW!)
│
├── background.js (v3.0.0)
│   └── Native Messaging relay
│
└── Native Messaging Host
    ├── whisper-control.sh
    └── whisper.cpp server
```

---

## 🔒 Privacy and Security

- ✅ **100% local** - No internet connection required
- ✅ **Zero tracking** - No data collected
- ✅ **Zero cloud** - Everything processed on your machine
- ✅ **Open source** - Fully auditable code
- ✅ **Manifest V3** - Latest security standards

**Audio data is never:**
- Sent to the internet
- Stored on a server
- Shared with third parties
- Used for AI training

---

## 🆚 Version History

| Version | Date | Changes |
|---------|------|---------|
| 3.0.1 | 2025-11-02 | Fixed insertion, reduced size |
| 3.0.0 | 2025-11-01 | Floating widget architecture |
| 2.1.0 | 2025-10-31 | English translation |
| 2.0.0 | 2025-10-31 | Auto-stop + automatic ENTER |
| 1.0.0 | 2025-10-31 | Initial release |

---

## 🤝 Contribution

Contributions are welcome! To contribute:

1. Fork the project
2. Create a feature branch
3. Commit changes
4. Push to branch
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

### v3.0.2 (next)
- [ ] Fix widget drag functionality
- [ ] Improve Native Host error messages
- [ ] Better focus detection edge cases

### v3.1.0
- [ ] Keyboard shortcuts (e.g., Ctrl+Shift+M)
- [ ] Multiple microphone selection
- [ ] Custom widget themes
- [ ] Recording history

---

**Privacy note**: This extension collects no data. All audio processing is done locally on your machine. No data is sent to the internet.

**Author**: Bruno DELNOZ - bruno.delnoz@protonmail.com  
**Version**: 3.0.1 - 2025-11-02  
**License**: [To be defined]
