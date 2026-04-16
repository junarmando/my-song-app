const lyrics = [
    { t: 0, text: "[Verse 1]" },
    { t: 2, text: "Staring at the traces" },
    { t: 6, text: "Of your departure, no trace of tomorrow" },
    { t: 10, text: "The cup of coffee, already cold on the table" },
    { t: 14, text: "Like our love that has lost its spark" },
    { t: 18, text: "[Pre-Chorus]" },
    { t: 20, text: "Tried to erase, tried to forget" },
    { t: 24, text: "But in every corner, you're still the one I'm with" },
    { t: 28, text: "The scent of your perfume on the pillow" },
    { t: 32, text: "Is slowly becoming poison in my mind" },
    { t: 36, text: "[Chorus]" },
    { t: 38, text: "Oh, right?" },
    { t: 40, text: "Fate is so cruel" },
    { t: 44, text: "You left the traces" },
    { t: 48, text: "Just to make me suffer" },
    { t: 52, text: "Oh, right?" },
    { t: 54, text: "How easy it is to say it's over" },
    { t: 58, text: "But the pain you left behind" },
    { t: 62, text: "Will never, ever go away" },
    { t: 66, text: "[Outro]" },
    { t: 68, text: "Traces... Traces..." },
    { t: 72, text: "Thanks for the memory." }
];

const lyricsContent = document.getElementById('lyrics-content');
lyrics.forEach((line, i) => {
    const div = document.createElement('div');
    div.className = 'lyric-line';
    div.textContent = line.text;
    div.id = `line-${i}`;
    lyricsContent.appendChild(div);
});

let audioCtx, analyser, dataArray;
let isPlaying = false;
let isPaused = false;
let startTime;
let currentLineIndex = 0;
let lyricsTimeout;

const startBtn = document.getElementById('start-btn');
const playbackControls = document.getElementById('playback-controls');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');
const restartBtn = document.getElementById('restart-btn');

startBtn.onclick = async () => {
    if (isPlaying) return;
    
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
    }
    
    startBtn.style.display = 'none';
    playbackControls.style.display = 'flex';
    isPlaying = true;
    isPaused = false;
    startTime = audioCtx.currentTime;
    currentLineIndex = 0;
    
    playLoop();
    drawVisualizer();
    singNext(0);
};

pauseBtn.onclick = () => {
    if (!isPlaying) return;
    if (!isPaused) {
        audioCtx.suspend();
        window.speechSynthesis.pause();
        clearTimeout(lyricsTimeout);
        isPaused = true;
        pauseBtn.textContent = 'Resume';
    } else {
        audioCtx.resume();
        window.speechSynthesis.resume();
        isPaused = false;
        pauseBtn.textContent = 'Pause';
        // Resume lyrics timer
        const nextTime = lyrics[currentLineIndex + 1] ? lyrics[currentLineIndex + 1].t : null;
        if (nextTime !== null) {
            const delay = (startTime + nextTime) - audioCtx.currentTime;
            lyricsTimeout = setTimeout(() => singNext(currentLineIndex + 1), Math.max(0, delay * 1000));
        }
    }
};

stopBtn.onclick = () => {
    stopPerformance();
};

restartBtn.onclick = () => {
    stopPerformance();
    setTimeout(() => startBtn.click(), 100);
};

function stopPerformance() {
    isPlaying = false;
    isPaused = false;
    if (audioCtx) audioCtx.close();
    audioCtx = null;
    window.speechSynthesis.cancel();
    clearTimeout(lyricsTimeout);
    
    startBtn.style.display = 'block';
    playbackControls.style.display = 'none';
    pauseBtn.textContent = 'Pause';
    
    // Reset UI
    document.querySelectorAll('.lyric-line').forEach(el => el.classList.remove('active'));
    lyricsContent.style.transform = `translateY(80px)`;
}

function playLoop() {
    if (!isPlaying) return;
    
    const bpm = 85;
    const noteTime = 60 / bpm;
    let nextBeat = audioCtx.currentTime;

    function scheduler() {
        if (!isPlaying) return;
        while (nextBeat < audioCtx.currentTime + 0.1) {
            const beatIndex = Math.round((nextBeat - startTime) / noteTime) % 4;
            playDrums(nextBeat, beatIndex);
            playBass(nextBeat, beatIndex);
            nextBeat += noteTime;
        }
        requestAnimationFrame(scheduler);
    }
    scheduler();
}

function playDrums(time, beat) {
    if (beat === 0 || beat === 2) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
        gain.gain.setValueAtTime(1, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
        osc.connect(gain);
        gain.connect(analyser);
        gain.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time + 0.5);
    }
    if (beat === 1 || beat === 3) {
        const noise = audioCtx.createBufferSource();
        const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.1, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        noise.buffer = buffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(analyser);
        gain.connect(audioCtx.destination);
        noise.start(time);
    }
}

function playBass(time, beat) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const freq = [55, 65, 49, 43][beat];
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);
    osc.connect(gain);
    gain.connect(analyser);
    gain.connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.4);
}

function singNext(index) {
    if (index >= lyrics.length || !isPlaying) return;
    currentLineIndex = index;

    const line = lyrics[index];
    const utterance = new SpeechSynthesisUtterance(line.text);
    utterance.lang = 'en-US';
    utterance.pitch = 0.5;
    utterance.rate = 0.8;

    document.querySelectorAll('.lyric-line').forEach(el => el.classList.remove('active'));
    const activeLine = document.getElementById(`line-${index}`);
    activeLine.classList.add('active');
    lyricsContent.style.transform = `translateY(${-index * 44 + 80}px)`;

    if (index < lyrics.length - 1) {
        const nextTime = lyrics[index + 1].t;
        const delay = (startTime + nextTime) - audioCtx.currentTime;
        lyricsTimeout = setTimeout(() => singNext(index + 1), Math.max(0, delay * 1000));
    }

    window.speechSynthesis.speak(utterance);
}

function drawVisualizer() {
    const canvas = document.getElementById('visualizer');
    const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

function draw() {
    if (!isPlaying) return;
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    const barWidth = (width / dataArray.length) * 2.5;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
        const barHeight = dataArray[i] / 2;
        ctx.fillStyle = `rgb(${barHeight + 100}, 60, 60)`;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
    }
}
draw();
}

