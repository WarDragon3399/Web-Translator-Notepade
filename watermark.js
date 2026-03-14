/**
 * watermark.js - Pro Court Version
 */
(function() {
    console.log("Watermark Engine: Checking for elements...");

    const setupWatermark = () => {
        const btn = document.getElementById('watermarkBtn');
        const menu = document.getElementById('watermarkDropdown');
        const display = document.getElementById('printWatermark');
        const wmImageInput = document.getElementById('wmImageInput');

        // Check if EVERYTHING is ready
        if (!btn || !menu || !wmImageInput || !display) {
            console.log("Waiting for Watermark elements...");
            setTimeout(setupWatermark, 500);
            return;
        }

        // --- 1. Toggle Menu ---
        btn.onclick = (e) => {
            e.stopPropagation();
            const rect = btn.getBoundingClientRect();
            menu.style.display = 'block';
            menu.style.left = rect.left + 'px';
            // Position ABOVE the button
            menu.style.top = (rect.top - menu.offsetHeight - 10) + 'px';
        };

        // --- 2. Text Option ---
        document.getElementById('wmTextOption').onclick = () => {
            const val = prompt("Enter Watermark Text:", "CONFIDENTIAL");
            if (val) {
                display.innerHTML = `<div style="position:fixed; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-45deg); opacity:0.1; font-size:80pt; font-weight:bold; color:black; z-index:-1; pointer-events:none; white-space:nowrap; font-family:sans-serif;">${val}</div>`;
                alert("Text Watermark Set!");
            }
            menu.style.display = 'none';
        };

        // --- 3. Image Option (The Bridge) ---
        document.getElementById('wmImageOption').onclick = () => {
            menu.style.display = 'none';
            wmImageInput.click(); // This opens the window
        };

        // --- 4. File Selection Logic ---
        wmImageInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    display.innerHTML = `<img src="${event.target.result}" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%) rotate(-45deg); opacity:0.1; max-width:500px; z-index:-1; pointer-events:none; filter:grayscale(1);">`;
                    alert("Image Watermark Set!");
                };
                reader.readAsDataURL(file);
            }
        };

        // --- 5. Clear Option ---
        document.getElementById('wmClearOption').onclick = () => {
            display.innerHTML = "";
            menu.style.display = 'none';
        };

        // Close on global click
        window.addEventListener('click', () => { menu.style.display = 'none'; });
        
        console.log("Watermark Engine: Ready and Bound.");
    };

    setupWatermark();
})();