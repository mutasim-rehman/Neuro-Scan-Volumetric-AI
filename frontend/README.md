# NeuroScan Frontend - Layer 1

React + Three.js volumetric visualization viewer using raymarching shaders.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The viewer will be available at `http://localhost:5173`

## Features

- **Volumetric Raymarching**: Custom GLSL shader with 256-step raymarching
- **Slicing Tools**: X, Y, Z clipping planes
- **Transfer Functions**: Opacity threshold adjustment
- **Demo Mode**: Works without backend data (shows demo sphere)

## Architecture

- **VolumetricViewer**: Main 3D container component
- **VolumetricMaterial**: Custom shader material for raymarching
- **useVolumetricLoader**: Hook for loading volumetric data from API
- **Controls**: UI panel for slicing and transfer function controls

## Development Status

- ✅ React Three Fiber setup
- ✅ Raymarching shader skeleton
- ✅ Volumetric loader (binary protocol parser)
- ✅ Demo volume generator
- ⏳ Control panel state binding
- ⏳ File upload UI
- ⏳ Error handling and loading states

