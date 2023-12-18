const fruitTypes = [
    'cherry', 'strawberry', 'grape', 'lemon', 'orange', 'apple',
    'cantaloupe', 'peach', 'pineapple', 'melon', 'watermelon'
  ];
  
class Fruit extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key) {
      super(scene, x, y, key);
      scene.add.existing(this);
      scene.physics.world.enable(this);
      this.setScale(this.setSize());
      this.setCollideWorldBounds(true);
      this.body.setCircle(this.width/2, 2,  -2);
      this.setFriction(0, 0);

      this.setBounce(0.5, 1);
    }

    setSize(){
      switch(this.texture.key){
        case 'cherry':
          return 0.2;
        case 'strawberry':
          return 0.25;
        case 'grape':
          return 0.3;
        case 'lemon':
          return 0.35;
        case 'orange':
          return 0.4;
        case 'apple':
          return 0.45;
        case 'cantaloupe':
          return 0.5;
        case 'peach':
          return 0.55;
        case 'pineapple':
          return 0.6;
        case 'melon':
          return 0.65;
        case 'watermelon':
          return 0.7;
    }
  }
}

function getNextFruit(){
  let nextFruitInt = Math.floor(Math.random() * 6);
  return fruitTypes[nextFruitInt];
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

window.Fruit = Fruit;