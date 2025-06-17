let tH = 50

class towerSpot {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.occupied = false;
    this.tower = null; // will hold actual tower object later
  }

  display() {
    if (!this.occupied) {
    fill('#ebbd3f')
    rect(this.x, this.y+50, tH, 10, 5)
    fill('#b5741f')
    rect(this.x + 23, this.y + 35, 5, 20, 3)
    fill(230)
    rect(this.x+18, this.y + 28, 15, 10)
    }
  }
 
  // Check if the plot was clicked.
  wasClicked(mx, my) {
    return !this.occupied && dist(mx, my, this.x+25, this.y+40) < 25;
  }
  
  highlight() {
    stroke(100, 255, 255, 150);
    strokeWeight(2)
    fill('#ebbd3f')
    rect(this.x, this.y+50, tH, 10, 5)
    fill('#b5741f')
    rect(this.x + 23, this.y + 35, 5, 20, 3)
    fill(230)
    rect(this.x+18, this.y + 28, 15, 10)
    noStroke();
  }

  // Code to construct the tower.
  buildTower(type) {
    if (type == "archer") {
      this.tower = new archer(this.x, this.y);
    } else if (type == "wizard") {
      this.tower = new wizard(this.x, this.y);
    } else if (type == "bomb") {
      this.tower = new bomb(this.x, this.y);
    }
    this.occupied = true;
    // Append the newly constructed tower to the towers array.
    towers.push(this.tower);
    towerBuild.setVolume(0.3);
    towerBuild.stop();
    towerBuild.play();
  }

}

class BaseTower {
  // Necessary stats that define each tower.
  constructor(x, y, range, rate, damage, attackType, basePrice) {
    this.x = x;
    this.y = y;
    this.range = range;
    this.rate = rate;
    this.damage = damage;
    this.attackType = attackType;
    this.cooldown = 0;
    this.level = 1;
    this.attackSound = null;
    this.basePrice = basePrice;
    this.upgradeCosts = [];  
    
  }

  // Check if the tower was clicked.
  wasClicked(mx, my) {
    return dist(mx, my, this.x+25, this.y+40) < 30;
  }

  // Draw the range of the tower.
  drawRange() {
    fill(100, 255, 255, 60);
    circle(this.x+26, this.y+30, this.range * 2);
  }

  // Display the stats of the tower on the bottom of the screen.
  drawStats() {
    
    let cost = this.getUpgradeCost();
    // let sell = this.sellPrice();
    
    fill('#783e00')
    rect(340, 440, 300, 100, 5)
    fill(230);
    textSize(14);
    text(`Level: ${this.level}`, 350, 460);
    text(`DMG: ${this.damage}`, 350, 480);
    text(`Range: ${this.range}`, 350, 500);
    
    // Truncate to 2 decimal points to avoid very long decimal numbers.
    text(`Rate: ${(this.rate/60).toFixed(2)}s`, 350, 520);
    text(`Type: ${this.attackType === 'p' ? "Physical" : "Magical"}`, 450, 460);
    
    // If the tower is at the max level then do not display a cost instead say it is MAX.
    text(`Upgrade Cost: ${cost === Infinity ? "MAX" : cost}`, 450, 480);
    
    // If the cost is infinity that means its the max level. No need to tell the player to upgrade the tower.
    if (cost != Infinity) text("Press 'u' to upgrade", 450, 500);

    // Display the sell price of the tower so the player is aware of how much money they will get back.
    text(`Press 's' to Sell: ${this.getSellPrice()}G`, 450, 520);


  }
  
  attack(enemies) {
    if (this.cooldown > 0) {
      this.cooldown--;
      return;  // Not ready to attack yet
    }

    let inRange = enemies.filter(enemy => dist(this.x+26, this.y+30, enemy.pos.x, enemy.pos.y) <= this.range);

    if (inRange.length > 0) {
      let target = inRange.reduce((closest, curr) => curr.pos.x < closest.pos.x ? curr : closest);

      // The damage dealt after armor is applied, if there is armor.
      let effectiveDamage = this.damage;

  if (this.attackType === 'p') {
    // reduce damage by enemy armor only if attack is physical
    effectiveDamage = this.damage * (1 - target.armor);
  }

      target.health -= effectiveDamage;
      
      // Play attack sound each attack;
      
      this.attackSound.stop();
      this.attackSound.play();
      
      // Reset cooldown
      this.cooldown = this.rate;
    }
  }
  
