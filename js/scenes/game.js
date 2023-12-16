let background;
let fruits;
let player;
let cursors;
let previewFruit;

const fruitTypes = [
  'cherry', 'strawberry', 'grape', 'orange', 'tangerine', 'apple',
  'lemon', 'peach', 'pineapple', 'melon', 'watermelon'
];

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
  const playerContainer = this.add.container(400, 50);

  // Create player
  player = createPlayer(this, 0, 0, 'player');
  player.setScale(0.1);
  player.body.allowGravity = false;

  // Add player to the container
  playerContainer.add(player);

  // Create preview fruit
  previewFruit = this.add.sprite(0, 0, 'cherry');
  previewFruit.setOrigin(0.5, 0.5);
  previewFruit.setVisible(false);

  // Create a rectangular box in the middle
  const box = this.physics.add.sprite(600, 398);
  box.setDisplaySize(430, 473);
  box.body.allowGravity = false;

  // Enable physics for the box
  this.physics.world.enable(box);
  box.body.setImmovable(true);

  fruits = this.physics.add.group();

  // Set up collisions
  this.physics.add.collider(fruits, fruits, combineFruits, null, this);
  this.physics.add.collider(fruits, box, isFruitInsideBox, null, this);

  // Collide with the sides and bottom of the box, but not the top
  this.physics.add.collider(fruits, box, function (fruit) {
    const topCollision = fruit.body.touching.up || fruit.body.blocked.up;

    if (!topCollision) {
      combineFruits(fruit);
    }
  });

  this.input.keyboard.on('keydown-SPACE', function (event) {
    spawnFruits();
  });

  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  updatePlayer(player, cursors);

  if (cursors.left.isDown || cursors.right.isDown) {
    previewFruit.setVisible(true);
  } else {
    previewFruit.setVisible(false);
  }

  if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
    spawnFruits();
  }
}

// Other functions (combineFruits, getCombinedFruitKey, isFruitInsideBox, spawnFruits) go here

function createPlayer(scene, x, y, key) {
  const player = scene.physics.add.sprite(x, y, key);
  scene.physics.world.enable(player);
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  return player;
}

function updatePlayer(player, cursors) {
  if (cursors.left.isDown) {
    player.setVelocityX(-200); // Adjust the speed as needed
  } else if (cursors.right.isDown) {
    player.setVelocityX(200); // Adjust the speed as needed
  } else {
    player.setVelocityX(0);
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

function getCombinedFruitKey(fruitKey) {
  // Mapping of fruit combinations
  const combinations = {
    'cherry': 'strawberry',
    'strawberry': 'grape',
    'grape': 'orange',
    'orange': 'tangerine',
    'tangerine': 'apple',
    'apple': 'lemon',
    'lemon': 'peach',
    'peach': 'pineapple',
    'pineapple': 'melon',
    'melon': 'watermelon',
  };

  // Return the combined fruit key or the original key if not found
  return combinations[fruitKey] || fruitKey;
}

function isFruitInsideBox(box, fruit) {
  // Check if the fruit is inside the box
  return (
    fruit.x > box.x - box.displayWidth / 2 &&
    fruit.x < box.x + box.displayWidth / 2 &&
    fruit.y > box.y - box.displayHeight / 2 &&
    fruit.y < box.y + box.displayHeight / 2
  );
}

function spawnFruits() {
  for (let i = 0; i < 5; i++) {
    const randomFruitType = Phaser.Math.RND.pick(fruitTypes);
    const fruit = createFruit(this, Phaser.Math.RND.between(100, 1100), 100, randomFruitType);
  }
}

function createFruit(scene, x, y, key) {
  const fruit = scene.physics.add.sprite(x, y, key);
  scene.physics.world.enable(fruit);
  fruit.setBounce(0.2);
  fruit.setCollideWorldBounds(true);
  return fruit;
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
