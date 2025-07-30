document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const journalEntry = document.getElementById('journal-entry');
    const saveButton = document.getElementById('save-journal-btn');
    const journalList = document.getElementById('journal-list');
    const toast = document.getElementById('toast-notification');

    // --- Helper Functions ---

    // 1. Show Toast Notification
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 2. Format Date
    function formatEntryDate(isoString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(isoString).toLocaleDateString('en-US', options);
    }

    // --- Core Functions ---

    // 3. Load Journal Entries
    function loadJournalEntries() {
        const entries = JSON.parse(localStorage.getItem('mindbloom_journalEntries')) || [];
        journalList.innerHTML = ''; // Clear current list

        if (entries.length === 0) {
            journalList.innerHTML = '<p class="no-entries">No entries yet. Write your first journal entry above!</p>';
            return;
        }

        // Display entries with the most recent first
        entries.slice().reverse().forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.classList.add('journal-item');

            const entryHeader = document.createElement('div');
            entryHeader.classList.add('journal-item-header');
            entryHeader.textContent = formatEntryDate(entry.date);

            const entryContent = document.createElement('div');
            entryContent.classList.add('journal-item-content');
            entryContent.innerHTML = `<p>${entry.content.replace(/\n/g, '<br>')}</p>`; // Preserve line breaks

            entryDiv.appendChild(entryHeader);
            entryDiv.appendChild(entryContent);

            // Add click listener to expand/collapse
            entryHeader.addEventListener('click', () => {
                entryDiv.classList.toggle('expanded');
            });

            journalList.appendChild(entryDiv);
        });
    }

    // 4. Save Journal Entry
    saveButton.addEventListener('click', () => {
        const content = journalEntry.value.trim();

        if (content === '') {
            showToast('Journal entry cannot be empty.');
            return;
        }

        const entries = JSON.parse(localStorage.getItem('mindbloom_journalEntries')) || [];
        const newEntry = {
            id: Date.now(),
            date: new Date().toISOString(),
            content: content
        };

        entries.push(newEntry);
        localStorage.setItem('mindbloom_journalEntries', JSON.stringify(entries));

        showToast('Your journal entry has been saved.');
        journalEntry.value = ''; // Clear textarea
        loadJournalEntries(); // Refresh the list
    });

    // --- Initial Load ---
    loadJournalEntries();
});
