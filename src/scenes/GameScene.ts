import { Scene } from 'phaser';
import { Player } from '../entities/Player';
import { Parent } from '../entities/Parent';
import { LevelData } from '../types/game.types';

export class GameScene extends Scene {
  private player!: Player;
  private parents: Parent[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private walls!: Phaser.Physics.Arcade.StaticGroup;
  private tokens!: Phaser.Physics.Arcade.Group;
  private currentLevel!: LevelData;
  private tokensCollected: number = 0;
  private tokensNeeded: number = 3;
  private lives: number = 3;
  private isPlayerCaught: boolean = false;
  private isPaused: boolean = false;
  
  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    // Reset state
    this.tokensCollected = 0;
    this.lives = 3;
    this.isPlayerCaught = false;
    this.isPaused = false;
    this.parents = [];
    
    // Create test level
    this.currentLevel = this.createTestLevel();
    
    // Set up world
    this.createWorld();
    
    // Create player
    this.player = new Player(this, this.currentLevel.playerStart.x, this.currentLevel.playerStart.y);
    
    // Create parents
    this.createParents();
    
    // Set up controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    
    // Add additional keys
    this.input.keyboard!.on('keydown-Q', () => {
      // Switch character logic will go here
      console.log('Switch character!');
    });
    
    // Add pause key
    this.input.keyboard!.on('keydown-ESC', () => {
      this.togglePause();
    });
    
    // Set up collisions
    this.physics.add.collider(this.player.sprite, this.walls);
    this.physics.add.overlap(this.player.sprite, this.tokens, this.collectToken, undefined, this);
    
    // Set up parent collisions
    this.parents.forEach(parent => {
      this.physics.add.collider(parent.sprite, this.walls);
      this.physics.add.overlap(
        this.player.sprite,
        parent.sprite,
        () => this.handleCaught(parent),
        undefined,
        this
      );
    });
    
    // Create UI
    this.createUI();
    
    // Show start message
    this.showMessage(this.currentLevel.dialogues.start, 3000);
  }

  update(): void {
    if (this.isPaused || this.isPlayerCaught) return;
    
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
    
    // Update parents AI
    const playerPos = this.player.getPosition();
    this.parents.forEach(parent => {
      parent.update(playerPos);
    });
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
    
    // Lives counter
    const livesText = this.add.text(20, 55, `Lives: ${'❤️'.repeat(this.lives)}`, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    });
    livesText.setScrollFactor(0);
    livesText.setDepth(100);
    livesText.setName('livesText');
    
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
    