  upgrade() {
  console.warn("Upgrade not implemented for this tower.");

}
  
    getSellPrice() {
  let refund = this.basePrice * 0.7;
  for (let i = 0; i < this.level - 1; i++) {
    refund += this.upgradeCosts[i] * 0.7;
  }
  return Math.floor(refund);
}
  
  sell() {
    let refund = this.basePrice * 0.7;
    for (let i = 0; i < this.level - 1; i++) {
      refund += this.upgradeCosts[i] * 0.7;
    }
    money += Math.floor(refund);

    // Remove from towers array
    let index = towers.indexOf(this);
    if (index !== -1) towers.splice(index, 1);

    // Find matching spot and reset it
    for (let spot of towerSpots) {
      if (spot.tower === this) {
        spot.tower = null;
        spot.occupied = false;
        break;
      }
    }

    // reset the properties of the tower spot.
    selectedSpot = null;
    towerSelect = false;
    buildMenuOpen = false;
      
    // sell message for the player.
    console.log("Tower sold for: " + refund + "G")
  }


  
}

class archer extends BaseTower {
 
  // Stats of the archer tower.
  constructor (x,y) {
   super(x, y, 140, 45, 6, 'p', 70)
    archerSFX.setVolume(0.3)
    this.attackSound = archerSFX;
    this.upgradeCosts = [110, 160];
  }
  
  // Level 1 visuals for archer.
  drawBase() {
  fill('#b5741f')
  rect(this.x, this.y+10, tH, tH)
  fill('#704813')
  rect(this.x - 5, this.y, tH+10, 15, 5)

  fill(230)  
  circle(this.x + 25, this.y + 20, 20)
  fill('#bd1111')
  circle(this.x + 25, this.y + 20, 15)
  fill(230)  
  circle(this.x + 25, this.y + 20, 10)
  fill('#bd1111')
  circle(this.x + 25, this.y + 20, 5)    
}
  
  // Level 2 visuals for archer.
  drawUpgraded() {
  fill('#919191')
  rect(this.x, this.y+10, tH, tH)
  fill('#6e6e6e')
  rect(this.x - 5, this.y, tH+10, 15, 5)

  fill(230)  
  circle(this.x + 25, this.y + 20, 20)
  fill('#bd1111')
  circle(this.x + 25, this.y + 20, 15)
  fill(230)  
  circle(this.x + 25, this.y + 20, 10)
  fill('#bd1111')
  circle(this.x + 25, this.y + 20, 5)    
  }
  
  // Level 3 visuals for archer.
  drawMax() {
  fill(80)
  circle(this.x-5, this.y+7, 8)
  circle(this.x+55, this.y+7, 8)
    
  fill('#8f8f8f')
  rect(this.x, this.y+10, tH, tH)
  fill('#6e6e6e')
  rect(this.x - 5, this.y, tH+10, 15, 5)
  fill('#6b6a6a')
  rect(this.x-5, this.y + tH +5, tH+10, 10,2)
    
  fill(80)
  circle(this.x+5, this.y+7, 6)
  circle(this.x+18, this.y+7, 6)
  circle(this.x+31, this.y+7, 6)
  circle(this.x+44, this.y+7, 6)

  fill(230)  
  circle(this.x + 25, this.y + 20, 20)
  fill('#bd1111')
  circle(this.x + 25, this.y + 20, 15)
  fill(230)  
  circle(this.x + 25, this.y + 20, 10)
  fill('#bd1111')
  circle(this.x + 25, this.y + 20, 5)    
  }
  
  // Draw the archer tower.
  display() {
    switch (this.level) {
    case 1:
      this.drawBase();
      break;
    case 2:
      this.drawUpgraded();
      break;
    case 3:
      this.drawMax();
      break;
    }
  } 
  
