<!--
============================================================================
Filename       : CHANGELOG.md
Author         : Bruno DELNOZ
Email          : bruno.delnoz@protonmail.com
Version        : 3.0.1
Date           : 2025-11-02
============================================================================
-->

# 📋 Changelog - Whisper Local STT for Brave

Complete history of all extension versions.

---

## Version 3.0.1 - 2025-11-02

### 🐛 Bug Fixes

#### Text Insertion Fixed ✅
**Problem:** Widget couldn't find active text field, transcribed text was never inserted.

**Solution:** 
- Added `lastFocusedElement` tracking
- Added `focusin` event listener (tracks all focus events)
- Added `click` event listener on editable elements
- Improved fallback chain: lastFocusedElement → activeElement → clipboard
- Better console logging for debugging

**Impact:** Text insertion now works reliably! Users must click in field before recording.

#### Widget Size Reduced ✅
**Problem:** Widget occupied too much screen space (350px width).

**Solution:**
- Widget width: 350px → **280px** (-20%)
- Minimized size: 70x70px → **50x50px** (-28%)
- All font sizes reduced by 1-2px
- All padding reduced proportionally
- More compact design overall

**Impact:** Widget takes ~20% less screen space.

### 📝 Documentation
- Updated README.md with v3.0.1 fixes
- Updated INSTALL.md with "click in field first" instructions
- Added troubleshooting for v3.0.1
- Documented known issues

### ⚠️ Known Issues v3.0.1
- **Widget drag not working** - Will be fixed in v3.0.2
- **Model switching may fail** - If Native Host not configured

### 📊 Stats
- Files changed: 2 (content-widget.js, widget-style.css)
- Lines added: ~30
- Lines modified: ~50
- Critical bugs fixed: 2

---

## Version 3.0.0 - 2025-11-01

### 🎯 MAJOR RELEASE - Floating Widget Architecture

Complete architectural redesign from popup-based to floating widget.

#### 🆕 New Features

##### Floating Widget System
- **Always-visible widget** on all web pages
- **Never closes** when clicking elsewhere
- **Draggable interface** (broken in v3.0.1)
- **Minimizable** to small 🎤 icon (70x70px)
- **Position memory** per domain
- **Semi-transparent** when not active
- **Smooth animations**

##### Dynamic Model Selection 🤖
- **Real-time model detection**
- **Model dropdown** with all available models
- **One-click model switching**
- **Automatic server restart** with selected model
- **Visual feedback** during model switch
- **Models auto-detected** from whisper.cpp/models

##### Server Status Monitoring 🟢
- **Real-time connection check** every 3 seconds
- **Visual status indicator**:
  - 🟢 Connected (model-name)
  - 🔴 Disconnected
  - 🟡 Restarting...
- **START button disabled** when disconnected

##### Native Messaging Host
- **whisper-control.sh** - Bash script for server control
- **List models** action
- **Switch model** action
- **Get status** action
- **JSON protocol** via stdin/stdout
- **Error handling** and timeout management
- **Logging** to /tmp/whisper-control.log

##### Improved Configuration
- **Language selector** in widget (9 languages)
- **Delay selector** (5s to 30s options)
- **All preferences saved** to localStorage
- **Per-domain preferences** (position, minimized state)
- **Global preferences** (language, delay)

#### 🔧 Technical Changes

##### Architecture
- **Removed** popup.html/popup.js
- **Added** content-widget.js (600+ lines)
- **Added** widget-style.css (300+ lines)
- **Added** background.js (Service worker)
- **Modified** manifest.json (Native Messaging)

##### Files Added
- `content-widget.js` - Floating widget
- `widget-style.css` - Widget styles
- `background.js` - Service worker
- `whisper-control.sh` - Native Host
- `com.whisper.control.json` - Native Host manifest
- `install-native-host.sh` - Installer

##### Files Modified
- `manifest.json` v3.0.0
- `install.sh` v3.0.0
- `start-whisper.sh` v3.0.0
- `README.md` v3.0.0
- `INSTALL.md` v3.0.0
- `CHANGELOG.md` v3.0.0

##### Files Removed
- ❌ `popup.html`
- ❌ `popup.js`
- ❌ `content.js` (merged into content-widget.js)

##### Code Statistics
- **New lines**: ~1500
- **Total files**: 14
- **Languages**: JavaScript, CSS, Bash, JSON, Markdown

#### 📚 Documentation
- Complete README rewrite
- New INSTALL guide with Native Host
- Detailed CHANGELOG
- MIGRATION_GUIDE_v3.0.0.md

#### ⚡ Performance
- Widget renders once per page
- Efficient status checking (3s intervals)
- Optimized drag & drop
- Lazy loading of models list

#### 🔒 Security
- Native Host restricted to extension ID
- No eval() or unsafe-inline
- Manifest V3 compliance
- CSP-friendly code

#### 🎨 UI/UX
- Modern gradient design
- Smooth transitions
- Clear visual feedback
- Accessibility support
- Responsive design
- High contrast mode support

---

## Version 2.1.0 - 2025-10-31

### 📝 Documentation Translation
- Full English translation of all documentation
- Updated README.md
- Translated CHANGELOG.md
- Updated INSTALL.md
- Maintained all original features

---

## Version 2.0.0 - 2025-10-31

### 🎯 Major Features

#### Intelligent Auto-stop (10s silence)
- Real-time silence detection (AudioContext + AnalyserNode)
- Automatic auto-stop after 10 seconds
- Visual countdown in interface
- Adjustable configuration (SILENCE_THRESHOLD, SILENCE_DURATION)
- No need to click "Stop recording"

#### Automatic ENTER
- ENTER key simulation after text insertion
- Automatic message sending (Claude.ai, Google, etc.)
- Complete keyboard events (keydown, keypress, keyup)
- Compatible with React, Vue, Angular
- Disableable via pressEnter parameter

