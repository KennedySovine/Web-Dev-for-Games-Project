// entities/player.js
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
      super(scene, x, y, texture);
      scene.add.existing(this);
      scene.physics.world.enable(this);
      this.body.allowGravity = false;
      this.setCollideWorldBounds(true);
    }
  
    update(cursors) {
      if (cursors.left.isDown) {
        this.setVelocityX(-200);
      } else if (cursors.right.isDown) {
        this.setVelocityX(200);
      } else {
        this.setVelocityX(0);
      }
    }
  }
  
  export default Player;