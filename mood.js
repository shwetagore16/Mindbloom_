document.addEventListener('DOMContentLoaded', () => {
    const moodButtons = document.querySelectorAll('.mood-btn');
    const saveButton = document.getElementById('save-mood-btn');
    const moodNotes = document.getElementById('mood-notes');
    const historyList = document.getElementById('mood-history-list');
    const toast = document.getElementById('toast-notification');
    let selectedMood = null;

    // 1. Mood Selection
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'selected' class from all buttons
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            // Add 'selected' class to the clicked button
            button.classList.add('selected');
            selectedMood = button.dataset.mood;
        });
    });

    // 2. Save Mood Entry
    saveButton.addEventListener('click', () => {
        if (!selectedMood) {
            showToast('Please select a mood first.');
            return;
        }

        const notes = moodNotes.value.trim();
        const entry = {
            mood: selectedMood,
            emoji: document.querySelector('.mood-btn.selected').textContent,
            notes: notes,
            date: new Date().toISOString()
        };

        saveEntry(entry);
        showToast('Your mood has been saved!');

        // Reset form
        moodButtons.forEach(btn => btn.classList.remove('selected'));
        selectedMood = null;
        moodNotes.value = '';
        
        // Refresh history
        loadMoodHistory();
    });

    // 3. Local Storage Functions
    function getEntries() {
        return JSON.parse(localStorage.getItem('mindbloom_moodHistory')) || [];
    }

    function saveEntry(entry) {
        const entries = getEntries();
        entries.unshift(entry); // Add new entry to the beginning
        localStorage.setItem('mindbloom_moodHistory', JSON.stringify(entries));
    }

    // 4. Load and Display History
    function loadMoodHistory() {
        historyList.innerHTML = ''; // Clear current list
        const entries = getEntries();
        
        // Show only the 5 most recent entries
        const recentEntries = entries.slice(0, 5);

        if (recentEntries.length === 0) {
            historyList.innerHTML = '<p style="text-align: center;">No moods recorded yet.</p>';
            return;
        }

        recentEntries.forEach(entry => {
            const item = document.createElement('div');
            item.className = 'mood-history-item';

            const formattedDate = new Date(entry.date).toLocaleString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            item.innerHTML = `
                <div class="emoji">${entry.emoji}</div>
                <div class="details">
                    <p class="date">${formattedDate}</p>
                    <p><strong>Mood:</strong> ${entry.mood}</p>
                    ${entry.notes ? `<p><em>${entry.notes}</em></p>` : ''}
                </div>
            `;
            historyList.appendChild(item);
        });
    }

    // 5. Toast Notification Function
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000); // Hide after 3 seconds
    }

    // Initial load
    loadMoodHistory();
});
