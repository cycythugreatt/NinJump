const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const platformWidth = 65;
const platformHeight = 20;
const platformStart = canvas.height - 50;

const gravity = 0.33;
const drag = 0.3;
const bounceVelocity = -12.5;

let minPlatformSpace = 15;
let maxPlatformSpace = 20;

let platforms = [{
  x: canvas.width / 2 - platformWidth / 2,
  y: platformStart
}];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

let y = platformStart;
while (y > 0) {
  y -= platformHeight + random(minPlatformSpace, maxPlatformSpace);

  let x;
  do {
    x = random(25, canvas.width - 25 - platformWidth);
  } while (
    y > canvas.height / 2 &&
    x > canvas.width / 2 - platformWidth * 1.5 &&
    x < canvas.width / 2 + platformWidth / 2
  );

  platforms.push({ x, y });
}

const doodle = {
  width: 40,
  height: 60,
  x: canvas.width / 2 - 20,
  y: platformStart - 60,
  dx: 0,
  dy: 0
};

let playerDir = 0;
let keydown = false;
let prevDoodleY = doodle.y;

let score = 0;

function resetGame() {
  platforms = [{
    x: canvas.width / 2 - platformWidth / 2,
    y: platformStart
  }];

  // Reset other game variables as needed
  minPlatformSpace = 15;
  maxPlatformSpace = 20;
  doodle.x = canvas.width / 2 - 20;
  doodle.y = platformStart - 60;
  doodle.dx = 0;
  doodle.dy = 0;
  playerDir = 0;
  keydown = false;
  prevDoodleY = doodle.y;
  score = 0;
}

// Add a click event listener to the restart button
const restartButton = document.getElementById('restartButton');
restartButton.addEventListener('click', function () {
  resetGame();
});


function loop() {
  requestAnimationFrame(loop);
  context.clearRect(0, 0, canvas.width, canvas.height);

  doodle.dy += gravity;

  if (doodle.y < canvas.height / 2 && doodle.dy < 0) {
    platforms.forEach(function (platform) {
      platform.y += -doodle.dy;
    });

    while (platforms[platforms.length - 1].y > 0) {
      platforms.push({
        x: random(25, canvas.width - 25 - platformWidth),
        y: platforms[platforms.length - 1].y - (platformHeight + random(minPlatformSpace, maxPlatformSpace))
      })

      minPlatformSpace += 0.5;
      maxPlatformSpace += 0.5;

      maxPlatformSpace = Math.min(maxPlatformSpace, canvas.height / 2);
    }
  }
  else {
    doodle.y += doodle.dy;
  }

  if (!keydown) {
    if (playerDir < 0) {
      doodle.dx += drag;

      if (doodle.dx > 0) {
        doodle.dx = 0;
        playerDir = 0;
      }
    }
    else if (playerDir > 0) {
      doodle.dx -= drag;

      if (doodle.dx < 0) {
        doodle.dx = 0;
        playerDir = 0;
      }
    }
  }

  doodle.x += doodle.dx;

  if (doodle.x + doodle.width < 0) {
    doodle.x = canvas.width;
  }
  else if (doodle.x > canvas.width) {
    doodle.x = -doodle.width;
  }

  context.fillStyle = 'black';
  platforms.forEach(function (platform) {
    context.fillRect(platform.x, platform.y, platformWidth, platformHeight);

    if (
      doodle.dy > 0 &&
      prevDoodleY + doodle.height <= platform.y &&
      doodle.x < platform.x + platformWidth &&
      doodle.x + doodle.width > platform.x &&
      doodle.y < platform.y + platformHeight &&
      doodle.y + doodle.height > platform.y
    ) {
      doodle.y = platform.y - doodle.height;
      doodle.dy = bounceVelocity;
      score += 10; // Increment score when jumping on a platform
    }
  });

  context.fillStyle = 'violet';
  context.fillRect(doodle.x, doodle.y, doodle.width, doodle.height);

  context.fillStyle = 'black';
  context.font = '20px Arial';
  context.fillText('Score: ' + score, 20, 30);

  prevDoodleY = doodle.y;

  platforms = platforms.filter(function (platform) {
    return platform.y < canvas.height;
  })
}

document.addEventListener('keydown', function (e) {
  if (e.which === 37) {
    keydown = true;
    playerDir = -1;
    doodle.dx = -3;
  }
  else if (e.which === 39) {
    keydown = true;
    playerDir = 1;
    doodle.dx = 3;
  }
});

document.addEventListener('keyup', function (e) {
  keydown = false;
});

requestAnimationFrame(loop);