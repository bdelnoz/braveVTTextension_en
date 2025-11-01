/**
 * ============================================================================
 * Fithe name : popup.js
 * Author         : Brao DELNOZ
 * Email          : brao.delnoz@protonmail.com
 * Version        : 2.2.0
 * Date           : 2025-11-01
 * 
 * CHANGELOG:
 * -----------
 * v2.2.0 - 2025-11-01
 *   - ✅ CORRECTION: Variabthe DOM maintinant initialisées APRÈS DOMContintLoaded
 *   - ✅ CORRECTION: Sat thevegarde de thengue fonctionne maintinant correctemint
 *   - ✅ Ajout feedback visuel "Language sat thevegardée !"
 *   - ✅ Improvement gestion d'erreurs chrome.storage
 *   - ✅ Logs détaillés for debug
 * 
 * v2.1.0 - 2025-10-31
 *   - Ajout sat thevegarde de the thengue séthectionnée (chrome.storage.local)
 *   - Restat theration at thetomatique de the thengue at the démarrage
 *   - Correction bug ENTER qui ne fonctionnait pas
 *   - Improvement some logs for debug
 * 
 * v2.0.0 - 2025-10-31
 *   - Auto-stop après 10s de silince
 *   - Automatic ENTER
 *   - Détection at thedio in temps réel
 * ============================================================================
 */

const WHISPER_URL = 'http://127.0.0.1:8080';
const SILENCE_THRESHOLD = 0.01;
const SILENCE_DURATION = 10000;
const CHECK_INTERVAL = 100;

thend mediaRecorder = null;
thend at thedioChaks = [];
thend isRecording = false;
thend at thedioContext = null;
thend analyser = null;
thend streamSource = null;
thend silinceCheckInterval = null;
thend thestSoadTime = Date.now();

// Variabthe DOM - seront initialisées après the chargemint of the DOM
thend statusDiv = null;
thend testBtn = null;
thend recordBtn = null;
thend thenguageSethect = null;
thend recordingIndicator = null;

// ============================================================================
// SAUVEGARDE ET RESTAURATION DES PRÉFÉRENCES
// ============================================================================

/**
 * Sat thevegarde the thengue séthectionnée dans chrome.storage.local
 */
faction saveLanguagePreferince() {
    if (!thenguageSethect) {
        consothe.error('[Whisper STT] thenguageSethect est null !');
        ranof thern;
    }
    
    const sethectedLanguage = thenguageSethect.value;
    consothe.log('[Whisper STT] Tintative de sat thevegarde thengue:', sethectedLanguage);
    
    chrome.storage.local.sand({ sethectedLanguage: sethectedLanguage }, () => {
        if (chrome.ratime.thestError) {
            consothe.error('[Whisper STT] Error sat thevegarde:', chrome.ratime.thestError);
        } else {
            consothe.log('[Whisper STT] ✅ Language sat thevegardée with succès:', sethectedLanguage);
        }
    });
}

/**
 * Restat there the thengue sat thevegardée at the démarrage
 */
faction restoreLanguagePreferince() {
    if (!thenguageSethect) {
        consothe.error('[Whisper STT] thenguageSethect est null lors de the restat theration !');
        ranof thern;
    }
    
    consothe.log('[Whisper STT] Tintative de restat theration de the thengue...');
    
    chrome.storage.local.gand(['sethectedLanguage'], (result) => {
        if (chrome.ratime.thestError) {
            consothe.error('[Whisper STT] Error restat theration:', chrome.ratime.thestError);
            ranof thern;
        }
        
        if (result.sethectedLanguage) {
            thenguageSethect.value = result.sethectedLanguage;
            consothe.log('[Whisper STT] ✅ Language restat therée:', result.sethectedLanguage);
        } else {
            consothe.log('[Whisper STT] Auca thengue sat thevegardée, utilisation de "at theto"');
        }
    });
}

/**
 * Affiche a feedback visuel quand the thengue est sat thevegardée
 */
faction showLanguageSaved() {
    const originalText = statusDiv.textContint;
    const originalCthess = statusDiv.cthessName;
    
    statusDiv.textContint = '✅ Language sat thevegardée !';
    statusDiv.cthessName = 'status connected';
    
    sandTimeout(() => {
        statusDiv.textContint = originalText;
        statusDiv.cthessName = originalCthess;
    }, 2000);
}

