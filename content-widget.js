/**
 * ============================================================================
 * Filename       : content-widget.js
 * Author         : Bruno DELNOZ
 * Email          : bruno.delnoz@protonmail.com
 * Version        : 3.0.3
 * Date           : 2025-11-02
 *
 * CHANGELOG:
 * -----------
 * v3.0.3 - 2025-11-02
 *   - FIXED: Minimized micro now draggable pico bello! 🎤
 *   - FIXED: Click on minimized micro to expand works!
 *   - Widget even more compact (see CSS)
 *   - Everything works perfectly now!
 *
 * v3.0.2 - 2025-11-02
 *   - FIXED: Widget drag working
 *
 * v3.0.1 - 2025-11-02
 *   - FIXED: Text insertion with focus tracking
 * ============================================================================
 */

console.log('[Whisper Widget v3.0.3] Loading... Pico bello perfecto! 🎯');

const WHISPER_URL = 'http://127.0.0.1:8080';
const SILENCE_THRESHOLD = 0.01;
const CHECK_INTERVAL = 100;

// Widget state
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let audioContext = null;
let analyser = null;
let silenceCheckInterval = null;
let lastSoundTime = Date.now();
let isMinimized = false;
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Focus tracking
let lastFocusedElement = null;

document.addEventListener('focusin', (e) => {
    if (e.target && (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable
    )) {
        lastFocusedElement = e.target;
        console.log('[Whisper Widget] Focus tracked:', e.target.tagName);
    }
}, true);

document.addEventListener('click', (e) => {
    if (e.target && (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable
    )) {
        lastFocusedElement = e.target;
        console.log('[Whisper Widget] Click tracked:', e.target.tagName);
    }
}, true);

// ============================================================================
// CREATE WIDGET
// ============================================================================

function createWidget() {
    if (document.getElementById('whisper-widget')) {
        console.log('[Whisper Widget] Widget already exists');
        return;
    }

    const widget = document.createElement('div');
    widget.id = 'whisper-widget';
    widget.innerHTML = `
    <div id="whisper-widget-header">
    <span id="whisper-widget-title">🎤 Whisper STT</span>
    <div id="whisper-widget-controls">
    <button id="whisper-widget-minimize" title="Minimize">─</button>
    </div>
    </div>
    <div id="whisper-widget-content">
    <div id="whisper-widget-status">🔄 Checking connection...</div>

    <div id="whisper-widget-model-section">
    <label>🤖 Model:</label>
    <select id="whisper-widget-model">
    <option value="">Loading...</option>
    </select>
    </div>

    <div id="whisper-widget-language-section">
    <label>🇫🇷 Language:</label>
    <select id="whisper-widget-language">
    <option value="auto">Auto-detection</option>
    <option value="fr">French</option>
    <option value="en">English</option>
    <option value="es">Spanish</option>
    <option value="de">German</option>
    <option value="it">Italian</option>
    <option value="pt">Portuguese</option>
    <option value="nl">Dutch</option>
    <option value="ar">Arabic</option>
    </select>
    </div>

    <div id="whisper-widget-delay-section">
    <label>⏱️ Auto-stop:</label>
    <select id="whisper-widget-delay">
    <option value="5000">5 seconds</option>
    <option value="10000">10 seconds</option>
    <option value="15000">15 seconds</option>
    <option value="20000">20 seconds</option>
    <option value="30000">30 seconds</option>
    </select>
    </div>

    <button id="whisper-widget-record" disabled>🎤 START</button>

    <div id="whisper-widget-recording-indicator">
    <span class="dot"></span>
    <span>RECORDING</span>
    </div>
    </div>
    `;

    document.body.appendChild(widget);

    loadPreferences();
    setupEventListeners();
    checkServerStatus();
    setInterval(checkServerStatus, 3000);
    loadAvailableModels();

    console.log('[Whisper Widget] Widget created pico bello!');
}

// ============================================================================
// EVENT LISTENERS - v3.0.3 DRAG EVERYWHERE! 🎯
// ============================================================================

