const fruitTypes = [
    'cherry', 'strawberry', 'grape', 'orange', 'tangerine', 'apple',
    'lemon', 'peach', 'pineapple', 'melon', 'watermelon'
  ];
  
class Fruit extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key) {
      super(scene, x, y, key);
      scene.physics.world.enable(this);
      this.setScale(this.setSize());
      this.setBounce(.2);
      this.setCollideWorldBounds(true);
    }

    getType(){
        return this.texture.key;
    }

    getCombinedFruitKey(fruitKey) {
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

    setSize(){
      switch(this.texture.key){
        case 'cherry':
          return 0.3;
        case 'strawberry':
          return 0.35;
        case 'grape':
          return 0.4;
        case 'orange':
          return 0.45;
        case 'tangerine':
          return 0.6;
        case 'apple':
          return 0.65;
        case 'lemon':
          return 0.7;
        case 'peach':
          return 0.75;
        case 'pineapple':
          return 0.8;
        case 'melon':
          return 0.85;
        case 'watermelon':
          return 0.9;
    }
  }
}

function getNextFruit(){
  let nextFruitInt = Math.random() * 6;
  return fruitTypes[nextFruitInt];
}

  window.Fruit = Fruit;