### 🔧 Technical Improvements

#### popup.js v2.0.0
- Added AudioContext for audio analysis
- Added AnalyserNode for sound detection
- RMS calculation for volume measurement
- Check interval every 100ms
- Clean resource cleanup
- Detailed logging
- Complete header with versioning

#### content.js v2.0.0
- New simulateEnterKey() function
- Complete keyboard event simulation
- Form support with submit trigger
- 50ms delay before simulation
- 3 insertion methods with fallback
- Improved React editor compatibility
- Complete header with versioning

### 📚 Documentation

#### README.md v2.0.0
- Complete feature documentation
- Dedicated auto-stop/ENTER sections
- Usage examples with Claude.ai
- Configuration instructions
- Header with versioning

#### INSTALL.md v2.0.0
- Updated installation guide
- v2.0.0 conversational mode instructions
- Troubleshooting for auto-stop/ENTER
- Configuration examples

#### CHANGELOG.md v2.0.0
- Created dedicated changelog file
- Complete version history

### 🎨 User Interface
- Countdown display during recording
- Improved status messages
- Visual state indicators

### 🔒 Security
- Clean AudioContext permissions
- Resource cleanup on stop
- Chromium compatibility maintained
- Respect for site security restrictions

---

## Version 1.0.0 - 2025-10-31

### 🎯 Initial Version

#### Basic Features
- Connection to local whisper.cpp server (port 8080)
- Audio recording via MediaRecorder API
- Transcription via whisper.cpp (9+ languages)
- Automatic text insertion into active fields
- Simple and intuitive UI

#### Components

**manifest.json v1.0.0**
- Manifest V3 configuration
- Permissions: activeTab, scripting
- Host permissions: localhost:8080
- Content scripts on all pages

**popup.html v1.0.0**
- Purple gradient design
- "Test connection" button
- "Start/Stop recording" button
- Language selector (9 languages)
- Animated recording indicator
- Privacy message

**popup.js v1.0.0**
- Audio recording management
- Whisper server communication
- Audio sending for transcription
- Text injection via content script
- Error handling + clipboard fallback

**content.js v1.0.0**
- Message listening from popup
- Input/textarea insertion
- ContentEditable insertion
- Nearby editable elements search
- React/Vue/Angular event triggering
- Support for Gmail, WhatsApp Web, forms

**start-whisper.sh v1.0.0**
- Automated server startup script
- Prerequisites verification
- LD_LIBRARY_PATH configuration
- large-v3 model support by default
- --convert option for audio conversion
- Port conflict handling

#### Supported Languages
- French 🇫🇷
- English 🇬🇧
- Spanish 🇪🇸
- German 🇩🇪
- Italian 🇮🇹
- Portuguese 🇵🇹
- Dutch 🇳🇱
- Arabic 🇸🇦
- Auto-detection 🌍

#### Supported Whisper Models
- tiny (75 MB)
- base (147 MB)
- small (487 MB)
- medium (1.5 GB)
- large-v3 (3 GB) - Recommended

#### Documentation v1.0.0
- Complete README.md
- INSTALL.md step-by-step guide
- Troubleshooting instructions
- Usage examples

#### Security and Privacy
- 100% local processing
- No tracking or data collection
- Auditable open source code
- Manifest V3 with minimal permissions

**Audio data is never:**
- Sent to internet
- Stored on server
- Shared with third parties
- Used for AI training

---

## 🔮 Future Roadmap

### Planned for v3.0.2
- [ ] Fix widget drag functionality
- [ ] Improve Native Host error messages
- [ ] Better focus detection edge cases

### Planned for v3.1.0
- [ ] Global keyboard shortcuts (Ctrl+Shift+M)
- [ ] Multiple microphone selection
- [ ] Custom widget themes
- [ ] Recording history with playback

### Planned for v3.2.0
- [ ] Continuous dictation mode (no time limit)
- [ ] Export transcriptions (TXT, JSON, CSV)
- [ ] Usage statistics
- [ ] Multiple concurrent recordings

### Planned for v4.0.0
- [ ] WebGPU support for faster transcription
- [ ] Multi-language in same recording
- [ ] Real-time streaming transcription
- [ ] Voice commands for browser control
- [ ] Integration with more AI assistants

### Additional Languages
- [ ] Support for all 99 Whisper languages
- [ ] Improved automatic detection
- [ ] Regional accent support

---

## 📊 Version Statistics

| Version | Date | Files | Lines of Code | New Features | Bug Fixes |
|---------|------|-------|---------------|--------------|-----------|
| 1.0.0 | 2025-10-31 | 7 | ~800 | 5 | - |
| 2.0.0 | 2025-10-31 | 9 | ~1200 | +2 | 0 |
| 2.1.0 | 2025-10-31 | 9 | ~1200 | 0 | 0 |
| **3.0.0** | **2025-11-01** | **14** | **~2700** | **+8** | **0** |
| **3.0.1** | **2025-11-02** | **14** | **~2730** | **0** | **+2** |

---

## 🤝 Contributions

All contributions are welcome! To contribute:

1. Fork the project
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

**Coding standards:**
- Follow existing code style
- Add comments for complex logic
- Update documentation
- Test thoroughly before PR
- Version all modified files

---

## 📄 License

[To be defined - MIT, GPL, Apache, etc.]

---

**Author**: Bruno DELNOZ - bruno.delnoz@protonmail.com  
**Project**: Whisper Local STT - Brave Extension  
**Current Version**: 3.0.1  
**Last Update**: 2025-11-02

---

**Thank you for using Whisper Local STT!** 🎤✨

For questions, issues, or suggestions, please open an issue on GitHub.
