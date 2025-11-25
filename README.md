<div align="center">
<img width="1200" alt="Debate Timer Screenshot" src="./assets/timer_screenshot.png" />
</div>

# Debate Master (辩论Timer)

A professional, feature-rich debate timer application designed for modern debate competitions.

## Features

### ⏱️ Standard Timer (普通模式)
- **Presets**: Quick access to 3, 3.5, 4, 5, 7, and 10-minute timers.
- **Controls**: Large Play/Pause and Reset buttons.
- **Audio Cues**:
  - Warning sound at 30 seconds remaining (louder and slightly longer for better noticeability). The warning sound is intentionally kept shorter than the end sound.
  - End sound when time expires (longer lower-pitched sustain).
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

Note: Modern browsers require a user gesture to enable audio playback. This app automatically primes the audio engine on the first click/interaction (so the first alert will play correctly). If you encounter silent alerts, click or tap anywhere in the app once and try again.

## Tech Stack
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (Icons)

### Audio engine
Web Audio API (shared AudioContext with first-gesture priming to avoid autoplay blocking; sound implemented with oscillators and gain ramps).
## Troubleshooting / Notes
- If you do not hear a sound on the first attempt, click or tap anywhere on the page to prime the browser audio context and try again.
- The warning and end sound settings are configurable in `utils/sound.ts` (constants for duration, frequency, and gain are centralized for easy tuning).