  getBasePrice() {
    return 70;
  }

  getUpgradeCost() {
    if (this.level === 1) return 110;
    if (this.level === 2) return 160;
    return Infinity;  // Can't upgrade past level 3
  }

  // Upgrade the tower.
  upgrade() {
    // Check money.
    let cost = this.getUpgradeCost();
    if (money >= cost && this.level < 3) {
      money -= cost;
      this.level++;

      // Stat changes per upgrade.
      if (this.level === 2) {
        this.damage += 3;
        this.range += 10;
        this.rate -= 10;
      } else if (this.level === 3) {
        this.damage += 3;
        this.range += 15;
        this.rate -= 5;
      }

    console.log(`Archer upgraded to level ${this.level}`);
      
    // Play tower upgrade sound.
    towerUpgrade.setVolume(0.2)
    towerUpgrade.stop()
    towerUpgrade.play()
      
    } else if (this.level == 3) {
      console.log("Max level reached.");
      invalidSFX.setVolume(0.1);
      invalidSFX.stop();
      invalidSFX.play();
    } else {
      console.log("Not enough gold.")
      invalidSFX.setVolume(0.1);
      invalidSFX.stop();
      invalidSFX.play();
    }
  }

}

archer.basePrice = 70;

class wizard extends BaseTower {
  
  // Stats of the wizard tower.
  constructor(x, y) {
   super(x, y, 130, 105, 15, 'm', 100)
    wizardSFX.setVolume(0.15)
    this.attackSound = wizardSFX;
        this.upgradeCosts = [160, 240];
  }
  
  // Level 1 visuals for wizard.
  drawBase() {
      fill('#a3a3a3')
      rect(this.x, this.y+10, tH, tH, 5)
      fill('#6e6e6e')
      rect(this.x - 5, this.y + tH, tH+10, 10, 4)
      fill('#667aff') 
      circle(this.x + 25, this.y+35, 7)
      for (let i = 0; i < 4; i++){
        ellipse(this.x + 2 +i*15, this.y+10, 6, 20)
      } 
  }
  
  // Level 2 visuals for wizard.
  drawUpgraded() {
          fill('#a3a3a3')
      rect(this.x, this.y+10, tH, tH, 5)
      fill('#6e6e6e')
      rect(this.x - 5, this.y + tH, tH+10, 11, 4)
      fill('#5269ff')
      circle(this.x + 20, this.y+35, 9)
      circle(this.x + 30, this.y+35, 9)
      ellipse(this.x, this.y+6, 8, 20)
      ellipse(this.x+tH, this.y+6, 8, 20)
      fill('#6e6e6e')
      rect(this.x - 5, this.y+10, tH+10, 6, 2)
  }
  
  // Level 3 visuals for wizard.
  drawMax() {
      fill('#a3a3a3')
      rect(this.x, this.y+10, tH, tH, 5)
      rect(this.x-5, this.y-2, 10, 15)
      rect(this.x+45, this.y-2, 10, 15)
      fill('#6e6e6e')
      rect(this.x - 5, this.y + tH, tH+10, 15, 4)
      rect(this.x - 5, this.y+10, tH+10, 6, 2)
      fill('#304cff')
      circle(this.x + 20, this.y+35, 8)
      circle(this.x + 30, this.y+35, 8)
      circle(this.x + 25, this.y+25, 8)
    
      ellipse(this.x, this.y-3, 10, 15)
      ellipse(this.x +tH, this.y-3, 10, 15)
  }
  
    // Draw the wizard tower
  display () {
      switch (this.level) {
    case 1:
      this.drawBase();
      break;
    case 2:
      this.drawUpgraded();
      break;
    case 3:
      this.drawMax();
      break;
    }
 }
  
  getBasePrice() {
    return 100;
  }

  getUpgradeCost() {
    if (this.level === 1) return 160;
    if (this.level === 2) return 240;
    return Infinity;
  }

