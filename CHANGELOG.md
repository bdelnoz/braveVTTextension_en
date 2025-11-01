<!--
============================================================================
Filename       : CHANGELOG.md
Author         : Bruno DELNOZ
Email          : bruno.delnoz@protonmail.com
Version        : 3.0.0
Date           : 2025-11-01
============================================================================
-->

# 📋 Changelog - Whisper Local STT for Brave

Complete history of all extension versions.

---

## Version 3.0.0 - 2025-11-01

### 🎯 MAJOR RELEASE - Floating Widget Architecture

This is a **complete architectural redesign** of the extension, moving from popup-based to floating widget with Native Messaging integration.

#### 🆕 New Features

##### Floating Widget System
- **Always-visible widget** on all web pages
- **Never closes** when clicking elsewhere (no more frustration!)
- **Draggable interface** - position it anywhere you want
- **Minimizable** to small 🎤 icon (70x70px)
- **Position memory** - widget reopens where you left it (per domain)
- **Semi-transparent** when not active (opacity 0.95)
- **Smooth animations** - fade in, hover effects, pulse during recording

##### Dynamic Model Selection 🤖
- **Real-time model detection** - see which model is currently running
- **Model dropdown** with all available models (tiny, base, small, medium, large-v3)
- **One-click model switching** - no need to touch terminal!
- **Automatic server restart** with selected model
- **Visual feedback** during model switch (🟡 Restarting...)
- **Models auto-detected** from whisper.cpp/models directory

##### Server Status Monitoring 🟢
- **Real-time connection check** every 3 seconds
- **Visual status indicator**:
  - 🟢 Connected (model-name) - Ready to use
  - 🔴 Disconnected - Server not running
  - 🟡 Restarting... - Model switch in progress
- **START button disabled** when disconnected (prevents errors)

##### Native Messaging Host
- **whisper-control.sh** - Bash script for server control
- **List models** action - returns all available models
- **Switch model** action - kills and restarts server with new model
- **Get status** action - checks server health
- **JSON protocol** via stdin/stdout
- **Error handling** and timeout management (15s max)
- **Logging** to /tmp/whisper-control.log

##### Improved Configuration
- **Language selector** - 9 languages available in widget
- **Delay selector** - 5s, 10s, 15s, 20s, 30s options
- **All preferences saved** to localStorage
- **Preferences per domain** (position, minimized state)
- **Global preferences** (language, delay)

#### 🔧 Technical Changes

##### Architecture
- **Removed popup.html/popup.js** - No longer needed
- **Added content-widget.js** (new main component, 600+ lines)
- **Added widget-style.css** (complete styling, 300+ lines)
- **Added background.js** - Service worker for Native Messaging relay
- **Modified manifest.json** - Added nativeMessaging permission, removed popup

##### Files Added
- `content-widget.js` - Floating widget implementation
- `widget-style.css` - Widget styles
- `background.js` - Service worker
- `whisper-control.sh` - Native Messaging Host
- `com.whisper.control.json` - Native Host manifest
- `install-native-host.sh` - Automated Native Host installer

##### Files Modified
- `manifest.json` - v3.0.0 with Native Messaging
- `install.sh` - v3.0.0 with Native Host support
- `start-whisper.sh` - v3.0.0 (version bump only)
- `README.md` - v3.0.0 complete rewrite
- `INSTALL.md` - v3.0.0 with Native Host guide
- `CHANGELOG.md` - v3.0.0 this file

##### Files Removed
- ❌ `popup.html` - Replaced by floating widget
- ❌ `popup.js` - Replaced by content-widget.js

##### Code Statistics
- **New lines**: ~1500
- **Total files**: 14
- **Languages**: JavaScript, CSS, Bash, JSON, Markdown

#### 📚 Documentation
- **Complete README rewrite** for v3.0.0
- **New INSTALL guide** with Native Host installation
- **Updated CHANGELOG** with detailed v3.0.0 info
- **All files versioned** to v3.0.0

