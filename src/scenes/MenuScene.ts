import { Scene } from 'phaser';

export class MenuScene extends Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background gradient effect
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x667eea, 0x667eea, 0x764ba2, 0x764ba2, 1);
    bg.fillRect(0, 0, width, height);

    // Title
    const title = this.add.text(width / 2, height / 3, "IT'S NOT FAIR!", {
      fontSize: '64px',
      fontFamily: 'Arial Black',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 8,
    });
    title.setOrigin(0.5);

    // Subtitle
    const subtitle = this.add.text(width / 2, height / 3 + 80, 'A game about life\'s little unfairnesses', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff',
    });
    subtitle.setOrigin(0.5);

    // Play button
    this.createButton(width / 2, height / 2 + 50, 'PLAY', () => {
      this.scene.start('GameScene');
    });

    // How to Play button
    this.createButton(width / 2, height / 2 + 120, 'HOW TO PLAY', () => {
      this.showInstructions();
    });

    // Credits
    const credits = this.add.text(width / 2, height - 50, 'Made with ❤️ by Vismaad & Niroop', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ffffff',
    });
    credits.setOrigin(0.5);

    // Add some animated elements
    this.tweens.add({
      targets: title,
      y: title.y + 10,
      duration: 2000,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }

  private createButton(x: number, y: number, text: string, callback: () => void): Phaser.GameObjects.Container {
    const button = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 200, 50, 0xffffff, 0.9);
    bg.setStrokeStyle(3, 0x000000);
    
    const label = this.add.text(0, 0, text, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#000000',
    });
    label.setOrigin(0.5);

    button.add([bg, label]);
    button.setSize(200, 50);
    button.setInteractive();

    // Hover effects
    button.on('pointerover', () => {
      bg.setFillStyle(0xffff00, 0.9);
      this.tweens.add({
        targets: button,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100,
      });
    });

    button.on('pointerout', () => {
      bg.setFillStyle(0xffffff, 0.9);
      this.tweens.add({
        targets: button,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
    });

    button.on('pointerdown', callback);

    return button;
  }

  private showInstructions(): void {
    const { width, height } = this.cameras.main;

    // Create overlay
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);
    overlay.setInteractive();

    // Instructions box
    const box = this.add.rectangle(width / 2, height / 2, 600, 400, 0xffffff, 0.95);
    box.setStrokeStyle(4, 0x000000);

    // Instructions text
    const instructions = this.add.text(width / 2, height / 2 - 150, 'HOW TO PLAY', {
      fontSize: '32px',
      fontFamily: 'Arial Black',
      color: '#000000',
    });
    instructions.setOrigin(0.5);

    const controls = this.add.text(width / 2, height / 2, 
      '🎮 CONTROLS:\n\n' +
      '← → Arrow Keys: Move\n' +
      '↑ ↓ Arrow Keys: Move Up/Down\n' +
      'SHIFT: Sneak (slower but quieter)\n' +
      'SPACE: Interact / Collect\n' +
      'Q: Switch Character\n\n' +
      '🎯 GOAL:\n' +
      'Collect tokens before bedtime!\n' +
      'Avoid getting caught by parents!\n' +
      'Deal with unfair rule changes!',
      {
        fontSize: '18px',
        fontFamily: 'Arial',
        color: '#000000',
        align: 'center',
      }
    );
    controls.setOrigin(0.5);

    // Close button
    const closeBtn = this.createButton(width / 2, height / 2 + 150, 'GOT IT!', () => {
      overlay.destroy();
      box.destroy();
      instructions.destroy();
      controls.destroy();
      closeBtn.destroy();
    });
  }
}