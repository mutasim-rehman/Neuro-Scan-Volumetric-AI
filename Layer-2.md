# **NeuroScan Layer 2: The AI Oncologist**

**Goal:** Automate the detection and segmentation of brain tumors using 3D Deep Learning.

## **1\. Overview**

Layer 2 is the intelligence system. It takes the multi-channel MRI data visualized in Layer 1 and performs **Semantic Segmentation**. It answers the question: *"Which specific voxels contain cancer?"*

**Key Technology:** PyTorch, MONAI (Medical Open Network for AI), SegResNet.

## **2\. The 3-Phase Pipeline**

### **Phase A: Training (The Knowledge)**

* **Dataset:** BraTS 2021 (Brain Tumor Segmentation Challenge).  
* **Input Data:** 4 Channels per patient (T1, T1ce, T2, FLAIR).  
* **Architecture:** **SegResNet** (an encoder-decoder architecture optimized for volumetric data).  
* **Loss Function:** DiceLoss (to handle class imbalance—tumors are small compared to the brain).  
* **Output:** We produce a "Model Bundle" (.pt file) containing the learned weights.

### **Phase B: Testing / Validation (The Verification)**

* **Metric:** **Dice Score** (Intersection over Union).  
* **Target:** \> 0.85 Dice Score on the validation set.  
* **Process:** We run the model on unseen patient data and compare the AI's mask against a Radiologist's manual segmentation.

### **Phase C: Inference / Prediction (The Application)**

This is the "Production" phase integrated into the app.

1. **Ingestion:** User uploads 4 MRI files via the UI.  
2. **Preprocessing:** Data is stacked into a (4, 128, 128, 128\) tensor.  
3. **Inference:** The model scans the tensor using **Sliding Window Inference** to handle memory constraints.  
4. **Post-Processing:** The output probabilities are thresholded (e.g., \> 50% confidence) to create a binary mask.  
5. **Handoff:** The mask is sent to Layer 1 (Frontend) to be rendered as a **Red Overlay** inside the brain.

## **3\. Implementation Details**

* **Model Source:** We utilize the brats\_mri\_segmentation bundle from the MONAI Model Zoo to ensure industry-standard performance.  
* **Classes:**  
  * **Label 1 (Red):** Necrotic Tumor Core.  
  * **Label 2 (Green):** Peritumoral Edema (Swelling).  
  * **Label 4 (Yellow):** Enhancing Tumor (Active Cancer).

## **4\. How to Run (Inference)**

\# 1\. Download the Pre-trained Model  
cd backend  
python \-m app.models.download\_bundle

\# 2\. Run Prediction on Sample Data  
\# (Assuming server is running)  
curl \-X POST http://localhost:8000/api/inference/segment \\  
     \-H "Content-Type: application/json" \\  
     \-d '{"file\_path": "data/sample\_001/flair.nii.gz"}'  
