# **NeuroScan Layer 1: Volumetric Visualization Engine**

**Goal:** Transform static 2D medical slices into an interactive 3D "Digital Twin" in the browser.

## **1\. Overview**

Layer 1 is the visualization core of NeuroScan. It creates a bridge between raw medical data formats (NIfTI/DICOM) and modern web graphics (WebGL). It does **not** perform diagnosis; it provides the *medium* through which diagnosis can be seen.

**Key Technology:** React Three Fiber, Custom GLSL Raymarching, Python Data Processing.

## **2\. Architecture: "The Ghost Brain"**

The system works by simulating light passing through a semi-transparent block of data.

1. **Input:** A single .nii.gz file (e.g., a FLAIR MRI scan).  
2. **Backend Processing:**  
   * **Normalization:** MRI scanners output arbitrary units. We normalize pixel intensity to 0.0 \- 1.0.  
   * **Binary Packing:** We strip metadata headers and compress the 3D array into a raw float32 stream.  
   * **Delivery:** Served via FastAPI as a binary blob.  
3. **Frontend Rendering (Raymarching):**  
   * **The Container:** A simple Three.js \<BoxGeometry /\>.  
   * **The Shader:** A custom Fragment Shader loops 256 times per pixel.  
   * **Sampling:** At every step, it samples the 3D texture density. High density \= High Opacity.

## **3\. Core Features (Implemented)**

* **Volumetric Loader:** Parses custom binary protocol with 40-byte headers.  
* **Slicing Tools:** X, Y, Z clipping planes implemented in GLSL.  
* **Transfer Functions:** Maps data intensity to opacity (e.g., hiding empty space).

## **4\. How to Run (Visualization Only)**

\# 1\. Start the Data Server  
cd backend  
python \-m uvicorn app.main:app \--reload

\# 2\. Start the Viewer  
cd frontend  
npm run dev

**Outcome:** You will see a "Ghostly" grey brain model that you can rotate and slice.