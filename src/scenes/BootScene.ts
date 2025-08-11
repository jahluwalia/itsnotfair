import { Scene } from 'phaser';

export class BootScene extends Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Show loading progress
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Create loading bar
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        color: '#ffffff',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2,
      text: '0%',
      style: {
        font: '18px monospace',
        color: '#ffffff',
      },
    });
    percentText.setOrigin(0.5, 0.5);

    // Update loading bar
    this.load.on('progress', (value: number) => {
      percentText.setText(Math.floor(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    // Load placeholder assets
    this.createPlaceholderAssets();
  }

  create(): void {
    // After loading, go to menu
    this.scene.start('MenuScene');
  }

  private createPlaceholderAssets(): void {
    // Create placeholder graphics for now
    // Player sprite (blue rectangle)
    this.load.svg('player', 'data:image/svg+xml;base64,' + 
      btoa(`<svg width="32" height="48" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="48" fill="#4287f5" rx="4"/>
        <circle cx="16" cy="12" r="8" fill="#fff"/>
      </svg>`));

    // Parent sprite (red rectangle)
    this.load.svg('parent', 'data:image/svg+xml;base64,' + 
      btoa(`<svg width="40" height="56" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="56" fill="#f54242" rx="4"/>
        <circle cx="20" cy="14" r="10" fill="#fff"/>
      </svg>`));

    // Token sprite (yellow star)
    this.load.svg('token', 'data:image/svg+xml;base64,' + 
      btoa(`<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <polygon points="16,2 20,12 30,12 22,18 25,28 16,22 7,28 10,18 2,12 12,12" fill="#ffd700"/>
      </svg>`));

    // Wall tile (gray square)
    this.load.svg('wall', 'data:image/svg+xml;base64,' + 
      btoa(`<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" fill="#808080"/>
      </svg>`));

    // Floor tile (light gray square)
    this.load.svg('floor', 'data:image/svg+xml;base64,' + 
      btoa(`<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" fill="#d0d0d0"/>
      </svg>`));
  }
}