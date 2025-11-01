/**
 * ============================================================================
 * Filename       : content.js
 * Author         : Bruno DELNOZ
 * Email          : bruno.delnoz@protonmail.com
 * Version        : 2.2.0
 * Date           : 2025-10-31
 * 
 * CHANGELOG:
 * -----------
 * v2.2.0 - 2025-10-31
 *   - Full English translation of code and comments
 *   - Updated all console logs
 *   - Maintained all functionality
 * 
 * v2.1.0 - 2025-10-31
 *   - Fixed ENTER bug that wasn't working
 *   - Improved ENTER simulation with more events
 *   - Added detailed logs for debugging
 *   - Test with form.submit() for Claude.ai
 * 
 * v2.0.0 - 2025-10-31
 *   - simulateEnterKey function
 *   - Automatic ENTER support
 *   - 3 insertion methods
 * ============================================================================
 */

// ============================================================================
// MAIN LISTENER
// ============================================================================

window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    
    if (event.data.type === 'WHISPER_INSERT_TEXT') {
        console.log('[Whisper STT Content] Message received:', event.data);
        const text = event.data.text;
        const pressEnter = event.data.pressEnter || false;
        console.log('[Whisper STT Content] pressEnter=', pressEnter);
        insertText(text, pressEnter);
    }
});

// ============================================================================
// MAIN INSERTION
// ============================================================================

function insertText(text, pressEnter = false) {
    console.log('[Whisper STT Content] Insertion:', text);
    console.log('[Whisper STT Content] PressEnter:', pressEnter);
    
    const activeElement = document.activeElement;
    
    if (!activeElement) {
        console.warn('[Whisper STT Content] No active element');
        return;
    }
    
    // Input/Textarea
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
        insertIntoInputOrTextarea(activeElement, text);
        if (pressEnter) {
            console.log('[Whisper STT Content] Calling simulateEnterKey on input/textarea');
            simulateEnterKey(activeElement);
        }
        return;
    }
    
    // ContentEditable
    if (activeElement.isContentEditable) {
        insertIntoContentEditable(activeElement, text);
        if (pressEnter) {
            console.log('[Whisper STT Content] Calling simulateEnterKey on contentEditable');
            simulateEnterKey(activeElement);
        }
        return;
    }
    
    // Search for editable parent
    const editableParent = findEditableParent(activeElement);
    if (editableParent) {
        console.log('[Whisper STT Content] Editable parent found');
        if (editableParent.isContentEditable) {
            insertIntoContentEditable(editableParent, text);
            if (pressEnter) simulateEnterKey(editableParent);
            return;
        }
    }
    
    // Search for nearby field
    const nearestInput = findNearestInput();
    if (nearestInput) {
        console.log('[Whisper STT Content] Nearby field found');
        nearestInput.focus();
        setTimeout(() => {
            if (nearestInput.tagName === 'INPUT' || nearestInput.tagName === 'TEXTAREA') {
                insertIntoInputOrTextarea(nearestInput, text);
            } else if (nearestInput.isContentEditable) {
                insertIntoContentEditable(nearestInput, text);
            }
            if (pressEnter) simulateEnterKey(nearestInput);
        }, 100);
    } else {
        console.warn('[Whisper STT Content] No field found');
    }
}

// ============================================================================
// INPUT/TEXTAREA INSERTION
// ============================================================================

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
    console.log('[Whisper STT Content] ✅ Text inserted into input/textarea');
}

// ============================================================================
// CONTENTEDITABLE INSERTION
// ============================================================================

function insertIntoContentEditable(element, text) {
    console.log('[Whisper STT Content] Inserting into contentEditable');
    element.focus();
    
    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
        const range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }
    
    // Method 1: execCommand
    try {
        const success = document.execCommand('insertText', false, text);
        if (success) {
            console.log('[Whisper STT Content] ✅ execCommand successful');
            triggerInputEvents(element);
            return;
        }
    } catch (e) {
        console.log('[Whisper STT Content] execCommand failed:', e);
    }
    
    // Method 2: Manual insertion
    try {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
        console.log('[Whisper STT Content] ✅ Manual insertion successful');
        triggerInputEvents(element);
    } catch (e) {
        console.error('[Whisper STT Content] ❌ All methods failed:', e);
    }
}

// ============================================================================
// ENTER SIMULATION - FIXED VERSION
// ============================================================================

