document.addEventListener('DOMContentLoaded', function() {
    // Personalized welcome for homepage
    if (document.getElementById('welcome-name')) {
        let user = JSON.parse(localStorage.getItem('mindbloom_user'));
        let name = user && user.name ? user.name : 'there';
        document.getElementById('welcome-name').textContent = name;
    }

    // Check login status
    const loggedIn = localStorage.getItem('mindbloom_loggedIn');
    if (loggedIn !== 'true') {
        window.location.href = 'index.html';
        return; 
    }

    // Set welcome message
    const user = JSON.parse(localStorage.getItem('mindbloom_user'));
    if (user && user.name) {
        document.getElementById('welcome-message').textContent = `Welcome to MindBloom, ${user.name}!`;
    }

    // Handle logout
    const logoutButton = document.getElementById('logout-btn');
    if(logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('mindbloom_loggedIn');
            localStorage.removeItem('mindbloom_user');
            window.location.href = 'login.html';
        });
    }

    // Motivational Quotes
    const quotes = [
        { text: "The best time to relax is when you don't have time for it.", author: "Sydney J. Harris" },
        { text: "Sometimes the most productive thing you can do is relax.", author: "Mark Black" },
        { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
        { text: "Take rest; a field that has rested gives a bountiful crop.", author: "Ovid" },
        { text: "Your mind will answer most questions if you learn to relax and wait for the answer.", author: "William S. Burroughs" },
        { text: "Tension is who you think you should be. Relaxation is who you are.", author: "Chinese Proverb" },
        { text: "It’s a good idea always to do something relaxing before making an important decision.", author: "Paulo Coelho" },
        { text: "Sometimes the most important thing in a whole day is the rest we take between two deep breaths.", author: "Etty Hillesum" },
        { text: "Slow down and everything you are chasing will come around and catch you.", author: "John De Paola" },
        { text: "Rest and self-care are so important. When you take time to replenish your spirit, it allows you to serve others from the overflow.", author: "Oprah Winfrey" }
    ];

    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const changeQuoteBtn = document.getElementById('change-quote-btn');
    let lastQuoteIndex = -1;

    function displayRandomQuote() {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * quotes.length);
        } while (randomIndex === lastQuoteIndex && quotes.length > 1);
        lastQuoteIndex = randomIndex;
        quoteText.textContent = `"${quotes[randomIndex].text}"`;
        quoteAuthor.textContent = `- ${quotes[randomIndex].author}`;
    }

    if(quoteText && quoteAuthor) {
        displayRandomQuote();
        if (changeQuoteBtn) {
            changeQuoteBtn.addEventListener('click', displayRandomQuote);
        }
    }

    // Staggered Card Animation
    const cards = document.querySelectorAll('.dash-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
    });

    // Emotional Backpack logic
    (function() {
        const input = document.getElementById('worry-input');
        const message = document.getElementById('eb-message');
        const throwBtn = document.getElementById('throw-btn');
        if (!input || !message || !throwBtn) return;

        // Throw Away animation logic
        throwBtn.addEventListener('click', () => {
            if (!input.value.trim()) return;
            input.classList.add('fade-out');
            throwBtn.disabled = true;
            // Wait for CSS transition to finish (800ms), then hide input
            setTimeout(() => {
                input.style.display = 'none';
                message.textContent = 'Your load is lighter now.';
                message.style.display = 'block';
                setTimeout(() => {
                    input.value = '';
                    input.style.display = '';
                    input.classList.remove('fade-out');
                    message.style.display = 'none';
                    throwBtn.disabled = false;
                }, 1800);
            }, 800);
        });



        // Optional: CSS for note drop animation
        const style = document.createElement('style');
        style.textContent = `
        .drop-into-bag {
            animation: dropNote 0.4s cubic-bezier(.5,1.8,.5,1) forwards;
        }
        @keyframes dropNote {
            0% { transform: translateY(0); opacity: 1; }
            80% { transform: translateY(60px) scale(0.9); opacity: 0.7; }
            100% { transform: translateY(120px) scale(0.5); opacity: 0; }
        }
        `;
        document.head.appendChild(style);
    })();
});
