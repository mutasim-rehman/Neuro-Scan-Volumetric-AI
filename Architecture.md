# **NeuroScan: Full Stack Architecture**

NeuroScan is composed of two distinct but integrated engineering layers.

| Layer | Focus | Key Tech | Status |
| :---- | :---- | :---- | :---- |
| **Layer 1** | **Visualization** | React, Three.js, GLSL, WebGL | \- |
| **Layer 2** | **Artificial Intelligence** | PyTorch, MONAI, 3D U-Net | \- |

## **How the Layers Interact**

1. **Layer 1** displays the **Anatomy** (The "Context").  
2. **Layer 2** generates the **Pathology** (The "Insight").  
3. The frontend compositor blends them: FinalPixel \= AnatomyColor \* (1 \- TumorAlpha) \+ TumorColor \* TumorAlpha.

See individual README files for deep dives into each layer:

* [Layer 1 Documentation](https://www.google.com/search?q=./README_LAYER_1_VISUALIZATION.md)  
* [Layer 2 Documentation](https://www.google.com/search?q=./README_LAYER_2_AI_PIPELINE.md)