// Developed by Parthkumar Rathod (Wardragon3399)
document.addEventListener('DOMContentLoaded', () => {
    const notepad = document.getElementById('notepad');
    const micBtn = document.getElementById('micBtn');
    const stopMicBtn = document.getElementById('stopMicBtn');
    const fileInput = document.getElementById('fileInput');

    let silenceTimer;
    const SILENCE_LIMIT = 3000; 

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;
    let isUserStopping = true;

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
        };

        recognition.onend = () => {
            if (!isUserStopping) {
                try { recognition.start(); } catch (e) {}
            }
        };
    }

    // Voice Functions
    function startVoice() {
        if (!recognition) return alert("Speech Recognition not supported.");
        isUserStopping = false;
        notepad.classList.add('recording-active');
        micBtn.style.display = "none";
        stopMicBtn.style.display = "inline-block";
        recognition.lang = document.getElementById('srcLang').value === 'auto' ? 'en-US' : document.getElementById('srcLang').value;
        recognition.start();
    }

    function stopVoice() {
        isUserStopping = true;
        clearTimeout(silenceTimer);
        recognition.stop();
        micBtn.style.display = "inline-block";
        stopMicBtn.style.display = "none";
        notepad.classList.remove('recording-active');
    }

    // Utility Functions
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
        } catch (e) { console.error("Translation Error"); }
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

    function shareNote() {
        const text = notepad.innerText.trim();
        if (navigator.share) { 
            navigator.share({ title: 'My Note', text: text }).catch(() => {}); 
        } else { 
            window.open(`https://mail.google.com/mail/?view=cm&fs=1&body=${encodeURIComponent(text)}`); 
        }
    }

    // Listeners
    micBtn.addEventListener('click', startVoice);
    stopMicBtn.addEventListener('click', stopVoice);
    document.getElementById('saveBtn').addEventListener('click', downloadFile);
    document.getElementById('openBtn').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', openFile);
    document.getElementById('shareBtn').addEventListener('click', shareNote);
    document.getElementById('creditsBtn').addEventListener('click', () => document.getElementById('creditsModal').style.display = 'flex');
    document.getElementById('closeCredits').addEventListener('click', () => document.getElementById('creditsModal').style.display = 'none');
    document.getElementById('convertBtn').addEventListener('click', translateText);
    document.getElementById('speakBtn').addEventListener('click', playAudio);
    document.getElementById('stopBtn').addEventListener('click', () => window.speechSynthesis.cancel());
    document.getElementById('themeBtn').addEventListener('click', () => document.body.classList.toggle('light-mode'));
});
