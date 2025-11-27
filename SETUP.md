# NeuroScan Layer 1 - Setup Guide

Complete guide to set up and run the volumetric visualization engine to view 3D NIfTI models.

## Prerequisites

### Required Software
- **Python 3.8+** (for backend)
- **Node.js 16+** and **npm** (for frontend)
- **Git** (optional, for cloning)

### System Requirements
- Windows, macOS, or Linux
- At least 4GB RAM
- Modern web browser with WebGL support (Chrome, Firefox, Edge, Safari)

## Quick Start

### Step 1: Clone or Navigate to Project

```bash
# If you have the project in a repository
git clone <repository-url>
cd NeuroScan

# Or navigate to your project directory
cd D:\NeuroScan  # or your project path
```

### Step 2: Backend Setup

#### 2.1 Navigate to Backend Directory
```bash
cd backend
```

#### 2.2 Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### 2.3 Install Dependencies

**First, upgrade pip and install build tools:**
```bash
python -m pip install --upgrade pip
pip install --upgrade setuptools wheel
```

**Then install project dependencies:**
```bash
pip install -r requirements.txt
```

This installs:
- FastAPI (web framework)
- Uvicorn (ASGI server)
- nibabel (NIfTI file handling)
- numpy (numerical operations)

**Note:** If you get a `setuptools.build_meta` error, see [backend/FIX_INSTALL_ERROR.md](./backend/FIX_INSTALL_ERROR.md)

#### 2.4 Verify Installation
```bash
python -c "import fastapi, nibabel, numpy; print('All dependencies installed!')"
```

### Step 3: Frontend Setup

#### 3.1 Navigate to Frontend Directory
Open a **new terminal window** and:
```bash
cd frontend
```

#### 3.2 Install Dependencies
```bash
npm install
```

This installs:
- React
- Three.js
- React Three Fiber
- Vite (build tool)

#### 3.3 Verify Installation
```bash
npm list --depth=0
```

### Step 4: Start the Servers

#### 4.1 Start Backend Server

In your **first terminal** (backend directory):
```bash
# Make sure virtual environment is activated
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

python -m uvicorn app.main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Backend is now running on:** `http://localhost:8000`

#### 4.2 Start Frontend Server

In your **second terminal** (frontend directory):
```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Frontend is now running on:** `http://localhost:5173`

### Step 5: Open the Application

1. Open your web browser
2. Navigate to: **http://localhost:5173**
3. You should see the NeuroScan viewer interface

## Viewing a 3D NIfTI Model

### Step 1: Prepare Your NIfTI File

You need a NIfTI file (`.nii` or `.nii.gz` format). Examples:
- Brain MRI scans
- Medical imaging data
- Any 3D volumetric data in NIfTI format

**Note:** If you don't have a NIfTI file, the viewer will show a demo volume.

### Step 2: Upload the File

