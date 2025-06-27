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

//Preloads all of the images and audio files.
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

//Creates all of the objects in the game.
function create() {
  // ----- Audio Creation -----
  popSound = this.sound.add('pop');
  backgroundMusic = this.sound.add('backgroundMusic');

  //Constantly play the music
  backgroundMusic.play({
    loop: true // Loop the audio
  });


  //Background Creation
  background = this.add.image(600, 337.5, 'background');

  //Create Score Container
  let scoreContainer = this.add.container(180, 150);

  //Add Score Text
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

  // Create container for player and next fruit
  playerContainer = this.add.container(400, 50);

  // Create player
  player = new Player(this, 0, 0, 'player');
  player.setScale(0.1);
  player.body.allowGravity = false;

  // Create next fruit display
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

  //Remove colliders for player and box.
  this.physics.world.removeCollider(playerContainer, boxLeft);
  this.physics.world.removeCollider(playerContainer, boxRight);
  this.physics.world.removeCollider(playerContainer, boxBottom);

  // Add physics colliders between the fruits
  this.physics.add.collider(fruits, fruits, combineFruits, null, this);
  this.physics.add.overlap(fruits, fruits, function (fruit1, fruit2) {
    if (fruit1.x < fruit2.x) {
      fruit1.x--;
      fruit2.x++;
    } else if (fruit1.x > fruit2.x) {
      fruit1.x++;
      fruit2.x--;
    }
  }, null, this);

  cursors = this.input.keyboard.createCursorKeys();
}

//Updates the game every frame.
function update() {
  // Move the player left and right
  if (gameOn) {
    if (cursors.left.isDown && playerContainer.x > 420) {
      playerContainer.x -= 10; // move left
    } else if (cursors.right.isDown && playerContainer.x < 780) {
      playerContainer.x += 10; // move right
    }

    // Update Score
    scoreNumber.setText(score);

    // Drop the fruit if the space bar is pressed.
    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
      dropFruit(this);
    }
  }

  //Fruit and Box Collision
  fruits.children.each(fruitAndBoxCollision, this);
}

//Drops the fruit from the player container to the game world.
function dropFruit(scene) {

  fruits.children.each(fruit => {
    fruit.body.setImmovable(false);
    });

  let currentX = previewFruit.x + playerContainer.x;
  let currentY = previewFruit.y + playerContainer.y;

  // Create the fruit
  let fruit = new Fruit(scene, currentX, currentY, previewFruit.texture.key);
  fruit.body.velocity.y = 100;
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
  //Bottom box collision
  if (Phaser.Geom.Intersects.RectangleToRectangle(fruit.getBounds(), this.boxBottom.getBounds())) {
    console.log('Bottom collision')
    fruit.body.y -= 1;
    fruit.body.velocity.y = 0;
    fruit.body.maxVelocity.y = 0; 
    fruit.body.setImmovable(true);
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
    let combinedFruit = new Fruit(this, fruit1.x, fruit1.y - 30, combinedFruitKey);
    fruits.add(combinedFruit);
    droppedFruits.push(combinedFruit);
    popSound.play();

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
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);
