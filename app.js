// DOM refs
const palette = document.getElementById('palette');
const targetColorEl = document.getElementById('targetColor');
const messageEl = document.getElementById('message');
const scoreEl = document.getElementById('score');
const squareCountEl = document.getElementById('squareCount');
const resetBtn = document.getElementById('resetBtn');
const playAgainBtn = document.getElementById('playAgain');
const resetScoreBtn = document.getElementById('resetScore');
const easyBtn = document.getElementById('easyBtn');
const hardBtn = document.getElementById('hardBtn');

let numSquares = 6;
let colors = [];
let pickedColor = null;
let score = 0;

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function randomColor() { return `rgb(${randInt(0, 255)}, ${randInt(0, 255)}, ${randInt(0, 255)})` }

function generateColors(n) {
    const arr = [];
    for (let i = 0; i < n; i++) arr.push(randomColor());
    return arr;
}

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)] }

function setMessage(text, type) {
    messageEl.textContent = text;
    messageEl.classList.remove('success', 'fail');
    if (type === 'success') messageEl.classList.add('success');
    if (type === 'fail') messageEl.classList.add('fail');
}

function render() {
    palette.innerHTML = '';
    colors.forEach((c, i) => {
        const btn = document.createElement('button');
        btn.className = 'swatch';
        btn.style.background = c;
        btn.setAttribute('aria-label', `color option ${i + 1} ${c}`);
        btn.setAttribute('data-color', c);
        btn.innerHTML = `<span style="text-shadow:0 2px 6px rgba(0,0,0,0.6);pointer-events:none">${i + 1}</span>`;
        btn.addEventListener('click', onSwatchClick);
        btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click() } });
        palette.appendChild(btn);
    })
}

function onSwatchClick(e) {
    const el = e.currentTarget;
    const color = el.getAttribute('data-color');
    if (color === pickedColor) {
        // correct
        setMessage('Correct! 🎉', 'success');
        score += 1;
        scoreEl.textContent = score;
        // reveal correct style and unify palette
        document.querySelectorAll('.swatch').forEach(s => {
            s.classList.remove('incorrect');
            s.classList.add('correct');
            s.style.background = pickedColor;
            s.disabled = true;
        });
    } else {
        // wrong
        setMessage('Try again', 'fail');
        el.classList.add('incorrect');
        el.disabled = true;
    }
}

function resetGame() {
    colors = generateColors(numSquares);
    pickedColor = pickRandom(colors);
    targetColorEl.textContent = pickedColor;
    setMessage('Pick a color');
    render();
    squareCountEl.textContent = numSquares;
}

// copy rgb to clipboard
targetColorEl.style.cursor = 'pointer';
targetColorEl.title = 'Click to copy RGB';
targetColorEl.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(targetColorEl.textContent);
        setMessage('Copied RGB to clipboard', 'success');
        setTimeout(() => setMessage('Pick a color'), 1400);
    } catch (e) { setMessage('Copy not supported'); }
})

// controls
resetBtn.addEventListener('click', () => { resetGame(); });
playAgainBtn.addEventListener('click', () => { resetGame(); });
resetScoreBtn.addEventListener('click', () => { score = 0; scoreEl.textContent = score; setMessage('Score reset'); setTimeout(() => setMessage('Pick a color'), 1200) });

easyBtn.addEventListener('click', () => { numSquares = 3; easyBtn.classList.add('active'); hardBtn.classList.remove('active'); resetGame(); })
hardBtn.addEventListener('click', () => { numSquares = 6; hardBtn.classList.add('active'); easyBtn.classList.remove('active'); resetGame(); })

// init
resetGame();

// small accessibility: allow keyboard to tab into each swatch
const observer = new MutationObserver(() => {
    document.querySelectorAll('.swatch').forEach(s => s.tabIndex = 0);
});
observer.observe(palette, { childList: true });

