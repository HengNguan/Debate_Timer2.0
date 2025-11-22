<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Debate Master (辩论大师)

A professional, feature-rich debate timer application designed for modern debate competitions.

## Features

### ⏱️ Standard Timer (普通模式)
- **Presets**: Quick access to 3, 3.5, 4, 5, 7, and 10-minute timers.
- **Controls**: Large Play/Pause and Reset buttons.
- **Audio Cues**:
  - Warning sound at 30 seconds remaining.
  - End sound when time expires.
- **Visual Feedback**: Timer turns red when time is low (< 30s).

### ♟️ Chess Timer (自由辩论)
- **Dual Timers**: Independent timers for Pro (正方) and Con (反方).
- **Turn Switching**: Tap a speaker's area to switch turns instantly.
- **Global Pause**: Pause the entire debate with a single click.

### 📋 Flow Mode (流程模式)
- **Round Management**: Create a custom sequence of debate rounds.
- **Customizable Rounds**:
  - Set title, type (Standard/Chess), duration (supports decimals like 3.5m), and speaker.
  - Drag and drop reordering (via Up/Down buttons).
- **Templates**: One-click loading of standard debate formats.

### 🎨 Customization
- **Competition Name**: Display the event name prominently.
- **Background**: Upload a custom background image for branding.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the app:
   ```bash
   npm run dev
   ```

3. Open http://localhost:5173 in your browser.

## Tech Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (Icons)
