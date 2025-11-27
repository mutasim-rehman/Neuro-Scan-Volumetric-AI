"""
Segmentation mask endpoints for Layer 2 integration
"""
from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import Response
from typing import Optional
from app.services.volumetric_processor import VolumetricProcessor
from app.services.file_storage import FileStorage

router = APIRouter()
processor = VolumetricProcessor()
file_storage = FileStorage()


@router.post("/segmentation/upload")
async def upload_segmentation_mask(
    file: UploadFile = File(...),
    base_file_id: Optional[str] = None
):
    """
    Upload a segmentation mask (from Layer 2).
    The mask should be a NIfTI file with integer labels.
    
    Args:
        file: Segmentation mask file (.nii or .nii.gz)
        base_file_id: Optional reference to the base volume this mask applies to
    """
    try:
        # Validate file extension
        filename = file.filename.lower()
        if not (filename.endswith('.nii') or filename.endswith('.nii.gz')):
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Only .nii and .nii.gz files are supported."
            )
        
        # Read file content
        file_content = await file.read()
        
        if len(file_content) == 0:
            raise HTTPException(status_code=400, detail="Empty file")
        
        # Save file with special prefix for masks
        import uuid
        mask_id = f"mask_{uuid.uuid4()}"
        file_path = file_storage.storage_dir / f"{mask_id}.nii.gz"
        
        with open(file_path, 'wb') as f:
            f.write(file_content)
        
        # Register as mask
        file_storage.file_registry[mask_id] = {
            "file_id": mask_id,
            "filename": file.filename,
            "file_path": str(file_path),
            "size": len(file_content),
            "type": "segmentation_mask",
            "base_file_id": base_file_id
        }
        
        # Process mask (normalize labels to 0-1 range for visualization)
        binary_blob = processor.process_file(str(file_path), cache_key=mask_id)
        
        return {
            "mask_id": mask_id,
            "filename": file.filename,
            "base_file_id": base_file_id,
            "message": "Segmentation mask uploaded and processed successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading mask: {str(e)}")


@router.get("/segmentation/{mask_id}")
async def get_segmentation_mask(mask_id: str):
    """
    Get segmentation mask data in binary format.
    """
    try:
        file_path = file_storage.get_file_path(mask_id)
        if not file_path:
            raise HTTPException(status_code=404, detail=f"Mask {mask_id} not found")
        
        # Process mask (with caching)
        binary_blob = processor.process_file(file_path, cache_key=mask_id)
        
        return Response(
            content=binary_blob,
            media_type="application/octet-stream",
            headers={
                "Content-Disposition": f'attachment; filename="mask_{mask_id}.bin"'
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing mask: {str(e)}")

