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
	const btnBullet = document.getElementById('bulletBtn');
	const upperBtn = document.getElementById('upperBtn');
    const lowerBtn = document.getElementById('lowerBtn');
	const fontSizeSelect = document.getElementById('fontSizeSelect');
	const fontSelect = document.getElementById('fontStyleSelect');	
	const srcLang = document.getElementById('srcLang');
	
	setTimeout(checkLanguageForCase, 100);
	
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
		
		if (document.queryCommandState('insertUnorderedList')) btnBullet.classList.add('format-active');
        else btnBullet.classList.remove('format-active');
    }
	
	//for Casechanger 
	// 1. Function to handle Case Change
    function changeCase(type) {
        const selection = window.getSelection();
        if (!selection.rangeCount || selection.toString().length === 0) return;

        const selectedText = selection.toString();
        const replacementText = (type === 'upper') 
            ? selectedText.toUpperCase() 
            : selectedText.toLowerCase();

        // Using insertText maintains the undo/redo buffer
        document.execCommand('insertText', false, replacementText);
        notepad.focus();
    }

    // 2. Function to enable/disable buttons based on Language
    function checkLanguageForCase() {
        const lang = srcLang.value; 
        
        // Enable if language is English (en), OR if it's set to 'auto' 
        // because auto-detect often handles English.
        if (lang.startsWith('en') || lang === 'auto') {
            upperBtn.style.opacity = "1";
            upperBtn.style.pointerEvents = "auto";
            upperBtn.style.filter = "grayscale(0%)";
            
            lowerBtn.style.opacity = "1";
            lowerBtn.style.pointerEvents = "auto";
            lowerBtn.style.filter = "grayscale(0%)";
        } else {
            // Disable for Gujarati, Hindi, etc.
            upperBtn.style.opacity = "0.3";
            upperBtn.style.pointerEvents = "none";
            upperBtn.style.filter = "grayscale(100%)";
            
            lowerBtn.style.opacity = "0.3";
            lowerBtn.style.pointerEvents = "none";
            lowerBtn.style.filter = "grayscale(100%)";
        }
    }
	
	//for font size
	function populateFontSizes() {
        // Clear existing options
        fontSizeSelect.innerHTML = '';

        // Check if user is on mobile
        const isMobile = window.innerWidth <= 600;

        let sizes;
        if (isMobile) {
            // Mobile-friendly sizes only
            sizes = [
                { label: "Small", value: "2" },
                { label: "Normal", value: "3" },
                { label: "Large", value: "4" }
            ];
        } 
		else {
            // Full desktop range
            sizes = [
                { label: "Tiny", value: "1" },
                { label: "Small", value: "2" },
                { label: "Normal", value: "3" },
                { label: "Medium", value: "4" },
                { label: "Large", value: "5" },
                { label: "Huge", value: "6" },
                { label: "Maximum", value: "7" }
            ];
        }

        sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size.value;
            option.text = size.label;
            // Set 'Normal' as default
            if (size.label === "Normal") option.selected = true;
            fontSizeSelect.appendChild(option);
        });
    }

	//for font Style
	async function loadSystemFonts() {
        if (!window.queryLocalFonts) {
            console.warn("Local Font Access API not supported. Using web-safe fonts.");
            return populateWebSafeFonts();
        }

        try {
            const status = await navigator.permissions.query({ name: 'local-fonts' });
            if (status.state === 'denied') return populateWebSafeFonts();

            const fonts = await window.queryLocalFonts();
            updateFontList(fonts);
        } catch (err) {
            console.error(err);
        }
    }

    function updateFontList(fonts) {
        const currentLang = srcLang.value.split('-')[0]; // e.g., 'gu' from 'gu-IN'
        fontSelect.innerHTML = '<option value="inherit">Default Font</option>';

        // Filter fonts that match the language script
        // Note: Browsers don't give "Language" metadata easily, 
        // so we check if the font name contains language keywords
        const filtered = fonts.filter(f => {
            const name = f.fullName.toLowerCase();
            if (currentLang === 'gu') return name.includes('gujarati') || name.includes('shruti');
            if (currentLang === 'hi') return name.includes('hindi') || name.includes('mangal') || name.includes('devanagari');
            if (currentLang === 'ar') return name.includes('arabic');
            return true; // Show all for English/Others
        });

        // Limit to first 50 to keep the menu fast
        filtered.slice(0, 700).forEach(font => {
            const opt = document.createElement('option');
            opt.value = font.family;
            opt.textContent = font.fullName;
            fontSelect.appendChild(opt);
        });
    }

    function populateWebSafeFonts() {
        const generic = ["Arial", "Verdana", "Times New Roman", "Courier New", "Georgia"];
        generic.forEach(f => {
            const opt = document.createElement('option');
            opt.value = opt.textContent = f;
            fontSelect.appendChild(opt);
        });
    }

    // Apply font change
    fontSelect.addEventListener('change', () => {
        document.execCommand('fontName', false, fontSelect.value);
        notepad.focus();
    });

    // --- LISTENERS ---
    btnBold.addEventListener('click', () => format('bold'));
    btnItalic.addEventListener('click', () => format('italic'));
    btnUnderline.addEventListener('click', () => format('underline'));
    btnStrike.addEventListener('click', () => format('strikeThrough'));
	btnBullet.addEventListener('click', () => format('insertUnorderedList'));
	upperBtn.addEventListener('click', () => changeCase('upper'));
    lowerBtn.addEventListener('click', () => changeCase('lower'));
    srcLang.addEventListener('change', checkLanguageForCase);
	
    // Update buttons whenever the user clicks or moves the cursor in the notepad
    notepad.addEventListener('keyup', updateToolbar);
    notepad.addEventListener('mouseup', updateToolbar);
	
	//for font size LISTENERS
	// Run on load and when window is resized
    populateFontSizes();
    window.addEventListener('resize', populateFontSizes);

    // Apply font size change
    fontSizeSelect.addEventListener('change', () => {
        document.execCommand('fontSize', false, fontSizeSelect.value);
        notepad.focus();
    });
	
	// for font Style LISTENERS
	// Re-filter fonts when the user changes the writing language
    srcLang.addEventListener('change', loadSystemFonts);
	
	// Initial load
    loadSystemFonts();
	
	// Run once on load
	checkLanguageForCase();
	
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
		// 4. Bullet Shortcut: Ctrl/Cmd + Shift + L
		if (ctrlOrCmd && e.shiftKey && e.key.toLowerCase() === 'l') {
			e.preventDefault();
			format('insertUnorderedList');
		}
		
    });
	
});
