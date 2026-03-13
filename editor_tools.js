/**
 * editor_tools.js 
 * Developed by: Wardragon3399
 * Handles text formatting and editor-specific functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    const notepad = document.getElementById('notepad');
    
    // Select our buttons
    const btnBold = document.getElementById('boldBtn');
    const btnItalic = document.getElementById('italicBtn');
    const btnUnderline = document.getElementById('underlineBtn');
    const btnStrike = document.getElementById('strikeBtn');

    function format(command) {
        document.execCommand(command, false, null);
        notepad.focus();
        updateToolbar(); // Check states immediately after click
    }

    // Function to check if Bold/Italic etc are active at cursor position
    function updateToolbar() {
        if (document.queryCommandState('bold')) btnBold.classList.add('format-active');
        else btnBold.classList.remove('format-active');

        if (document.queryCommandState('italic')) btnItalic.classList.add('format-active');
        else btnItalic.classList.remove('format-active');

        if (document.queryCommandState('underline')) btnUnderline.classList.add('format-active');
        else btnUnderline.classList.remove('format-active');

        if (document.queryCommandState('strikeThrough')) btnStrike.classList.add('format-active');
        else btnStrike.classList.remove('format-active');
    }

    // --- LISTENERS ---
    btnBold.addEventListener('click', () => format('bold'));
    btnItalic.addEventListener('click', () => format('italic'));
    btnUnderline.addEventListener('click', () => format('underline'));
    btnStrike.addEventListener('click', () => format('strikeThrough'));

    // Update buttons whenever the user clicks or moves the cursor in the notepad
    notepad.addEventListener('keyup', updateToolbar);
    notepad.addEventListener('mouseup', updateToolbar);
	
	// --- KEYBOARD SHORTCUTS FOR FORMATTING ---
   // To handle Alt + H + 4, we need to track if H was pressed while Alt was down
    let altHPressed = false;

    document.addEventListener('keydown', (e) => {
        if (document.activeElement !== notepad) return;

        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;
        const key = e.key.toLowerCase();

        // 1. Standard Shortcuts
        if (ctrlOrCmd && key === 'b') { e.preventDefault(); format('bold'); }
        if (ctrlOrCmd && key === 'i') { e.preventDefault(); format('italic'); }
        if (ctrlOrCmd && key === 'u') { e.preventDefault(); format('underline'); }

        // 2. Strikethrough for MAC: Cmd + Shift + X
        if (isMac && ctrlOrCmd && e.shiftKey && key === 'x') {
            e.preventDefault();
            format('strikeThrough');
        }

        // 3. Strikethrough for WINDOWS: Alt + H + 4
        if (!isMac) {
            // Check if user is holding Alt and presses H
            if (e.altKey && key === 'h') {
                e.preventDefault(); // Stop browser help menu
                altHPressed = true;
                
                // Reset the tracker after 1 second if 4 isn't pressed
                setTimeout(() => { altHPressed = false; }, 1000);
            }

            // If Alt+H was just pressed and the user now hits 4
            if (altHPressed && key === '4') {
                e.preventDefault();
                format('strikeThrough');
                altHPressed = false; // Reset
            }
        }
    });
	
});
