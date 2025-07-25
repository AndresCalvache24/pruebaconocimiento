// Estado global de la aplicación
let currentChallenge = 0;
let completedChallenges = [];
let currentActivity = null;

// Definición de las 10 pruebas
const challenges = [
    {
        id: 1,
        title: "🐾 Animales Mágicos",
        description: "¿Tiene rayas y no es cebra, hace “rrrrr” y no es fiera?",
        type: "multiple-choice",
        question: "¿Cuál de estos animales es una mascota doméstica?",
        options: ["León", "Gato", "Tigre", "Leopardo"],
        correct: 1,
        icon: "🐱"
    },
    {
        id: 2,
        title: "🌈 Colores Brillantes",
        description: "Arrastra los colores a su lugar correcto",
        type: "drag-drop",
        items: [
            { text: "Verde", color: "#95e1d3" },
            { text: "Rojo", color: "#ff6b6b" },
            { text: "Azul", color: "#667eea" },
            { text: "Amarillo", color: "#ffe66d" }
        
        ],
        correctOrder: ["Rojo", "Azul", "Amarillo", "Verde"],
        icon: "🎨"
    },
    {
        id: 3,
        title: "🔢 Números Mágicos",
        description: "Completa la secuencia numérica",
        type: "sequence",
        sequence: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30],
        missingNumbers: [9, 21, 27],
        icon: "🔢"
    },
    {
        id: 4,
        title: "📝 Palabras Secretas",
        description: "¿Qué es algo que no puedes ver, lo que parece imposible lo hace posible? y todos quedamos sorprendidos.",
        type: "word-completion",
        word: "MAGIA",
        hint: "Tu lo has hecho",
        icon: "✨"
    },
    {
        id: 5,
        title: "🎵 Sonidos Musicales",
        description: "¿Qué instrumento suena así?",
        type: "multiple-choice",
        question: "¿Qué instrumento membranófono se toca con las manos?",
        options: ["Piano", "Tambor", "Flauta", "Guitarra"],
        correct: 1,
        icon: "🥁"
    },
    {
        id: 6,
        title: "🌍 Formas del Mundo",
        description: "Encuentra las formas geométricas",
        type: "shape-matching",
        shapes: [
            { name: "Círculo", emoji: "⭕" },
            { name: "paralelogramo", emoji: "▱" },
            { name: "Hexágono", emoji: "⬡" },
            { name: "Pentágono", emoji: "⭔" }
        ],
        icon: "🔷"
    },
    {
        id: 7,
        title: "🍎 Frutas Saludables",
        description: "Cuenta las manzanas correctamente",
        type: "counting",
        items: ["🍎", "🍎", "🍎", "🍎", "🍅"],
        question: "¿Cuántas manzanas hay en total?",
        correctAnswer: 4,
        icon: "🍎"
    },
    {
        id: 8,
        title: "🚗 Vehículos Rápidos",
        description: "Ordena los vehículos del más lento al más rápido",
        type: "ordering",
        items: [
            { name: "Bicicleta", speed: 1 },
            { name: "Auto", speed: 2 },
            { name: "Avion", speed: 3 },
            { name: "Cohete", speed: 4 }
        ],
        icon: "🚀"
    },
    {
        id: 9,
        title: "🌤️ Clima Mágico",
        description: "Relaciona el clima con la ropa adecuada",
        type: "matching",
        pairs: [
            { weather: "☀️", clothing: "🏖️" },
            { weather: "🌧️", clothing: "☔" },
            { weather: "❄️", clothing: "🧥" },
            { weather: "🌪️", clothing: "🏠" }
        ],
        icon: "🌈"
    },
    {
        id: 10,
        title: "🏆 Prueba Final",
        description: "Resuelve el acertijo mágico",
        type: "riddle",
        question: "Soy alto cuando soy joven y bajo cuando soy viejo. ¿Qué soy?",
        options: ["Un árbol", "Una vela", "Una montaña", "Un edificio"],
        correct: 1,
        icon: "🕯️"
    }
];

// Elementos del DOM
const screens = {
    start: document.getElementById('start-screen'),
    progress: document.getElementById('progress-screen'),
    activity: document.getElementById('activity-screen'),
    victory: document.getElementById('victory-screen')
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    updateProgress();
    renderChallengesGrid();
}

function setupEventListeners() {
    // Botón de inicio
    document.getElementById('start-btn').addEventListener('click', () => {
        showScreen('progress');
    });

    // Botón de volver
    document.getElementById('back-btn').addEventListener('click', () => {
        showScreen('progress');
    });

    // Botón de verificar
    document.getElementById('check-btn').addEventListener('click', checkAnswer);

    // Botón de siguiente
    document.getElementById('next-btn').addEventListener('click', nextChallenge);

    // Botón de reiniciar
    document.getElementById('restart-btn').addEventListener('click', restartGame);
}