#### 🐛 Bug Fixes
- Fixed ENTER simulation issues from v2.x
- Fixed audio context cleanup on stop
- Fixed widget z-index conflicts
- Fixed position saving edge cases

#### ⚡ Performance
- Widget renders once per page (not on every popup open)
- Efficient status checking (3s intervals, not continuous)
- Optimized drag & drop (requestAnimationFrame)
- Lazy loading of models list

#### 🔒 Security
- Native Host restricted to extension ID
- No eval() or unsafe-inline
- Manifest V3 compliance
- CSP-friendly code

#### 🎨 UI/UX Improvements
- **Modern gradient design** (same as v2.x popup)
- **Smooth transitions** and hover effects
- **Clear visual feedback** for all actions
- **Accessibility support** (keyboard navigation, ARIA labels)
- **Responsive design** (works on all screen sizes)
- **High contrast mode** support
- **Reduced motion** support for accessibility

---

## Version 2.1.0 - 2025-10-31

### 📝 Documentation Translation
- **Full English translation** of all documentation files
- **Updated README.md** with English content
- **Translated CHANGELOG.md** to English
- **Updated INSTALL.md** with English instructions
- **Maintained all original features** and structure

---

## Version 2.0.0 - 2025-10-31

### 🎯 Major Features

#### Intelligent auto-stop after 10 seconds of silence
- **Added real-time silence detection** with AudioContext and AnalyserNode
- **Automatic auto-stop** after 10 seconds without detected sound
- **Visual countdown** in interface ("auto-stop in 10s... 9s... 8s...")
- **Adjustable configuration** via SILENCE_THRESHOLD and SILENCE_DURATION
- **No need to click** "Stop recording"

#### Automatic ENTER after insertion
- **ENTER key simulation** after transcribed text insertion
- **Automatic message sending** (perfect for Claude.ai, Google, etc.)
- **Complete keyboard events** (keydown, keypress, keyup)
- **Compatible** with React, Vue, Angular and standard forms
- **Disableable option** via pressEnter parameter

### 🔧 Technical Improvements

#### popup.js v2.0.0
- Added AudioContext for real-time audio analysis
- Added AnalyserNode for sound level detection
- RMS (Root Mean Square) calculation for accurate volume measurement
- Check interval every 100ms
- Clean AudioContext resource cleanup
- Detailed logs for debugging ([Whisper STT])
- Complete header with author, version, changelog
- Comprehensive comments throughout code

#### content.js v2.0.0
- New simulateEnterKey() function
- Complete keyboard event simulation (keydown, keypress, keyup)
- Form support with submit trigger if appropriate
- 50ms delay before simulation to ensure complete insertion
- 3 insertion methods with automatic fallback
- Improved compatibility with complex React editors
- Complete header with versioning
- Detailed comments for each function

### 📚 Documentation

#### README.md v2.0.0
- Complete documentation of new features
- Dedicated section for auto-stop and automatic ENTER
- Usage examples with Claude.ai
- Detailed use cases (conversation, dictation, search)
- Instructions for configuring new parameters
- Header with versioning

#### INSTALL.md v2.0.0
- Updated installation guide
- Instructions for using v2.0.0 conversational mode
- Troubleshooting section for auto-stop and ENTER
- Silence delay configuration
- Sensitivity configuration
- Disabling automatic ENTER if desired

#### CHANGELOG.md v2.0.0
- Created dedicated changelog file
- Complete history of all versions

### 🎨 User Interface
- Display of countdown during recording
- Improved message: "auto-stop in Xs"
- Visual indicator of state (recording, silence, transcription)

### 🔒 Security and Compatibility
- Clean AudioContext permissions management
- Resource cleanup on stop
- Maintained compatibility with all Chromium browsers
- Respect for site security restrictions (ENTER may be blocked on protected sites)

---

## Version 1.0.0 - 2025-10-31

### 🎯 Initial Version