1. In the browser, look for the **control panel** on the right side
2. Scroll down to the **"File Upload"** section
3. Click **"Upload NIfTI File"** button
4. Select your `.nii` or `.nii.gz` file
5. Wait for upload to complete (you'll see "Uploading..." status)

### Step 3: View the 3D Model

Once uploaded:
- The 3D model will **automatically load and display**
- You'll see a "ghostly" 3D visualization of your volume
- The model will be rotating slowly (demo mode)

### Step 4: Interact with the Model

#### Mouse Controls:
- **Left Click + Drag**: Rotate the view
- **Right Click + Drag**: Pan the view
- **Scroll Wheel**: Zoom in/out

#### Control Panel (Right Side):
- **Slicing Planes**: Use X, Y, Z sliders to clip the volume
- **Opacity Threshold**: Adjust to see more/less detail
- **Color Mode**: Switch between Grayscale, Heatmap, Rainbow
- **Brightness/Contrast**: Fine-tune the visualization

### Step 5: Explore Features

#### File Manager (Bottom Left - 📁 icon):
- View all uploaded files
- Switch between files
- Delete files

#### Channel Selector (Bottom Left - 📊 icon):
- For multi-channel MRI (T1, T1ce, T2, FLAIR)
- Assign files to channels
- Switch between channels

#### Help Panel (Top Right - ? icon):
- View keyboard shortcuts
- Read usage guide
- Learn about features

## Example Workflow

```
1. Start backend server (Terminal 1)
   → cd backend
   → venv\Scripts\activate  (Windows)
   → python -m uvicorn app.main:app --reload

2. Start frontend server (Terminal 2)
   → cd frontend
   → npm run dev

3. Open browser
   → http://localhost:5173

4. Upload NIfTI file
   → Click "Upload NIfTI File"
   → Select your .nii or .nii.gz file

5. View 3D model
   → Model appears automatically
   → Use mouse to rotate/zoom
   → Adjust controls for best view
```

## Troubleshooting

### Backend Issues

**Problem: Port 8000 already in use**
```bash
# Solution: Use a different port
python -m uvicorn app.main:app --reload --port 8001
```

**Problem: Module not found errors**
```bash
# Solution: Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**Problem: Virtual environment not activating**
```bash
# Windows: Try
.\venv\Scripts\activate

# macOS/Linux: Try
source ./venv/bin/activate
```

### Frontend Issues

**Problem: Port 5173 already in use**
```bash
# Solution: Vite will automatically use next available port
# Or specify a port:
npm run dev -- --port 5174
```

**Problem: npm install fails**
```bash
# Solution: Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Problem: Module not found errors**
```bash
# Solution: Reinstall dependencies
npm install
```

### Browser Issues

**Problem: WebGL not supported**
- Update your browser
- Enable hardware acceleration
- Try a different browser (Chrome recommended)

**Problem: Blank screen**
- Check browser console (F12) for errors
- Verify both servers are running
- Check that backend is on port 8000
- Verify CORS settings in backend

**Problem: File upload fails**
- Check file size (very large files may timeout)
- Verify file is .nii or .nii.gz format
- Check browser console for errors
- Verify backend is running

### General Issues

**Problem: Can't see the 3D model**
- Make sure a file is uploaded
- Try adjusting opacity threshold
- Check slicing planes (reset to 0)
- Try different color modes

**Problem: Slow performance**
- Reduce volume size if possible
- Close other applications
- Use a modern browser
- Check system resources

## Verification Checklist

Before viewing your model, verify:

- [ ] Backend server is running (http://localhost:8000)
- [ ] Frontend server is running (http://localhost:5173)
- [ ] Browser shows the NeuroScan interface
- [ ] No errors in browser console (F12)
- [ ] NIfTI file is in correct format (.nii or .nii.gz)
- [ ] File upload completes successfully
- [ ] 3D viewer area is visible

## Testing with Demo Data

If you don't have a NIfTI file:

1. The viewer will automatically show a **demo sphere volume**
2. You can still test all controls and features
3. All visualization features work with demo data

## Next Steps

Once you can view 3D models:

1. **Explore Controls**: Try all the visualization options
2. **Upload Different Files**: Test with various NIfTI files
3. **Multi-Channel**: Try uploading 4 MRI sequences (T1, T1ce, T2, FLAIR)
4. **Export**: Try exporting screenshots and data
5. **Layer 2**: Ready for AI tumor detection integration

## Getting Help

If you encounter issues:

1. Check the browser console (F12) for errors
2. Check terminal output for backend errors
3. Verify all prerequisites are installed
4. Review the troubleshooting section above
5. Check documentation in `LAYER_1_COMPLETE.md`

## Quick Reference

### Backend Commands
```bash
cd backend
venv\Scripts\activate          # Windows
source venv/bin/activate       # macOS/Linux
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### Frontend Commands
```bash
cd frontend
npm install
npm run dev
```

### URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs (Swagger UI)

---

**You're all set!** Start both servers and upload a NIfTI file to see your 3D model. 🎉

