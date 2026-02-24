# 🎮 Pixel Platformer

A retro-style 2D platformer game inspired by classic 8-bit/16-bit games, built with Phaser 3 and TypeScript.

![Game Style](https://img.shields.io/badge/Style-Pixel%20Art-blue)
![Engine](https://img.shields.io/badge/Engine-Phaser%203-green)
![Language](https://img.shields.io/badge/Language-TypeScript-blue)

## 🌟 Features

### 🎨 Classic Retro Style
- **8-bit pixel art** graphics generated programmatically
- **FC-era** inspired visual design with nostalgic blue sky background
- **Smooth scrolling** camera system for classic platformer feel

### 👥 Dual Player Mode
- **Player 1 (Sonic)**: Blue hedgehog with red shoes
  - Controls: Arrow keys + Space/↑ to jump
- **Player 2 (Shadow)**: Black hedgehog with red stripes
  - Controls: WASD + Shift/W to jump

### 🎯 Gameplay Elements
- ✨ **Collectible Coins**: Gather all coins to spawn new ones
- 🍄 **Ground Enemies**: Mushroom-like enemies that patrol platforms
- 🔥 **Fire Enemies**: Flying dragon enemies that shoot fireballs
- 🏆 **Score System**: 
  - Coins: +10 points
  - Stomp enemy: +20 points
  - Defeat fire enemy: +50 points
- ❤️ **Lives System**: Start with 3 lives
- 🎮 **Multiplayer**: Cooperative gameplay with camera following both players

### 🌍 World Design
- **Multi-layered platforms** with varying heights
- **Vertical scrolling** up to 1200px height
- **Physics-based** movement with gravity and collision detection
- **Dynamic difficulty**: More enemies spawn as you progress

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pixel-platformer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the local server URL (usually `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎮 How to Play

### Controls

#### Player 1 (Blue Sonic)
- **Left/Right Arrow**: Move
- **Up Arrow or Space**: Jump

#### Player 2 (Black Shadow)
- **A/D**: Move left/right
- **W or Shift**: Jump

### Objective
- Collect all the golden coins
- Avoid or stomp on enemies
- Don't fall off the platforms
- Survive with your 3 lives
- Achieve the highest score possible!

### Tips
- 💡 You can stomp enemies by jumping on them from above
- 💡 Fire enemies shoot homing fireballs - keep moving!
- 💡 Stomping fire enemies gives you more points
- 💡 When you collect all coins, new ones appear with more enemies
- 💡 Press **R** to restart after game over

## 🛠️ Technology Stack

- **Game Engine**: [Phaser 3](https://phaser.io/) (v3.90.0)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Graphics**: Procedurally generated pixel art (no external assets needed)
- **Physics**: Phaser Arcade Physics

## 📁 Project Structure

```
pixel-platformer/
├── public/              # Static assets
├── src/
│   ├── scenes/
│   │   └── MainScene.ts # Main game scene
│   ├── main.ts          # Game initialization
│   └── style.css        # Styling
├── index.html           # Entry HTML
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript config
```

## 🎨 Game Assets

All visual assets are **generated programmatically** using Phaser's Graphics API:
- Player sprites (Sonic & Shadow)
- Platform textures with grass details
- Enemy sprites (mushrooms & fire dragons)
- Coin animations
- Fireball effects

No external image files required!

## 🔧 Development

### Adding New Features
The main game logic is in `src/scenes/MainScene.ts`. Key methods:
- `preload()`: Load/generate assets
- `create()`: Initialize game objects
- `update()`: Game loop logic

### Customization
You can easily customize:
- Player colors and designs in `createPixelAssets()`
- Platform layouts in `createPlatforms()`
- Enemy behavior in the `update()` loop
- Physics parameters in `src/main.ts`

## 📝 License

This project is created for educational purposes.

## 🎯 Future Ideas

- [ ] Add sound effects and music
- [ ] Implement power-ups (speed boost, invincibility, etc.)
- [ ] Create multiple levels
- [ ] Add boss battles
- [ ] Implement local high score storage
- [ ] Add more enemy types
- [ ] Create level editor

## 🤝 Contributing

Feel free to fork this project and add your own features!

---

**Enjoy the game! 🎮✨**

Made with ❤️ using Phaser 3 and TypeScript
