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

This is a skeleton implementation. Key features to implement:
- [ ] NIfTI file loading (nibabel integration)
- [ ] File upload endpoint
- [ ] Volumetric texture binding in shader
- [ ] Control panel state management
- [ ] Error handling and loading states

## License

MIT

