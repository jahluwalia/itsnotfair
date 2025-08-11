export interface PlayerConfig {
  x: number;
  y: number;
  texture: string;
  speed: number;
  sneakSpeed: number;
}

export interface LevelData {
  id: string;
  name: string;
  world: number;
  layout: string[][];
  playerStart: { x: number; y: number };
  tokens: TokenData[];
  parents: ParentData[];
  unfairnessEvents: UnfairnessEvent[];
  dialogues: LevelDialogues;
}

export interface TokenData {
  id: string;
  x: number;
  y: number;
  type: 'main' | 'bonus' | 'hidden';
  value: number;
}

export interface ParentData {
  id: string;
  name: string;
  x: number;
  y: number;
  patrolPath?: { x: number; y: number; wait?: number }[];
  patrolSpeed: number;
  detectionRange: number;
  catchPhrase: string;
}

export interface UnfairnessEvent {
  id: string;
  type: 'RULE_CHANGE' | 'BAD_TIMING' | 'DOUBLE_STANDARD' | 'RANDOM_PUNISHMENT' | 'AUTHORITY';
  triggerType: 'TIME' | 'LOCATION' | 'ACTION' | 'TOKENS_COLLECTED';
  triggerValue: number | { x: number; y: number };
  message: string;
  effect: {
    type: 'SPEED_CHANGE' | 'TIME_LIMIT' | 'NEW_OBSTACLE' | 'RULE_CHANGE';
    value: any;
  };
}

export interface LevelDialogues {
  start: string;
  success: string;
  failure: string;
  partialSuccess?: string;
}

export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'LEVEL_COMPLETE';

export interface SaveData {
  currentLevel: string;
  completedLevels: string[];
  totalTokens: number;
  achievements: string[];
  settings: GameSettings;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  difficulty: 'EASY' | 'NORMAL' | 'UNFAIR';
}