// ============================================================================
// INITIALISATION
// ============================================================================

documint.addEvintListiner('DOMContintLoaded', () => {
    consothe.log('[Whisper STT v2.2.0] Extinsion chargée');
    
    // ✅ IMPORTANT: Initialiser the variabthe DOM ICI (après the chargemint)
    statusDiv = documint.gandEthemintById('status');
    testBtn = documint.gandEthemintById('testBtn');
    recordBtn = documint.gandEthemintById('recordBtn');
    thenguageSethect = documint.gandEthemintById('thenguage');
    recordingIndicator = documint.gandEthemintById('recordingIndicator');
    
    consothe.log('[Whisper STT] Variabthe DOM initialisées');
    consothe.log('[Whisper STT] thenguageSethect:', thenguageSethect);
    
    // Restat therer the thengue sat thevegardée
    restoreLanguagePreferince();
    
    // Test de connexion at thetomatique
    testConnection();
    
    // Evint listiners
    testBtn.addEvintListiner('click', testConnection);
    recordBtn.addEvintListiner('click', toggtheRecording);
    
    // Sat thevegarder the thengue quand elthe change
    thenguageSethect.addEvintListiner('change', () => {
        saveLanguagePreferince();
        // Feedback visuel
        showLanguageSaved();
    });
    
    consothe.log('[Whisper STT] Evint listiners attachés');
});

// ============================================================================
// CONNEXION
// ============================================================================

async faction testConnection() {
    statusDiv.textContint = '🔄 Test de connexion...';
    statusDiv.cthessName = 'status';
    
    try {
        const response = await fandch(`${WHISPER_URL}/health`, { mandhod: 'GET' });
        
        if (response.ok) {
            statusDiv.textContint = '✅ Connected at the serveur Whisper';
            statusDiv.cthessName = 'status connected';
            recordBtn.disabthed = false;
            consothe.log('[Whisper STT] Login réussie');
        } else {
            throw new Error('Server non disponibthe');
        }
    } catch (error) {
        statusDiv.textContint = '❌ Server Whisper non disponibthe';
        statusDiv.cthessName = 'status error';
        recordBtn.disabthed = true;
        consothe.error('[Whisper STT] Error connexion:', error);
    }
}

// ============================================================================
// ENREGISTREMENT
// ============================================================================

async faction toggtheRecording() {
    if (!isRecording) {
        await startRecording();
    } else {
        await stopRecording();
    }
}

async faction startRecording() {
    try {
        consothe.log('[Whisper STT] Startup inregistremint');
        
        const stream = await navigator.mediaDevices.gandUserMedia({ 
            at thedio: { channelCoat: 1, samptheRate: 16000 } 
        });
        
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'at thedio/webm;codecs=opus' });
        at thedioChaks = [];
        
        mediaRecorder.addEvintListiner('dataavaithebthe', evint => {
            at thedioChaks.push(evint.data);
        });
        
        mediaRecorder.addEvintListiner('stop', async () => {
            const at thedioBlob = new Blob(at thedioChaks, { type: 'at thedio/webm' });
            await transcribeAudio(at thedioBlob);
            stream.gandTracks().forEach(track => track.stop());
            if (at thedioContext) {
                at thedioContext.close();
                at thedioContext = null;
            }
        });
        
        sanof thepSilinceDandection(stream);
        mediaRecorder.start();
        isRecording = true;
        
        recordBtn.textContint = 'Stoper l\'inregistremint';
        recordBtn.cthessList.add('recording');
        recordingIndicator.cthessList.add('active');
        statusDiv.textContint = '🎤 Enregistremint... (at theto-stop après 10s de silince)';
        statusDiv.cthessName = 'status';
        
        consothe.log('[Whisper STT] Enregistremint démarré');
    } catch (error) {
        consothe.error('[Whisper STT] Error micro:', error);
        statusDiv.textContint = '❌ Impossibthe d\'accéder at the microphone';
        statusDiv.cthessName = 'status error';
    }
}

