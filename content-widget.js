/**
 * ============================================================================
 * Filename       : content-widget.js
 * Author         : Bruno DELNOZ
 * Email          : bruno.delnoz@protonmail.com
 * Version        : 3.0.0
 * Date           : 2025-11-01
 * 
 * Description    : Floating widget for Whisper Local STT extension
 *                  Complete standalone interface with model selection,
 *                  language selection, delay configuration, and drag & drop
 * 
 * CHANGELOG:
 * -----------
 * v3.0.0 - 2025-11-01
 *   - Complete floating widget system
 *   - Server status monitoring (Connected/Disconnected)
 *   - Whisper model detection and selection
 *   - Native Messaging integration for model switching
 *   - Language selector (9 languages)
 *   - Auto-stop delay selector (5s to 30s)
 *   - Draggable widget with position saving
 *   - Minimizable to small icon
 *   - START/STOP recording buttons
 *   - Real-time countdown during recording
 *   - Auto-stop after silence detection
 *   - Automatic ENTER after transcription
 *   - localStorage for all preferences
 *   - Semi-transparent when not active
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const WHISPER_URL = 'http://127.0.0.1:8080';
const SILENCE_THRESHOLD = 0.01;
const CHECK_INTERVAL = 100;
const STATUS_CHECK_INTERVAL = 3000; // Check server every 3s
const WIDGET_ID = 'whisper-stt-widget';

// Default values
let SILENCE_DURATION = 10000; // 10 seconds
let currentLanguage = 'fr';
let currentModel = 'unknown';
let serverConnected = false;

// Recording state
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let audioContext = null;
let analyser = null;
let streamSource = null;
let silenceCheckInterval = null;
let statusCheckInterval = null;
let lastSoundTime = Date.now();

// Widget state
let widgetMinimized = false;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let widgetStartX = 0;
let widgetStartY = 0;

// ============================================================================
// WIDGET HTML STRUCTURE
// ============================================================================

function createWidget() {
    // Check if widget already exists
    if (document.getElementById(WIDGET_ID)) {
        console.log('[Whisper Widget] Widget already exists');
        return;
    }

    const widget = document.createElement('div');
    widget.id = WIDGET_ID;
    widget.innerHTML = `
        <div class="whisper-widget-header">
            <span class="whisper-widget-title">🎤 Whisper STT</span>
            <button class="whisper-widget-minimize" title="Minimize">─</button>
        </div>
        <div class="whisper-widget-content">
            <div class="whisper-server-status">
                <span class="status-indicator">🔴</span>
                <span class="status-text">Checking...</span>
            </div>
            
            <div class="whisper-model-selector">
                <label>🤖 Model:</label>
                <select class="model-select">
                    <option value="">Loading...</option>
                </select>
            </div>
            
            <div class="whisper-language-selector">
                <label>🇫🇷 Language:</label>
                <select class="language-select">
                    <option value="auto">Auto-detection</option>
                    <option value="fr" selected>French</option>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="pt">Portuguese</option>
                    <option value="nl">Dutch</option>
                    <option value="ar">Arabic</option>
                </select>
            </div>
            
            <div class="whisper-delay-selector">
                <label>⏱️ Auto-stop:</label>
                <select class="delay-select">
                    <option value="5000">5 seconds</option>
                    <option value="10000" selected>10 seconds</option>
                    <option value="15000">15 seconds</option>
                    <option value="20000">20 seconds</option>
                    <option value="30000">30 seconds</option>
                </select>
            </div>
            
            <div class="whisper-recording-info" style="display: none;">
                <div class="recording-pulse">🔴 RECORDING</div>
                <div class="recording-countdown">Auto-stop in: 10s</div>
            </div>
            
            <button class="whisper-start-btn">🎤 START</button>
            <button class="whisper-stop-btn" style="display: none;">⏹️ STOP</button>
        </div>
    `;
    
    document.body.appendChild(widget);
    console.log('[Whisper Widget v3.0.0] Widget created');
    
    // Load saved preferences
    loadPreferences();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Start server status monitoring
    startStatusMonitoring();
    
    // Check for available models
    checkAvailableModels();
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function initializeEventListeners() {
    const widget = document.getElementById(WIDGET_ID);
    if (!widget) return;
    
    // Drag & Drop on header
    const header = widget.querySelector('.whisper-widget-header');
    header.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
    
    // Minimize button
    const minimizeBtn = widget.querySelector('.whisper-widget-minimize');
    minimizeBtn.addEventListener('click', toggleMinimize);
    
    // Model selector
    const modelSelect = widget.querySelector('.model-select');
    modelSelect.addEventListener('change', handleModelChange);
    
    // Language selector
    const languageSelect = widget.querySelector('.language-select');
    languageSelect.addEventListener('change', handleLanguageChange);
    
    // Delay selector
    const delaySelect = widget.querySelector('.delay-select');
    delaySelect.addEventListener('change', handleDelayChange);
    
    // START button
    const startBtn = widget.querySelector('.whisper-start-btn');
    startBtn.addEventListener('click', startRecording);
    
    // STOP button
    const stopBtn = widget.querySelector('.whisper-stop-btn');
    stopBtn.addEventListener('click', stopRecording);
}

// ============================================================================
// DRAG & DROP
// ============================================================================

function startDragging(e) {
    if (e.target.classList.contains('whisper-widget-minimize')) return;
    
    isDragging = true;
    const widget = document.getElementById(WIDGET_ID);
    
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    
    const rect = widget.getBoundingClientRect();
    widgetStartX = rect.left;
    widgetStartY = rect.top;
    
    widget.style.cursor = 'grabbing';
}

function drag(e) {
    if (!isDragging) return;
    
    const widget = document.getElementById(WIDGET_ID);
    const deltaX = e.clientX - dragStartX;
    const deltaY = e.clientY - dragStartY;
    
    let newX = widgetStartX + deltaX;
    let newY = widgetStartY + deltaY;
    
    // Keep widget within viewport
    const maxX = window.innerWidth - widget.offsetWidth;
    const maxY = window.innerHeight - widget.offsetHeight;
    
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    
    widget.style.left = newX + 'px';
    widget.style.top = newY + 'px';
    widget.style.right = 'auto';
    widget.style.bottom = 'auto';
}

function stopDragging() {
    if (!isDragging) return;
    
    isDragging = false;
    const widget = document.getElementById(WIDGET_ID);
    widget.style.cursor = 'grab';
    
    // Save position
    savePosition();
}

// ============================================================================
// MINIMIZE / MAXIMIZE
// ============================================================================

function toggleMinimize() {
    const widget = document.getElementById(WIDGET_ID);
    const content = widget.querySelector('.whisper-widget-content');
    const minimizeBtn = widget.querySelector('.whisper-widget-minimize');
    
    widgetMinimized = !widgetMinimized;
    
    if (widgetMinimized) {
        content.style.display = 'none';
        widget.classList.add('minimized');
        minimizeBtn.textContent = '+';
        minimizeBtn.title = 'Maximize';
    } else {
        content.style.display = 'block';
        widget.classList.remove('minimized');
        minimizeBtn.textContent = '─';
        minimizeBtn.title = 'Minimize';
    }
    
    savePreferences();
}

// ============================================================================
// SERVER STATUS MONITORING
// ============================================================================

function startStatusMonitoring() {
    // Initial check
    checkServerStatus();
    
    // Periodic checks
    statusCheckInterval = setInterval(checkServerStatus, STATUS_CHECK_INTERVAL);
}

async function checkServerStatus() {
    try {
        const response = await fetch(`${WHISPER_URL}/health`, { method: 'GET' });
        
        if (response.ok) {
            updateServerStatus(true);
        } else {
            updateServerStatus(false);
        }
    } catch (error) {
        updateServerStatus(false);
    }
}

function updateServerStatus(connected) {
    serverConnected = connected;
    const widget = document.getElementById(WIDGET_ID);
    if (!widget) return;
    
    const statusIndicator = widget.querySelector('.status-indicator');
    const statusText = widget.querySelector('.status-text');
    const startBtn = widget.querySelector('.whisper-start-btn');
    
    if (connected) {
        statusIndicator.textContent = '🟢';
        statusText.textContent = `Connected${currentModel !== 'unknown' ? ' (' + currentModel + ')' : ''}`;
        startBtn.disabled = false;
    } else {
        statusIndicator.textContent = '🔴';
        statusText.textContent = 'Disconnected';
        startBtn.disabled = true;
    }
}

// ============================================================================
// MODEL DETECTION AND SELECTION
// ============================================================================

async function checkAvailableModels() {
    console.log('[Whisper Widget] Checking available models via Native Host');
    
    try {
        // Send message to Native Host
        const response = await sendNativeMessage({ action: 'list_models' });
        
        if (response && response.models) {
            populateModelSelector(response.models, response.current);
            currentModel = response.current || 'unknown';
            updateServerStatus(serverConnected);
        } else {
            console.warn('[Whisper Widget] No models returned from Native Host');
            populateModelSelectorFallback();
        }
    } catch (error) {
        console.error('[Whisper Widget] Error checking models:', error);
        populateModelSelectorFallback();
    }
}

function populateModelSelector(models, current) {
    const widget = document.getElementById(WIDGET_ID);
    if (!widget) return;
    
    const modelSelect = widget.querySelector('.model-select');
    modelSelect.innerHTML = '';
    
    // Create friendly names
    const modelNames = {
        'ggml-tiny.bin': 'tiny (fast)',
        'ggml-base.bin': 'base',
        'ggml-small.bin': 'small',
        'ggml-medium.bin': 'medium ⭐',
        'ggml-large-v3.bin': 'large-v3 (best)'
    };
    
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = modelNames[model] || model;
        
        if (model === current) {
            option.selected = true;
            currentModel = model.replace('ggml-', '').replace('.bin', '');
        }
        
        modelSelect.appendChild(option);
    });
    
    console.log('[Whisper Widget] Models populated, current:', current);
}

function populateModelSelectorFallback() {
    const widget = document.getElementById(WIDGET_ID);
    if (!widget) return;
    
    const modelSelect = widget.querySelector('.model-select');
    modelSelect.innerHTML = `
        <option value="ggml-tiny.bin">tiny (fast)</option>
        <option value="ggml-base.bin">base</option>
        <option value="ggml-small.bin">small</option>
        <option value="ggml-medium.bin" selected>medium ⭐</option>
        <option value="ggml-large-v3.bin">large-v3 (best)</option>
    `;
    
    currentModel = 'medium';
}

async function handleModelChange(e) {
    const newModel = e.target.value;
    console.log('[Whisper Widget] Switching model to:', newModel);
    
    // Update status to "restarting"
    const widget = document.getElementById(WIDGET_ID);
    const statusIndicator = widget.querySelector('.status-indicator');
    const statusText = widget.querySelector('.status-text');
    const startBtn = widget.querySelector('.whisper-start-btn');
    
    statusIndicator.textContent = '🟡';
    statusText.textContent = 'Restarting...';
    startBtn.disabled = true;
    
    try {
        // Send switch model command to Native Host
        const response = await sendNativeMessage({
            action: 'switch_model',
            model: newModel
        });
        
        if (response && response.status === 'success') {
            console.log('[Whisper Widget] Model switched successfully');
            currentModel = response.model;
            
            // Wait a bit for server to be ready
            setTimeout(() => {
                checkServerStatus();
            }, 2000);
        } else {
            console.error('[Whisper Widget] Model switch failed:', response);
            alert('Failed to switch model. Check console for details.');
            checkServerStatus();
        }
    } catch (error) {
        console.error('[Whisper Widget] Error switching model:', error);
        alert('Error switching model: ' + error.message);
        checkServerStatus();
    }
}

// ============================================================================
// NATIVE MESSAGING
// ============================================================================

function sendNativeMessage(message) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            { type: 'NATIVE_MESSAGE', data: message },
            (response) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response);
                }
            }
        );
    });
}

// ============================================================================
// LANGUAGE AND DELAY SELECTORS
// ============================================================================

function handleLanguageChange(e) {
    currentLanguage = e.target.value;
    savePreferences();
    console.log('[Whisper Widget] Language changed to:', currentLanguage);
}

function handleDelayChange(e) {
    SILENCE_DURATION = parseInt(e.target.value);
    savePreferences();
    console.log('[Whisper Widget] Delay changed to:', SILENCE_DURATION + 'ms');
}

// ============================================================================
// RECORDING
// ============================================================================

async function startRecording() {
    if (!serverConnected) {
        alert('Whisper server is not connected!');
        return;
    }
    
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
        
        updateRecordingUI(true);
        
        console.log('[Whisper Widget] Recording started');
    } catch (error) {
        console.error('[Whisper Widget] Microphone error:', error);
        alert('Cannot access microphone: ' + error.message);
    }
}

function setupSilenceDetection(stream) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    streamSource = audioContext.createMediaStreamSource(stream);
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
            if (silenceDuration >= SILENCE_DURATION) {
                console.log('[Whisper Widget] Auto-stop triggered');
                stopRecording();
            } else {
                const remainingSeconds = Math.ceil((SILENCE_DURATION - silenceDuration) / 1000);
                updateCountdown(remainingSeconds);
            }
        }
    }, CHECK_INTERVAL);
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        console.log('[Whisper Widget] Stopping recording');
        mediaRecorder.stop();
        isRecording = false;
        
        if (silenceCheckInterval) {
            clearInterval(silenceCheckInterval);
            silenceCheckInterval = null;
        }
        
        updateRecordingUI(false);
        updateStatusMessage('⏳ Transcribing...');
    }
}

function updateRecordingUI(recording) {
    const widget = document.getElementById(WIDGET_ID);
    if (!widget) return;
    
    const startBtn = widget.querySelector('.whisper-start-btn');
    const stopBtn = widget.querySelector('.whisper-stop-btn');
    const recordingInfo = widget.querySelector('.whisper-recording-info');
    
    if (recording) {
        startBtn.style.display = 'none';
        stopBtn.style.display = 'block';
        recordingInfo.style.display = 'block';
    } else {
        startBtn.style.display = 'block';
        stopBtn.style.display = 'none';
        recordingInfo.style.display = 'none';
    }
}

function updateCountdown(seconds) {
    const widget = document.getElementById(WIDGET_ID);
    if (!widget) return;
    
    const countdown = widget.querySelector('.recording-countdown');
    if (countdown) {
        countdown.textContent = `Auto-stop in: ${seconds}s`;
    }
}

function updateStatusMessage(message) {
    const widget = document.getElementById(WIDGET_ID);
    if (!widget) return;
    
    const statusText = widget.querySelector('.status-text');
    if (statusText) {
        const originalText = statusText.textContent;
        statusText.textContent = message;
        
        // Restore after 3 seconds
        setTimeout(() => {
            updateServerStatus(serverConnected);
        }, 3000);
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
        
        if (currentLanguage !== 'auto') {
            formData.append('language', currentLanguage);
            console.log('[Whisper Widget] Forced language:', currentLanguage);
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
            await insertTextIntoPage(result.text.trim());
            updateStatusMessage('✅ Done!');
        } else {
            throw new Error('No text transcribed');
        }
    } catch (error) {
        console.error('[Whisper Widget] Transcription error:', error);
        updateStatusMessage('❌ Error');
        alert('Transcription error: ' + error.message);
    }
}

// ============================================================================
// TEXT INSERTION
// ============================================================================

async function insertTextIntoPage(text) {
    console.log('[Whisper Widget] Inserting text:', text);
    
    const activeElement = document.activeElement;
    
    if (!activeElement) {
        console.warn('[Whisper Widget] No active element');
        copyToClipboard(text);
        return;
    }
    
    // Input/Textarea
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
        insertIntoInputOrTextarea(activeElement, text);
        simulateEnterKey(activeElement);
        return;
    }
    
    // ContentEditable
    if (activeElement.isContentEditable) {
        insertIntoContentEditable(activeElement, text);
        simulateEnterKey(activeElement);
        return;
    }
    
    // Fallback: clipboard
    console.warn('[Whisper Widget] No suitable field, copying to clipboard');
    copyToClipboard(text);
}

function insertIntoInputOrTextarea(element, text) {
    const start = element.selectionStart || 0;
    const end = element.selectionEnd || 0;
    const currentValue = element.value || '';
    
    const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);
    element.value = newValue;
    
    const newCursorPos = start + text.length;
    element.selectionStart = newCursorPos;
    element.selectionEnd = newCursorPos;
    
    triggerInputEvents(element);
    console.log('[Whisper Widget] Text inserted into input/textarea');
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
            console.log('[Whisper Widget] execCommand successful');
            triggerInputEvents(element);
            return;
        }
    } catch (e) {
        console.log('[Whisper Widget] execCommand failed, using manual insertion');
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
        console.log('[Whisper Widget] Manual insertion successful');
        triggerInputEvents(element);
    } catch (e) {
        console.error('[Whisper Widget] All insertion methods failed:', e);
        copyToClipboard(text);
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
            composed: true,
            view: window
        };
        
        element.dispatchEvent(new KeyboardEvent('keydown', eventInit));
        element.dispatchEvent(new KeyboardEvent('keypress', eventInit));
        element.dispatchEvent(new KeyboardEvent('keyup', eventInit));
        
        const form = element.closest('form');
        if (form) {
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
        
        console.log('[Whisper Widget] ENTER simulated');
    }, 100);
}

function triggerInputEvents(element) {
    const events = [
        new Event('input', { bubbles: true, cancelable: true }),
        new Event('change', { bubbles: true, cancelable: true }),
        new InputEvent('beforeinput', { bubbles: true }),
        new InputEvent('input', { bubbles: true, inputType: 'insertText' })
    ];
    
    events.forEach(event => {
        try {
            element.dispatchEvent(event);
        } catch (e) {}
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('[Whisper Widget] Text copied to clipboard');
        updateStatusMessage('📋 Copied!');
    }).catch(err => {
        console.error('[Whisper Widget] Clipboard error:', err);
    });
}

// ============================================================================
// PREFERENCES MANAGEMENT
// ============================================================================

function savePreferences() {
    const widget = document.getElementById(WIDGET_ID);
    if (!widget) return;
    
    const rect = widget.getBoundingClientRect();
    
    const prefs = {
        position: {
            left: rect.left,
            top: rect.top
        },
        language: currentLanguage,
        delay: SILENCE_DURATION,
        minimized: widgetMinimized
    };
    
    localStorage.setItem('whisperWidgetPrefs', JSON.stringify(prefs));
    console.log('[Whisper Widget] Preferences saved');
}

function savePosition() {
    const widget = document.getElementById(WIDGET_ID);
    if (!widget) return;
    
    const rect = widget.getBoundingClientRect();
    
    const prefs = JSON.parse(localStorage.getItem('whisperWidgetPrefs') || '{}');
    prefs.position = {
        left: rect.left,
        top: rect.top
    };
    
    localStorage.setItem('whisperWidgetPrefs', JSON.stringify(prefs));
}

function loadPreferences() {
    const widget = document.getElementById(WIDGET_ID);
    if (!widget) return;
    
    const prefs = JSON.parse(localStorage.getItem('whisperWidgetPrefs') || '{}');
    
    // Position
    if (prefs.position) {
        widget.style.left = prefs.position.left + 'px';
        widget.style.top = prefs.position.top + 'px';
        widget.style.right = 'auto';
        widget.style.bottom = 'auto';
    }
    
    // Language
    if (prefs.language) {
        currentLanguage = prefs.language;
        const languageSelect = widget.querySelector('.language-select');
        if (languageSelect) {
            languageSelect.value = currentLanguage;
        }
    }
    
    // Delay
    if (prefs.delay) {
        SILENCE_DURATION = prefs.delay;
        const delaySelect = widget.querySelector('.delay-select');
        if (delaySelect) {
            delaySelect.value = SILENCE_DURATION;
        }
    }
    
    // Minimized state
    if (prefs.minimized) {
        widgetMinimized = prefs.minimized;
        if (widgetMinimized) {
            toggleMinimize();
        }
    }
    
    console.log('[Whisper Widget] Preferences loaded');
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Create widget when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
} else {
    createWidget();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
    }
    if (silenceCheckInterval) {
        clearInterval(silenceCheckInterval);
    }
});

console.log('[Whisper Widget v3.0.0] Content script loaded');
