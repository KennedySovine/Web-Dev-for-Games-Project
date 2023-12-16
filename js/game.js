let background;
let fruits;
let player;
let cursors;
let previewFruit;
let playerContainer;

function preload() {
  this.load.image('background', 'assets/background.png');
  for (const fruitType of fruitTypes) {
    this.load.image(fruitType, `assets/${fruitType}.png`);
  }
  this.load.image('player', 'assets/player.png');
}

function create() {
  background = this.add.image(600, 337.5, 'background');

  // Create container for player and preview
  playerContainer = this.add.container(400, 50);

  // Create player
  player = new Player(this, 0, 0, 'player');
  player.setScale(0.1);
  player.body.allowGravity = false;

  // Create preview fruit
  previewFruit = new Fruit(this, 0, 0, 'cherry');
  previewFruit.setOrigin(0.5, 0.5);
  previewFruit.setVisible(true);
  previewFruit.body.allowGravity = false;

  //Add to container
  playerContainer.add(player);
  playerContainer.add(previewFruit);
  previewFruit.y = player.y + player.displayHeight / 2 ;
  previewFruit.x = player.x - player.displayWidth / 2

  fruits = this.physics.add.group();

  createBox();

  // Set up collisions
  this.physics.add.collider(fruits, boxLeft);
  this.physics.add.collider(fruits, boxRight);
  this.physics.add.collider(fruits, boxBottom);

  this.physics.world.removeCollider(playerContainer, boxLeft);
  this.physics.world.removeCollider(playerContainer, boxRight);
  this.physics.world.removeCollider(playerContainer, boxBottom);

  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (cursors.left.isDown) {
    playerContainer.x -= 10; // move left
  } else if (cursors.right.isDown) {
    playerContainer.x += 10; // move right
  }

  if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
    dropFruit();
  }
}

function combineFruits(fruit) {
  // Check if there are enough fruits to combine
  if (fruits.countActive(true) >= 2) {
    // Combine two fruits into the next fruit
    let combinedFruitKey = getCombinedFruitKey(fruit.texture.key);

    // Create the combined fruit at the same position as the destroyed fruits
    let combinedFruit = fruits.create(fruit.x, fruit.y, combinedFruitKey);
    combinedFruit.setBounce(0.2);
    combinedFruit.setCollideWorldBounds(true);
    fruit.destroy();
    previewFruit.setVisible(false);
  }
}

function dropFruit(){
  let droppedFruit= previewFruit;
  droppedFruit.body.allowGravity = true;
  fruits.add(droppedFruit);
}

function createBox(){
// Create the sides and bottom of the box
  let boxLeft = this.add.rectangle(385, 398, 10, 480, 0x000000, 0);
  let boxRight = this.add.rectangle(815, 398, 10, 480, 0x000000, 0);
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
}

function spawnFruits() {
  for (let i = 0; i < 5; i++) {
    const randomFruitType = Phaser.Math.RND.pick(fruitTypes);
    const fruit = createFruit(this, Phaser.Math.RND.between(100, 1100), 100, randomFruitType);
  }
}

function createBox(){
  // Create the left, right, and bottom sides of the box
  let boxLeft = this.physics.add.sprite(box.x - box.width / 2, box.y, null);
  let boxRight = this.physics.add.sprite(box.x + box.width / 2, box.y, null);
  let boxBottom = this.physics.add.sprite(box.x, box.y + box.height / 2, null);

  // Set the size of the sides
    boxLeft.displayWidth = 1; // Make the left side very thin
  boxRight.displayWidth = 1; // Make the right side very thin
  boxBottom.displayHeight = 1; // Make the bottom side very thin

  // Set the height of the sides
  boxLeft.displayHeight = box.height;
  boxRight.displayHeight = box.height;
  boxBottom.displayWidth = box.width;

  // Make the sides immovable
  boxLeft.body.setImmovable(true);
  boxRight.body.setImmovable(true);
  boxBottom.body.setImmovable(true);
}

const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 675,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 100 },
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
