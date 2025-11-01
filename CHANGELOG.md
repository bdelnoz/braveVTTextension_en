<!--
============================================================================
Filename       : CHANGELOG.md
Author         : Bruno DELNOZ
Email          : bruno.delnoz@protonmail.com
Full path      : /mnt/data2_78g/Security/scripts/Projects_web/braveVTTextension/CHANGELOG.md
Target usage   : Complete version history for Whisper Local STT extension
Version        : 2.1.0
Date           : 2025-10-31
============================================================================
-->

# 📋 Changelog - Whisper Local STT for Brave

Complete history of all extension versions.

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

---

## 🔮 Future Roadmap

### Features planned for v3.0.0
- [ ] **Global keyboard shortcuts** (e.g., Ctrl+Shift+M to start/stop)
- [ ] **Continuous dictation mode** without time limit
- [ ] **Transcription history** with search
- [ ] **Export transcriptions** in TXT, JSON, CSV
- [ ] **Multi-microphones** with selection in interface
- [ ] **Advanced settings** directly in popup
- [ ] **Customizable themes** (light/dark mode)
- [ ] **Usage statistics** (number of transcriptions, total time, etc.)

### Planned Technical Improvements
- [ ] **Background service worker** for better resource management
- [ ] **Model caching** for faster startup
- [ ] **WebGPU support** for hardware acceleration
- [ ] **Audio compression** before sending to server
- [ ] **Offline mode** with temporary local storage

### Additional Languages
- [ ] Support for all 99 Whisper languages
- [ ] Improved automatic detection
- [ ] Regional accent support

---

## 📊 Version Statistics

| Version | Date | Lines of Code | Files | New Features |
|---------|------|---------------|-------|--------------|
| 1.0.0 | 2025-10-31 | ~800 | 7 | 5 |
| 2.0.0 | 2025-10-31 | ~1200 | 9 | +2 |
| 2.1.0 | 2025-10-31 | ~1200 | 9 | 0 (translation) |

---

## 🤝 Contributions

All contributions are welcome! To contribute:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Author**: Bruno DELNOZ - bruno.delnoz@protonmail.com  
**Project**: Whisper Local STT - Brave Extension  
**Last update**: 2025-10-31
