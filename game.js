const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const healthBar = document.querySelector("progress");
const dogWidth = 50;
const dogHeight = 70;
const dogSpeed = 0.05;
const dogPositionX = 250;
const dogPositionY = 250;
const dogCatcherPositionX = 500;
const dogCatcherPositionY = 500;
const dogCatcherWidth = 40;
const dogCatcherHeight = 80;
let dogCatcherSpeed = 0.009;
let treatsCollected = document.getElementById("result");
let currentLevel = document.getElementById("level");
let i = 1;
let totalTreats = 0;
let levels = 1;

function haveCollided(sprite1, sprite2) {
  return (
    sprite1.x + sprite1.width > sprite2.x &&
    sprite1.y + sprite1.height > sprite2.y &&
    sprite2.x + sprite2.width > sprite1.x &&
    sprite2.y + sprite2.height > sprite1.y
  );
}

function pushOff(c1, c2) {
  if (haveCollided(c1, c2)) {
    if (c1.x + c1.width > c2.x) {
      c1.x -= 4;
      c2.x += 4;
    } else if (c1.y + c1.height > c2.y) {
      c1.y -= 4;
      c2.y += 4;
    } else if (c2.x + c2.width > c1.x) {
      c1.x += 4;
      c2.x -= 4;
    } else {
      c1.y += 4;
      c2.y -= 4;
    }
  }
}

function collisionDetection() {
  for (let i = 0; i < enemies.length; ++i) {
    for (let j = i + 1; j < enemies.length; ++j) {
      pushOff(enemies[i], enemies[j]);
    }
  }
}

function levelUp() {
  if (totalTreats % 5 === 0) {
    ++levels;
    currentLevel.innerHTML = levels;
  }
}

function stayInBounds() {
  if (player.x < 15) {
    player.x = 15;
  } else if (player.x > 760) {
    player.x = 760;
  } else if (player.y < 0) {
    player.y = 0;
  } else if (player.y > 530) {
    player.y = 530;
  }
}

// Background Image Source:https://2.bp.blogspot.com/-3-bkBLwA_Bk/VaTNgW4XoEI/AAAAAAAAE_8/hHO-ZQz83OI/s1600/tile_grass_v01bs.png 
class Background {
  constructor(x, y) {
    this.image = new Image();
    this.image.src =
      "https://2.bp.blogspot.com/-3-bkBLwA_Bk/VaTNgW4XoEI/AAAAAAAAE_8/hHO-ZQz83OI/s1600/tile_grass_v01bs.png";
    Object.assign(this, { x, y });
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, canvas.width, canvas.height);
    ctx.fillStyle = ctx.createPattern(this.image, "repeat");
  }
  static updateBackground() {
    ++topBackground.y;
    ++normalBackground.y;
    moveBackground();
  }
}

class Sprite {
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    ctx.stroke();
  }
}

// Scarecrow Sprite Image Source: https://www.stickpng.com/img/icons-logos-emojis/emojis/emoji-poop
class Scarecrow extends Sprite {
  constructor(x, y, width, height, speed) {
    super();
    this.image = new Image();
    this.image.src = "https://i.ibb.co/VQw263q/580b57fcd9996e24bc43c39c.png";
    Object.assign(this, { x, y, width, height, speed });
  }
}

