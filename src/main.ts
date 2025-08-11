import Phaser from 'phaser';
import { gameConfig } from './config/GameConfig';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';

// Remove loading spinner once game starts
const removeLoadingScreen = () => {
  const loadingElement = document.querySelector('.loading');
  if (loadingElement) {
    loadingElement.remove();
  }
};

// Initialize the game
const config: Phaser.Types.Core.GameConfig = {
  ...gameConfig,
  scene: [BootScene, MenuScene, GameScene],
  callbacks: {
    postBoot: () => {
      removeLoadingScreen();
    },
  },
};

// Start the game
new Phaser.Game(config);

// Handle window resize
window.addEventListener('resize', () => {
  // Phaser will handle this automatically with Scale.FIT mode
});