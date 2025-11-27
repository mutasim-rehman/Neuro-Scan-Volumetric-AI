# Frontend Quick Start

## Setup Frontend Server

```bash
cd frontend
npm install
npm run dev
```

## Verify It's Working

Open browser: http://localhost:5173

You should see the NeuroScan viewer interface.

## Upload and View NIfTI File

1. Click **"Upload NIfTI File"** button (right control panel)
2. Select a `.nii` or `.nii.gz` file
3. Wait for upload to complete
4. **3D model appears automatically!**

## Controls

- **Left Click + Drag**: Rotate view
- **Scroll Wheel**: Zoom
- **Right Click + Drag**: Pan
- **Sliders**: Adjust visualization

## Troubleshooting

**Port 5173 in use?**
Vite will automatically use the next available port.

**npm install fails?**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Blank screen?**
- Check browser console (F12)
- Verify backend is running on port 8000
- Check for CORS errors

