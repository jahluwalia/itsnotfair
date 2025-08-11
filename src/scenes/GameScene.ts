import { Scene } from 'phaser';
import { Player } from '../entities/Player';
import { LevelData } from '../types/game.types';

export class GameScene extends Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private walls!: Phaser.Physics.Arcade.StaticGroup;
  private tokens!: Phaser.Physics.Arcade.Group;
  private currentLevel!: LevelData;
  private tokensCollected: number = 0;
  private tokensNeeded: number = 3;
  
  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    // Create test level
    this.currentLevel = this.createTestLevel();
    
    // Set up world
    this.createWorld();
    
    // Create player
    this.player = new Player(this, this.currentLevel.playerStart.x, this.currentLevel.playerStart.y);
    
    // Set up controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    
    // Add additional keys
    this.input.keyboard!.on('keydown-Q', () => {
      // Switch character logic will go here
      console.log('Switch character!');
    });
    
    // Set up collisions
    this.physics.add.collider(this.player.sprite, this.walls);
    this.physics.add.overlap(this.player.sprite, this.tokens, this.collectToken, undefined, this);
    
    // Create UI
    this.createUI();
    
    // Show start message
    this.showMessage(this.currentLevel.dialogues.start, 3000);
  }

  update(): void {
    // Handle player movement
    const shift = this.input.keyboard!.addKey('SHIFT');
    const sneaking = shift.isDown;
    
    if (this.cursors.left.isDown) {
      this.player.move('left', sneaking);
    } else if (this.cursors.right.isDown) {
      this.player.move('right', sneaking);
    } else if (this.cursors.up.isDown) {
      this.player.move('up', sneaking);
    } else if (this.cursors.down.isDown) {
      this.player.move('down', sneaking);
    } else {
      this.player.stop();
    }
  }

  private createWorld(): void {
    // Create walls group
    this.walls = this.physics.add.staticGroup();
    
    // Create tokens group
    this.tokens = this.physics.add.group();
    
    // Build level from data
    const tileSize = 32;
    const layout = this.currentLevel.layout;
    
    for (let y = 0; y < layout.length; y++) {
      for (let x = 0; x < layout[y].length; x++) {
        const tile = layout[y][x];
        const worldX = x * tileSize + tileSize / 2;
        const worldY = y * tileSize + tileSize / 2;
        
        if (tile === '#') {
          // Wall
          const wall = this.add.sprite(worldX, worldY, 'wall');
          this.walls.add(wall);
        } else {
          // Floor
          this.add.sprite(worldX, worldY, 'floor');
        }
      }
    }
    
    // Add tokens
    this.currentLevel.tokens.forEach(tokenData => {
      const token = this.physics.add.sprite(tokenData.x, tokenData.y, 'token');
      token.setData('value', tokenData.value);
      token.setData('id', tokenData.id);
      this.tokens.add(token);
      
      // Add floating animation
      this.tweens.add({
        targets: token,
        y: token.y - 10,
        duration: 1000,
        ease: 'Sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });
  }

  private createUI(): void {
    const { width } = this.cameras.main;
    
    // Token counter
    const tokenText = this.add.text(20, 20, `Tokens: ${this.tokensCollected}/${this.tokensNeeded}`, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    });
    tokenText.setScrollFactor(0);
    tokenText.setDepth(100);
    tokenText.setName('tokenText');
    
    // Level name
    const levelText = this.add.text(width - 20, 20, this.currentLevel.name, {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    });
    levelText.setOrigin(1, 0);
    levelText.setScrollFactor(0);
    levelText.setDepth(100);
  }

  private collectToken(player: any, token: any): void {
    const value = token.getData('value') || 1;
    this.tokensCollected += value;
    
    // Update UI
    const tokenText = this.children.getByName('tokenText') as Phaser.GameObjects.Text;
    if (tokenText) {
      tokenText.setText(`Tokens: ${this.tokensCollected}/${this.tokensNeeded}`);
    }
    
    // Play collection effect
    this.tweens.add({
      targets: token,
      y: token.y - 50,
      alpha: 0,
      scale: 1.5,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        token.destroy();
      },
    });
    
    // Check win condition
    if (this.tokensCollected >= this.tokensNeeded) {
      this.levelComplete();
    }
  }

  private levelComplete(): void {
    this.player.stop();
    this.showMessage(this.currentLevel.dialogues.success, 3000);
    
    // After delay, return to menu
    this.time.delayedCall(3000, () => {
      this.scene.start('MenuScene');
    });
  }

  private showMessage(text: string, duration: number): void {
    const { width, height } = this.cameras.main;
    
    const bg = this.add.rectangle(width / 2, height / 2, 600, 100, 0x000000, 0.8);
    bg.setScrollFactor(0);
    bg.setDepth(200);
    
    const message = this.add.text(width / 2, height / 2, text, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 550 },
    });
    message.setOrigin(0.5);
    message.setScrollFactor(0);
    message.setDepth(201);
    
    // Fade in
    bg.setAlpha(0);
    message.setAlpha(0);
    
    this.tweens.add({
      targets: [bg, message],
      alpha: 1,
      duration: 300,
    });
    
    // Auto remove
    this.time.delayedCall(duration, () => {
      this.tweens.add({
        targets: [bg, message],
        alpha: 0,
        duration: 300,
        onComplete: () => {
          bg.destroy();
          message.destroy();
        },
      });
    });
  }

  private createTestLevel(): LevelData {
    return {
      id: 'test-level',
      name: 'Tutorial - But I\'m Not Tired!',
      world: 0,
      layout: [
        ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'],
        ['#','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','#'],
        ['#','.','.','.','.','#','#','#','#','.','.','.','#','#','#','#','.','.','.','.','#'],
        ['#','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','#'],
        ['#','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','#'],
        ['#','.','.','#','#','#','.','.','.','.','.','.','.','.','#','#','#','.','.','#'],
        ['#','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','#'],
        ['#','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','#'],
        ['#','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','#'],
        ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'],
      ],
      playerStart: { x: 100, y: 150 },
      tokens: [
        { id: 't1', x: 300, y: 150, type: 'main', value: 1 },
        { id: 't2', x: 500, y: 250, type: 'main', value: 1 },
        { id: 't3', x: 200, y: 250, type: 'main', value: 1 },
      ],
      parents: [],
      unfairnessEvents: [],
      dialogues: {
        start: 'But I\'m not tired! Quick, collect the tokens before bedtime!',
        success: 'Yes! You earned enough time to finish your game!',
        failure: 'Caught! Straight to bed with no story time...',
      },
    };
  }
}