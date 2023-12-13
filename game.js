const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

let background;
let fruits;
let watermelon;
let player;

function preload() {
 // Load the background image
 this.load.image('background', 'assets/background.jpg');
 // Load fruit images
 this.load.image('cherry', 'assets/cherry.png');
 this.load.image('strawberry', 'assets/strawberry.png');
 this.load.image('grape', 'assets/grape.png');
 this.load.image('orange', 'assets/orange.png');
 this.load.image('tangerine', 'assets/tangerine.png');
 this.load.image('apple', 'assets/apple.png');
 this.load.image('lemon', 'assets/lemon.png');
 this.load.image('peach', 'assets/peach.png');
 this.load.image('pineapple', 'assets/pineapple.png');
 this.load.image('melon', 'assets/melon.png');
 this.load.image('watermelon', 'assets/watermelon.png');

  // Load player image
  this.load.image('player', 'assets/player.png');
}

function create() {
  // Add the background image
  background = this.add.image(640, 360, 'background');

  // Create player (bar)
  player = this.add.sprite(400, 50, 'player');
  player.setScale(0.2);

  // Enable physics for the player
  this.physics.world.enable(player);

  // Set player properties
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  // Create fruits
  fruits = this.physics.add.group({
    key: 'cherry',
    repeat: 5,
    setXY: { x: 100, y: 100, stepX: 70 },
  });

  // Create watermelon
  watermelon = this.physics.add.sprite(400, 300, 'watermelon');
  this.physics.world.enable([fruits, watermelon]);

  // Set up collisions
  this.physics.add.collider(fruits, fruits);
  this.physics.add.collider(fruits, watermelon, combineFruits, null, this);

  userInput();
}

function update() {
  // Add game logic here
  // You can add additional logic for player and game updates
}

function combineFruits(watermelon, fruit) {
  fruit.destroy();

  // Check if there are enough fruits to combine
  if (fruits.countActive(true) >= 2) {
    // Combine two fruits into the next fruit
    let combinedFruitKey = getCombinedFruitKey(fruit.texture.key);
    
    // Create the combined fruit at the same position as the destroyed fruits
    let combinedFruit = fruits.create(fruit.x, fruit.y, combinedFruitKey);
    combinedFruit.setBounce(0.2);
    combinedFruit.setCollideWorldBounds(true);
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

function userInput(){
  // Set up arrow key input for player
  this.input.keyboard.on('keydown_LEFT', function (event) {
    player.setVelocityX(-200); // Adjust the speed as needed
  });

  this.input.keyboard.on('keydown_RIGHT', function (event) {
    player.setVelocityX(200); // Adjust the speed as needed
  });

  this.input.keyboard.on('keyup_LEFT', function (event) {
    player.setVelocityX(0);
  });

  this.input.keyboard.on('keyup_RIGHT', function (event) {
    player.setVelocityX(0);
  });
}