document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Breathing Exercise ---
    const breathingCircle = document.getElementById('breathing-circle');
    const breathingText = document.getElementById('breathing-text');
    const breathDuration = 4000; // 4 seconds in, 4 seconds out

    function runBreathingCycle() {
        breathingText.textContent = 'Breathe In...';
        breathingCircle.style.transform = 'scale(1.5)';

        setTimeout(() => {
            breathingText.textContent = 'Breathe Out...';
            breathingCircle.style.transform = 'scale(1)';
        }, breathDuration);
    }
    // Initial call and loop
    runBreathingCycle();
    setInterval(runBreathingCycle, breathDuration * 2);


    // --- 2. Music Player ---
    const musicButtons = document.querySelectorAll('.music-control-btn');
    const audioElements = document.querySelectorAll('audio');

    musicButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetAudioId = button.getAttribute('data-audio');
            const targetAudio = document.getElementById(targetAudioId);

            // Pause all other audio
            audioElements.forEach(audio => {
                if (audio.id !== targetAudioId) {
                    audio.pause();
                    // Reset other buttons' icons
                    document.querySelector(`[data-audio='${audio.id}']`).textContent = '▶️'; // Play icon
                }
            });

            // Toggle play/pause for the target audio
            if (targetAudio.paused) {
                targetAudio.play();
                button.textContent = '⏸️'; // Pause icon
            } else {
                targetAudio.pause();
                button.textContent = '▶️'; // Play icon
            }
        });
    });


    // --- 3. Pomodoro Timer ---
    const timerDisplay = document.getElementById('timer-display');
    const startPauseBtn = document.getElementById('timer-start-pause');
    const resetBtn = document.getElementById('timer-reset');
    let timerInterval = null;
    let timeLeft = 1500; // 25 minutes in seconds
    let isTimerRunning = false;
    updateTimerDisplay(); // Ensure display is synced on load

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    startPauseBtn.addEventListener('click', () => {
        if (isTimerRunning) {
            clearInterval(timerInterval);
            startPauseBtn.textContent = 'Start';
            isTimerRunning = false;
        } else {
            // Prevent multiple intervals
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateTimerDisplay();
                } else {
                    clearInterval(timerInterval);
                    alert('Pomodoro session complete!');
                    startPauseBtn.textContent = 'Start';
                    isTimerRunning = false;
                    timeLeft = 1500;
                    updateTimerDisplay();
                }
            }, 1000);
            startPauseBtn.textContent = 'Pause';
            isTimerRunning = true;
        }
    });

    resetBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        timerInterval = null;
        timeLeft = 1500;
        updateTimerDisplay();
        startPauseBtn.textContent = 'Start';
        isTimerRunning = false;
    });


    // --- 4. Motivational Quote ---
    const quoteDisplay = document.getElementById('quote-display');
    const quotes = [
        "The best way to get started is to quit talking and begin doing.",
        "The secret of getting ahead is getting started.",
        "It’s not whether you get knocked down, it’s whether you get up.",
        "Your calm mind is the ultimate weapon against your challenges.",
        "Every moment is a fresh beginning.",
        "The greatest wealth is a quiet mind.",
        "Happiness is not by chance, but by choice.",
        "Peace begins with a smile.",
        "You are stronger than you think.",
        "Let go of what you can’t control."
    ];
    let lastQuoteIndex = -1;

    function displayRandomQuote() {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * quotes.length);
        } while (randomIndex === lastQuoteIndex && quotes.length > 1);
        lastQuoteIndex = randomIndex;
        quoteDisplay.textContent = `"${quotes[randomIndex]}"`;
    }
    displayRandomQuote();

    // Add event listener to change quote button
    const changeQuoteBtn = document.getElementById('change-quote-btn');
    if (changeQuoteBtn) {
        changeQuoteBtn.addEventListener('click', displayRandomQuote);
    }

});
