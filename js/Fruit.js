const fruitTypes = [
    'cherry', 'strawberry', 'grape', 'lemon', 'orange', 'apple',
    'canteloupe', 'peach', 'pineapple', 'melon', 'watermelon'
  ];
  
class Fruit extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, key) {
      super(scene.matter.world, x, y, key);
      scene.add.existing(this);
      this.setScale(this.setSize());
      
      // Set circular physics body based on the scaled size
      const scaledRadius = (this.width * this.scaleX) * 0.45; // Increased from 0.35 to reduce overlap
      this.setCircle(scaledRadius);
      this.setBounce(0.3);
      this.setFriction(0.1);
      this.setFrictionAir(0.01);
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
        case 'canteloupe':
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
    'grape': 'lemon',
    'lemon': 'orange',
    'orange': 'apple',
    'apple': 'canteloupe',
    'canteloupe': 'peach',
    'peach': 'pineapple',
    'pineapple': 'melon',
    'melon': 'watermelon',
  };

  // Return the combined fruit key or the original key if not found
  return combinations[fruitKey] || fruitKey;
}

window.Fruit = Fruit;
window.fruitTypes = fruitTypes;
window.getNextFruit = getNextFruit;
window.getCombinedFruitKey = getCombinedFruitKey;