function setupEventListeners() {
    const widget = document.getElementById('whisper-widget');
    const header = document.getElementById('whisper-widget-header');

    // Minimize button
    document.getElementById('whisper-widget-minimize').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMinimize();
    });

    // Record button
    document.getElementById('whisper-widget-record').addEventListener('click', toggleRecording);

    // Model selector
    document.getElementById('whisper-widget-model').addEventListener('change', handleModelChange);

    // Language selector
    document.getElementById('whisper-widget-language').addEventListener('change', savePreferences);

    // Delay selector
    document.getElementById('whisper-widget-delay').addEventListener('change', savePreferences);

    // DRAG - Works on header AND minimized widget! v3.0.3 🎯
    header.style.cursor = 'grab';

    // Click on minimized widget to expand - v3.0.3 FIX! 🎯
    widget.addEventListener('click', (e) => {
        if (isMinimized && !isDragging) {
            toggleMinimize();
        }
    });

    // Mouse down (start drag)
    const startDrag = (e) => {
        // Don't drag if clicking minimize button
        if (e.target.id === 'whisper-widget-minimize' ||
            e.target.closest('#whisper-widget-minimize')) {
            return;
            }

            // Don't expand if starting a drag
            isDragging = true;

        if (isMinimized) {
            widget.style.cursor = 'grabbing';
        } else {
            header.style.cursor = 'grabbing';
        }

        const rect = widget.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;

        console.log('[Whisper Widget] Drag started!');
        e.preventDefault();
        e.stopPropagation();
    };

    // Mouse down on header (normal widget)
    header.addEventListener('mousedown', startDrag);

    // Mouse down on minimized widget - v3.0.3 NEW! 🎯
    widget.addEventListener('mousedown', (e) => {
        if (isMinimized) {
            startDrag(e);
        }
    });

    // Mouse move (dragging)
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        e.preventDefault();

        const newX = e.clientX - dragOffsetX;
        const newY = e.clientY - dragOffsetY;

        widget.style.left = newX + 'px';
        widget.style.top = newY + 'px';
        widget.style.right = 'auto';
        widget.style.bottom = 'auto';
    });

    // Mouse up (stop drag)
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            // Small delay to prevent click event
            setTimeout(() => {
                isDragging = false;
            }, 100);

            if (isMinimized) {
                widget.style.cursor = 'grab';
            } else {
                header.style.cursor = 'grab';
            }
            savePosition();
            console.log('[Whisper Widget] Drag stopped pico bello!');
        }
    });

    restorePosition();
}

// ============================================================================
// SERVER STATUS
// ============================================================================

async function checkServerStatus() {
    try {
        const response = await fetch(`${WHISPER_URL}/health`, { method: 'GET' });

        if (response.ok) {
            const data = await response.json();
            const currentModel = extractModelName(data);

            document.getElementById('whisper-widget-status').textContent = `🟢 Connected (${currentModel})`;
            document.getElementById('whisper-widget-status').className = 'connected';
            document.getElementById('whisper-widget-record').disabled = false;
        } else {
            throw new Error('Server unavailable');
        }
    } catch (error) {
        document.getElementById('whisper-widget-status').textContent = '🔴 Disconnected';
        document.getElementById('whisper-widget-status').className = 'disconnected';
        document.getElementById('whisper-widget-record').disabled = true;
    }
}

function extractModelName(healthData) {
    if (healthData && healthData.model) {
        // Affiche exactement ce que le serveur renvoie, sans modification
        return healthData.model;
    }
    return "Disconnected";
}

// ============================================================================
// MODELS
// ============================================================================

async function loadAvailableModels() {
    try {
        const response = await chrome.runtime.sendMessage({
            action: 'nativeMessage',
            data: { action: 'list_models' }
        });

        if (response && response.models && response.models.length > 0) {
            const modelSelect = document.getElementById('whisper-widget-model');
            modelSelect.innerHTML = response.models.map(model =>
            `<option value="${model}">${model}</option>`
            ).join('');
        }
    } catch (error) {
        console.log('[Whisper Widget] Could not load models');
        document.getElementById('whisper-widget-model').innerHTML = '<option value="">N/A</option>';
    }
}

async function handleModelChange(e) {
    const newModel = e.target.value;
    if (!newModel) return;

    document.getElementById('whisper-widget-status').textContent = '🟡 Restarting...';
    document.getElementById('whisper-widget-status').className = 'restarting';
    document.getElementById('whisper-widget-record').disabled = true;

    try {
        const response = await chrome.runtime.sendMessage({
            action: 'nativeMessage',
            data: { action: 'switch_model', model: newModel }
        });

        if (response && response.success) {
            setTimeout(() => checkServerStatus(), 2000);
        } else {
            throw new Error('Model switch failed');
        }
    } catch (error) {
        console.error('[Whisper Widget] Model switch error:', error);
        document.getElementById('whisper-widget-status').textContent = '❌ Switch failed';
        document.getElementById('whisper-widget-status').className = 'error';
    }
}

// ============================================================================
// RECORDING
// ============================================================================

async function toggleRecording() {
    if (!isRecording) {
        await startRecording();
    } else {
        await stopRecording();
    }
}

