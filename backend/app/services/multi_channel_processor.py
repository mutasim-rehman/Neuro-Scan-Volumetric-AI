"""
Multi-channel MRI processor for handling T1, T1ce, T2, FLAIR sequences
"""
from typing import Dict, List, Optional
import numpy as np
from app.services.volumetric_processor import VolumetricProcessor
from app.services.file_storage import FileStorage


class MultiChannelProcessor:
    """
    Manages multi-channel MRI data for Layer 2 integration.
    Handles grouping of T1, T1ce, T2, FLAIR sequences.
    """
    
    def __init__(self):
        self.processor = VolumetricProcessor()
        self.channel_groups: Dict[str, Dict[str, str]] = {}  # group_id -> {T1: file_id, T1ce: file_id, ...}
    
    def create_channel_group(self, channels: Dict[str, str]) -> str:
        """
        Create a channel group from uploaded files.
        
        Args:
            channels: Dictionary mapping channel names to file_ids
                     e.g., {"T1": "file_id_1", "T1ce": "file_id_2", "T2": "file_id_3", "FLAIR": "file_id_4"}
        
        Returns:
            Group ID for the channel set
        """
        import uuid
        group_id = str(uuid.uuid4())
        
        # Validate all channels exist
        file_storage = FileStorage()
        for channel_name, file_id in channels.items():
            if not file_storage.get_file_path(file_id):
                raise ValueError(f"File {file_id} for channel {channel_name} not found")
        
        self.channel_groups[group_id] = channels
        return group_id
    
    def get_channel_group(self, group_id: str) -> Optional[Dict[str, str]]:
        """Get channel group by ID."""
        return self.channel_groups.get(group_id)
    
    def list_channel_groups(self) -> List[Dict]:
        """List all channel groups with metadata."""
        result = []
        for group_id, channels in self.channel_groups.items():
            result.append({
                "group_id": group_id,
                "channels": channels,
                "channel_count": len(channels)
            })
        return result
    
    def delete_channel_group(self, group_id: str) -> bool:
        """Delete a channel group."""
        if group_id in self.channel_groups:
            del self.channel_groups[group_id]
            return True
        return False

