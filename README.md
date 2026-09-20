# Corbon Guitar Synced

A Spicetify extension that displays a floating guitar video synced with the song's BPM. Inspired by **Corbon Amodio**.

![Preview](assets/preview.gif)

## Features

- 🎸 Floating transparent guitar video
- 🎵 BPM sync — video speed adjusts to the song's tempo
- ⚡ Velocity effect — slow-mo on beat, fast between beats
- ✨ Glow effect on beat
- ⌨️ `Ctrl + D` to toggle on/off
- 🔄 Auto pause/play with Spotify
- 📐 Dynamic positioning (follows player bar & volume button)

## Installation

### Via Spicetify Marketplace (Recommended)

1. Open Spotify
2. Go to **Marketplace** → **Extensions**
3. Search for **"Corbon Guitar Synced"**
4. Click **Install**

### Manual Installation

1. Install [Spicetify](https://spicetify.app/)
2. Download `corbon-guitar-synced.js` from [Releases](https://github.com/thorryn1/corbon-guitar-synced/releases)
3. Copy to `%appdata%\spicetify\Extensions\`
4. Run:
   ```bash
   spicetify config extensions corbon-guitar-synced.js
   spicetify apply