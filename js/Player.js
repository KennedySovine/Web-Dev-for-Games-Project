class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
      super(scene, x, y, texture);
      scene.physics.add.existing(this);
      scene.physics.world.enable(this);
      this.body.allowGravity = false;
      this.setCollideWorldBounds(true);
    }
  }

  window.Player = Player;