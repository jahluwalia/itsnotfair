import { Types } from 'phaser';

export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 768;

export const gameConfig: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#2d2d2d',
  scale: {
    parent: 'game-container',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true, // Set to false for production
    },
  },
  scene: [], // Will be populated in main.ts
};