async function startRecording() {
    try {
        console.log('[Whisper Widget] Starting recording');

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: { channelCount: 1, sampleRate: 16000 }
        });

        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
        audioChunks = [];

        mediaRecorder.addEventListener('dataavailable', event => {
            audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener('stop', async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            await transcribeAudio(audioBlob);
            stream.getTracks().forEach(track => track.stop());
            if (audioContext) {
                audioContext.close();
                audioContext = null;
            }
        });

        setupSilenceDetection(stream);
        mediaRecorder.start();
        isRecording = true;

        document.getElementById('whisper-widget-record').textContent = '⏹️ STOP';
        document.getElementById('whisper-widget-record').classList.add('recording');
        document.getElementById('whisper-widget-recording-indicator').classList.add('active');
        document.getElementById('whisper-widget-status').textContent = '🎤 Recording...';

        console.log('[Whisper Widget] Recording started');
    } catch (error) {
        console.error('[Whisper Widget] Microphone error:', error);
        document.getElementById('whisper-widget-status').textContent = '❌ Mic error';
    }
}

function setupSilenceDetection(stream) {
    const selectedDelay = parseInt(document.getElementById('whisper-widget-delay').value);

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    const streamSource = audioContext.createMediaStreamSource(stream);
    streamSource.connect(analyser);

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    lastSoundTime = Date.now();

    silenceCheckInterval = setInterval(() => {
        analyser.getByteTimeDomainData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            const normalized = (dataArray[i] - 128) / 128;
            sum += normalized * normalized;
        }
        const rms = Math.sqrt(sum / bufferLength);

        if (rms > SILENCE_THRESHOLD) {
            lastSoundTime = Date.now();
        } else {
            const silenceDuration = Date.now() - lastSoundTime;
            if (silenceDuration >= selectedDelay) {
                console.log('[Whisper Widget] Auto-stop triggered');
                stopRecording();
            } else {
                const remainingSeconds = Math.ceil((selectedDelay - silenceDuration) / 1000);
                document.getElementById('whisper-widget-status').textContent = `🎤 Auto-stop in: ${remainingSeconds}s`;
            }
        }
    }, CHECK_INTERVAL);
}

async function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        console.log('[Whisper Widget] Stopping recording');
        mediaRecorder.stop();
        isRecording = false;

        if (silenceCheckInterval) {
            clearInterval(silenceCheckInterval);
            silenceCheckInterval = null;
        }

        document.getElementById('whisper-widget-record').textContent = '🎤 START';
        document.getElementById('whisper-widget-record').classList.remove('recording');
        document.getElementById('whisper-widget-recording-indicator').classList.remove('active');
        document.getElementById('whisper-widget-status').textContent = '⏳ Transcription...';
    }
}

// ============================================================================
// TRANSCRIPTION
// ============================================================================

async function transcribeAudio(audioBlob) {
    try {
        console.log('[Whisper Widget] Sending audio for transcription');

        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');

        const language = document.getElementById('whisper-widget-language').value;
        if (language !== 'auto') {
            formData.append('language', language);
            console.log('[Whisper Widget] Forced language:', language);
        }

        const response = await fetch(`${WHISPER_URL}/inference`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        console.log('[Whisper Widget] Transcription received:', result);

        if (result.text) {
            const cleanText = result.text.trim().replace(/\n/g, ' ');
            await insertTextIntoPage(cleanText);
            document.getElementById('whisper-widget-status').textContent = '✅ Done!';
            setTimeout(() => checkServerStatus(), 2000);
        } else {
            throw new Error('No text transcribed');
        }
    } catch (error) {
        console.error('[Whisper Widget] Transcription error:', error);
        document.getElementById('whisper-widget-status').textContent = '❌ Error';
    }
}

// ============================================================================
// TEXT INSERTION
// ============================================================================

async function insertTextIntoPage(text) {
    console.log('[Whisper Widget] Inserting text:', text);

    if (lastFocusedElement && document.contains(lastFocusedElement)) {
        console.log('[Whisper Widget] Using lastFocusedElement:', lastFocusedElement.tagName);

        if (lastFocusedElement.tagName === 'INPUT' || lastFocusedElement.tagName === 'TEXTAREA') {
            insertIntoInputOrTextarea(lastFocusedElement, text);
            simulateEnterKey(lastFocusedElement);
            return;
        } else if (lastFocusedElement.isContentEditable) {
            insertIntoContentEditable(lastFocusedElement, text);
            simulateEnterKey(lastFocusedElement);
            return;
        }
    }

    const activeElement = document.activeElement;
    if (activeElement && activeElement !== document.body) {
        console.log('[Whisper Widget] Using activeElement:', activeElement.tagName);

        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
            insertIntoInputOrTextarea(activeElement, text);
            simulateEnterKey(activeElement);
            return;
        } else if (activeElement.isContentEditable) {
            insertIntoContentEditable(activeElement, text);
            simulateEnterKey(activeElement);
            return;
        }
    }

    console.log('[Whisper Widget] No suitable field, copying to clipboard');
    await copyToClipboard(text);
}

