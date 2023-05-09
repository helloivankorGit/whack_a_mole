const gameContainer = document.querySelector('.game');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time');

let score = 0;
let molesWhacked = 0;
let moleTimerId = null;
let startTime = null;

function createHole() {
    const hole = document.createElement('div');
    hole.classList.add('hole');
    hole.addEventListener('click', whackMole);
    gameContainer.appendChild(hole);
}

function createMole() {
    const mole = document.createElement('div');
    mole.classList.add('mole');
    mole.innerText = '🐭';
    mole.addEventListener('click', whackMole);
    const holes = Array.from(document.querySelectorAll('.hole:not(.mole)'));
    const randomHole = holes[Math.floor(Math.random() * holes.length)];
    randomHole.appendChild(mole);
    mole.classList.add('visible');
    moleTimerId = setTimeout(() => {
        randomHole.removeChild(mole);
        mole.classList.remove('visible');
        if (molesWhacked < 10) {
            createMole();
        } else {
            endGame();
        }
    }, 1000);
}

function whackMole(event) {
    if (!event.isTrusted) return; // prevent cheating
    if (!event.currentTarget.classList.contains('mole')) return; // ignore clicks on holes
    if (event.currentTarget.classList.contains('whacked')) return; // ignore clicks on already whacked moles
    event.currentTarget.classList.add('whacked');
    score += 10;
    molesWhacked++;
    scoreDisplay.innerText = score;
}

function startGame() {
    score = 0;
    molesWhacked = 0;
    scoreDisplay.innerText = score;
    timeDisplay.innerText = '00:00';
    startTime = new Date().getTime();
    while (gameContainer.firstChild) {
        gameContainer.removeChild(gameContainer.firstChild);
    }
    for (let i = 0; i < 9; i++) {
        createHole();
    }
    createMole();
    updateTime();
}

function endGame() {
    clearTimeout(moleTimerId);
    const endTime = new Date().getTime();
    const totalTimeInSeconds = Math.round((endTime - startTime) / 1000);
    const minutes = Math.floor(totalTimeInSeconds / 60);
    const seconds = totalTimeInSeconds % 60;
    alert(`Congratulations! It took you ${minutes}:${seconds < 10 ? '0' + seconds : seconds} to reach ${score} points.`);
    startGame();
}

function updateTime() {
    const currentTime = new Date().getTime();
    const totalTimeInSeconds = Math.round((currentTime - startTime) / 1000);
    const minutes = Math.floor(totalTimeInSeconds / 60);
    const seconds = totalTimeInSeconds % 60;
    timeDisplay.innerText = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    setTimeout(updateTime, 1000);
}

document.addEventListener('DOMContentLoaded', startGame);
