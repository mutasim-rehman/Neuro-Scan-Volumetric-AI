# NeuroScan Backend - Layer 1

FastAPI server for processing and serving volumetric medical imaging data.

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python -m uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `GET /` - API status
- `GET /health` - Health check
- `GET /api/volumetric/{file_id}` - Get volumetric data (binary format)
- `POST /api/volumetric/upload` - Upload and process NIfTI file
- `GET /api/volumetric/list` - List available files

## Binary Protocol

The volumetric data is served in a custom binary format:
- **Header (40 bytes)**: width, height, depth (uint32 each), data_type (uint32), reserved (28 bytes)
- **Data**: float32 array of normalized voxel values (0.0-1.0)

## Development Status

- ✅ FastAPI application structure
- ✅ Volumetric processor skeleton
- ✅ Binary protocol implementation
- ⏳ NIfTI file loading (nibabel integration)
- ⏳ File upload handling
- ⏳ Data caching

