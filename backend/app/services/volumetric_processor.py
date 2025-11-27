"""
Volumetric data processor for NIfTI files
Handles normalization, binary packing, and custom protocol generation
"""
import numpy as np
from typing import Tuple, Optional
import struct


class VolumetricProcessor:
    """
    Processes NIfTI files into custom binary format for web rendering.
    
    Process:
    1. Load NIfTI file
    2. Normalize intensity values to 0.0-1.0
    3. Pack into binary format with 40-byte header
    """
    
    def __init__(self):
        self.data_cache = {}  # Cache processed volumes
    
    def load_nifti(self, file_path: str) -> np.ndarray:
        """
        Load a NIfTI file and return as numpy array.
        
        Args:
            file_path: Path to .nii or .nii.gz file
            
        Returns:
            3D numpy array of voxel data
        """
        from app.services.nifti_loader import load_nifti_file
        data, _ = load_nifti_file(file_path)
        return data
    
    def normalize(self, data: np.ndarray) -> np.ndarray:
        """
        Normalize voxel intensities to 0.0-1.0 range.
        
        Args:
            data: Raw voxel data from MRI scanner
            
        Returns:
            Normalized array (float32, 0.0-1.0)
        """
        # Remove NaN and infinite values
        data = np.nan_to_num(data, nan=0.0, posinf=0.0, neginf=0.0)
        
        # Normalize to 0-1 range
        data_min = np.min(data)
        data_max = np.max(data)
        
        if data_max > data_min:
            normalized = (data - data_min) / (data_max - data_min)
        else:
            normalized = np.zeros_like(data)
        
        return normalized.astype(np.float32)
    
    def pack_binary(self, data: np.ndarray) -> bytes:
        """
        Pack normalized 3D array into custom binary format.
        
        Binary Format:
        - Header (40 bytes):
          * width (uint32, 4 bytes)
          * height (uint32, 4 bytes)
          * depth (uint32, 4 bytes)
          * data_type (uint32, 4 bytes) - 1 = float32
          * reserved (28 bytes, zeros)
        - Data: float32 array (width * height * depth * 4 bytes)
        
        Args:
            data: Normalized 3D array (float32)
            
        Returns:
            Binary blob ready for transmission
        """
        height, width, depth = data.shape
        
        # Create 40-byte header
        header = struct.pack(
            '>IIII',  # Big-endian uint32 for each dimension
            width,
            height,
            depth,
            1  # data_type: 1 = float32
        )
        # Pad header to 40 bytes
        header += b'\x00' * (40 - len(header))
        
        # Flatten and pack data as float32
        data_flat = data.flatten(order='C')  # C-order (row-major)
        data_bytes = data_flat.tobytes()
        
        return header + data_bytes
    
    def process_file(self, file_path: str) -> bytes:
        """
        Complete processing pipeline: load -> normalize -> pack.
        
        Args:
            file_path: Path to NIfTI file
            
        Returns:
            Binary blob in custom format
        """
        # Load
        raw_data = self.load_nifti(file_path)
        
        # Normalize
        normalized = self.normalize(raw_data)
        
        # Pack
        binary_blob = self.pack_binary(normalized)
        
        return binary_blob
    
    def get_dimensions(self, file_path: str) -> Tuple[int, int, int]:
        """
        Get dimensions of a NIfTI file without full processing.
        
        Returns:
            (width, height, depth) tuple
        """
        data = self.load_nifti(file_path)
        return data.shape[::-1]  # Return as (width, height, depth)

