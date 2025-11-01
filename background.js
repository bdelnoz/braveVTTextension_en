/**
 * ============================================================================
 * Filename       : background.js
 * Author         : Bruno DELNOZ
 * Email          : bruno.delnoz@protonmail.com
 * Version        : 3.0.0
 * Date           : 2025-11-01
 * 
 * Description    : Background service worker for Whisper STT extension
 *                  Relays messages between content script and Native Host
 * 
 * CHANGELOG:
 * -----------
 * v3.0.0 - 2025-11-01
 *   - Initial service worker
 *   - Native Messaging relay
 *   - Message passing between content script and native host
 * ============================================================================
 */

const NATIVE_HOST_NAME = 'com.whisper.control';

console.log('[Whisper STT Background v3.0.0] Service worker started');

// ============================================================================
// MESSAGE RELAY
// ============================================================================

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('[Whisper Background] Message received:', request);
    
    if (request.type === 'NATIVE_MESSAGE') {
        // Relay message to Native Host
        console.log('[Whisper Background] Sending to Native Host:', request.data);
        
        chrome.runtime.sendNativeMessage(
            NATIVE_HOST_NAME,
            request.data,
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error('[Whisper Background] Native Host error:', chrome.runtime.lastError);
                    sendResponse({ 
                        error: chrome.runtime.lastError.message,
                        nativeHostMissing: true
                    });
                } else {
                    console.log('[Whisper Background] Native Host response:', response);
                    sendResponse(response);
                }
            }
        );
        
        // Return true to indicate async response
        return true;
    }
});

// ============================================================================
// EXTENSION LIFECYCLE
// ============================================================================

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('[Whisper Background] Extension installed');
    } else if (details.reason === 'update') {
        console.log('[Whisper Background] Extension updated to v3.0.0');
    }
});
