const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load the plane image from the provided URL
const planeImage = new Image();
planeImage.src = "https://freepngimg.com/thumb/plane/4-2-plane-png-image.png";

// Load the background image
const backgroundImage = new Image();
backgroundImage.src =
  "https://img.freepik.com/free-photo/new-york-city_649448-1679.jpg?w=740&t=st=1728665061~exp=1728665661~hmac=3aad8571ec65432c96d860a3416cf4cabd2535b09f94e0da5d1578913300a628";

// Load the building obstacle image
const buildingImage = new Image();
buildingImage.src =
  "https://png.pngtree.com/png-clipart/20220913/original/pngtree-multi-complex-building-transparent-png-image_8616898.png";

// Load the explosion image
const explosionImage = new Image();
explosionImage.src =
  "https://i.gifer.com/origin/62/623cdcca882db2d7efa8d32424a61d29_w200.gif"; // Explosion GIF

let plane = {
  x: 50,
  y: canvas.height / 2,
  width: 60, // Width of the plane image
  height: 30, // Height of the plane image
  dy: 0, // Plane's vertical speed
  gravity: 0.6,
  lift: -7.5 // Reduced the jump movement for a smaller jump
};

let buildings = [];
let buildingGap = 200; // The space between the top and bottom building
let buildingWidth = 100; // Width of the building obstacle image
let buildingSpeed = 3;
let frame = 0;
let score = 0;
let gameOver = false;
let explosionActive = false; // To track explosion state
let explosionFrame = 0; // To control the explosion animation frame count
let gameOverDelay = false; // To control the delay before game over message

// Control plane with click or spacebar
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    plane.dy = plane.lift; // Move plane up
  }
});

canvas.addEventListener("click", () => {
  plane.dy = plane.lift; // Move plane up
});

// Building generation
function generateBuildings() {
  if (frame % 100 === 0) {
    let buildingHeight = Math.random() * (canvas.height - buildingGap);
    buildings.push({
      x: canvas.width,
      topHeight: buildingHeight,
      bottomHeight: canvas.height - buildingHeight - buildingGap
    });
  }
}

// Draw buildings using the obstacle image
function drawBuildings() {
  buildings.forEach((building) => {
    ctx.drawImage(
      buildingImage,
      building.x,
      0,
      buildingWidth,
      building.topHeight
    ); // Top building
    ctx.drawImage(
      buildingImage,
      building.x,
      canvas.height - building.bottomHeight,
      buildingWidth,
      building.bottomHeight
    ); // Bottom building
  });
}

// Move buildings
function moveBuildings() {
  buildings.forEach((building, index) => {
    building.x -= buildingSpeed; // Move building to the left

    // Remove buildings that have moved off-screen
    if (building.x + buildingWidth < 0) {
      buildings.splice(index, 1);
      score++;
    }
  });
}

// Draw the plane using the image
function drawPlane() {
  ctx.drawImage(planeImage, plane.x, plane.y, plane.width, plane.height);
}

// Update plane's position
function updatePlane() {
  plane.dy += plane.gravity;
  plane.y += plane.dy;

  // Keep the plane within screen bounds
  if (plane.y + plane.height > canvas.height) {
    plane.y = canvas.height - plane.height;
    gameOver = true;
  } else if (plane.y < 0) {
    plane.y = 0;
    gameOver = true;
  }
}

// Check for collisions with buildings
function checkCollisions() {
  buildings.forEach((building) => {
    if (
      plane.x + plane.width > building.x &&
      plane.x < building.x + buildingWidth &&
      (plane.y < building.topHeight ||
        plane.y + plane.height > canvas.height - building.bottomHeight)
    ) {
      explosionActive = true; // Trigger explosion animation

      // Set a delay for game over
      if (!gameOverDelay) {
        gameOverDelay = true;
        setTimeout(() => {
          gameOver = true; // Set game over state
        }, 300); // 0.3 seconds delay
      }
    }
  });
}

// Display score
function displayScore() {
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("Score: " + score, 10, 50);
}

// Reset game on game over
function resetGame() {
  if (gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText(
      "Game Over! Final Score: " + score,
      canvas.width / 4,
      canvas.height / 2
    );
    ctx.fillText("Click to Restart", canvas.width / 4, canvas.height / 2 + 60);

    // Stop the music
    document.getElementById("gameMusic").pause();

    canvas.addEventListener("click", () => {
      // Reset game
      plane.y = canvas.height / 2;
      plane.dy = 0;
      buildings = [];
      score = 0;
      frame = 0;
      gameOver = false;
      explosionActive = false; // Reset explosion state
      explosionFrame = 0; // Reset explosion frame count
      gameOverDelay = false; // Reset game over delay

      // Restart the music
      document.getElementById("gameMusic").play();
    });
  }
}

// Draw explosion animation
function drawExplosion() {
  if (explosionActive) {
    ctx.drawImage(explosionImage, plane.x - 30, plane.y - 30, 120, 120); // Draw explosion centered on the plane
    explosionFrame++;

    // Stop the explosion after a few frames
    if (explosionFrame > 10) {
      // Display explosion for 10 frames
      explosionActive = false; // Reset explosion state
    }
  }
}

// Main game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the background image
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    generateBuildings();
    moveBuildings();
    drawBuildings();
    drawPlane();
    updatePlane();
    checkCollisions();
    displayScore();
    drawExplosion(); // Draw explosion if active

    frame++;
  } else {
    resetGame();
  }

  requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();

// Play the music when the game starts
document.getElementById("gameMusic").play();