function showScreen(screenName) {
    // Ocultar todas las pantallas
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostrar la pantalla seleccionada
    screens[screenName].classList.add('active');
    
    // Actualizar progreso si es necesario
    if (screenName === 'progress') {
        updateProgress();
    }
}

function updateProgress() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const progress = (completedChallenges.length / challenges.length) * 100;
    
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Prueba ${completedChallenges.length + 1} de ${challenges.length}`;
}

function renderChallengesGrid() {
    const grid = document.getElementById('challenges-grid');
    grid.innerHTML = '';
    
    challenges.forEach((challenge, index) => {
        const card = document.createElement('div');
        card.className = 'challenge-card';
        
        if (completedChallenges.includes(challenge.id)) {
            card.classList.add('completed');
        } else if (index > completedChallenges.length) {
            card.classList.add('locked');
        } else {
            card.addEventListener('click', () => startChallenge(challenge));
        }
        
        card.innerHTML = `
            <div class="challenge-number">${challenge.icon}</div>
            <div class="challenge-title">${challenge.title}</div>
            <div class="challenge-description">${challenge.description}</div>
        `;
        
        grid.appendChild(card);
    });
}

function startChallenge(challenge) {
    currentActivity = challenge;
    currentChallenge = challenge.id;
    
    document.getElementById('activity-title').textContent = challenge.title;
    document.getElementById('activity-content').innerHTML = '';
    document.getElementById('check-btn').style.display = 'block';
    document.getElementById('next-btn').style.display = 'none';
    
    // Resetear estrellas
    document.querySelectorAll('.stars span').forEach(star => {
        star.classList.remove('active');
    });
    
    renderActivity(challenge);
    showScreen('activity');
}

function renderActivity(challenge) {
    const content = document.getElementById('activity-content');
    
    switch (challenge.type) {
        case 'multiple-choice':
            renderMultipleChoice(challenge, content);
            break;
        case 'drag-drop':
            renderDragDrop(challenge, content);
            break;
        case 'sequence':
            renderSequence(challenge, content);
            break;
        case 'word-completion':
            renderWordCompletion(challenge, content);
            break;
        case 'shape-matching':
            renderShapeMatching(challenge, content);
            break;
        case 'counting':
            renderCounting(challenge, content);
            break;
        case 'ordering':
            renderOrdering(challenge, content);
            break;
        case 'matching':
            renderMatching(challenge, content);
            break;
        case 'riddle':
            renderRiddle(challenge, content);
            break;
    }
}

function renderMultipleChoice(challenge, container) {
    container.innerHTML = `
        <div class="question-container">
            <div class="question-text">${challenge.question}</div>
            <div class="options-container">
                ${challenge.options.map((option, index) => `
                    <button class="option-btn" data-index="${index}">${option}</button>
                `).join('')}
            </div>
        </div>
    `;
    
    // Event listeners para las opciones
    container.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            container.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

function renderDragDrop(challenge, container) {
    container.innerHTML = `
        <div class="drag-container">
            <div class="drag-items">
                ${challenge.items.map(item => `
                    <div class="drag-item" draggable="true" data-text="${item.text}" style="background-color: ${item.color}">
                        ${item.text}
                    </div>
                `).join('')}
            </div>
            <div class="drop-zones">
                ${challenge.correctOrder.map((colorName, index) => {
                    const item = challenge.items.find(item => item.text === colorName);
                    return `<div class="drop-zone" data-expected="${colorName}" style="background-color: ${item.color}; opacity: 0.3;">
                        <span style="color: #333; font-weight: bold; opacity: 0.7;">Coloca aquí: ${colorName}</span>
                    </div>`;
                }).join('')}
            </div>
        </div>
    `;
    
    setupDragAndDrop(container);
}

function setupDragAndDrop(container) {
    const dragItems = container.querySelectorAll('.drag-item');
    const dropZones = container.querySelectorAll('.drop-zone');
    
    dragItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });
    
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragenter', handleDragEnter);
        zone.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.dataset.text);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.target.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    const text = e.dataTransfer.getData('text/plain');
    const zone = e.target;
    
    zone.classList.remove('drag-over');
    zone.classList.add('filled');
    zone.innerHTML = `<span style="color: white; font-weight: bold;">${text}</span>`;
    zone.dataset.expected = text;
}

function renderSequence(challenge, container) {
    const sequence = [...challenge.sequence];
    challenge.missingNumbers.forEach(num => {
        const index = sequence.indexOf(num);
        if (index !== -1) {
            sequence[index] = '_';
        }
    });
    
    container.innerHTML = `
        <div class="sequence-container">
            <h3>Completa la secuencia:</h3>
            <div class="sequence-display">
                ${sequence.map(num => 
                    num === '_' ? '<input type="number" class="sequence-input" min="1" max="10">' : `<span class="sequence-number">${num}</span>`
                ).join('')}
            </div>
        </div>
    `;
}

function renderWordCompletion(challenge, container) {
    const word = challenge.word;
    const inputs = word.split('').map((letter, index) => 
        `<input type="text" class="letter-input" maxlength="1" data-index="${index}">`
    ).join('');
    
    container.innerHTML = `
        <div class="word-completion">
            <h3>Completa la palabra:</h3>
            <p><strong>Pista:</strong> ${challenge.hint}</p>
            <div class="word-display">${inputs}</div>
        </div>
    `;
    
    // Auto-focus y navegación entre inputs
    const letterInputs = container.querySelectorAll('.letter-input');
    letterInputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            if (this.value && index < letterInputs.length - 1) {
                letterInputs[index + 1].focus();
            }
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value && index > 0) {
                letterInputs[index - 1].focus();
            }
        });
    });
}

function renderShapeMatching(challenge, container) {
    // Crear una copia del array de formas y mezclarlo aleatoriamente para las opciones
    const shuffledShapes = [...challenge.shapes].sort(() => Math.random() - 0.5);
    
    container.innerHTML = `
        <div class="shape-matching">
            <h3>Relaciona cada forma con su nombre:</h3>
            <div class="shapes-grid">
                ${challenge.shapes.map(shape => `
                    <div class="shape-item" data-shape="${shape.name}">
                        <div class="shape-emoji">${shape.emoji}</div>
                        <select class="shape-select">
                            <option value="">Selecciona...</option>
                            ${shuffledShapes.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
                        </select>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderCounting(challenge, container) {
    container.innerHTML = `
        <div class="counting-container">
            <h3>${challenge.question}</h3>
            <div class="items-display">
                ${challenge.items.join(' ')}
            </div>
            <div class="counting-input">
                <label>Respuesta: </label>
                <input type="number" id="counting-answer" min="1" max="10">
            </div>
        </div>
    `;
}

function renderOrdering(challenge, container) {
    // Crear una copia del array y mezclarlo aleatoriamente
    const shuffledItems = [...challenge.items].sort(() => Math.random() - 0.5);
    
    container.innerHTML = `
        <div class="ordering-container">
            <h3>Ordena del más lento al más rápido:</h3>
            <div class="ordering-items">
                ${shuffledItems.map(item => `
                    <div class="ordering-item" data-speed="${item.speed}" draggable="true">
                        ${item.name}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    setupOrdering(container);
}

function setupOrdering(container) {
    const items = container.querySelectorAll('.ordering-item');
    let draggedItem = null;
    
    items.forEach(item => {
        item.addEventListener('dragstart', e => {
            draggedItem = item;
            item.classList.add('dragging');
        });
        
        item.addEventListener('dragend', e => {
            item.classList.remove('dragging');
        });
        
        item.addEventListener('dragover', e => {
            e.preventDefault();
        });
        
        item.addEventListener('drop', e => {
            e.preventDefault();
            if (draggedItem !== item) {
                const allItems = [...items];
                const draggedIndex = allItems.indexOf(draggedItem);
                const droppedIndex = allItems.indexOf(item);
                
                if (draggedIndex < droppedIndex) {
                    item.parentNode.insertBefore(draggedItem, item.nextSibling);
                } else {
                    item.parentNode.insertBefore(draggedItem, item);
                }
            }
        });
    });
}

function renderMatching(challenge, container) {
    container.innerHTML = `
        <div class="matching-container">
            <h3>Relaciona el clima con la ropa adecuada:</h3>
            <div class="matching-pairs">
                ${challenge.pairs.map(pair => `
                    <div class="matching-pair">
                        <div class="weather-item">${pair.weather}</div>
                        <div class="arrow">→</div>
                        <select class="clothing-select">
                            <option value="">Selecciona...</option>
                            ${challenge.pairs.map(p => `<option value="${p.clothing}">${p.clothing}</option>`).join('')}
                        </select>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderRiddle(challenge, container) {
    container.innerHTML = `
        <div class="riddle-container">
            <h3>🧩 Acertijo:</h3>
            <div class="riddle-question">${challenge.question}</div>
            <div class="options-container">
                ${challenge.options.map((option, index) => `
                    <button class="option-btn" data-index="${index}">${option}</button>
                `).join('')}
            </div>
        </div>
    `;
    
    // Event listeners para las opciones
    container.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            container.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

function checkAnswer() {
    if (!currentActivity) return;
    
    let isCorrect = false;
    
    switch (currentActivity.type) {
        case 'multiple-choice':
            isCorrect = checkMultipleChoice();
            break;
        case 'drag-drop':
            isCorrect = checkDragDrop();
            break;
        case 'sequence':
            isCorrect = checkSequence();
            break;
        case 'word-completion':
            isCorrect = checkWordCompletion();
            break;
        case 'shape-matching':
            isCorrect = checkShapeMatching();
            break;
        case 'counting':
            isCorrect = checkCounting();
            break;
        case 'ordering':
            isCorrect = checkOrdering();
            break;
        case 'matching':
            isCorrect = checkMatching();
            break;
        case 'riddle':
            isCorrect = checkRiddle();
            break;
    }
    
    if (isCorrect) {
        showSuccess();
    } else {
        showError();
    }
}

function checkMultipleChoice() {
    const selected = document.querySelector('.option-btn.selected');
    return selected && parseInt(selected.dataset.index) === currentActivity.correct;
}

function checkDragDrop() {
    const dropZones = document.querySelectorAll('.drop-zone');
    return Array.from(dropZones).every((zone, index) => {
        return zone.dataset.expected === currentActivity.correctOrder[index];
    });
}

function checkSequence() {
    const inputs = document.querySelectorAll('.sequence-input');
    return Array.from(inputs).every((input, index) => {
        const expected = currentActivity.missingNumbers[index];
        return parseInt(input.value) === expected;
    });
}

function checkWordCompletion() {
    const inputs = document.querySelectorAll('.letter-input');
    const word = Array.from(inputs).map(input => input.value.toUpperCase()).join('');
    return word === currentActivity.word;
}

function checkShapeMatching() {
    const selects = document.querySelectorAll('.shape-select');
    return Array.from(selects).every(select => {
        const shapeItem = select.closest('.shape-item');
        const expectedShape = shapeItem.dataset.shape;
        return select.value === expectedShape;
    });
}

function checkCounting() {
    const answer = document.getElementById('counting-answer');
    return parseInt(answer.value) === currentActivity.correctAnswer;
}

function checkOrdering() {
    const items = document.querySelectorAll('.ordering-item');
    const currentOrder = Array.from(items).map(item => parseInt(item.dataset.speed));
    const correctOrder = currentActivity.items.map(item => item.speed).sort((a, b) => a - b);
    return JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
}

function checkMatching() {
    const selects = document.querySelectorAll('.clothing-select');
    const pairs = currentActivity.pairs;
    return Array.from(selects).every((select, index) => {
        return select.value === pairs[index].clothing;
    });
}

function checkRiddle() {
    const selected = document.querySelector('.option-btn.selected');
    return selected && parseInt(selected.dataset.index) === currentActivity.correct;
}

function showSuccess() {
    // Mostrar estrellas
    const stars = document.querySelectorAll('.stars span');
    const starCount = Math.min(3, Math.floor(Math.random() * 3) + 1);
    
    for (let i = 0; i < starCount; i++) {
        setTimeout(() => {
            stars[i].classList.add('active');
        }, i * 200);
    }
    
    // Marcar como completada
    if (!completedChallenges.includes(currentActivity.id)) {
        completedChallenges.push(currentActivity.id);
    }
    
    // Mostrar botón siguiente
    document.getElementById('check-btn').style.display = 'none';
    document.getElementById('next-btn').style.display = 'block';
    
    // Efecto de celebración
    showCelebration();
}

function showError() {
    // Efecto de error
    const content = document.getElementById('activity-content');
    content.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        content.style.animation = '';
    }, 500);
}

function showCelebration() {
    // Crear confeti
    for (let i = 0; i < 50; i++) {
        createConfetti();
    }
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '1000';
    
    document.body.appendChild(confetti);
    
    const animation = confetti.animate([
        { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], {
        duration: 3000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    
    animation.onfinish = () => confetti.remove();
}

function nextChallenge() {
    if (completedChallenges.length >= challenges.length) {
        showScreen('victory');
    } else {
        showScreen('progress');
        renderChallengesGrid();
    }
}

function restartGame() {
    completedChallenges = [];
    currentChallenge = 0;
    currentActivity = null;
    showScreen('start');
}

// Agregar animación de shake al CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Lista de nombres de archivos de imágenes en la carpeta img/
const imagenes = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.jpg",
  "7.jpg",
  "8.jpg",
  "9.jpg",
  "10.jpg" 
  // Agrega aquí los nombres de tus otras imágenes, por ejemplo:
  // "foto2.jpg",
  // "foto3.png",
];

// Función para cambiar la imagen aleatoriamente
function cambiarImagenAleatoria() {
  const indice = Math.floor(Math.random() * imagenes.length);
  const img = document.getElementById("imagen-aleatoria");
  img.src = "img/" + imagenes[indice];
}

// Cambia la imagen cada 3 segundos
setInterval(cambiarImagenAleatoria, 3000);

// Cambia la imagen al cargar la página
window.onload = cambiarImagenAleatoria;
