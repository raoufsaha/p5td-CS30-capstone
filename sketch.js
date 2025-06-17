/***************************
Raouf Saha
06/13
CS 30
CapStone Project
p5.js Tower Defense

Tower defense game inspired by IronHide Studios' Kingdom Rush. Background music belongs to Ironhide Studios.
**************************/

// Variable declarations. 
  // Tower declarations
let towerSpots = [];
let towers = [];
let buildMenuOpen = false;
let selectedSpot = null;
let towerSelect = false;

// Game stat declarations
let money = 350;
let lives = 20;

// Game ends
let gameWon = false;
let gameLost = false;
let endFade = 0;
let endScale = 1;
let restartButton;

  // Enemy and wave declarations
let enemies = [];
let waveEnemies = [];
let currentWave = 0;
let waveInProgress = false;
const totalWaves = 10;

  // Spawning declarations
let spawnQueue = [];
let spawnTimer = 0;
let spawnDelay = 45; // frames between spawns (0.75s at 60fps)

  // Audio declarations
let archerSFX, wizardSFX, bombSFX, deathSound, battleTheme, preBattle, waveCall, lifeLost, towerBuild, towerUpgrade, towerSell, invalidSFX;

  // Array for the path that the enemies travel. In x and y coordinates.
let path = [
  { x: 800, y: 235 },  // Start point (right edge)
  { x: 635, y: 235 },  // Move left
  { x: 635, y: 405 },  // Down
  { x: 435, y: 405 },  // Left
  { x: 435, y: 115 },  // Up
  { x: 240, y: 115 },  // Left
  { x: 240, y: 395 },  // Down
  { x: -10,   y: 395 },  // Exit off the left
];

  // Preload audios to prevent runtime errors.
function preload() {
  archerSFX = loadSound('Audio/archerSFX.mp3');
  wizardSFX = loadSound('Audio/wizardSFX.mp3');
  bombSFX = loadSound('Audio/bombSFX.mp3');
  deathSound = loadSound('Audio/deathSound.mp3');
  battleTheme = loadSound('Audio/battleTheme.mp3');
  preBattle = loadSound('Audio/preBattle.mp3');
  waveCall = loadSound('Audio/waveCall.mp3');
  lifeLost = loadSound('Audio/lifeLost.mp3');
  towerBuild = loadSound('Audio/towerBuild.mp3');
  towerUpgrade = loadSound('Audio/towerUpgrade.mp3');
  towerSell = loadSound('Audio/towerSell.mp3');
  invalidSFX= loadSound('Audio/invalidSFX.mp3');
}


// Function that places all the tower spots around the map. Saves code in the setup function and makes the overall code look cleaner
function placeSpots() {
  
  towerSpots.push(new towerSpot(510,280))
  towerSpots.push(new towerSpot(510,200))
  towerSpots.push(new towerSpot(510,120))
  towerSpots.push(new towerSpot(310,160))
  towerSpots.push(new towerSpot(310,240))
  towerSpots.push(new towerSpot(310,320))
  towerSpots.push(new towerSpot(700,270))
  towerSpots.push(new towerSpot(130,190))
  towerSpots.push(new towerSpot(130,270))
  towerSpots.push(new towerSpot(130,110))
  
}

function setup() {
  
  noStroke();
  createCanvas(800, 525);
  placeSpots();
  populateWaves();
  
  // Play preBattle music.
  preBattle.setVolume(0.15);
  preBattle.stop();
  preBattle.loop();
  
  // Forced to chop up the text so it all logs nicely on the console.
  console.log("Welcome to p5.js Tower Defense. Click on a plot of land to construct a tower. Enemies      spawn from the red side and exit through the blue side. Press the spacebar 'to start         waves!")

}

function mousePressed() {
  let clickedAnySpot = false;

  // Check clicks on a tower spot.
  for (let spot of towerSpots) {
    if (spot.wasClicked(mouseX, mouseY)) {
      buildMenuOpen = true;
      selectedSpot = spot;
      towerSelect = true;
      clickedAnySpot = true;
      break;
    }
  }
  
  // Check clicks on a tower.
  for (let t of towers) {
    if (t.wasClicked(mouseX, mouseY)) { 
      selectedSpot = t;
      towerSelect = true;
      clickedAnySpot = true;
      break;
    }
  }

  // Check clicks that are not a tower spot or a tower.
  if (!clickedAnySpot) {
    buildMenuOpen = false;
    selectedSpot = null;
  }
}

