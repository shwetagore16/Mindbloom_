document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const thoughtInput = document.getElementById('thought-input');
    const addThoughtBtn = document.getElementById('add-thought-btn');
    const terrariumVisual = document.getElementById('terrarium-visual');
    const thoughtTypeBtns = document.querySelectorAll('.thought-type-btn');
    
    // Initialize thoughts array
    let thoughts = [];
    
    // Word banks for sentiment analysis
    const positiveWords = [
        'happy', 'joy', 'love', 'excited', 'amazing', 'wonderful', 'great', 'good', 
        'positive', 'awesome', 'fantastic', 'excellent', 'bliss', 'peace', 'calm',
        'confident', 'proud', 'grateful', 'thankful', 'blessed', 'optimistic', 'hopeful',
        'motivated', 'inspired', 'energized', 'thrilled', 'ecstatic', 'delighted',
        'content', 'satisfied', 'fulfilled', 'accomplished', 'success', 'achievement',
        'progress', 'growth', 'improve', 'better', 'best', 'superb', 'outstanding',
        'perfect', 'lucky', 'fortunate', 'smile', 'laugh', 'fun', 'enjoy', 'pleasure'
    ];
    
    const negativeWords = [
        'sad', 'angry', 'upset', 'frustrated', 'anxious', 'worried', 'scared', 'fear',
        'bad', 'terrible', 'awful', 'horrible', 'dreadful', 'negative', 'stress',
        'stressed', 'depressed', 'miserable', 'lonely', 'alone', 'tired', 'exhausted',
        'overwhelmed', 'defeated', 'hopeless', 'helpless', 'useless', 'failure',
        'disappointed', 'disappointment', 'regret', 'guilt', 'shame', 'embarrassed',
        'hurt', 'pain', 'suffer', 'suffering', 'problem', 'issue', 'trouble', 'difficult',
        'hard', 'challenge', 'challenging', 'struggle', 'struggling', 'lost', 'confused'
    ];
    
    // Plant elements and positions
    const plantElements = [];
    const maxPlants = 20; // Maximum number of plants in the terrarium
    
    // Initialize
    initEventListeners();
    
    // Load saved garden on page load
    loadGarden();
    
    function initEventListeners() {
        // Add thought button click
        addThoughtBtn.addEventListener('click', addThoughtToTerrarium);
        

        // Thought type button clicks
        thoughtTypeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                thoughtTypeBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
            });
        });
        
        // Allow Enter key to submit thought (but allow Shift+Enter for new line)
        thoughtInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addThoughtToTerrarium();
            }
        });
        
        // Save garden state when leaving the page
        window.addEventListener('beforeunload', function() {
            saveGarden();
        });
    }

    // Add a thought to the terrarium based on text analysis
    function addThoughtToTerrarium() {
        const text = thoughtInput.value.trim();
        if (!text) return;
        
        // Get the selected thought type (or analyze text if auto-detect is on)
        const selectedBtn = document.querySelector('.thought-type-btn.active');
        let thoughtType = selectedBtn ? selectedBtn.dataset.type : 'plant'; // Default to plant
        
        // Analyze text sentiment if in auto mode
        const sentiment = analyzeTextSentiment(text);
        
        // Create a new thought object
        const newThought = {
            id: Date.now(),
            text: text,
            type: thoughtType,
            sentiment: sentiment,
            timestamp: new Date().toISOString()
        };
        
        // Add to thoughts array and save
        if (!thoughts) thoughts = [];
        thoughts.push(newThought);
        saveThoughts();
        
        // Create and add the plant element
        addPlantToTerrarium(thoughtType, sentiment);
        
        // Clear the input
        thoughtInput.value = '';
        
        // Show a confirmation message
        showMessage('Thought added to your terrarium!', 'success');
    }
    
    // Analyze text to determine sentiment (positive/negative/neutral)
    function analyzeTextSentiment(text) {
        // Convert to lowercase for case-insensitive matching
        const lowerText = text.toLowerCase();
        
        // Count positive and negative word matches
        const positiveMatches = positiveWords.filter(word => 
            new RegExp(`\\b${word}\\b`).test(lowerText)
        ).length;
        
        const negativeMatches = negativeWords.filter(word => 
            new RegExp(`\\b${word}\\b`).test(lowerText)
        ).length;
        
        // Determine overall sentiment
        if (positiveMatches > negativeMatches) {
            return 'positive';
        } else if (negativeMatches > positiveMatches) {
            return 'negative';
        } else {
            return 'neutral';
        }
    }
    
    // Add a visual plant to the terrarium
    // Track which emoji was used last for each type to ensure variety
    const lastUsedEmoji = {
        'plant-positive': 0,
        'plant-neutral': 0,
        'plant-negative': 0,
        'moss-positive': 0,
        'moss-neutral': 0,
        'moss-negative': 0,
        'fog-positive': 0,
        'fog-neutral': 0,
        'fog-negative': 0,
        'thorn-positive': 0,
        'thorn-neutral': 0,
        'thorn-negative': 0
    };

    function getPlantEmoji(type, sentiment) {
        const emojiSets = {
            'plant': {
                'positive': ['🌸', '🌺', '🌻', '🌼', '🌷', '🌹', '💐', '🏵️', '🌞', '🌝'],
                'neutral': ['🌱', '🌿', '☘️', '🍀', '🌾', '🌴', '🌲', '🌳', '🌵', '🌾'],
                'negative': ['🥀', '🍂', '🍁', '🌾', '🍃', '🌱', '🥀', '🍂', '🍁', '🌿']
            },
            'moss': {
                'positive': ['🌱', '🌿', '🍃', '☘️', '🍀', '🌱', '🌿', '🍃', '☘️', '🍀'],
                'neutral': ['🌱', '🌿', '🍃', '☘️', '🍀', '🌱', '🌿', '🍃', '☘️', '🍀'],
                'negative': ['🌱', '🌿', '🍃', '☘️', '🍀', '🌱', '🌿', '🍃', '☘️', '🍀']
            },
            'fog': {
                'positive': ['🥀', '🥀', '🥀', '🥀', '🥀', '🥀', '🥀', '🥀', '🥀', '🥀'],
                'neutral': ['🥀', '🥀', '🥀', '🥀', '🥀', '🥀', '🥀', '🥀', '🥀', '🥀'],
                'negative': ['🥀', '🥀', '🥀', '🥀', '🥀', '🥀', '🥀', '🥀', '🥀', '🥀']
            },
            'thorn': {
                'positive': ['🌵', '🌵', '🌵', '🌵', '🌵', '🌵', '🌵', '🌵', '🌵', '🌵'],
                'neutral': ['🌵', '🌵', '🌵', '🌵', '🌵', '🌵', '🌵', '🌵', '🌵', '🌵'],
                'negative': ['🌵', '🌵', '🌵', '🌵', '🌵', '🌵', '🌵', '🌵', '🌵', '🌵']
            }
        };

        const key = `${type}-${sentiment}`;
        const emojiArray = emojiSets[type]?.[sentiment] || ['🌱'];
        
        // Get next emoji in sequence for this type/sentiment
        const emojiIndex = lastUsedEmoji[key] % emojiArray.length;
        lastUsedEmoji[key] = (lastUsedEmoji[key] + 1) % emojiArray.length;
        
        return emojiArray[emojiIndex];
    }

    function getRandomHueRotation() {
        // Generate a random hue rotation between -180 and 180 degrees
        return Math.floor(Math.random() * 360) - 180;
    }

    function addPlantToTerrarium(type, sentiment, isInitialLoad = false) {
        if (!isInitialLoad && plantElements.length >= maxPlants) {
            const oldestPlant = plantElements.shift();
            if (oldestPlant && oldestPlant.parentNode) {
                oldestPlant.parentNode.removeChild(oldestPlant);
            }
        }
        
        const plant = document.createElement('div');
        plant.className = `plant ${type} ${sentiment}`;
        
        // Add random color variation class
        if (type === 'fog' || type === 'thorn') {
            const hueRotation = getRandomHueRotation();
            const saturation = 1 + Math.random() * 0.5; // 1.0 to 1.5
            plant.style.filter = `hue-rotate(${hueRotation}deg) saturate(${saturation})`;
        }
        
        // Get next emoji in sequence based on type and sentiment
        const emoji = getPlantEmoji(type, sentiment);
        plant.textContent = emoji;
        
        // Randomly select a plant to animate (10% chance for any plant, but higher for spoiled/thorn)
        const shouldAnimate = (type === 'fog' || type === 'thorn') ? 
            (Math.random() < 0.3) : (Math.random() < 0.1);
            
        if (shouldAnimate) {
            plant.classList.add('special');
            // Remove the special class after animation completes
            setTimeout(() => {
                plant.classList.remove('special');
            }, 3000);
        }
        
        // Set random position
        const left = 10 + Math.random() * 80; // 10-90% of container width
        const bottom = 10 + Math.random() * 30; // 10-40% from bottom
        
        plant.style.left = `${left}%`;
        plant.style.bottom = `${bottom}%`;
        
        // Store plant data as data attributes
        plant.dataset.type = type;
        plant.dataset.sentiment = sentiment;
        
        // Add plant to DOM and our array
        terrariumVisual.appendChild(plant);
        plantElements.push(plant);
        
        // Add animation class
        requestAnimationFrame(() => {
            plant.classList.add('grow');
        });
        
        // Save the garden state
        saveGarden();
    }
    
    // Helper functions to get different plant types HTML
    function getRandomPlantHTML(sentiment) {
        const plants = [
            '🌱', '🌿', '🌴', '🌲', '🌳', '🌵', '🌾', '🍀', '☘️', '🌺',
            '🌸', '🌼', '🌻', '🌹', '🌷', '💐', '🌲', '🌳', '🌴', '🌵'
        ];
        const randomPlant = plants[Math.floor(Math.random() * plants.length)];
        return `<div class="plant-emoji">${randomPlant}</div>`;
    }
    
    function getRandomMossHTML(sentiment) {
        const mosses = ['🍃', '🌿', '🌱', '☘️', '🍀'];
        const randomMoss = mosses[Math.floor(Math.random() * mosses.length)];
        return `<div class="moss-emoji">${randomMoss}</div>`;
    }
    
    function getRandomFogHTML(sentiment) {
        const witheredFlowers = ['🥀', '🍂', '🍁', '🥀', '🍂'];
        const randomFlower = witheredFlowers[Math.floor(Math.random() * witheredFlowers.length)];
        return `<div class="withered-flower-emoji">${randomFlower}</div>`;
    }
    
    function getRandomThornHTML(sentiment) {
        const thorns = ['🌵', '🌾', '🌿'];
        const randomThorn = thorns[Math.floor(Math.random() * thorns.length)];
        return `<div class="thorn-emoji">${randomThorn}</div>`;
    }
    
    // Show a message to the user
    function showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        // Add to the page
        document.body.appendChild(messageDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageDiv.classList.add('fade-out');
            setTimeout(() => messageDiv.remove(), 500);
        }, 3000);
    }
    
    // Load thoughts from localStorage
    function loadThoughts() {
        const savedThoughts = localStorage.getItem('thoughts');
        if (savedThoughts) {
            try {
                const parsedThoughts = JSON.parse(savedThoughts);
                thoughts = Array.isArray(parsedThoughts) ? parsedThoughts : [];
                
                // If we have saved thoughts, update the terrarium visual
                if (thoughts.length > 0) {
                    updateTerrariumVisual();
                }
            } catch (e) {
                console.error('Error loading thoughts from localStorage:', e);
                thoughts = [];
            }
        }
    }
    
    // Initialize the terrarium with saved thoughts or starter plants
    function initializeTerrarium() {
        // Load any saved thoughts first
        loadThoughts();
        
        // Add some initial plants if no thoughts exist
        if (thoughts.length === 0 && plantElements.length === 0) {
            // Add initial plants only if there are no saved thoughts
            addPlantToTerrarium('plant', 'positive');
            addPlantToTerrarium('moss', 'neutral');
        }
    }
    
    // Start the terrarium
    initializeTerrarium();
    
    // Save thoughts to localStorage
    function saveThoughts() {
        localStorage.setItem('thoughts', JSON.stringify(thoughts));
    }
    
    // Update the terrarium visual based on the current thoughts
    function updateTerrariumVisual() {
        // Clear the terrarium
        terrariumVisual.innerHTML = '';
        plantElements = [];
        
        // Add plants for each thought
        thoughts.forEach(thought => {
            addPlantToTerrarium(thought.type, thought.sentiment, true);
        });
    }
    
    // Initialize filter buttons
    function initFilters() {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update filter
                currentFilter = button.dataset.filter;
                renderThoughts();
            });
        });
    }
    
    // Update the type hint text
    function updateTypeHint() {
        const typeNames = {
            'plant': 'Positive',
            'moss': 'Neutral',
            'fog': 'Uncertain',
            'thorn': 'Challenging'
        };
        
        const emojis = {
            'plant': '🌱',
            'moss': '🍃',
            'fog': '🌫️',
            'thorn': '🌵'
        };
        
        selectedTypeHint.textContent = `${emojis[selectedType]} ${typeNames[selectedType]} thought selected`;
    }

    // Plant a new thought
    function plantThought() {
        const thoughtText = thoughtInput.value.trim();
        if (thoughtText) {
            const newThought = {
                id: Date.now(),
                text: thoughtText,
                type: selectedType,
                timestamp: new Date().toISOString(),
                growth: 1, // Start with growth level 1
                lastNurtured: new Date().toISOString()
            };

            thoughts.unshift(newThought);
            saveThoughts();
            renderThoughts();
            updateTerrariumVisual();
            
            // Reset input
            thoughtInput.value = '';
            
            // Add visual feedback
            const btn = plantThoughtBtn;
            const originalText = btn.textContent;
            btn.textContent = 'Planted! 🌱';
            btn.disabled = true;
            
            // Add visual effect to terrarium
            const visualEffect = document.createElement('div');
            visualEffect.className = 'terrarium-sparkle';
            visualEffect.style.left = `${Math.random() * 80 + 10}%`;
            visualEffect.style.top = `${Math.random() * 80 + 10}%`;
            terrariumItems.appendChild(visualEffect);
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                if (visualEffect.parentNode) {
                    visualEffect.remove();
                }
            }, 2000);
        }
    }

    // Render thoughts based on current filter
    function renderThoughts() {
        // Filter thoughts based on current filter
        let filteredThoughts = [...thoughts];
        if (currentFilter !== 'all') {
            filteredThoughts = thoughts.filter(thought => thought.type === currentFilter);
        }

        if (filteredThoughts.length === 0) {
            const noThoughtsMsg = document.createElement('p');
            noThoughtsMsg.className = 'no-thoughts';
            noThoughtsMsg.textContent = currentFilter === 'all' 
                ? 'Your thought garden is empty. Plant your first thought above!' 
                : `No ${getTypeName(currentFilter)} thoughts found.`;
            thoughtsContainer.innerHTML = '';
            thoughtsContainer.appendChild(noThoughtsMsg);
            return;
        }

        thoughtsContainer.innerHTML = '';
        filteredThoughts.forEach(thought => {
            const thoughtElement = createThoughtElement(thought);
            thoughtsContainer.appendChild(thoughtElement);
        });
    }
    
    // Get display name for thought type
    function getTypeName(type) {
        const names = {
            'plant': 'positive',
            'moss': 'neutral',
            'fog': 'uncertain',
            'thorn': 'challenging'
        };
        return names[type] || '';
    }

    // Create a thought element
    function createThoughtElement(thought) {
        const thoughtDiv = document.createElement('div');
        thoughtDiv.className = `thought-card thought-${thought.type}`;
        thoughtDiv.dataset.id = thought.id;
        
        // Format the date
        const date = new Date(thought.timestamp);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Growth indicator (hearts for positive, water drops for others)
        const growthIndicator = Array(thought.growth).fill('').map((_, i) => 
            thought.type === 'plant' ? '❤️' : '💧'
        ).join('');
        
        thoughtDiv.innerHTML = `
            <div class="thought-text">${thought.text}</div>
            <div class="thought-growth">${growthIndicator}</div>
            <div class="thought-footer">
                <span class="thought-type-badge type-${thought.type}">${getTypeEmoji(thought.type)} ${getTypeName(thought.type)}</span>
                <span class="thought-date">${formattedDate}</span>
                <div class="thought-actions">
                    <button class="nurture-thought" data-id="${thought.id}" title="Nurture this thought">
                        ${thought.type === 'plant' ? '💧 Water' : '✨ Nurture'}
                    </button>
                    <button class="delete-thought" data-id="${thought.id}" title="Remove this thought">
                        ✕
                    </button>
                </div>
            </div>
        `;

        // Add delete functionality
        const deleteBtn = thoughtDiv.querySelector('.delete-thought');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteThought(thought.id);
        });
        
        // Add nurture functionality
        const nurtureBtn = thoughtDiv.querySelector('.nurture-thought');
        if (nurtureBtn) {
            nurtureBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                nurtureThought(thought.id);
            });
        }

        return thoughtDiv;
    }
    
    // Get emoji for thought type
    function getTypeEmoji(type) {
        const emojis = {
            'plant': '🌱',
            'moss': '🍃',
            'fog': '🌫️',
            'thorn': '🌵'
        };
        return emojis[type] || '💭';
    }
    
    // Nurture a thought (increase growth)
    function nurtureThought(id) {
        const thought = thoughts.find(t => t.id === id);
        if (thought) {
            // Can only grow up to level 5
            if (thought.growth < 5) {
                thought.growth += 1;
                thought.lastNurtured = new Date().toISOString();
                saveThoughts();
                renderThoughts();
                updateTerrariumVisual();
                
                // Show feedback
                showToast(thought.type === 'plant' 
                    ? '🌱 Plant is growing!' 
                    : '✨ Thought nurtured!');
            } else {
                showToast(thought.type === 'plant' 
                    ? '🌿 Your plant is fully grown!' 
                    : '🌟 This thought is fully nurtured!');
            }
        }
    }

    // Delete a thought
    function deleteThought(id) {
        if (confirm('Are you sure you want to remove this thought?')) {
            thoughts = thoughts.filter(thought => thought.id !== id);
            saveThoughts();
            renderThoughts();
            updateTerrariumVisual();
            showToast('Thought removed');
        }
    }
    
    // Update the terrarium visual based on thoughts
    function updateTerrariumVisual() {
        // Clear existing items
        terrariumItems.innerHTML = '';
        
        // Only show the most recent 10 thoughts in the visual
        const recentThoughts = [...thoughts].slice(0, 10);
        
        recentThoughts.forEach((thought, index) => {
            const item = document.createElement('div');
            item.className = `terrarium-item terrarium-${thought.type}`;
            
            // Position items in a grid-like pattern
            const row = Math.floor(index / 3);
            const col = index % 3;
            const baseLeft = 10 + col * 40;
            const baseTop = 10 + row * 30;
            
            // Add some randomness to the position
            const left = baseLeft + (Math.random() * 20 - 10);
            const top = baseTop + (Math.random() * 20 - 10);
            
            // Set position and size based on growth
            const size = 15 + (thought.growth * 3);
            
            item.style.left = `${left}%`;
            item.style.top = `${top}%`;
            item.style.width = `${size}px`;
            item.style.height = `${size}px`;
            item.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            // Add emoji based on type
            const emoji = document.createElement('span');
            emoji.textContent = getTypeEmoji(thought.type);
            emoji.style.fontSize = `${size * 0.8}px`;
            item.appendChild(emoji);
            
            // Add tooltip with thought text
            item.title = thought.text;
            
            terrariumItems.appendChild(item);
        });
        
        // Add some decorative elements if no thoughts yet
        if (recentThoughts.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'terrarium-empty';
            emptyMsg.textContent = 'Plant your first thought to start growing your terrarium!';
            terrariumItems.appendChild(emptyMsg);
        }
    }
    
    // Show a toast message
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Save thoughts to localStorage
    function saveGarden() {
        try {
            // First save the current thoughts
            const thoughtState = thoughts.map(thought => ({
                id: thought.id,
                text: thought.text,
                type: thought.type,
                sentiment: thought.sentiment,
                timestamp: thought.timestamp
            }));
            
            // Then save the visual plant elements
            const plantState = Array.from(plantElements).map(plant => ({
                type: plant.dataset.type || 'plant',
                sentiment: plant.dataset.sentiment || 'neutral',
                left: plant.style.left,
                bottom: plant.style.bottom,
                emoji: plant.textContent
            }));
            
            const gardenState = {
                thoughts: thoughtState,
                plantElements: plantState,
                lastSaved: new Date().toISOString()
            };
            
            localStorage.setItem('gardenState', JSON.stringify(gardenState));
            console.log('Garden saved:', gardenState);
            return true;
        } catch (e) {
            console.error('Error saving garden:', e);
            showMessage('Error saving your garden. Your browser storage might be full.', 'error');
            return false;
        }
    }
    
    function loadGarden() {
        const savedState = localStorage.getItem('gardenState');
        if (savedState) {
            try {
                const gardenState = JSON.parse(savedState);
                thoughts = gardenState.thoughts || [];
                
                // Clear existing plants
                terrariumVisual.innerHTML = '';
                plantElements = [];
                
                // Restore plants from saved state
                if (gardenState.plantElements && gardenState.plantElements.length > 0) {
                    gardenState.plantElements.forEach(plantData => {
                        const plant = document.createElement('div');
                        plant.className = `plant ${plantData.type} ${plantData.sentiment}`;
                        plant.style.left = plantData.left;
                        plant.style.bottom = plantData.bottom;
                        plant.textContent = plantData.emoji;
                        plant.dataset.type = plantData.type;
                        plant.dataset.sentiment = plantData.sentiment;
                        
                        terrariumVisual.appendChild(plant);
                        plantElements.push(plant);
                        
                        // Trigger grow animation
                        requestAnimationFrame(() => {
                            plant.classList.add('grow');
                        });
                    });
                }
                
                return true;
            } catch (e) {
                console.error('Error loading garden:', e);
                return false;
            }
        }
        return false;
    }
    
    // Alias for backward compatibility
    function saveThoughts() {
        return saveGarden();
    }
});
