class Player extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture) {
      super(scene.matter.world, x, y, texture);
      scene.add.existing(this);
      this.setStatic(true); // Player doesn't fall
      this.setIgnoreGravity(true);
    }
  }

  window.Player = Player;