function keyPressed() {
  
  // Spacebar to call in waves.
    if (key === ' ') {
    if (!waveInProgress && currentWave < totalWaves) {
      startWave(currentWave);
      waveInProgress = true;
      waveCall.setVolume(0.05);
      waveCall.stop();
      waveCall.play();
      console.log("Wave", currentWave + 1, "started!");
    }
  }
  
  // Tower construction hotkeys. Only work when the build menu is open.
  if (buildMenuOpen && selectedSpot) {
    let k = key.toLowerCase();
  
    if (k === 'a') {
      if (money >= archer.basePrice) {
        money -= archer.basePrice;
        selectedSpot.buildTower("archer");
        buildMenuOpen = false;
      } else {
        invalidSFX.setVolume(0.1);
        invalidSFX.stop();
        invalidSFX.play();
        console.log("Insufficient funds for Archer.");
      }
    }

    if (k === 'b') {
      if (money >= bomb.basePrice) {
        money -= bomb.basePrice;
        selectedSpot.buildTower("bomb");
        buildMenuOpen = false;
      } else {
        invalidSFX.setVolume(0.1);
        invalidSFX.stop();
        invalidSFX.play();
        console.log("Insufficient funds for Bomb.");
      }
    }

    if (k === 'w') {
      if (money >= wizard.basePrice) {
        money -= wizard.basePrice;
        selectedSpot.buildTower("wizard");
        buildMenuOpen = false;
      } else {
        invalidSFX.setVolume(0.1);
        invalidSFX.stop();
        invalidSFX.play();
        console.log("Insufficient funds for Wizard.");
      }
    }
  }
  
  // Upgrade key.
  if (key === 'u' && selectedSpot && selectedSpot.upgrade) {
  selectedSpot.upgrade();
}
  
  // Sell key  
  if (towerSelect && selectedSpot && typeof selectedSpot.sell === 'function') {
  if (key.toLowerCase() === 's') {
    selectedSpot.sell();
    towerSell.setVolume(0.2);
    towerSell.stop();
    towerSell.play();
  }
}

}

// Wave composition.
function populateWaves() {

    // Wave 1:
  waveEnemies[0] = [];
  for (let i = 0; i < 14; i++){
    waveEnemies[0].push(new basicEnemy());
  }

  // Wave 2:
  waveEnemies[1] = [];
  for (let i = 0; i < 6; i++){
    waveEnemies[1].push(new basicEnemy());
  }

    for (let i = 0; i < 5; i++){
    waveEnemies[1].push(new mediumEnemy());
  }
  
  // Wave 3:
  waveEnemies[2] = [];
    for (let i = 0; i < 8; i++){
    waveEnemies[2].push(new basicEnemy());
  }
  
      for (let i = 0; i < 8; i++){
    waveEnemies[2].push(new fastEnemy());
  }
  
  // Wave 4:
  waveEnemies[3] = [];
    for (let i = 0; i < 3; i++){
    waveEnemies[3].push(new mediumEnemy());
  }
  
      for (let i = 0; i < 10; i++){
    waveEnemies[3].push(new basicEnemy());
  }
  
        for (let i = 0; i < 5; i++){
    waveEnemies[3].push(new mediumEnemy());
  }

  // Wave 5:
  waveEnemies[4] = [];
    for (let i = 0; i < 20; i++){
    waveEnemies[4].push(new basicEnemy());
  }
  
          for (let i = 0; i < 5; i++){
    waveEnemies[4].push(new mediumEnemy());
  }
  
      for (let i = 0; i < 3; i++){
    waveEnemies[4].push(new armoredEnemy());
  }
  
  // Wave 6:
  waveEnemies[5] = [];
    for (let i = 0; i < 25; i++){
    waveEnemies[5].push(new fastEnemy());
  }
  
      for (let i = 0; i < 10; i++){
    waveEnemies[5].push(new mediumEnemy());
  }
  
  // Wave 7:
  waveEnemies[6] = [];
  
  waveEnemies[6].push(new maulerEnemy());
  
    for (let i = 0; i < 5; i++){
    waveEnemies[6].push(new mediumEnemy());
  }
  
      for (let i = 0; i < 3; i++){
    waveEnemies[6].push(new armoredEnemy());
  }
  
        for (let i = 0; i < 4; i++){
    waveEnemies[6].push(new maulerEnemy());
  }
  
  // Wave 8:
  waveEnemies[7] = [];
      for (let i = 0; i < 15; i++){
    waveEnemies[7].push(new basicEnemy());
  }
  
        for (let i = 0; i < 10; i++){
    waveEnemies[7].push(new mediumEnemy());
  }
  
          for (let i = 0; i < 3; i++){
    waveEnemies[7].push(new giantEnemy());
  }
  
  // Wave 9:
  waveEnemies[8] = [];
      for (let i = 0; i < 3; i++){
    waveEnemies[8].push(new armoredEnemy());
  }
  
        for (let i = 0; i < 5; i++){
    waveEnemies[8].push(new maulerEnemy());
  }
  
          for (let i = 0; i < 10; i++){
    waveEnemies[8].push(new fastEnemy());
  }
  
            for (let i = 0; i < 4; i++){
    waveEnemies[8].push(new giantEnemy());
  }
  
  // Wave 10:
  waveEnemies[9] = [];
      for (let i = 0; i < 2; i++){
    waveEnemies[9].push(new giantEnemy());
  }
  
  // Spawn the bossman
        for (let i = 0; i < 15; i++){
    waveEnemies[9].push(new basicEnemy());
  }
  
          for (let i = 0; i < 10; i++){
    waveEnemies[9].push(new fastEnemy());
  }
  
            for (let i = 0; i < 5; i++){
    waveEnemies[9].push(new maulerEnemy());
  }
  
              for (let i = 0; i < 6; i++){
    waveEnemies[9].push(new giantEnemy());
  }
 }