#### Basic Features
- **Connection to local whisper.cpp server** (port 8080)
- **Audio recording** via MediaRecorder API
- **Transcription** via whisper.cpp with 9+ language support
- **Automatic insertion** of transcribed text into active fields
- **Simple and intuitive user interface**

#### Components

**manifest.json v1.0.0**
- Manifest V3 configuration for Brave/Chrome
- Permissions: activeTab, scripting
- Host permissions: localhost:8080
- Content scripts injected on all pages

**popup.html v1.0.0**
- Popup interface with purple gradient design
- "Test connection" button
- "Start/Stop recording" button
- Language selector (9 available languages)
- Animated recording indicator
- Privacy information message

**popup.js v1.0.0**
- Audio recording management
- Communication with whisper server
- Audio sending for transcription
- Text injection into page via content script
- Error handling and clipboard fallback

**content.js v1.0.0**
- Listening for popup messages
- Insertion into input and textarea
- Insertion into contentEditable elements
- Search for nearby editable elements
- Triggering React/Vue/Angular events
- Support for Gmail, WhatsApp Web, standard forms

**start-whisper.sh v1.0.0**
- Automated whisper server startup script
- Prerequisites verification
- LD_LIBRARY_PATH library configuration
- large-v3 model support by default
- --convert option for automatic audio conversion
- Already used port handling

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
- INSTALL.md with step-by-step guide
- Troubleshooting instructions
- Usage examples

#### Security and Privacy
- 100% local, no data sent online
- No tracking or data collection
- Auditable open source code
- Manifest V3 with minimal permissions

**Audio data is never**:
- Sent to the internet
- Stored on a server
- Shared with third parties
- Used for AI training

---

## 🔮 Future Roadmap

### Planned for v3.1.0
- [ ] **Global keyboard shortcuts** (e.g., Ctrl+Shift+M to start/stop)
- [ ] **Multiple microphone selection** in widget
- [ ] **Custom themes** for widget (light/dark mode)
- [ ] **Recording history** with playback

### Planned for v3.2.0
- [ ] **Continuous dictation mode** without time limit
- [ ] **Export transcriptions** in TXT, JSON, CSV
- [ ] **Usage statistics** (transcription count, total time, accuracy)
- [ ] **Multiple concurrent recordings** (different tabs)

### Planned for v4.0.0
- [ ] **WebGPU support** for faster transcription
- [ ] **Multi-language in same recording** (auto-detect switches)
- [ ] **Real-time transcription** (streaming mode)
- [ ] **Voice commands** for browser control
- [ ] **Integration with more AI assistants**

### Additional Languages
- [ ] Support for all 99 Whisper languages
- [ ] Improved automatic detection
- [ ] Regional accent support

---

## 📊 Version Statistics

| Version | Date | Files | Lines of Code | New Features | Breaking Changes |
|---------|------|-------|---------------|--------------|------------------|
| 1.0.0 | 2025-10-31 | 7 | ~800 | 5 | - |
| 2.0.0 | 2025-10-31 | 9 | ~1200 | +2 | No |
| 2.1.0 | 2025-10-31 | 9 | ~1200 | 0 (translation) | No |
| **3.0.0** | **2025-11-01** | **14** | **~2700** | **+8** | **Yes (architecture)** |

---

## 🤝 Contributions

All contributions are welcome! To contribute:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Coding standards**:
- Follow existing code style
- Add comments for complex logic
- Update documentation (README, INSTALL, CHANGELOG)
- Test thoroughly before PR
- Version all modified files

---

## 📄 License

[To be defined - MIT, GPL, Apache, etc.]

---

**Author**: Bruno DELNOZ - bruno.delnoz@protonmail.com  
**Project**: Whisper Local STT - Brave Extension  
**Current Version**: 3.0.0  
**Last Update**: 2025-11-01

---

**Thank you for using Whisper Local STT!** 🎤✨

For questions, issues, or suggestions, please open an issue on GitHub.
