//Developed by Parthkumar Rathod (Wardragon3399)

const notepad = document.getElementById('notepad');
const micBtn = document.getElementById('micBtn');
const fileInput = document.getElementById('fileInput');

// Event Listeners
document.getElementById('saveBtn').addEventListener('click', downloadFile);
document.getElementById('openBtn').addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', openFile);

document.getElementById('shareBtn').addEventListener('click', shareNote);
document.getElementById('micBtn').addEventListener('click', toggleVoiceInput);
document.getElementById('creditsBtn').addEventListener('click', () => toggleCredits(true));
document.getElementById('closeCredits').addEventListener('click', () => toggleCredits(false));
document.getElementById('convertBtn').addEventListener('click', translateText);
document.getElementById('speakBtn').addEventListener('click', playAudio);
document.getElementById('stopBtn').addEventListener('click', stopAudio);
document.getElementById('themeBtn').addEventListener('click', () => document.body.classList.toggle('light-mode'));

// Function to Open/Read File
function openFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        notepad.innerText = e.target.result;
        // Reset file input so same file can be opened again if needed
        fileInput.value = ""; 
    };
    reader.readAsText(file);
}

function toggleCredits(show) {
    document.getElementById('creditsModal').style.display = show ? 'flex' : 'none';
}

async function shareNote() {
    const text = notepad.innerText.trim();
    if (!text) return;
    if (navigator.share) {
        try { await navigator.share({ title: 'Notepad Share', text: text }); } catch (err) {}
    } else {
        window.open('https://mail.google.com/mail/?view=cm&fs=1&su=Note&body=' + encodeURIComponent(text), '_blank');
    }
}

async function translateText() {
    const text = notepad.innerText.trim();
    if(!text) return;
    const src = document.getElementById('srcLang').value;
    const target = document.getElementById('targetLang').value;
    try {
        const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' + src + '&tl=' + target + '&dt=t&q=' + encodeURI(text);
        const response = await fetch(url);
        const data = await response.json();
        notepad.innerText = data[0].map(item => item[0]).join("");
    } catch (e) { console.error("Translation Error"); }
}

function playAudio() {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(notepad.innerText);
    const lang = document.getElementById('targetLang').value;
    utter.lang = lang;
    const voices = window.speechSynthesis.getVoices();
    utter.voice = voices.find(v => v.lang.startsWith(lang)) || null;
    window.speechSynthesis.speak(utter);
}

function stopAudio() { window.speechSynthesis.cancel(); }

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (Recognition) {
    recognition = new Recognition();
    recognition.onresult = (e) => { notepad.innerText = e.results[0][0].transcript; };
    recognition.onend = () => { 
        micBtn.classList.remove('recording'); 
        micBtn.innerText = "🎤 Voice Input"; 
    };
}

function toggleVoiceInput() {
    if (!recognition) return alert("Voice input not supported.");
    recognition.lang = document.getElementById('srcLang').value === 'auto' ? 'en-US' : document.getElementById('srcLang').value;
    recognition.start();
    micBtn.classList.add('recording');
    micBtn.innerText = "🛑 Listening...";
}

function downloadFile() {
    const blob = new Blob([notepad.innerText], {type: 'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Note_' + new Date().getTime() + '.txt';
    a.click();
}