function simulateEnterKey(element) {
    console.log('[Whisper STT Content] ⏎ ENTER simulation started');
    
    // Wait for insertion to complete
    setTimeout(() => {
        // Event configuration
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
        
        console.log('[Whisper STT Content] Creating keyboard events');
        
        // Keydown
        const keydownEvent = new KeyboardEvent('keydown', eventInit);
        element.dispatchEvent(keydownEvent);
        console.log('[Whisper STT Content] keydown dispatched');
        
        // Keypress
        try {
            const keypressEvent = new KeyboardEvent('keypress', eventInit);
            element.dispatchEvent(keypressEvent);
            console.log('[Whisper STT Content] keypress dispatched');
        } catch (e) {
            console.log('[Whisper STT Content] keypress not supported');
        }
        
        // Keyup
        const keyupEvent = new KeyboardEvent('keyup', eventInit);
        element.dispatchEvent(keyupEvent);
        console.log('[Whisper STT Content] keyup dispatched');
        
        // IMPORTANT: For Claude.ai and other React editors
        // Also try to trigger a submit event on parent form
        const form = element.closest('form');
        if (form) {
            console.log('[Whisper STT Content] Form found, attempting submit');
            
            // Create submit event
            const submitEvent = new Event('submit', { 
                bubbles: true, 
                cancelable: true 
            });
            form.dispatchEvent(submitEvent);
            console.log('[Whisper STT Content] submit dispatched on form');
        }
        
        // For editors that only listen to clicks on submit button
        // Search for nearby submit button
        const submitButton = findSubmitButton(element);
        if (submitButton) {
            console.log('[Whisper STT Content] Submit button found, simulating click');
            submitButton.click();
            console.log('[Whisper STT Content] Click simulated on submit button');
        }
        
        console.log('[Whisper STT Content] ✅ ENTER simulation completed');
    }, 100);
}

// ============================================================================
// FIND SUBMIT BUTTON
// ============================================================================

function findSubmitButton(element) {
    // Search in parent form
    const form = element.closest('form');
    if (form) {
        // Search for submit type button
        const submitBtn = form.querySelector('button[type="submit"]') || 
                         form.querySelector('input[type="submit"]') ||
                         form.querySelector('button:not([type])'); // Button without type = submit by default
        if (submitBtn) {
            console.log('[Whisper STT Content] Submit button found in form');
            return submitBtn;
        }
    }
    
    // Search for button near element (for Claude.ai)
    const container = element.parentElement?.parentElement;
    if (container) {
        const buttons = container.querySelectorAll('button');
        for (const btn of buttons) {
            // Search for button with evocative text
            const btnText = btn.textContent.toLowerCase();
            if (btnText.includes('send') || 
                btnText.includes('submit') ||
                btn.getAttribute('aria-label')?.toLowerCase().includes('send')) {
                console.log('[Whisper STT Content] Send/submit button found:', btn);
                return btn;
            }
        }
    }
    
    console.log('[Whisper STT Content] No submit button found');
    return null;
}

// ============================================================================
// EVENTS
// ============================================================================

function triggerInputEvents(element) {
    const events = [
        new Event('input', { bubbles: true, cancelable: true }),
        new Event('change', { bubbles: true, cancelable: true }),
        new KeyboardEvent('keydown', { bubbles: true }),
        new KeyboardEvent('keyup', { bubbles: true }),
        new InputEvent('beforeinput', { bubbles: true }),
        new InputEvent('input', { bubbles: true, inputType: 'insertText' })
    ];
    
    events.forEach(event => {
        try {
            element.dispatchEvent(event);
        } catch (e) {}
    });
}

// ============================================================================
// UTILITIES
// ============================================================================

function findEditableParent(element) {
    let current = element.parentElement;
    let depth = 0;
    while (current && depth < 10) {
        if (current.isContentEditable || 
            current.tagName === 'INPUT' || 
            current.tagName === 'TEXTAREA') {
            return current;
        }
        current = current.parentElement;
        depth++;
    }
    return null;
}

function findNearestInput() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="search"], input:not([type]), textarea');
    for (const input of inputs) {
        if (isElementVisible(input)) return input;
    }
    
    const editables = document.querySelectorAll('[contenteditable="true"]');
    for (const editable of editables) {
        if (isElementVisible(editable)) return editable;
    }
    return null;
}

function isElementVisible(element) {
    if (!element) return false;
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           element.offsetWidth > 0 &&
           element.offsetHeight > 0;
}

console.log('[Whisper STT Content v2.2.0] Content script loaded and ready');