  upgrade() {
    
    let cost = this.getUpgradeCost();
    if (money >= cost && this.level < 3) {
      money -= cost;
      this.level++;

      if (this.level === 2) {
        this.damage += 17;
        this.range += 10;
      } else if (this.level === 3) {
        this.damage += 24;
        this.range += 10;
        this.rate -= 15; // a bit faster
      }
    
    console.log(`Wizard upgraded to level ${this.level}`);
            
    // Play tower upgrade sound.
    towerUpgrade.setVolume(0.2)
    towerUpgrade.stop();
    towerUpgrade.play();
      
    } else if (this.level == 3) {
      console.log("Max level reached.");
      invalidSFX.setVolume(0.1);
      invalidSFX.stop();
      invalidSFX.play();
    } else {
      console.log("Not enough gold.")
      invalidSFX.setVolume(0.1);
      invalidSFX.stop();
      invalidSFX.play();
    }
  }
  
}

wizard.basePrice = 100;

class bomb extends BaseTower {
  
    constructor(x, y) {
    super(x,y, 150, 135, 24, 'p', 125)
    bombSFX.setVolume(0.2)
    this.attackSound = bombSFX;
    this.upgradeCosts = [190, 280];
  }
  
    // Level 1 visuals for artillery.
  drawBase() {
         fill('#808080')
      rect(this.x + 10, this.y, 30, 30, 5)
      fill('#e09422')
      rect(this.x, this.y + 20, tH, tH -20, 5)
      fill('#b5741f')
      rect(this.x - 5, this.y + 45 , 60, 15, 4)
      fill('#3b3b3b')
      ellipse(this.x+25, this.y+5, 26, 5) 
  }
  
  // Level 2 visuals for artillery.
  drawUpgraded() {
      fill('#5f5f5f')
      rect(this.x + 10, this.y-5, 30, 35, 5)
      fill('#8f8f8f')
      rect(this.x, this.y + 20, tH, tH -20, 4)
      fill('#6b6a6a')
      rect(this.x - 5, this.y + 45 , 60, 15, 3)
      fill('#303030')
      ellipse(this.x+25, this.y, 26, 5) 
  }
  
  // Level 3 visuals for artillery.
  drawMax() {
      fill(20)
      circle(this.x+7, this.y, 8)
      circle(this.x+41, this.y, 8)
      circle(this.x+7, this.y+10, 8)
      circle(this.x+41, this.y+10, 8)
      fill('#5f5f5f')
      rect(this.x + 7, this.y-10, 35, 40, 5)
      fill('#4a2222')
      rect(this.x, this.y + 20, tH, tH -15, 4)
      fill('#361919')
      rect(this.x - 5, this.y + 50 , 60, 15, 3)
      fill('#303030')
      ellipse(this.x+25, this.y-5, 28, 5) 
  }
  
    // Draw the artillery tower.
  display () {
      switch (this.level) {
    case 1:
      this.drawBase();
      break;
    case 2:
      this.drawUpgraded();
      break;
    case 3:
      this.drawMax();
      break;
    }
 }
  
  getBasePrice() {
    return 125;
  }

  getUpgradeCost() {
    if (this.level === 1) return 190;
    if (this.level === 2) return 280;
    return Infinity;
  }

  upgrade() {
    let cost = this.getUpgradeCost();
    if (money >= cost && this.level < 3) {
      money -= cost;
      this.level++;

      if (this.level === 2) {
        this.damage += 18;
        this.range += 20;
      } else if (this.level === 3) {
        this.damage += 28;
        this.range += 20;
        this.rate -= 15; // a bit faster
      }
      
      console.log(`Artillery upgraded to level ${this.level}`);
      
    // Play tower upgrade sound.
    towerUpgrade.setVolume(0.2);
    towerUpgrade.stop();
    towerUpgrade.play();
      
    } else if (this.level == 3) {
      console.log("Max level reached.");
      invalidSFX.setVolume(0.1);
      invalidSFX.stop();
      invalidSFX.play();
    } else {
      console.log("Not enough gold.")
      invalidSFX.setVolume(0.1);
      invalidSFX.stop();
      invalidSFX.play();
    }
  }

}

bomb.basePrice = 125;