function startWave(waveNumber) {
  spawnQueue = []; // clear old queue just in case
  spawnTimer = 0;
  if (waveNumber == 0) {
    preBattle.stop()
    battleTheme.setVolume(0.05); 
    battleTheme.stop();
    battleTheme.loop();
  }
  if (waveEnemies[waveNumber] && !waveInProgress) {
    spawnQueue.push(...waveEnemies[waveNumber]);
  } else {
    console.warn("No enemies found for wave", waveNumber);
  }
}

function win() {
  gameWon = true;
  endFade = 0;
  endScale = 1;
}

function lose() {
  gameLost = true;
  endFade = 0;
  endScale = 1;
}

function drawEndScreen() {
  if (endFade < 255) {
    endFade += 2;
    endScale += 0.01;
  }

  push();
  fill(0, endFade * 0.6);
  rect(0, 0, width, height);
  fill(gameWon ? color(0, 255, 100, endFade) : color(255, 50, 50, endFade));
  textAlign(CENTER, CENTER);
  textSize(50 * endScale);
  textStyle(BOLD); 
  text(gameWon ? " YOU WIN! " : " YOU LOSE ", width / 2, height / 2);
  pop();
}


// Function to call to draw the track. Saves lines of code from the draw function.
function track() {
  fill('#debe3e');
  rect(width - 200, 200, 220, 70, 20);
  rect(width - 200, 200, 70, 230, 20);
  rect(400, 360, 260, 70, 20);
  rect(400, 80, 70, 320, 20);
  rect(200, 80, 240, 70, 20);
  rect(200, 80, 70, 300, 20);
  rect(-10, 350, 280, 70, 20);
  fill('#c78822');
  rect(40, 280, 8, 60, 3);
  fill('#2385fc');
  rect(48, 285, 30, 20);
  noFill();
  stroke(50, 100, 255, 150);
  strokeWeight(6);
  circle(40, 385, 40);
  noStroke();
  fill('#c78822');
  rect(740, 130, 8, 60, 3);
  fill('#cc1414');
  rect(748, 135, 30, 20);
  stroke(255, 50, 50, 150);
  strokeWeight(6);
  noFill();
  circle(760, 235, 40);
  noStroke();
  
}

