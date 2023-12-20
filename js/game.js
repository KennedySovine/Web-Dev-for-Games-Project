let background;
let backgroundMusic;
let popSound;
let player;
let cursors;
let previewFruit;
let playerContainer;
let fruits;
let nextFruit;
let droppedFruits = [];
let score = 0;
let scoreNumber;
let gameOn = true;
let boxLeft;
let boxRight;
let boxBottom;

let fruitVelocity;

function preload() {
  // ----- Visuals Loading -----
  this.load.image('background', 'assets/images/background.png');
  //Load all Fruit Images
  for (const fruitType of fruitTypes) {
    this.load.image(fruitType, `assets/images/${fruitType}.png`);
  }
  //Load Player Image
  this.load.image('player', 'assets/images/player.png');

  //Load box images
  this.load.image('boxLeft', 'assets/images/boxLeft.png');
  this.load.image('boxRight', 'assets/images/boxRight.png');
  this.load.image('boxBottom', 'assets/images/boxBottom.png');

  // ----- Audio Loading -----
  this.load.audio('backgroundMusic', 'assets/audio/backgroundMusic.mp3');

  this.load.audio('pop', 'assets/audio/popSound.mp3')
}

function create() {
  // ----- Audio Creation -----
  this.popSound = this.sound.add('pop');
  this.backgroundMusic = this.sound.add('backgroundMusic');

  //Constantly play the music
  this.backgroundMusic.play({
    loop: true // Loop the audio
  });


  //Background Creation
  background = this.add.image(600, 337.5, 'background');

  let scoreContainer = this.add.container(180, 150);

  let scoreText = this.add.text(115, 50, 'Score', {
    fontSize: '40px',
    fill: 'white',
    stroke: '#000000',
    strokeThickness: 4
  });
  scoreNumber = this.add.text(0, 0, '0', {
    fontSize: '40px',
    fill: 'white',
    stroke: '#000000',
    strokeThickness: 4
  });
  scoreNumber.setOrigin(0.5, 0.5);
  scoreContainer.add(scoreNumber);

  scoreNumber.setText(score);

  // Create container for player and preview
  playerContainer = this.add.container(400, 50);

  // Create player
  player = new Player(this, 0, 0, 'player');
  player.setScale(0.1);
  player.body.allowGravity = false;

  nextFruit = new Fruit(this, 0, 0, 'strawberry');
  nextFruit.body.allowGravity = false;
  nextFruit.x = 1015;
  nextFruit.y = 180;
  nextFruit.setScale(.5);
  nextFruit.setVisible(true);

  // Create preview fruit
  previewFruit = new Fruit(this, 0, 0, 'cherry');
  previewFruit.setOrigin(0.5, 0.5);
  previewFruit.setVisible(true);
  previewFruit.body.allowGravity = false;

  //Add to container
  playerContainer.add(player);
  playerContainer.add(previewFruit);
  previewFruit.y = player.y + player.displayHeight / 2;

  // Create the sides and bottom of the box
  this.boxLeft = this.physics.add.staticImage(381, 398, 'boxLeft');
  this.boxRight = this.physics.add.staticImage(820, 398, 'boxRight');
  this.boxBottom = this.physics.add.staticImage(600, 637, 'boxBottom');

  // Enable physics for the sides and bottom
  this.physics.world.enable([this.boxLeft, this.boxRight, this.boxBottom]);

  fruits = this.physics.add.group();

  // Set up collisions
  this.physics.add.collider(fruits, this.boxBottom);

  //Remove colliders for player and box.
  this.physics.world.removeCollider(playerContainer, boxLeft);
  this.physics.world.removeCollider(playerContainer, boxRight);
  this.physics.world.removeCollider(playerContainer, boxBottom);

  this.physics.add.collider(fruits, fruits, combineFruits, null, this);
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (gameOn) {
    if (cursors.left.isDown) {
      playerContainer.x -= 10; // move left
    } else if (cursors.right.isDown) {
      playerContainer.x += 10; // move right
    }

    //update Score
    scoreNumber.setText(score);

    // Drop the fruit if the space bar is pressed.
    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
      reactivateFruit();
      dropFruit(this);
    }
  }

  //touching2Fruits(fruit);

  //Checks if the fruit is touching either side of the box and another fruit.
  let checkingFruit = function () {
    fruits.children.each(fruit => {
      // Check if the fruit is already immovable
      if (!fruit.body.immovable) {
        let touchingBox = (this.physics.overlap(fruit, this.boxRight)) || (this.physics.overlap(fruit, this.boxLeft)); // If fruit is touching either side of the box
        let touchingFruit = this.physics.overlap(fruit, fruits); //If the fruit is touching another fruit

        //Set the fruit to be immovable if it is touching 2 fruits at the same time.
        if (touchingBox && touchingFruit) {
          console.log('Touching both')
          fruit.body.y -= 1;
          this.time.delayedCall(1000, () => {
            if (touchingBox && touchingFruit) {
              fruit.body.setImmovable(true);
            }
          });
        }
      }
    });
  }

  //Fruit and Box Collision
  fruits.children.each(fruitAndBoxCollision, this);
}

