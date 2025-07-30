document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const timerDisplay = document.querySelector('.timer-display');
    const timerProgress = document.querySelector('.timer-circle-progress');
    const startBtn = document.getElementById('start-timer');
    const pauseBtn = document.getElementById('pause-timer');
    const resetBtn = document.getElementById('reset-timer');
    const modeBtns = document.querySelectorAll('.mode-btn');
    const newTaskInput = document.getElementById('new-task');
    const addTaskBtn = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const newRewardInput = document.getElementById('new-reward');
    const newRewardDurationInput = document.getElementById('new-reward-duration');
    const addRewardBtn = document.getElementById('add-reward');
    const rewardList = document.getElementById('reward-list');
    const bloomCardModal = document.getElementById('bloom-card-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const rewardSuggestion = document.querySelector('.reward-suggestion');
    const rewardTimerDisplay = document.getElementById('reward-timer-display');
    const startRewardBtn = document.getElementById('start-reward-btn');

    // --- Timer State ---
    let countdown;
    let timeLeft;
    let isPaused = true;
    let currentMode = 1500; // Default: 25 mins
    const radius = timerProgress.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    timerProgress.style.strokeDasharray = circumference;

    // --- Reward Timer State ---
    let rewardCountdown;
    let currentReward = null;

    // --- App Data ---
    const defaultRewards = [
        { text: 'Watch a reel', duration: 5 },
        { text: 'Stretch and sip water', duration: 5 },
        { text: 'Send a meme to a friend', duration: 2 },
        { text: '5-min music break', duration: 5 },
        { text: 'Doodle for a few minutes', duration: 3 }
    ];
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let rewards = JSON.parse(localStorage.getItem('rewards')) || [];

    // --- Timer Logic ---
    function updateTimerDisplay(seconds, displayElement) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        displayElement.textContent = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updatePomodoroProgress(seconds) {
        const progress = (seconds / currentMode) * circumference;
        timerProgress.style.strokeDashoffset = circumference - progress;
    }

    function startTimer() {
        if (isPaused) {
            isPaused = false;
            startBtn.textContent = 'Running...';
            const now = Date.now();
            const then = now + timeLeft * 1000;
            updateTimerDisplay(timeLeft, timerDisplay);
            updatePomodoroProgress(timeLeft);

            countdown = setInterval(() => {
                const secondsLeft = Math.round((then - Date.now()) / 1000);
                if (secondsLeft < 0) {
                    clearInterval(countdown);
                    showBloomCard();
                    resetTimer();
                    return;
                }
                timeLeft = secondsLeft;
                updateTimerDisplay(timeLeft, timerDisplay);
                updatePomodoroProgress(timeLeft);
            }, 1000);
        }
    }

    function pauseTimer() {
        isPaused = true;
        startBtn.textContent = 'Start';
        clearInterval(countdown);
    }

    function resetTimer() {
        isPaused = true;
        startBtn.textContent = 'Start';
        clearInterval(countdown);
        timeLeft = currentMode;
        updateTimerDisplay(timeLeft, timerDisplay);
        updatePomodoroProgress(timeLeft);
    }

    function switchMode(e) {
        currentMode = parseInt(e.target.dataset.time, 10);
        modeBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        resetTimer();
    }

    // --- Task Logic ---
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';
            li.innerHTML = `
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="complete-btn" data-index="${index}">✓</button>
                    <button class="delete-btn" data-index="${index}">×</button>
                </div>
            `;
            taskList.appendChild(li);
        });
        saveData();
    }

    function addTask() {
        const text = newTaskInput.value.trim();
        if (text) {
            tasks.push({ text, completed: false });
            newTaskInput.value = '';
            renderTasks();
        }
    }

    function handleTaskAction(e) {
        const index = e.target.dataset.index;
        if (e.target.classList.contains('complete-btn')) {
            tasks[index].completed = !tasks[index].completed;
            if (tasks[index].completed) {
                showBloomCard();
            }
        } else if (e.target.classList.contains('delete-btn')) {
            tasks.splice(index, 1);
        }
        renderTasks();
    }

    // --- Reward Logic ---
    function renderRewards() {
        rewardList.innerHTML = '';
        const allRewards = [...defaultRewards, ...rewards];
        allRewards.forEach((reward, index) => {
            const li = document.createElement('li');
            const isDefault = index < defaultRewards.length;
            li.innerHTML = `
                <span>${reward.text} <strong>(${reward.duration} min)</strong></span>
                <div class="reward-actions">
                    ${!isDefault ? `<button class="delete-reward-btn" data-index="${index - defaultRewards.length}">×</button>` : ''}
                </div>
            `;
            rewardList.appendChild(li);
        });
        saveData();
    }

    function addReward() {
        const text = newRewardInput.value.trim();
        const duration = parseInt(newRewardDurationInput.value, 10);
        if (text && duration > 0) {
            rewards.push({ text, duration });
            newRewardInput.value = '';
            newRewardDurationInput.value = '5';
            renderRewards();
        }
    }

    function deleteReward(e) {
        if (e.target.classList.contains('delete-reward-btn')) {
            const index = e.target.dataset.index;
            rewards.splice(index, 1);
            renderRewards();
        }
    }

    // --- Bloom Card Modal Logic ---
    function showBloomCard() {
        const userRewards = rewards.length > 0 ? rewards : defaultRewards;
        currentReward = userRewards[Math.floor(Math.random() * userRewards.length)];
        
        rewardSuggestion.textContent = `${currentReward.text} (${currentReward.duration} min)`;
        rewardTimerDisplay.style.display = 'none';
        document.querySelector('.reward-suggestion-container').style.display = 'block';
        startRewardBtn.style.display = 'inline-block';

        bloomCardModal.classList.add('show');
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 }, zIndex: 1002 });
    }

    function hideBloomCard() {
        bloomCardModal.classList.remove('show');
        clearInterval(rewardCountdown);
        currentReward = null;
    }

    function startRewardTimer() {
        if (!currentReward) return;

        document.querySelector('.reward-suggestion-container').style.display = 'none';
        startRewardBtn.style.display = 'none';
        rewardTimerDisplay.style.display = 'block';

        let rewardTimeLeft = currentReward.duration * 60;
        updateTimerDisplay(rewardTimeLeft, rewardTimerDisplay);

        rewardCountdown = setInterval(() => {
            rewardTimeLeft--;
            updateTimerDisplay(rewardTimeLeft, rewardTimerDisplay);
            if (rewardTimeLeft <= 0) {
                clearInterval(rewardCountdown);
                // Optionally, add a sound or visual cue for completion
                hideBloomCard();
            }
        }, 1000);
    }

    // --- General & Event Listeners ---
    function saveData() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('rewards', JSON.stringify(rewards));
    }

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    modeBtns.forEach(btn => btn.addEventListener('click', switchMode));

    addTaskBtn.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTask());
    taskList.addEventListener('click', handleTaskAction);

    addRewardBtn.addEventListener('click', addReward);
    newRewardInput.addEventListener('keypress', (e) => e.key === 'Enter' && addReward());
    newRewardDurationInput.addEventListener('keypress', (e) => e.key === 'Enter' && addReward());
    rewardList.addEventListener('click', deleteReward);

    startRewardBtn.addEventListener('click', startRewardTimer);
    closeModalBtn.addEventListener('click', hideBloomCard);
    window.addEventListener('click', (e) => e.target === bloomCardModal && hideBloomCard());

    // --- Initial Setup ---
    resetTimer();
    renderTasks();
    renderRewards();
});
