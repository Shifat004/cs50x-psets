const bucket = document.getElementById('bucket');
const flower = document.getElementById('flower');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

let score = 0;
let lives = 3;
let gameInterval;

function startGame() {
    startButton.style.display = 'none';
    restartButton.style.display = 'block';
    score = 0;
    lives = 3;
    updateHUD();
    dropFlower();
}

function restartGame() {
    clearInterval(gameInterval);
    score = 0;
    lives = 3;
    updateHUD();
    dropFlower();
}

function updateHUD() {
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
}

function dropFlower() {
    resetFlowerPosition();

    gameInterval = setInterval(() => {
        flower.style.top = parseInt(flower.style.top) + 5 + 'px';
        
        if (parseInt(flower.style.top) >= 340) { // Close to the bucket
            if (checkCatch()) {
                score++;  // Increase score when the flower touches the bucket
                flower.style.display = 'none';  // Hide flower on catch
            } else {
                lives--;
                if (lives === 0) {
                    clearInterval(gameInterval);
                    alert('Game Over! Your score: ' + score);
                    startButton.style.display = 'block';
                    restartButton.style.display = 'none';
                }
            }
            resetFlowerPosition(); // Reset the flower position after checking
            updateHUD();
        }
    }, 20);
}

function resetFlowerPosition() {
    flower.style.display = 'block';  // Show the flower again
    flower.style.top = '-50px';  // Reset to the top
    flower.style.left = Math.random() * 560 + 'px';  // Random horizontal position
}

function checkCatch() {
    const flowerX = parseInt(flower.style.left);
    const bucketX = bucket.offsetLeft;

    // Check if the flower lands within the bucket's width
    return flowerX >= bucketX && flowerX <= bucketX + 80; // Return true if caught
}

document.addEventListener('mousemove', (e) => {
    const gameRect = document.querySelector('.game').getBoundingClientRect();
    const mouseX = e.clientX - gameRect.left;
    if (mouseX > 0 && mouseX < 600) {
        bucket.style.left = mouseX - 40 + 'px'; // Center the bucket with the mouse
    }
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
