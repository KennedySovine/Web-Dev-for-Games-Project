class Fruit extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key) {
      super(scene, x, y, key);
      scene.physics.world.enable(this);
      this.setBounce(0.2);
      this.setCollideWorldBounds(true);
    }
  }
  
  export default Fruit;  