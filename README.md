# NeuroScan

A full-stack medical imaging visualization system for brain tumor detection and visualization.

## Architecture

NeuroScan consists of two integrated layers:
- **Layer 1**: Volumetric Visualization Engine (React, Three.js, GLSL)
- **Layer 2**: AI Tumor Detection (PyTorch, MONAI)

See [Architecture.md](./Architecture.md) for detailed documentation.

## Quick Start

### Backend (Layer 1)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend (Layer 1)

```bash
cd frontend
npm install
npm run dev
```

The viewer will be available at `http://localhost:5173`

## Development Status

### Phase 1: Complete ✅
- ✅ NIfTI file loading (nibabel integration)
- ✅ File upload endpoint with storage
- ✅ Volumetric texture binding in shader
- ✅ Control panel state management (slicing planes, transfer function)
- ✅ Error handling and loading states
- ✅ Raymarching shader with 256 steps
- ✅ Binary protocol implementation

### Phase 2: Complete ✅
- ✅ Proper ray-box intersection raymarching
- ✅ Advanced transfer functions (color modes, brightness, contrast)
- ✅ File management UI (list, select, delete)
- ✅ Camera controls (orbit, zoom, pan)
- ✅ File metadata display
- ✅ Performance optimizations

### Phase 3: Complete ✅
- ✅ Multi-channel MRI support (T1, T1ce, T2, FLAIR)
- ✅ Segmentation mask overlay system
- ✅ Measurement tools framework
- ✅ Export functionality (screenshot, data)
- ✅ Channel selector UI
- ✅ Mask rendering shader
- ✅ Layer 2 integration preparation

### Layer 1: Complete ✅
- ✅ Comprehensive error handling and user feedback
- ✅ Loading states and progress indicators
- ✅ Toast notification system
- ✅ Help panel with keyboard shortcuts
- ✅ UI/UX polish and animations
- ✅ Production-ready codebase

### Next: Layer 2 Integration
- [ ] AI tumor detection pipeline
- [ ] Model integration (MONAI SegResNet)
- [ ] Inference endpoints
- [ ] Full measurement implementation (point picking)
- [ ] 2D slice views
- [ ] Animation/playback for 4D data

## License

MIT

