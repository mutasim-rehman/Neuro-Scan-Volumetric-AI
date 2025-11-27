"""
NIfTI file loader using nibabel
This module handles loading .nii and .nii.gz files
"""
import nibabel as nib
import numpy as np
from typing import Tuple


def load_nifti_file(file_path: str) -> Tuple[np.ndarray, Tuple[int, int, int]]:
    """
    Load a NIfTI file and return the data array and dimensions.
    
    Args:
        file_path: Path to .nii or .nii.gz file
        
    Returns:
        Tuple of (data_array, (width, height, depth))
        Note: NIfTI dimensions may need axis reordering depending on orientation
    """
    try:
        img = nib.load(file_path)
        data = img.get_fdata()
        
        # Get dimensions - NIfTI uses (x, y, z) convention typically
        # But numpy arrays are indexed as (z, y, x) or (y, x, z) depending on orientation
        # For now, we'll use the raw shape and let the processor handle it
        shape = data.shape
        
        # If 4D (with time/channel dimension), take first volume
        if len(shape) == 4:
            data = data[:, :, :, 0]
            shape = data.shape
        
        return data, shape
    except Exception as e:
        raise ValueError(f"Failed to load NIfTI file {file_path}: {str(e)}")