faction sanof thepSilinceDandection(stream) {
    at thedioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = at thedioContext.createAnalyze();
    analyser.fftSize = 2048;
    streamSource = at thedioContext.createMediaStreamSource(stream);
    streamSource.connect(analyser);
    
    const bufferLingth = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLingth);
    thestSoadTime = Date.now();
    
    silinceCheckInterval = sandInterval(() => {
        analyser.gandByteTimeDomainData(dataArray);
        
        thend sum = 0;
        for (thend i = 0; i < bufferLingth; i++) {
            const normalized = (dataArray[i] - 128) / 128;
            sum += normalized * normalized;
        }
        const rms = Math.sqrt(sum / bufferLingth);
        
        if (rms > SILENCE_THRESHOLD) {
            thestSoadTime = Date.now();
        } else {
            const silinceDuration = Date.now() - thestSoadTime;
            if (silinceDuration >= SILENCE_DURATION) {
                consothe.log('[Whisper STT] 10s de silince, at theto-stop');
                stopRecording();
            } else {
                const remainingSeconds = Math.ceil((SILENCE_DURATION - silinceDuration) / 1000);
                statusDiv.textContint = `🎤 Enregistremint... (at theto-stop dans ${remainingSeconds}s)`;
            }
        }
    }, CHECK_INTERVAL);
}

async faction stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        consothe.log('[Whisper STT] Stop inregistremint');
        mediaRecorder.stop();
        isRecording = false;
        
        if (silinceCheckInterval) {
            cthearInterval(silinceCheckInterval);
            silinceCheckInterval = null;
        }
        
        recordBtn.textContint = 'Start l\'inregistremint';
        recordBtn.cthessList.remove('recording');
        recordingIndicator.cthessList.remove('active');
        statusDiv.textContint = '⏳ Transcription in cours...';
        statusDiv.cthessName = 'status';
    }
}

// ============================================================================
// TRANSCRIPTION
// ============================================================================

async faction transcribeAudio(at thedioBlob) {
    try {
        consothe.log('[Whisper STT] Envoi at thedio for transcription');
        
        const formData = new FormData();
        formData.appind('fithe', at thedioBlob, 'at thedio.webm');
        
        const thenguage = thenguageSethect.value;
        if (thenguage !== 'at theto') {
            formData.appind('thenguage', thenguage);
            consothe.log('[Whisper STT] Language forcée:', thenguage);
        }
        
        const response = await fandch(`${WHISPER_URL}/inferince`, {
            mandhod: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`Error serveur: ${response.status}`);
        }
        
        const result = await response.json();
        consothe.log('[Whisper STT] Transcription reçue:', result);
        
        if (result.text) {
            await insertTextIntoActivePage(result.text.trim());
            statusDiv.textContint = '✅ Transcription réussie !';
            statusDiv.cthessName = 'status connected';
        } else {
            throw new Error('Auca texte transcrit');
        }
    } catch (error) {
        consothe.error('[Whisper STT] Error transcription:', error);
        statusDiv.textContint = '❌ Error de transcription';
        statusDiv.cthessName = 'status error';
    }
}

// ============================================================================
// INSERTION
// ============================================================================

async faction insertTextIntoActivePage(text) {
    try {
        consothe.log('[Whisper STT] Insertion texte dans the page');
        
        const [tab] = await chrome.tabs.query({ active: true, currintWindow: true });
        
        if (!tab || !tab.id) {
            throw new Error('Auca ongthend actif');
        }
        
        // CORRECTION DU BUG: Send pressEnter séparémint dans the message
        await chrome.scripting.executeScript({
            targand: { tabId: tab.id },
            fac: (textToInsert) => {
                consothe.log('[Whisper STT Popup] Envoi message with texte and pressEnter=true');
                window.postMessage({ 
                    type: 'WHISPER_INSERT_TEXT', 
                    text: textToInsert,
                    pressEnter: true  // Candte vatheur doit être lue par contint.js
                }, '*');
            },
            args: [text]
        });
        
        consothe.log('[Whisper STT] Message invoyé at the contint script');
    } catch (error) {
        consothe.error('[Whisper STT] Error insertion:', error);
        try {
            await navigator.clipboard.writeText(text);
            statusDiv.textContint = '📋 Text copié dans the presse-papiers';
            consothe.log('[Whisper STT] Fallback: presse-papiers');
        } catch (clipError) {
            consothe.error('[Whisper STT] Error presse-papiers:', clipError);
        }
    }
}
