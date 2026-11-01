# 🏹 Arrow Puzzle — Directional Logic Escape & PWA Game

A responsive, high-performance web game and logic escape puzzle built with **React**, **Vite**, **Tailwind CSS**, and the browser **Web Audio API**.

---

## 🎯 Gameplay Overview
- **Objective:** Clear the board by guiding all directional arrows safely out of the grid boundaries.
- **Mechanics:**
  - Tapping an arrow raycasts along its pointing trajectory.
  - If unobstructed, it glides smoothly out of the board.
  - If another arrow blocks its path, it indicates collision (turns red + shake feedback) and consumes a heart.
- **Infinite Progression:** Cycles across difficulty tiers: **Easy** $\rightarrow$ **Medium** $\rightarrow$ **Hard** $\rightarrow$ **Expert** $\rightarrow$ repeat infinitely.
- **Features:**
  - 🔄 **Undo & Reset:** Full move history to undo moves or restart levels.
  - 💡 **Hint System:** 1 Free Hint + 2 Ad-rewarded hints per level.
  - 📏 **Guideline Ruler:** Visual trajectory lines overlay.
  - ⏸ **Pause & Settings:** Timer, moves counter, and sound toggles.
  - 👤 **Multi-User Google Sign-In & Guest Mode:** Isolated progress per account with local storage persistence.

---

## 🚀 Quick Start for Collaborators / Developers

### 1. Clone the repository
```bash
git clone https://github.com/LabishRoopani/arrow-puzzle.git
cd arrow-puzzle
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run local development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production
```bash
npm run build
```

---

## 📁 Project Structure

```text
arrow-puzzle/
├── public/                     # Static icons, manifest, favicon
├── src/
│   ├── components/             # React UI components
│   │   ├── ArrowCell.jsx       # Grid cell tile
│   │   ├── Board.jsx           # Grid board
│   │   ├── GoogleAuthModal.jsx # Multi-account sign-in
│   │   ├── HomeScreen.jsx      # Mobile dashboard
│   │   ├── LevelModal.jsx      # Level selector overlay
│   │   ├── LoadingScreen.jsx   # Splash loader
│   │   ├── PauseModal.jsx      # In-game pause menu
│   │   ├── RewardAdModal.jsx   # Rewarded ads simulation
│   │   ├── SettingsModal.jsx   # Sound & game settings
│   │   ├── SnakeBoard.jsx      # 1:1 Gameplay canvas & touch bindings
│   │   └── WinModal.jsx        # Celebration dialog
│   ├── engine/                 # Deterministic Puzzle Engine
│   │   ├── gameRules.js        # Coordinate helpers & boundary checks
│   │   ├── gameState.js        # State updates & move records
│   │   ├── pathValidator.js    # Raycasting line-of-sight checks
│   │   └── snakeEngine.js      # Non-intersecting snake generator & hints
│   ├── utils/
│   │   ├── soundEffects.js     # Web Audio API zero-asset synthesizer
│   │   └── storage.js          # User-isolated LocalStorage sync
│   ├── App.jsx                 # Master application controller
│   └── index.css               # Tailwind & custom keyframe animations
└── package.json
```

---

## 📱 Mobile Installation (PWA)
1. Open the game in Chrome / Safari on your smartphone.
2. Tap the browser options menu (`⋮` or Share icon).
3. Select **"Add to Home Screen"** or **"Install App"**.
