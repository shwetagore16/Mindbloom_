// ebag-history.js - Save, load, and remind for Emotional Backpack worries
// Uses localStorage for frontend-only privacy

const EBAG_KEY = 'mindbloom_emotional_backpack';

function saveWorry(worry) {
    const now = new Date().toISOString();
    let worries = JSON.parse(localStorage.getItem(EBAG_KEY)) || [];
    worries.push({ text: worry, date: now });
    localStorage.setItem(EBAG_KEY, JSON.stringify(worries));
}

function loadWorries() {
    return JSON.parse(localStorage.getItem(EBAG_KEY)) || [];
}

function clearWorries() {
    localStorage.removeItem(EBAG_KEY);
}

function showWorryHistory() {
    const worries = loadWorries();
    const historyDiv = document.getElementById('ebag-history');
    if (!historyDiv) return;
    historyDiv.innerHTML = '';
    if (worries.length === 0) {
        historyDiv.innerHTML = '<p class="no-entries">No worries stored. Throw one into the backpack!</p>';
        return;
    }
    // Clear All button
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear All';
    clearBtn.className = 'btn btn-clear-all';
    clearBtn.style.marginBottom = '14px';
    clearBtn.onclick = function() {
        if (confirm('Clear all worries?')) {
            clearWorries();
            showWorryHistory();
        }
    };
    historyDiv.appendChild(clearBtn);
    worries.slice().reverse().forEach((w, idx) => {
        const item = document.createElement('div');
        item.className = 'ebag-history-item';
        const date = new Date(w.date).toLocaleString();
        item.innerHTML = `<span class="ebag-history-text">${w.text}</span><span class="ebag-history-date">${date}</span>`;
        // Delete button
        const delBtn = document.createElement('button');
        delBtn.textContent = '🗑️';
        delBtn.className = 'ebag-history-del';
        delBtn.title = 'Delete this worry';
        delBtn.onclick = function() {
            if (confirm('Delete this worry?')) {
                deleteWorry(w.text, w.date);
                showWorryHistory();
            }
        };
        item.appendChild(delBtn);
        historyDiv.appendChild(item);
    });
}

function deleteWorry(text, date) {
    let worries = loadWorries();
    worries = worries.filter(w => !(w.text === text && w.date === date));
    localStorage.setItem(EBAG_KEY, JSON.stringify(worries));
}

// (Stub) For future: sync worries to cloud
function syncWorriesToCloud() {
    // TODO: Integrate with Supabase or another backend for cross-device sync
}

// Advanced reminder: if >3 days since last throw, show stronger reminder
function checkAdvancedReminder() {
    const worries = loadWorries();
    if (!worries.length) return;
    const last = worries[worries.length-1];
    const lastDate = new Date(last.date);
    const now = new Date();
    const diffDays = Math.floor((now-lastDate)/(1000*60*60*24));
    if (diffDays >= 3) {
        showEbagToast('It’s been a while since you let go of a worry. Try it today!');
    }
}



// Simple daily reminder (shows toast if not thrown today)
function checkDailyReminder() {
    const worries = loadWorries();
    const today = new Date().toISOString().slice(0,10);
    const thrownToday = worries.some(w => w.date.slice(0,10) === today);
    if (!thrownToday) {
        showEbagToast('Remember to let go of a worry today!');
    }
}

function showEbagToast(msg) {
    let toast = document.getElementById('ebag-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'ebag-toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}

// On page load, show history and check reminder
document.addEventListener('DOMContentLoaded', () => {
    showWorryHistory();
    checkDailyReminder();
});