// Dog Image Source: https://www.pngfans.com/middle-06861db0da241235-dog-running.html
class Dog extends Sprite {
  constructor(x, y, width, height, speed) {
    super();
    this.image = new Image();
    this.image.src =
      "https://i.ibb.co/y8QkPWY/dog-running-png-puppy-australian-cattle-dog-clipa-2b766088bc924f2c.png";
    Object.assign(this, { x, y, width, height, speed });
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

 // DogCatcher Image source: https://www.pinclipart.com/pindetail/xRJxTh_dog-catcher-male-scribblenauts-police-clipart/
class DogCatcher extends Sprite {
  constructor(x, y, width, height, speed) {
    super();
    this.image = new Image();
    this.image.src =
      "https://i.ibb.co/92pS4vm/Pin-Clipart-com-old-dog-clip-art-1910203.png";
    Object.assign(this, { x, y, width, height, speed });
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
// Heart Image Source: https://www.stockunlimited.com/similar/2008684.html
class Heart extends Sprite {
  constructor(x, y, width, height, speed) {
    super();
    this.image = new Image();
    this.image.src = "http://www.freeiconspng.com/uploads/heart-png-15.png";
    Object.assign(this, { x, y, width, height, speed });
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

// Treat Image Source: https://pngtree.com/freepng/pet-treat_2744410.html
class Treat extends Sprite {
  constructor(x, y, width, height, speed) {
    super();
    this.image = new Image();
    this.image.src =
      "https://i.ibb.co/9q16Ghf/kisspng-dog-biscuit-cat-food-clip-art-snack-5baa0f171db760-8541430615378716391217.png";
    Object.assign(this, { x, y, width, height, speed });
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

let topBackground = new Background(0, -600);
let normalBackground = new Background(0, 0);

let player = new Dog(dogPositionX, dogPositionY, dogWidth, dogHeight, dogSpeed);

let scarecrow = [];

let enemies = [
  new DogCatcher(
    dogCatcherPositionX,
    dogCatcherPositionY,
    dogCatcherWidth,
    dogCatcherHeight,
    dogCatcherSpeed - 0.002
  ),
  new DogCatcher(
    dogCatcherPositionX - 250,
    dogCatcherPositionY,
    dogCatcherWidth,
    dogCatcherHeight,
    dogCatcherSpeed
  )
];

let availableHearts = [];

let availableTreats = [];

function moveBackground() {
  if (normalBackground.y >= 600) {
    topBackground.y = -600;
    normalBackground.y = 0;
  }
}

/* I unfortunately was not able to figure out how to get my scarecrow to work for this assignment, 
 and I ran out of time to play around with it and figure it out. 
 However I am determined to figure it out over the break. */
function spawnScarecrow() {
  if (i % 150 === 0) {
    scarecrow.push(
      new Scarecrow(
        Math.random() * (500 - 150) + 150,
        Math.random() * (500 - 100) + 100,
        40,
        40,
        0
      )
    );
  }
}

function spawnDogCatchers() {
  if (i % 250 === 0) {
    enemies.push(
      new DogCatcher(
        dogCatcherPositionX - 155,
        dogCatcherPositionY,
        dogCatcherWidth,
        dogCatcherHeight,
        dogCatcherSpeed - 0.004
      ),
      new DogCatcher(
        dogCatcherPositionX - 275,
        dogCatcherPositionY,
        dogCatcherWidth,
        dogCatcherHeight,
        dogCatcherSpeed - 0.002
      )
    );
    if (levels === 1) {
      enemies.push(
        new DogCatcher(
          dogCatcherPositionX - 155,
          dogCatcherPositionY - dogCatcherPositionY,
          dogCatcherWidth,
          dogCatcherHeight,
          dogCatcherSpeed - 0.002
        ),
        new DogCatcher(
          dogCatcherPositionX - 275,
          dogCatcherPositionY - dogCatcherPositionY,
          dogCatcherWidth,
          dogCatcherHeight,
          dogCatcherSpeed - 0.002
        )
      );
    }
  }
  Background.updateBackground();
}

function spawnHearts() {
  if (i % 150 === 0) {
    availableHearts.push(
      new Heart(
        Math.random() * (500 - 150) + 150,
        Math.random() * (500 - 100) + 100,
        40,
        40,
        0
      )
    );
  }
}

function spawnTreats() {
  if (i % 150 === 0) {
    availableTreats.push(
      new Treat(
        Math.random() * (470 - 150) + 150,
        Math.random() * (470 - 100) + 100,
        30,
        30,
        0
      )
    );
  }
}

let mouse = { x: 0, y: 0, width: 0, height: 0 };
document.body.addEventListener("mousemove", updateMouse);
function updateMouse(event) {
  const { left, top } = canvas.getBoundingClientRect();
  mouse.x = event.clientX - left;
  mouse.y = event.clientY - top;
}

function dogCatcherChase(leader, follower, speed) {
  follower.x +=
    (leader.x + leader.width / 2 - (follower.x + follower.width / 2)) * speed;
  follower.y +=
    (leader.y + leader.height / 2 - (follower.y + follower.height / 2)) * speed;
}

function startScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "27px Courier New";
  ctx.fillStyle = "white";
  ctx.align = "center";
  ctx.fillText(
    "Run from the dog catchers!",
    canvas.width / 2 - 220,
    canvas.height / 2 - 50
  );
  ctx.fillText("Click to Go!", canvas.width / 2 - 110, canvas.height / 2 + 60);
  canvas.addEventListener("click", restartGame);
}

function gameOverScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "27px Courier New";
  ctx.fillStyle = "white";
  ctx.align = "center";
  ctx.fillText(
    "You have been caught!",
    canvas.width / 2 - 195,
    canvas.height / 2 - 20
  );
  ctx.font = "20px";
  ctx.fillText(
    "Click to Restart",
    canvas.width / 2 - 150,
    canvas.height / 2 + 60
  );
  canvas.addEventListener("click", restartGame);
}

function restartGame() {
  canvas.removeEventListener("click", restartGame);
  healthBar.value = 100;
  levels = 0;
  currentLevel.innerHTML = levels;
  totalTreats = 0;
  availableTreats.length = 0;
  availableHearts.length = 0;
  treatsCollected.innerHTML = totalTreats;
  Object.assign(player, { x: canvas.width / 2, y: canvas.height / 2 });
  enemies = [
    new DogCatcher(
      dogCatcherPositionX,
      dogCatcherPositionY,
      dogCatcherWidth,
      dogCatcherHeight,
      dogCatcherSpeed - 0.002
    ),
    new DogCatcher(
      dogCatcherPositionX - 250,
      dogCatcherPositionY,
      dogCatcherWidth,
      dogCatcherHeight,
      dogCatcherSpeed
    )
  ];
  requestAnimationFrame(drawScene);
}

function updateScene() {
  i++;
  spawnDogCatchers();
  spawnScarecrow();
  Background.updateBackground();
  spawnHearts();
  spawnTreats();
  collisionDetection();
  dogCatcherChase(mouse, player, player.speed);
  enemies.forEach(catcher => dogCatcherChase(player, catcher, catcher.speed));
  enemies.forEach(catcher => {
    if (haveCollided(catcher, player)) {
      healthBar.value -= 1;
      pushOff(player, catcher);
    }
  });
  availableTreats.forEach(treat => {
    if (haveCollided(player, treat)) {
      let i = availableTreats.indexOf(treat);
      availableTreats.splice(i, 1);
      enemies.shift();
      totalTreats += 1;
      levelUp();
      treatsCollected.innerHTML = totalTreats;
    }
  });
  availableHearts.forEach(heart => {
    if (haveCollided(player, heart)) {
      let i = availableHearts.indexOf(heart);
      availableHearts.splice(i, 1);
      healthBar.value += 5;
    }
  });
}

function drawScene() {
  topBackground.draw();
  normalBackground.draw();
  player.draw();
  availableTreats.forEach(treat => treat.draw());
  availableHearts.forEach(heart => heart.draw());
  enemies.forEach(catcher => catcher.draw());
  updateScene();
  stayInBounds();
  if (healthBar.value <= 0) {
    gameOverScreen();
  } else {
    requestAnimationFrame(drawScene);
  }
}

requestAnimationFrame(startScreen());
requestAnimationFrame(drawScene);
