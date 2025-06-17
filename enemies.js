class Enemy {
  // The average enemy will not have armor so I set it to 0. I can later modify the armor by passing it into each enemy specifically.
  constructor(speed, health, reward, lives, armor = 0) {
    // Stats for each enemy.
    this.speed = speed;
    this.health = health;
    this.maxHealth = health;
    this.reward = reward;
    this.lives = lives;
    this.armor = armor
    // Initialize their first spawn as 0. The enemies position would be the first value on the path array aka their spawn point.
    this.waypointIndex = 0;
    this.pos = createVector(path[0].x, path[0].y);
  }

  update() {
    // loop that continues to run so long as the enemies have not reached the end. 
    if (this.waypointIndex < path.length) {
      // target destination is assigned a vector which is derived from the path array at the current waypointIndex. waypointIndex is simply the current step of the path the enemies are on. Eg. waypointIndex = 1 means that they're travelling to the first target destination.
      let target = createVector(path[this.waypointIndex].x, path[this.waypointIndex].y);
      let dir = p5.Vector.sub(target, this.pos);
      let dist = dir.mag();
      dir.normalize();
      this.pos.add(dir.mult(this.speed));

      if (dist < this.speed) {
        this.waypointIndex++;
      }
    }
  }

  display() {
    fill('red');
    ellipse(this.pos.x, this.pos.y, 20, 20);
  }

  isOffscreen() {
    return this.waypointIndex >= path.length;
  }
  
  drawHP() {
      // Health bar
  fill(200, 50, 50);
  rect(this.pos.x - 10, this.pos.y - 20, 20, 4)
    
      let barWidth = 20 * (this.health / this.maxHealth);
    fill(0,255,0)
  rect(this.pos.x - 10, this.pos.y - 20, barWidth, 4);
    fill(230)
    textStyle(BOLD);
    textSize(12);
    text(this.health ,this.pos.x, this.pos.y)
  }
  
  isDead() {
  return this.health <= 0;
  }
  
}

class basicEnemy extends Enemy {
  
  constructor() {
    super(1.2, 24, 5, 1)
}
   
  display() {
    // recycled the soldier drawing from my 7.2 assignment.
    fill('red');
    ellipse(this.pos.x, this.pos.y, 18, 20);
    fill(30)
    // Spear base
    rect(this.pos.x-8, this.pos.y-8, 3, 22)
    // Tip of spear
    fill(220)
    triangle(this.pos.x-10, this.pos.y-6, this.pos.x-6,this.pos.y-12, this.pos.x-4,this.pos.y-6)
    this.drawHP();
  }
}


class mediumEnemy extends Enemy {
  
  constructor() {
    super(1, 64, 10, 2)
}
  
  
  display() {
    fill(160,40,40);
    ellipse(this.pos.x, this.pos.y, 22, 25);
    fill(30)
    // Sword handle
    rect(this.pos.x-10, this.pos.y+6, 3, 5, 5)
    // sword blade
    fill(220)
    rect(this.pos.x-11, this.pos.y-14, 4, 20)
    this.drawHP();
  }
}

class fastEnemy extends Enemy {
  
  constructor() {
    super(2.1, 32, 10, 1)
}
  
  
  display() {
    fill('#d97109');
    circle(this.pos.x, this.pos.y, 15);
    fill(30);
    // Sword handle
    rect(this.pos.x-8, this.pos.y, 3, 4, 5);
    // sword blade
    fill(220);
    rect(this.pos.x-8, this.pos.y-10, 3, 10);
    this.drawHP();
  }
}


class armoredEnemy extends Enemy {
  
  constructor() {
    super(0.6, 200, 25, 3, 0.7);
}
   
  display() {
    fill('#949494');
    ellipse(this.pos.x, this.pos.y, 25, 28);
    strokeWeight(2);
    stroke('#303030');
    fill('#6e6d6b');
    rect(this.pos.x-2, this.pos.y-4, 15, 22);
    noStroke();
    ellipse(this.pos.x, this.pos.y-12, 20,8)
    this.drawHP();
  }
}

class maulerEnemy extends Enemy {
  
  constructor() {
    super(1.3, 172, 35, 3, 0.2)
}
    
  display() {
    fill('#781501');
    circle(this.pos.x, this.pos.y, 28);
    this.drawHP();
  }
}

class giantEnemy extends Enemy {
  
  constructor() {
    super(0.5, 700, 40, 5)
}
    
  display() {
    fill('#593802');
    circle(this.pos.x, this.pos.y, 40);
    this.drawHP();
  }
}
