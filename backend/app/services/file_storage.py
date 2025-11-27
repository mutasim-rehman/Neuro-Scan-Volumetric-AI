"""
File storage service for managing uploaded NIfTI files
"""
import os
import uuid
from pathlib import Path
from typing import Dict, Optional
import shutil


class FileStorage:
    """
    Manages storage and retrieval of uploaded NIfTI files.
    """
    
    def __init__(self, storage_dir: str = "data/uploads"):
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(parents=True, exist_ok=True)
        self.file_registry: Dict[str, Dict] = {}  # file_id -> metadata
        
        # Load existing files from disk on startup
        self._load_existing_files()
    
    def _load_existing_files(self):
        """Load file registry from existing files in storage directory."""
        for file_path in self.storage_dir.glob("*.nii*"):
            file_id = file_path.stem
            if file_id not in self.file_registry:
                self.file_registry[file_id] = {
                    "file_id": file_id,
                    "filename": file_path.name,
                    "file_path": str(file_path),
                    "size": file_path.stat().st_size if file_path.exists() else 0
                }
    
    def save_file(self, file_content: bytes, filename: str) -> str:
        """
        Save uploaded file and return unique file_id.
        
        Args:
            file_content: Raw file bytes
            filename: Original filename
            
        Returns:
            Unique file_id for retrieval
        """
        file_id = str(uuid.uuid4())
        file_path = self.storage_dir / f"{file_id}.nii.gz"
        
        # Save file
        with open(file_path, 'wb') as f:
            f.write(file_content)
        
        # Register file
        self.file_registry[file_id] = {
            "file_id": file_id,
            "filename": filename,
            "file_path": str(file_path),
            "size": len(file_content)
        }
        
        return file_id
    
    def get_file_path(self, file_id: str) -> Optional[str]:
        """
        Get file path for a given file_id.
        
        Args:
            file_id: Unique file identifier
            
        Returns:
            File path if exists, None otherwise
        """
        if file_id in self.file_registry:
            return self.file_registry[file_id]["file_path"]
        return None
    
    def list_files(self) -> list:
        """
        List all registered files.
        
        Returns:
            List of file metadata dictionaries
        """
        return list(self.file_registry.values())
    
    def delete_file(self, file_id: str) -> bool:
        """
        Delete a file and its registration.
        
        Args:
            file_id: Unique file identifier
            
        Returns:
            True if deleted, False if not found
        """
        if file_id not in self.file_registry:
            return False
        
        file_path = Path(self.file_registry[file_id]["file_path"])
        if file_path.exists():
            file_path.unlink()
        
        del self.file_registry[file_id]
        return True

