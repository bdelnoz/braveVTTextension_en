# 🚀 Migration Guide to v3.0.0

## 📦 Files Created

### ✅ NEW FILES (v3.0.0)
1. **content-widget.js** - Floating widget (29 KB)
2. **widget-style.css** - Widget styles (7.5 KB)
3. **background.js** - Service worker (2.5 KB)
4. **whisper-control.sh** - Native Host (6.7 KB)
5. **com.whisper.control.json** - Native Host manifest (287 B)
6. **install-native-host.sh** - Native Host installer (11 KB)

### 🔄 MODIFIED FILES (v3.0.0)
7. **manifest.json** - Updated for Native Messaging (723 B)
8. **install.sh** - Native Host support (11 KB)
9. **start-whisper.sh** - Version bump (15 KB)
10. **README.md** - Complete rewrite (13 KB)
11. **INSTALL.md** - Native Host guide (15 KB)
12. **CHANGELOG.md** - v3.0.0 entry (13 KB)

### ❌ REMOVE THESE FILES
- **popup.html** - No longer needed
- **popup.js** - No longer needed

### ✅ KEEP THESE FILES
- **icon48.png** - Unchanged
- **icon96.png** - Unchanged
- **.gitignore** - Unchanged

---

## 🌳 Git Workflow

```bash
# 1. Create branch
git checkout -b feature/v3.0.0-floating-widget

# 2. Copy new files from outputs
cp /mnt/user-data/outputs/*.js ./
cp /mnt/user-data/outputs/*.css ./
cp /mnt/user-data/outputs/*.sh ./
cp /mnt/user-data/outputs/*.json ./
cp /mnt/user-data/outputs/*.md ./

# Make scripts executable
chmod +x install.sh start-whisper.sh whisper-control.sh install-native-host.sh

# 3. Remove old files
rm popup.html popup.js

# 4. Git status
git status

# 5. Add all files
git add .

# 6. Commit
git commit -m "feat: v3.0.0 - Floating widget with dynamic model selection

- Complete architecture refactoring
- Floating widget replaces popup
- Native Messaging Host for model switching
- Real-time server status monitoring
- Draggable and minimizable widget
- All files versioned to v3.0.0

BREAKING CHANGE: popup.html and popup.js removed"

# 7. Push
git push origin feature/v3.0.0-floating-widget

# 8. Test thoroughly, then merge to main
```

---

## 🧪 Testing Checklist

### Installation
- [ ] Extension loads without errors
- [ ] Widget appears on all pages
- [ ] Widget shows correct status (Connected/Disconnected)

### Native Host
- [ ] Run `./install.sh --install-native`
- [ ] Extension ID configured correctly
- [ ] Restart Brave
- [ ] Model dropdown populates with available models

### Recording
- [ ] Click START - recording begins
- [ ] Countdown shows "Auto-stop in Xs"
- [ ] Auto-stop after silence works
- [ ] Transcription inserts correctly
- [ ] ENTER presses automatically

### Model Switching
- [ ] Select different model from dropdown
- [ ] Status shows "🟡 Restarting..."
- [ ] Server restarts with new model (5-15s)
- [ ] Status shows "🟢 Connected (new-model)"
- [ ] Recording works with new model

### Widget Features
- [ ] Widget is draggable
- [ ] Position is saved
- [ ] Widget is minimizable
- [ ] Minimized state is saved
- [ ] All dropdowns work (language, delay)

### Edge Cases
- [ ] Widget works on Claude.ai
- [ ] Widget works on Google
- [ ] Widget works on Gmail
- [ ] Server disconnection handled gracefully
- [ ] Browser restart preserves settings

---

## 📋 Installation Instructions for Users

### 1. Update Extension

```bash
cd /path/to/braveVTTextension
git pull
git checkout feature/v3.0.0-floating-widget
```

### 2. Reload Extension

1. Go to `brave://extensions/`
2. Find "Whisper Local STT"
3. Click 🔄 **Reload**

### 3. Install Native Host

```bash
./install.sh --install-native
# Follow prompts:
# - Browser: Brave
# - Extension ID: [copy from brave://extensions/]
```

### 4. Restart Brave

**IMPORTANT**: Close Brave completely and reopen.

### 5. Start Whisper

```bash
./start-whisper.sh --exec
```

### 6. Test

1. Open any webpage
2. Widget should appear in bottom-right
3. Status should show: 🟢 Connected (medium)
4. Try recording!

---

## 🐛 Troubleshooting v3.0.0

### Widget not appearing

```bash
# Check browser console (F12)
# Look for "[Whisper Widget]" messages

# Reload extension
brave://extensions/ → Reload

# Reload page
F5
```

### Model dropdown empty

```bash
# Native Host not installed or misconfigured
./install.sh --install-native

# Check Native Host logs
tail -f /tmp/whisper-control.log

# Verify manifest
cat ~/.config/BraveSoftware/Brave-Browser/NativeMessagingHosts/com.whisper.control.json
```

### Server status stuck at "Checking..."

```bash
# Whisper server not running
./start-whisper.sh --exec

# Check port
curl http://localhost:8080/health
```

---

## 📊 Architecture Comparison

### v2.x (Old)
```
User clicks extension icon
       ↓
Popup opens
       ↓
User clicks START
       ↓
Recording...
       ↓
User clicks elsewhere
       ↓
❌ Popup closes, recording stops!
```

### v3.0.0 (New)
```
Widget always visible
       ↓
User clicks START
       ↓
Recording...
       ↓
User clicks elsewhere
       ↓
✅ Widget stays, recording continues!
       ↓
Auto-stop after silence
       ↓
Transcription + ENTER
       ↓
Done!
```

---

## 🎯 Key Benefits v3.0.0

1. **Widget never closes** ✨
2. **Model selection from UI** 🤖
3. **Real-time server status** 🟢
4. **Draggable & minimizable** 📍
5. **Better UX** - no more frustration! 🎉

---

## 📞 Support

Issues? Check:
- `/tmp/whisper-control.log`
- `/tmp/whisper-server.log`
- Browser console (F12)

---

**Good luck with v3.0.0!** 🚀🎤

Author: Bruno DELNOZ - bruno.delnoz@protonmail.com
Date: 2025-11-01
