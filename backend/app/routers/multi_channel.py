"""
Multi-channel MRI endpoints for Layer 2 integration
"""
from fastapi import APIRouter, HTTPException
from typing import Dict, List
from app.services.multi_channel_processor import MultiChannelProcessor

router = APIRouter()
multi_channel_processor = MultiChannelProcessor()


@router.post("/multi-channel/create")
async def create_channel_group(channels: Dict[str, str]):
    """
    Create a multi-channel group from uploaded files.
    
    Expected channels: T1, T1ce, T2, FLAIR
    Example:
    {
        "T1": "file_id_1",
        "T1ce": "file_id_2",
        "T2": "file_id_3",
        "FLAIR": "file_id_4"
    }
    """
    try:
        # Validate required channels
        required_channels = ["T1", "T1ce", "T2", "FLAIR"]
        for channel in required_channels:
            if channel not in channels:
                raise HTTPException(
                    status_code=400,
                    detail=f"Missing required channel: {channel}"
                )
        
        group_id = multi_channel_processor.create_channel_group(channels)
        return {
            "group_id": group_id,
            "channels": channels,
            "message": "Channel group created successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/multi-channel/list")
async def list_channel_groups():
    """List all channel groups."""
    try:
        groups = multi_channel_processor.list_channel_groups()
        return {"groups": groups, "count": len(groups)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/multi-channel/{group_id}")
async def get_channel_group(group_id: str):
    """Get channel group details."""
    try:
        group = multi_channel_processor.get_channel_group(group_id)
        if not group:
            raise HTTPException(status_code=404, detail=f"Channel group {group_id} not found")
        return {"group_id": group_id, "channels": group}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/multi-channel/{group_id}")
async def delete_channel_group(group_id: str):
    """Delete a channel group."""
    try:
        deleted = multi_channel_processor.delete_channel_group(group_id)
        if not deleted:
            raise HTTPException(status_code=404, detail=f"Channel group {group_id} not found")
        return {"message": f"Channel group {group_id} deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