// Function to call to draw tower logos in the build menu. This makes the draw function cleaner and more readable rather than drawing all the logos in there.
function towerLogo(t) {
  if (t == 'archer'){
    textSize(14);
    fill(230)  ;
    circle(40, 495, 40);
    fill('#bd1111');
    circle(40, 495, 30);
    fill(230);
    circle(40, 495, 20);
    fill('#bd1111');
    circle(40, 495, 10);
    fill(230);
    text("Archer: 'a'", 10, 450);
    textSize(16);
    textStyle(BOLD);
    // Check to see if you have enough money to buy tower. If yes then the price will be gold coloured, otherwise it will be red to indicate that you have insufficient funds. Bolded the price as it was hard to see due to the colors.
    if (money < 70) fill('#bd1111');
    else fill('#f2db07');
    text("70", 30, 468);
    
  } else if (t == 'wizard') {
      textStyle(NORMAL);
      textSize(14);
      fill(230);
      text("Wizard: 'w'", 100, 450);
      textSize(16);
      textStyle(BOLD);
        if (money < 100) fill('#bd1111');
    else fill('#f2db07');
    text("100", 120, 468);
    fill('#a3a3a3');
    rect(130, 490, 8, 30, 4);
    fill('#963df5');
    circle(133, 483, 20)
  } else if (t == 'bomb') {
     textStyle(NORMAL);
      textSize(14);
      fill(230);
      text("Artillery: 'b'", 190, 450);
      textSize(16);
      textStyle(BOLD);
        if (money < 125) fill('#bd1111');
    else fill('#f2db07');
    text("125", 210, 468);
    fill('#d6cb76');
    rect(223.5, 473, 3, 10, 1)
    fill('#262626');
    circle(225, 500, 32);
    rect(215, 481, 20, 10, 5);

  }
}

function draw() {
  
  if (gameWon || gameLost) {
  drawEndScreen();
  return; // stop the game logic if ended
}
  
  // Draw the battlefield.
  background(100,180,50);

  
  // Show stats.
  fill(230);
  textStyle(BOLD);
  textSize(16);
  // text("TowerSelect: " + towerSelect, 10, 20);
  text("Gold: " + money, 10, 40);
  text("Lives: " + lives, 10, 60);
  text("Wave: " + (currentWave+1), 10, 20);
  
  // Show build menu in the bottom right corner alongside the towers available and their prices.

  // Draw the track.
  track();
  
    // Iterate through the tower spots and call the necessary functions
  for (let t of towerSpots){
    t.display();
        if (t === selectedSpot) {
    t.highlight();
    } 
  }
  
    // Iterate through the towers and call the necessary functions
  for (let t of towers){
    t.display();
    t.attack(enemies);
     // Draw range if this is the selected spot and it has a tower
    if (t === selectedSpot) {
    t.drawRange();
    t.drawStats();
    }
  }
  
    if (buildMenuOpen) {
    fill(100);
    rect(-10, 430, 300, 120, 10);
    towerLogo('archer');
    towerLogo('wizard');
    towerLogo('bomb');
  }
  
  // Iterate through the enemies and call the necessary functions. Iteration through the array backwards is necessary because using .splice while looping forward can skip items.
for (let i = enemies.length - 1; i >= 0; i--) {
  let e = enemies[i];
  e.update();
  e.display();

  if (e.isDead()) {
    money += e.reward; 
    enemies.splice(i, 1);
    
    //Play enemy death sound.
    deathSound.setVolume(0.04)
    deathSound.stop()
    deathSound.play()

  }
  
  if (e.isOffscreen()) {
    lives -= e.lives;
    enemies.splice(i, 1);
    
    // Play life lost sound.
    lifeLost.setVolume(0.06)
    lifeLost.stop()
    lifeLost.play()
  }
}
  
  // Make enemies more grouped together on waves 4 and 6
  if (currentWave == 3) spawnDelay = 20; else if (currentWave == 5) spawnDelay = 25; else spawnDelay = 45
  
  if (spawnQueue.length > 0) {
    if (spawnTimer <= 0) {
      let nextEnemy = spawnQueue.shift();
      enemies.push(nextEnemy);
      spawnTimer = spawnDelay;
    } else {
      spawnTimer--;
    }
  }
  
  // Announce that the current wave has been completed and increment the wave counter for the next waves. Award the player 30 gold.
  if (waveInProgress && enemies.length === 0) {
  waveInProgress = false; 
  currentWave++;
  money += 30
  console.log("Wave", currentWave, "cleared! You have been awarded 30 gold! Press spacebar for the next wave.");
  }

    // Condition where player wins the game.
  if (currentWave >= waveEnemies.length && enemies.length === 0 && spawnQueue.length === 0) {
  win();
  }

  // Condition where player loses the game.
  if (lives <= 0) {
  lose();
  }

}