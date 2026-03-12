// Developed by Parthkumar Rathod (Wardragon3399)
const notepad = document.getElementById('notepad');
const micBtn = document.getElementById('micBtn');
const stopMicBtn = document.getElementById('stopMicBtn');
const fileInput = document.getElementById('fileInput');

let silenceTimer;
const SILENCE_LIMIT = 3000; 

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
let isUserStopping = true; // Start as true so it doesn't auto-start on load

if (Recognition) {
    recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        clearTimeout(silenceTimer);
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        notepad.innerText += " " + transcript;

        silenceTimer = setTimeout(() => {
            if (!isUserStopping) {
                notepad.innerText += "\n\n";
            }
        }, SILENCE_LIMIT);
    };

    recognition.onerror = (event) => {
        console.error("Speech Recognition Error: ", event.error);
        if (event.error === 'not-allowed') {
            alert("Microphone access blocked. Please click the camera/mic icon in the address bar to allow.");
        }
    };

    recognition.onend = () => {
        // Only restart if the user hasn't clicked 'Stop' and it wasn't a permanent error
        if (!isUserStopping) {
            try {
                recognition.start();
            } catch (e) {
                console.log("Restart failed, but that's okay.");
            }
        }
    };
}

function startVoice() {
    if (!recognition) return alert("Speech Recognition not supported.");
    
    // Reset state
    isUserStopping = false;
    notepad.classList.add('recording-active');
    micBtn.style.display = "none";
    stopMicBtn.style.display = "inline-block";

    // Set language and Start
    recognition.lang = document.getElementById('srcLang').value === 'auto' ? 'en-US' : document.getElementById('srcLang').value;
    
    try {
        recognition.start();
    } catch (e) {
        console.error("Already started or blocked.");
    }
}

function stopVoice() {
    isUserStopping = true;
    clearTimeout(silenceTimer);
    recognition.stop();
    micBtn.style.display = "inline-block";
    stopMicBtn.style.display = "none";
    notepad.classList.remove('recording-active');
}

// Keep your other utility functions (translate, download, etc.) the same as before
async function translateText() {
    const text = notepad.innerText.trim();
    if(!text) return;
    const src = document.getElementById('srcLang').value.split('-')[0];
    const target = document.getElementById('targetLang').value;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${src}&tl=${target}&dt=t&q=${encodeURI(text)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        notepad.innerText = data[0].map(item => item[0]).join("");
    } catch (e) { console.error("Error"); }
}

function playAudio() {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(notepad.innerText);
    utter.lang = document.getElementById('targetLang').value;
    window.speechSynthesis.speak(utter);
}

function downloadFile() {
    const blob = new Blob([notepad.innerText], {type: 'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Note_' + Date.now() + '.txt';
    a.click();
}

function openFile(e) {
    const reader = new FileReader();
    reader.onload = (event) => { notepad.innerText = event.target.result; };
    reader.readAsText(e.target.files[0]);
}

function toggleCredits(show) { document.getElementById('creditsModal').style.display = show ? 'flex' : 'none'; }

function shareNote() {
    const text = notepad.innerText.trim();
    if (navigator.share) { navigator.share({ title: 'My Note', text: text }); }
    else { window.open(`https://mail.google.com/mail/?view=cm&fs=1&body=${encodeURIComponent(text)}`); }
}// Developed by Parthkumar Rathod (Wardragon3399)
const notepad = document.getElementById('notepad');
const micBtn = document.getElementById('micBtn');
const stopMicBtn = document.getElementById('stopMicBtn');
const fileInput = document.getElementById('fileInput');

let silenceTimer;
const SILENCE_LIMIT = 3000; 

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
let isUserStopping = true; // Start as true so it doesn't auto-start on load

if (Recognition) {
    recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        clearTimeout(silenceTimer);
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        notepad.innerText += " " + transcript;

        silenceTimer = setTimeout(() => {
            if (!isUserStopping) {
                notepad.innerText += "\n\n";
            }
        }, SILENCE_LIMIT);
    };

    recognition.onerror = (event) => {
        console.error("Speech Recognition Error: ", event.error);
        if (event.error === 'not-allowed') {
            alert("Microphone access blocked. Please click the camera/mic icon in the address bar to allow.");
        }
    };

    recognition.onend = () => {
        // Only restart if the user hasn't clicked 'Stop' and it wasn't a permanent error
        if (!isUserStopping) {
            try {
                recognition.start();
            } catch (e) {
                console.log("Restart failed, but that's okay.");
            }
        }
    };
}

function startVoice() {
    if (!recognition) return alert("Speech Recognition not supported.");
    
    // Reset state
    isUserStopping = false;
    notepad.classList.add('recording-active');
    micBtn.style.display = "none";
    stopMicBtn.style.display = "inline-block";

    // Set language and Start
    recognition.lang = document.getElementById('srcLang').value === 'auto' ? 'en-US' : document.getElementById('srcLang').value;
    
    try {
        recognition.start();
    } catch (e) {
        console.error("Already started or blocked.");
    }
}

function stopVoice() {
    isUserStopping = true;
    clearTimeout(silenceTimer);
    recognition.stop();
    micBtn.style.display = "inline-block";
    stopMicBtn.style.display = "none";
    notepad.classList.remove('recording-active');
}

// Keep your other utility functions (translate, download, etc.) the same as before
async function translateText() {
    const text = notepad.innerText.trim();
    if(!text) return;
    const src = document.getElementById('srcLang').value.split('-')[0];
    const target = document.getElementById('targetLang').value;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${src}&tl=${target}&dt=t&q=${encodeURI(text)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        notepad.innerText = data[0].map(item => item[0]).join("");
    } catch (e) { console.error("Error"); }
}

function playAudio() {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(notepad.innerText);
    utter.lang = document.getElementById('targetLang').value;
    window.speechSynthesis.speak(utter);
}

function downloadFile() {
    const blob = new Blob([notepad.innerText], {type: 'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Note_' + Date.now() + '.txt';
    a.click();
}

function openFile(e) {
    const reader = new FileReader();
    reader.onload = (event) => { notepad.innerText = event.target.result; };
    reader.readAsText(e.target.files[0]);
}

function toggleCredits(show) { document.getElementById('creditsModal').style.display = show ? 'flex' : 'none'; }

function shareNote() {
    const text = notepad.innerText.trim();
    if (navigator.share) { navigator.share({ title: 'My Note', text: text }); }
    else { window.open(`https://mail.google.com/mail/?view=cm&fs=1&body=${encodeURIComponent(text)}`); }
}
