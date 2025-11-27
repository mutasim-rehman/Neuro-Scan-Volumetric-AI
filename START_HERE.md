# 🚀 START HERE - View Your First 3D NIfTI Model

## ⚡ Super Quick Start (Copy & Paste)

### Terminal 1 - Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
python -m pip install --upgrade pip
pip install --upgrade setuptools wheel
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### Terminal 2 - Frontend  
```bash
cd frontend
npm install
npm run dev
```

### Browser
👉 Open: **http://localhost:5173**

### Upload File
1. Click **"Upload NIfTI File"**
2. Select your `.nii` or `.nii.gz` file
3. **Done!** Your 3D model appears! 🎉

---

## 📋 Step-by-Step Checklist

### ✅ Prerequisites
- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] Modern browser (Chrome recommended)

### ✅ Backend Setup
- [ ] Navigate to `backend` folder
- [ ] Create virtual environment: `python -m venv venv`
- [ ] Activate: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
- [ ] Install: `pip install -r requirements.txt`
- [ ] Run: `python -m uvicorn app.main:app --reload`
- [ ] Verify: http://localhost:8000 shows API message

### ✅ Frontend Setup
- [ ] Open NEW terminal
- [ ] Navigate to `frontend` folder
- [ ] Install: `npm install`
- [ ] Run: `npm run dev`
- [ ] Verify: http://localhost:5173 shows viewer

### ✅ View 3D Model
- [ ] Open browser to http://localhost:5173
- [ ] Click "Upload NIfTI File" button
- [ ] Select your NIfTI file (.nii or .nii.gz)
- [ ] Wait for upload (see "Uploading..." message)
- [ ] 3D model appears automatically!
- [ ] Use mouse to rotate, scroll to zoom

---

## 🎮 Controls

| Action | How To |
|--------|--------|
| **Rotate** | Left-click + drag |
| **Zoom** | Scroll wheel |
| **Pan** | Right-click + drag |
| **Slice** | Use X, Y, Z sliders |
| **Adjust View** | Opacity, brightness, contrast sliders |

---

## 🆘 Having Issues?

### Backend won't start?
- Check Python version: `python --version` (need 3.8+)
- Try: `pip install --upgrade pip` then reinstall
- Port 8000 busy? Use `--port 8001`

### Frontend won't start?
- Check Node version: `node --version` (need 16+)
- Try: `npm cache clean --force` then reinstall
- Port 5173 busy? Vite auto-finds next port

### Can't see 3D model?
- Check browser console (F12) for errors
- Verify both servers are running
- Try adjusting opacity threshold slider
- Reset slicing planes to 0

### File upload fails?
- Check file is `.nii` or `.nii.gz` format
- File too large? Try smaller test file
- Check backend terminal for errors

---

## 📚 More Help

- **Detailed Setup**: See [SETUP.md](./SETUP.md)
- **Quick Reference**: See [QUICK_START.md](./QUICK_START.md)
- **Complete Docs**: See [LAYER_1_COMPLETE.md](./LAYER_1_COMPLETE.md)

---

## ✨ What You'll See

Once everything is running:
- **Right Panel**: Control sliders and upload button
- **Center**: 3D volumetric visualization (your NIfTI model)
- **Bottom Left**: File manager, channel selector, tools
- **Top Right**: Help button (?)

The 3D model will appear as a "ghostly" semi-transparent volume that you can rotate, zoom, and slice through!

---

**Need help?** Check the troubleshooting section in [SETUP.md](./SETUP.md) or open the Help panel (?) in the viewer.

