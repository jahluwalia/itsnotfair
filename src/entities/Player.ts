import { Scene, Physics } from 'phaser';

export class Player {
  public sprite: Physics.Arcade.Sprite;
  private scene: Scene;
  private normalSpeed: number = 160;
  private sneakSpeed: number = 60;
  private currentSpeed: number = this.normalSpeed;
  private isSneaking: boolean = false;

  constructor(scene: Scene, x: number, y: number) {
    this.scene = scene;
    
    // Create sprite
    this.sprite = scene.physics.add.sprite(x, y, 'player');
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setSize(24, 40); // Slightly smaller hitbox than visual
    this.sprite.setOffset(4, 4);
    
    // Set up physics
    this.sprite.setDrag(500);
    this.sprite.setMaxVelocity(this.normalSpeed);
  }

  move(direction: 'left' | 'right' | 'up' | 'down', sneaking: boolean = false): void {
    this.isSneaking = sneaking;
    this.currentSpeed = sneaking ? this.sneakSpeed : this.normalSpeed;
    this.sprite.setMaxVelocity(this.currentSpeed);

    switch (direction) {
      case 'left':
        this.sprite.setVelocityX(-this.currentSpeed);
        this.sprite.setFlipX(true);
        break;
      case 'right':
        this.sprite.setVelocityX(this.currentSpeed);
        this.sprite.setFlipX(false);
        break;
      case 'up':
        this.sprite.setVelocityY(-this.currentSpeed);
        break;
      case 'down':
        this.sprite.setVelocityY(this.currentSpeed);
        break;
    }

    // Visual feedback for sneaking
    if (sneaking) {
      this.sprite.setAlpha(0.7);
      this.sprite.setScale(0.9);
    } else {
      this.sprite.setAlpha(1);
      this.sprite.setScale(1);
    }
  }

  stop(): void {
    this.sprite.setVelocity(0, 0);
    this.sprite.setAlpha(1);
    this.sprite.setScale(1);
    this.isSneaking = false;
  }

  getPosition(): { x: number; y: number } {
    return {
      x: this.sprite.x,
      y: this.sprite.y,
    };
  }

  setPosition(x: number, y: number): void {
    this.sprite.setPosition(x, y);
  }

  destroy(): void {
    this.sprite.destroy();
  }
}