/**
 * ============================================================================
 * Filename       : popup.js
 * Author         : Bruno DELNOZ
 * Email          : bruno.delnoz@protonmail.com
 * Version        : 2.2.0
 * Date           : 2025-10-31
 * 
 * CHANGELOG:
 * -----------
 * v2.2.0 - 2025-10-31
 *   - Full English translation of code and comments
 *   - Updated all console logs and UI messages
 *   - Maintained all functionality
 * 
 * v2.1.0 - 2025-10-31
 *   - Added saving of selected language (chrome.storage.local)
 *   - Automatic language restoration on startup
 *   - Fixed ENTER bug that wasn't working
 *   - Improved logs for debugging
 * 
 * v2.0.0 - 2025-10-31
 *   - Auto-stop after 10s of silence
 *   - Automatic ENTER
 *   - Real-time audio detection
 * ============================================================================
 */

const WHISPER_URL = 'http://127.0.0.1:8080';
const SILENCE_THRESHOLD = 0.01;
const SILENCE_DURATION = 10000;
const CHECK_INTERVAL = 100;

let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let audioContext = null;
let analyser = null;
let streamSource = null;
let silenceCheckInterval = null;
let lastSoundTime = Date.now();

const statusDiv = document.getElementById('status');
const testBtn = document.getElementById('testBtn');
const recordBtn = document.getElementById('recordBtn');
const languageSelect = document.getElementById('language');
const recordingIndicator = document.getElementById('recordingIndicator');

// ============================================================================
// PREFERENCES SAVING AND RESTORATION
// ============================================================================

/**
 * Save selected language in chrome.storage.local
 */
function saveLanguagePreference() {
    const selectedLanguage = languageSelect.value;
    chrome.storage.local.set({ selectedLanguage: selectedLanguage }, () => {
        console.log('[Whisper STT] Language saved:', selectedLanguage);
    });
}

/**
 * Restore saved language on startup
 */
function restoreLanguagePreference() {
    chrome.storage.local.get(['selectedLanguage'], (result) => {
        if (result.selectedLanguage) {
            languageSelect.value = result.selectedLanguage;
            console.log('[Whisper STT] Language restored:', result.selectedLanguage);
        }
    });
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('[Whisper STT v2.2.0] Extension loaded');
    
    // Restore saved language
    restoreLanguagePreference();
    
    // Automatic connection test
    testConnection();
    
    // Event listeners
    testBtn.addEventListener('click', testConnection);
    recordBtn.addEventListener('click', toggleRecording);
    
    // Save language when it changes
    languageSelect.addEventListener('change', saveLanguagePreference);
});

// ============================================================================
// CONNECTION
// ============================================================================

async function testConnection() {
    statusDiv.textContent = '🔄 Testing connection...';
    statusDiv.className = 'status';
    
    try {
        const response = await fetch(`${WHISPER_URL}/health`, { method: 'GET' });
        
        if (response.ok) {
            statusDiv.textContent = '✅ Connected to Whisper server';
            statusDiv.className = 'status connected';
            recordBtn.disabled = false;
            console.log('[Whisper STT] Connection successful');
        } else {
            throw new Error('Server unavailable');
        }
    } catch (error) {
        statusDiv.textContent = '❌ Whisper server unavailable';
        statusDiv.className = 'status error';
        recordBtn.disabled = true;
        console.error('[Whisper STT] Connection error:', error);
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
        console.log('[Whisper STT] Starting recording');
        
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
        
        recordBtn.textContent = 'Stop recording';
        recordBtn.classList.add('recording');
        recordingIndicator.classList.add('active');
        statusDiv.textContent = '🎤 Recording... (auto-stop after 10s of silence)';
        statusDiv.className = 'status';
        
        console.log('[Whisper STT] Recording started');
    } catch (error) {
        console.error('[Whisper STT] Microphone error:', error);
        statusDiv.textContent = '❌ Cannot access microphone';
        statusDiv.className = 'status error';
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
                console.log('[Whisper STT] 10s of silence, auto-stop');
                stopRecording();
            } else {
                const remainingSeconds = Math.ceil((SILENCE_DURATION - silenceDuration) / 1000);
                statusDiv.textContent = `🎤 Recording... (auto-stop in ${remainingSeconds}s)`;
            }
        }
    }, CHECK_INTERVAL);
}

async function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        console.log('[Whisper STT] Stopping recording');
        mediaRecorder.stop();
        isRecording = false;
        
        if (silenceCheckInterval) {
            clearInterval(silenceCheckInterval);
            silenceCheckInterval = null;
        }
        
        recordBtn.textContent = 'Start recording';
        recordBtn.classList.remove('recording');
        recordingIndicator.classList.remove('active');
        statusDiv.textContent = '⏳ Transcription in progress...';
        statusDiv.className = 'status';
    }
}

// ============================================================================
// TRANSCRIPTION
// ============================================================================

async function transcribeAudio(audioBlob) {
    try {
        console.log('[Whisper STT] Sending audio for transcription');
        
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');
        
        const language = languageSelect.value;
        if (language !== 'auto') {
            formData.append('language', language);
            console.log('[Whisper STT] Forced language:', language);
        }
        
        const response = await fetch(`${WHISPER_URL}/inference`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('[Whisper STT] Transcription received:', result);
        
        if (result.text) {
            await insertTextIntoActivePage(result.text.trim());
            statusDiv.textContent = '✅ Transcription successful!';
            statusDiv.className = 'status connected';
        } else {
            throw new Error('No text transcribed');
        }
    } catch (error) {
        console.error('[Whisper STT] Transcription error:', error);
        statusDiv.textContent = '❌ Transcription error';
        statusDiv.className = 'status error';
    }
}

// ============================================================================
// INSERTION
// ============================================================================

async function insertTextIntoActivePage(text) {
    try {
        console.log('[Whisper STT] Inserting text into page');
        
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab || !tab.id) {
            throw new Error('No active tab');
        }
        
        // BUG FIX: Send pressEnter separately in message
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (textToInsert) => {
                console.log('[Whisper STT Popup] Sending message with text and pressEnter=true');
                window.postMessage({ 
                    type: 'WHISPER_INSERT_TEXT', 
                    text: textToInsert,
                    pressEnter: true  // This value must be read by content.js
                }, '*');
            },
            args: [text]
        });
        
        console.log('[Whisper STT] Message sent to content script');
    } catch (error) {
        console.error('[Whisper STT] Insertion error:', error);
        try {
            await navigator.clipboard.writeText(text);
            statusDiv.textContent = '📋 Text copied to clipboard';
            console.log('[Whisper STT] Fallback: clipboard');
        } catch (clipError) {
            console.error('[Whisper STT] Clipboard error:', clipError);
        }
    }
}
