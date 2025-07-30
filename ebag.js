// ebag.js - Maximal Emotional Backpack Animations

document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('worry-input');
    const throwBtn = document.getElementById('throw-btn');
    const backpackSection = document.getElementById('emotional-backpack-section');
    const ebMessage = document.getElementById('eb-message');
    const backpack = document.getElementById('eb-backpack');
    const paperPlane = document.getElementById('eb-paper-plane');
    const clouds = document.querySelectorAll('.eb-cloud');
    const zipper = document.querySelector('.eb-zipper');

    // Sound effect (optional)
    let throwAudio = null;
    try {
        throwAudio = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4c8e.mp3'); // airplane whoosh
    } catch (e) {}

    // Animate clouds (randomize drift)
    clouds.forEach((cloud, idx) => {
        cloud.style.animationDuration = (10 + Math.random() * 5) + 's';
        cloud.style.opacity = 0.6 + Math.random() * 0.3;
    });

    // Create a floating text element for animation
    let floatingText = null;
    let animating = false;

    function resetBackpack() {
        if (floatingText) {
            floatingText.remove();
            floatingText = null;
        }
        backpackSection.classList.remove('eb-shake', 'eb-throw');
        if (paperPlane) paperPlane.classList.remove('eb-plane-throw');
        throwBtn.disabled = false;
        animating = false;
    }

    // Animate text into the backpack
    function animateTextIntoBackpack(text) {
        // Save the worry to localStorage
        if (text && text.length > 0) {
            if (typeof saveWorry === 'function') saveWorry(text);
            if (typeof showWorryHistory === 'function') showWorryHistory();
        }
        if (animating) return;
        resetBackpack();
        animating = true;
        floatingText = document.createElement('div');
        floatingText.className = 'eb-floating-text';
        floatingText.textContent = text;
        backpackSection.appendChild(floatingText);
        // Position floating text above the backpack visually
        const backpackRect = backpack.getBoundingClientRect();
        const sectionRect = backpackSection.getBoundingClientRect();
        floatingText.style.left = (backpack.offsetLeft + backpack.offsetWidth / 2) + 'px';
        floatingText.style.top = (backpack.offsetTop - 40) + 'px';
        floatingText.style.transform = 'translate(-50%, 0)';
        // Start animation
        setTimeout(() => {
            floatingText.classList.add('eb-fly-in');
            // After fly-in, move text visually "inside" the bag (layer behind SVG)
            setTimeout(() => {
                // Move the floating text into the backpack SVG visually
                floatingText.style.zIndex = 2; // Behind bag front
                floatingText.style.opacity = 0.01;
                // Vibrate (shake) the backpack for 3 seconds
                backpackSection.classList.add('eb-shake');
                let shakeCount = 0;
                let shakeInterval = setInterval(() => {
                    backpackSection.classList.remove('eb-shake');
                    void backpackSection.offsetWidth; // force reflow
                    backpackSection.classList.add('eb-shake');
                    shakeCount++;
                    if (shakeCount >= 6) { // 6 x 0.5s = 3s
                        clearInterval(shakeInterval);
                        backpackSection.classList.remove('eb-shake');
                    }
                }, 500);
                // Zipper animates (CSS keyframes)
                if (zipper) {
                    zipper.style.animation = 'eb-zipper-move 1s cubic-bezier(.5,1.4,.5,1)';
                    setTimeout(() => {
                        zipper.style.animation = '';
                    }, 1000);
                }
                // Automatically throw after 5 seconds
                setTimeout(() => {
                    if (floatingText && !throwBtn.disabled) {
                        animateThrow();
                    }
                }, 5000);
                // Enable throw button as fallback
                throwBtn.disabled = false;
                animating = false;
            }, 1200);
        }, 100);
    }

    // Animate backpack throw (maximal)
    function animateThrow() {
        if (!floatingText || animating) return;
        animating = true;
        backpackSection.classList.remove('eb-shake');
        floatingText.classList.add('eb-throw-away');
        backpackSection.classList.add('eb-throw');
        throwBtn.disabled = true;
        // Paper plane throw
        if (paperPlane) {
            paperPlane.classList.add('eb-plane-throw');
        }
        // Play sound
        if (throwAudio) {
            try { throwAudio.currentTime = 0; throwAudio.play(); } catch(e){}
        }
        // After throw, show message and reset
        setTimeout(() => {
            ebMessage.textContent = 'Worry thrown away! ✈️';
            ebMessage.style.display = 'block';
            resetBackpack();
            setTimeout(() => {
                ebMessage.textContent = 'Everything is going to be fine, so don’t worry. Go and talk to someone who will listen to you any day—and if there’s no one, I am here.';
                ebMessage.style.display = 'block';
                ebMessage.style.opacity = '1';
                ebMessage.style.transition = '';
            }, 1800);
        }, 1400);
    }

    // Handle input submit
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (input.value.trim()) {
                animateTextIntoBackpack(input.value.trim());
                input.value = '';
                throwBtn.disabled = true;
            }
        }
    });

    throwBtn.addEventListener('click', function() {
        animateThrow();
    });
});
