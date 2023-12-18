let background;
let fruits;
let player;
let cursors;
let previewFruit;
let playerContainer;
let nextFruit;
let droppedFruits = [];
let score = 0;
let scoreNumber;
let gameOn = true;
let backgroundMusic;
let popSound;

function preload() {
  // ----- Visuals Loading -----
  this.load.image('background', 'assets/images/background.png');
  //Load all Fruit Images
  for (const fruitType of fruitTypes) {
    this.load.image(fruitType, `assets/images/${fruitType}.png`);
  }
  //Load Player Image
  this.load.image('player', 'assets/images/player.png');

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
  let boxLeft = this.add.rectangle(381, 398, 20, 480, 0x000000, 0);
  let boxRight = this.add.rectangle(820, 398, 20, 480, 0x000000, 0);
  let boxBottom = this.add.rectangle(600, 637, 430, 10, 0x000000, 0);

  // Enable physics for the sides and bottom
  this.physics.world.enable([boxLeft, boxRight, boxBottom]);

  // Make the sides and bottom immovable
  boxLeft.body.setImmovable(true);
  boxLeft.body.allowGravity = false;
  boxRight.body.setImmovable(true);
  boxRight.body.allowGravity = false;
  boxBottom.body.setImmovable(true);
  boxBottom.body.allowGravity = false;

  boxLeft.body.setBounce(0); // Make the box walls not bounce
<<<<<<< HEAD
boxRight.body.setBounce(0);
boxBottom.body.setBounce(0);
=======
  boxRight.body.setBounce(0);
  boxBottom.body.setBounce(0);
>>>>>>> main

  fruits = this.physics.add.group();

  // Set up collisions
  this.physics.add.collider(fruits, boxLeft);
  this.physics.add.collider(fruits, boxRight);
  this.physics.add.collider(fruits, boxBottom);

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

    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
      let currentX = playerContainer.x;
      let currentY = playerContainer.y;

      // Create the fruit
      let dropFruit = new Fruit(this, currentX, currentY, previewFruit.texture.key);
      fruits.add(dropFruit);
      droppedFruits.push(dropFruit);
      previewFruit.setTexture(nextFruit.texture.key);
      nextFruit.setTexture(getNextFruit());
      console.log(dropFruit.y);
      if (dropFruit.y < 180) {
        console.log('Might end game');
        this.time.delayedCall(2000, () => {
          console.log(dropFruit.y);
          if (dropFruit.y < 180) {
            gameOn = false;
            alert('Game Over! Your Score: ' + score);
            console.log('Game Over!');
          }
        });
      }
    }
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
    let combinedFruit = new Fruit(this, fruit1.x, fruit1.y - 10, combinedFruitKey);
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