    // Pause hint
    const pauseHint = this.add.text(width / 2, 20, 'ESC to Pause', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    });
    pauseHint.setOrigin(0.5, 0);
    pauseHint.setScrollFactor(0);
    pauseHint.setDepth(100);
    pauseHint.setAlpha(0.7);
  }
  
  private createParents(): void {
    // Clear existing parents
    this.parents.forEach(p => p.destroy());
    this.parents = [];
    
    // Create parents from level data
    this.currentLevel.parents.forEach(parentData => {
      const parent = new Parent(
        this,
        parentData.x,
        parentData.y,
        parentData.patrolPath || [{ x: parentData.x, y: parentData.y }],
        parentData.catchPhrase
      );
      this.parents.push(parent);
    });
  }
  
  private handleCaught(parent: Parent): void {
    if (this.isPlayerCaught || parent.getState() !== 'CHASE') return;
    
    this.isPlayerCaught = true;
    this.player.stop();
    
    // Show catch phrase
    this.showMessage(parent.getCatchPhrase(), 2000);
    
    // Lose a life
    this.lives--;
    this.updateLivesDisplay();
    
    // Check game over
    if (this.lives <= 0) {
      this.gameOver();
    } else {
      // Reset positions after delay
      this.time.delayedCall(2000, () => {
        this.resetAfterCaught();
      });
    }
  }
  
  private resetAfterCaught(): void {
    this.isPlayerCaught = false;
    
    // Reset player position
    this.player.setPosition(
      this.currentLevel.playerStart.x,
      this.currentLevel.playerStart.y
    );
    
    // Reset parents
    this.parents.forEach(parent => parent.reset());
    
    // Show encouragement
    const encouragements = [
      'Try again! You got this!',
      'So close! Be sneakier!',
      'Parents have super hearing!',
      'Try using Shift to sneak!',
    ];
    const randomMsg = encouragements[Math.floor(Math.random() * encouragements.length)];
    this.showMessage(randomMsg, 2000);
  }
  
  private updateLivesDisplay(): void {
    const livesText = this.children.getByName('livesText') as Phaser.GameObjects.Text;
    if (livesText) {
      livesText.setText(`Lives: ${'❤️'.repeat(Math.max(0, this.lives))}`);
      
      // Flash effect
      this.tweens.add({
        targets: livesText,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 200,
        yoyo: true,
        ease: 'Power2',
      });
    }
  }
  
  private togglePause(): void {
    this.isPaused = !this.isPaused;
    
    if (this.isPaused) {
      // Show pause menu
      const { width, height } = this.cameras.main;
      
      const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
      overlay.setScrollFactor(0);
      overlay.setDepth(300);
      overlay.setName('pauseOverlay');
      
      const pauseText = this.add.text(width / 2, height / 2 - 50, 'PAUSED', {
        fontSize: '48px',
        fontFamily: 'Arial Black',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
      });
      pauseText.setOrigin(0.5);
      pauseText.setScrollFactor(0);
      pauseText.setDepth(301);
      pauseText.setName('pauseText');
      
      const resumeText = this.add.text(width / 2, height / 2 + 20, 'Press ESC to Resume', {
        fontSize: '24px',
        fontFamily: 'Arial',
        color: '#ffffff',
      });
      resumeText.setOrigin(0.5);
      resumeText.setScrollFactor(0);
      resumeText.setDepth(301);
      resumeText.setName('resumeText');
      
      // Stop all movement
      this.player.stop();
      this.parents.forEach(parent => parent.sprite.setVelocity(0, 0));
    } else {
      // Remove pause menu
      ['pauseOverlay', 'pauseText', 'resumeText'].forEach(name => {
        const obj = this.children.getByName(name);
        if (obj) obj.destroy();
      });
    }
  }
  
  private gameOver(): void {
    this.isPlayerCaught = true;
    this.showMessage(this.currentLevel.dialogues.failure, 3000);
    
    // Return to menu after delay
    this.time.delayedCall(3000, () => {
      this.scene.start('MenuScene');
    });
  }

  private collectToken(_player: any, token: any): void {
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
      parents: [
        {
          id: 'mom',
          name: 'Mom',
          x: 400,
          y: 200,
          patrolPath: [
            { x: 400, y: 200 },
            { x: 500, y: 200, wait: 1000 },
            { x: 500, y: 100 },
            { x: 300, y: 100, wait: 1000 },
            { x: 300, y: 200 },
          ],
          patrolSpeed: 60,
          detectionRange: 120,
          catchPhrase: "Nice try, but I have parent radar!"
        },
        {
          id: 'dad',
          name: 'Dad',
          x: 550,
          y: 280,
          patrolPath: [
            { x: 550, y: 280 },
            { x: 350, y: 280, wait: 2000 },
            { x: 150, y: 280 },
            { x: 150, y: 200, wait: 1000 },
            { x: 350, y: 200 },
            { x: 550, y: 200 },
          ],
          patrolSpeed: 50,
          detectionRange: 100,
          catchPhrase: "Bedtime means bedtime, kiddo!"
        }
      ],
      unfairnessEvents: [],
      dialogues: {
        start: 'But I\'m not tired! Quick, collect the tokens before bedtime!',
        success: 'Yes! You earned enough time to finish your game!',
        failure: 'Caught! Straight to bed with no story time...',
      },
    };
  }
}