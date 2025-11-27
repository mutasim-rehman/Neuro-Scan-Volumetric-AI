# Quick Start Guide - View 3D NIfTI Model in 5 Minutes

## Fastest Way to Get Started

### 1. Backend (Terminal 1)
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# OR
source venv/bin/activate       # macOS/Linux

python -m pip install --upgrade pip
pip install --upgrade setuptools wheel
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

✅ Backend running on http://localhost:8000

### 2. Frontend (Terminal 2 - New Window)
```bash
cd frontend
npm install
npm run dev
```

✅ Frontend running on http://localhost:5173

### 3. Open Browser
Go to: **http://localhost:5173**

### 4. Upload NIfTI File
1. Click **"Upload NIfTI File"** (right panel)
2. Select your `.nii` or `.nii.gz` file
3. Wait for upload
4. **3D model appears automatically!**

### 5. Interact
- **Mouse drag**: Rotate
- **Scroll**: Zoom
- **Right-click drag**: Pan
- **Sliders**: Adjust visualization

## That's It! 🎉

Your 3D NIfTI model is now visible and interactive.

For detailed setup, see [SETUP.md](./SETUP.md)

