# Backend Quick Start

## Setup Backend Server

### Windows
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### macOS/Linux
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

## Verify It's Working

Open browser: http://localhost:8000

You should see:
```json
{"message": "NeuroScan Layer 1 API", "status": "running"}
```

API Documentation: http://localhost:8000/docs

## Troubleshooting

**Port 8000 in use?**
```bash
python -m uvicorn app.main:app --reload --port 8001
```

**Dependencies not installing?**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