// Set all fruits to be movable again
function reactivateFruit() {
  fruits.children.each(fruit => {
    fruit.body.setImmovable(false);
  });
}

function touching2Fruits(fruit) {
  let overlapCount = 0;
  let touchingFruit = [];

  // Add the fruit to check
  touchingFruit.push(fruit);

  fruits.children.each(function (otherFruit) {
    if (fruit === otherFruit) return; // Don't check a fruit against itself

    if (this.physics.overlap(fruit, otherFruit)) {
      overlapCount++;
      // Add the fruit to the list of touching fruits
      touchingFruit.push(otherFruit);
    }
  }, this);

  if (overlapCount >= 2) {
    console.log('Fruit is touching at least two other fruits');
    touchingFruit.forEach(fruit => {
      fruit.body.setImmovable(true);
    });
  }
}

//Drops the fruit from the player container to the game world.
function dropFruit(scene) {
  let currentX = previewFruit.x + playerContainer.x;
  let currentY = previewFruit.y + playerContainer.y;

  // Create the fruit
  let fruit = new Fruit(scene, currentX, currentY, previewFruit.texture.key);
  //fruit.body.velocity.y = maxVelocity;
  fruits.add(fruit);
  droppedFruits.push(fruit);
  previewFruit.setTexture(nextFruit.texture.key);
  nextFruit.setTexture(getNextFruit());
  fruit.body.velocity.y = 100;
  if (fruit.y < 180) {
    console.log('Might end game');
    scene.time.delayedCall(2000, () => {
      console.log(fruit.y);
      if (fruit.y < 180) {
        gameOn = false;
        alert('Game Over! Your Score: ' + score);
        console.log('Game Over!');
        backgroundMusic.stop();
      }
    });
  }
}

function fruitAndBoxCollision(fruit) {
  // Left box collision
  if (Phaser.Geom.Intersects.RectangleToRectangle(fruit.getBounds(), this.boxLeft.getBounds())) {
    // If it is, move it slightly down and to the side
    fruit.y -= 1;
    fruit.x -= fruit.body.velocity.x > 0 ? 1 : -1;
    //Right box collision
  } else if (Phaser.Geom.Intersects.RectangleToRectangle(fruit.getBounds(), this.boxRight.getBounds())) {
    // If it is, move it slightly down and to the side
    fruit.y -= 1;
    fruit.x -= fruit.body.velocity.x > 0 ? -1 : 1;
  }
}

//Combines 2 fruits together if they are the same type of fruit.
function combineFruits(fruit1, fruit2) {
  // if either fruit is a watermelon, return as they cannot be combined.
  if (fruit1.texture.key === 'watermelon' || fruit2.texture.key === 'watermelon') {
    return;
  }
  // Check if the fruits are of the same type
  if (fruit1.texture.key === fruit2.texture.key) {
    // Combine the fruits into the next fruit
    score += 50;
    let combinedFruitKey = getCombinedFruitKey(fruit1.texture.key);

    // Create the combined fruit at the same position as the destroyed fruits
    let combinedFruit = new Fruit(this, fruit1.x, fruit1.y - 20, combinedFruitKey);
    fruits.add(combinedFruit);
    droppedFruits.push(combinedFruit);
    this.popSound.play();

    // Destroy the original fruits
    fruit1.destroy();
    fruit2.destroy();
  }
}

const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 675,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 100
      },
      debug: true,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);