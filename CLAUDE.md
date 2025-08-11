# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"It's Not Fair!" is a comedic sibling stealth platformer game for kids (ages 7-10) that teaches resilience through humor. Players control two siblings collecting "Fairness Tokens" while avoiding parents and dealing with sudden "unfair" rule changes. The game is built for the web and hosted at itsnotfair.co.

## Current Status

**Initial Development** - Basic game engine setup complete with:
- TypeScript + Phaser 3 + Vite build system
- Three scenes: Boot, Menu, and Game
- Basic player movement with sneaking mechanics
- Token collection system
- Placeholder graphics
- Ready for Vercel deployment

## Technical Stack

### Core Technologies
- **Game Engine**: Phaser 3.90.0 - Mature HTML5 game framework
- **Language**: TypeScript - Type safety and better IDE support
- **Build Tool**: Vite - Fast development and optimized production builds
- **Hosting**: Vercel - Static site hosting with automatic deployments

### Project Structure
```
src/
├── main.ts              # Entry point
├── config/              # Game configuration
├── scenes/              # Game scenes (Boot, Menu, Game, etc.)
├── entities/            # Game objects (Player, Parent, Token)
├── systems/             # Game systems (UnfairnessManager, SaveManager)
├── levels/              # Level data and loader
├── types/               # TypeScript type definitions
└── utils/               # Helper functions

game-design/             # Design documents for family collaboration
├── levels/              # Level design templates
├── characters/          # Character design templates
└── kid-feedback/        # Playtesting feedback forms
```

## Core Game Systems to Implement

When development begins, these are the key systems that need implementation:

### 1. Character Controllers
- **Sister (Kavi)**: Wall-slide, duct-crawl, balloon decoy abilities
- **Brother (Niro)**: IoT hacking, heavy object manipulation, tech-based puzzles
- Character switching mechanic or simultaneous co-op control

### 2. Stealth Mechanics
- Parent/obstacle patrol patterns with line-of-sight detection
- Crouch/roll mechanics for avoiding detection
- Hide-in-plain-sight crowd blending
- Audio-based detection system

### 3. Level Systems
- 5 worlds with distinct mechanics:
  1. Bedtime Blitz (night-light avoidance)
  2. Snack-Heist Kitchen (code-breaking minigames)  
  3. Backyard Breakout (environmental hazards)
  4. Mall Mayhem (crowd mechanics)
  5. Vacation Vexation (dual-character puzzles)

### 4. Fairness Systems
- Dynamic rule changes mid-level
- "Because I Said So" meter tracking
- Patience bar management
- Token collection and scoring

### 5. Comedy/Polish Features
- Procedural Dad jokes on failure
- Sibling banter system
- Animated speech bubbles
- Satirical sticker collection

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (opens browser automatically)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type checking
npm run type-check

# Deploy to Vercel (after connecting GitHub repo)
vercel --prod
```

## MVP Scope

The design document suggests focusing on:
1. Implement Worlds 1-2 with core mechanics
2. Single-player with character switching (before adding co-op)
3. Basic stealth and token collection
4. Simple fail/retry loop with comedy elements

## Key Design Principles

- **Comedy First**: Every mechanic should have a humorous angle
- **Unfairness as Feature**: Intentionally unfair moments that mirror real sibling dynamics
- **Quick Retry**: Fast fail/restart to keep gameplay flowing
- **Visual Gags**: Use animation and visual effects for comedy over dialogue

## Asset Requirements

When creating/commissioning assets:
- Character sprites with multiple animation states (idle, sneak, caught, victory)
- Household environment tiles (floors, walls, furniture)
- UI elements matching the comedy theme
- Sound effects emphasizing cartoon-style feedback
- Parent/obstacle sprites with clear sight-cone indicators

## Current Implementation Details

### What's Working
- Basic game loop with Phaser 3 and TypeScript
- Player movement with arrow keys
- Sneaking mechanic (hold Shift for slower, quieter movement)
- Token collection with visual feedback
- Level completion detection
- Responsive canvas scaling
- Menu system with instructions

### Placeholder Assets
Currently using SVG placeholders:
- Blue rectangle with circle for player
- Red rectangle for parents (not yet implemented)
- Yellow star for tokens
- Gray squares for walls/floors

### Next Implementation Steps
1. Add Parent entities with patrol AI
2. Implement detection/stealth mechanics
3. Create UnfairnessManager for random events
4. Add sound effects and background music
5. Implement character switching (Q key)
6. Create level loader for JSON-based levels
7. Add save system using localStorage
8. Replace placeholder graphics with kid-drawn art

## Family Collaboration

### Design Templates Available
- `game-design/levels/TEMPLATE.md` - For kids to design levels
- `game-design/levels/example-01-but-im-not-tired.md` - Example level
- `game-design/characters/character-template.md` - Character design
- `game-design/kid-feedback/feedback-template.md` - Playtesting notes
- `game-design/unfairness-mechanics.md` - Types of unfairness guide

### How Kids Can Contribute
1. Fill out level templates with their unfair scenarios
2. Draw character concepts (can be scanned/photographed)
3. Record sound effects with their voices
4. Playtest and provide feedback
5. Suggest funny parent catchphrases
6. Design "Fairness Token" rewards