function insertIntoInputOrTextarea(element, text) {
    const start = element.selectionStart || 0;
    const end = element.selectionEnd || 0;
    const currentValue = element.value || '';

    element.value = currentValue.substring(0, start) + text + currentValue.substring(end);

    const newCursorPos = start + text.length;
    element.selectionStart = newCursorPos;
    element.selectionEnd = newCursorPos;

    triggerInputEvents(element);
    console.log('[Whisper Widget] ✅ Text inserted pico bello!');
}

function insertIntoContentEditable(element, text) {
    element.focus();

    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
        const range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    try {
        const success = document.execCommand('insertText', false, text);
        if (success) {
            console.log('[Whisper Widget] ✅ execCommand successful');
            triggerInputEvents(element);
            return;
        }
    } catch (e) {
        console.log('[Whisper Widget] execCommand failed:', e);
    }

    try {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
        console.log('[Whisper Widget] ✅ Manual insertion pico bello!');
        triggerInputEvents(element);
    } catch (e) {
        console.error('[Whisper Widget] ❌ All methods failed:', e);
    }
}

function simulateEnterKey(element) {
    setTimeout(() => {
        const eventInit = {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
            composed: true
        };

        element.dispatchEvent(new KeyboardEvent('keydown', eventInit));
        element.dispatchEvent(new KeyboardEvent('keypress', eventInit));
        element.dispatchEvent(new KeyboardEvent('keyup', eventInit));

        console.log('[Whisper Widget] ⏎ ENTER simulated');
    }, 100);
}

function triggerInputEvents(element) {
    const events = [
        new Event('input', { bubbles: true }),
        new Event('change', { bubbles: true }),
        new InputEvent('beforeinput', { bubbles: true }),
        new InputEvent('input', { bubbles: true, inputType: 'insertText' })
    ];

    events.forEach(event => {
        try {
            element.dispatchEvent(event);
        } catch (e) {}
    });
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        console.log('[Whisper Widget] ✅ Text copied to clipboard');
        document.getElementById('whisper-widget-status').textContent = '📋 Copied to clipboard';
    } catch (error) {
        console.error('[Whisper Widget] Clipboard error:', error);
        document.getElementById('whisper-widget-status').textContent = '❌ Clipboard failed';
    }
}

// ============================================================================
// UI FUNCTIONS - v3.0.3 MINIMIZED CURSOR! 🎯
// ============================================================================

function toggleMinimize() {
    const widget = document.getElementById('whisper-widget');
    const content = document.getElementById('whisper-widget-content');

    isMinimized = !isMinimized;

    if (isMinimized) {
        widget.classList.add('minimized');
        content.style.display = 'none';
        widget.style.cursor = 'grab'; // v3.0.3 NEW!
    } else {
        widget.classList.remove('minimized');
        content.style.display = 'block';
        widget.style.cursor = 'default'; // v3.0.3 NEW!
    }

    savePreferences();
}

// ============================================================================
// PREFERENCES
// ============================================================================

function savePreferences() {
    const prefs = {
        language: document.getElementById('whisper-widget-language').value,
        delay: document.getElementById('whisper-widget-delay').value,
        minimized: isMinimized
    };

    localStorage.setItem('whisper-widget-prefs', JSON.stringify(prefs));
    console.log('[Whisper Widget] Preferences saved pico bello!');
}

function loadPreferences() {
    const prefs = JSON.parse(localStorage.getItem('whisper-widget-prefs') || '{}');

    if (prefs.language) {
        document.getElementById('whisper-widget-language').value = prefs.language;
    }

    if (prefs.delay) {
        document.getElementById('whisper-widget-delay').value = prefs.delay;
    } else {
        document.getElementById('whisper-widget-delay').value = '10000';
    }

    if (prefs.minimized) {
        toggleMinimize();
    }
}

function savePosition() {
    const widget = document.getElementById('whisper-widget');
    const position = {
        left: widget.style.left,
        top: widget.style.top
    };

    localStorage.setItem('whisper-widget-position', JSON.stringify(position));
    console.log('[Whisper Widget] Position saved pico bello!');
}

function restorePosition() {
    const position = JSON.parse(localStorage.getItem('whisper-widget-position') || '{}');

    if (position.left && position.top) {
        const widget = document.getElementById('whisper-widget');
        widget.style.left = position.left;
        widget.style.top = position.top;
        widget.style.right = 'auto';
        widget.style.bottom = 'auto';
        console.log('[Whisper Widget] Position restored pico bello!');
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
} else {
    createWidget();
}

console.log('[Whisper Widget v3.0.3] Loaded - Everything PICO BELLO PERFECTO! 🎯✨');
