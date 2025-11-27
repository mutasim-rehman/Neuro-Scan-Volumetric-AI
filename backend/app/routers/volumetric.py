"""
Volumetric data endpoints for serving processed NIfTI files
"""
from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import Response
from typing import Optional
from app.services.volumetric_processor import VolumetricProcessor
from app.services.file_storage import FileStorage

router = APIRouter()
processor = VolumetricProcessor()
file_storage = FileStorage()


@router.get("/volumetric/{file_id}")
async def get_volumetric_data(file_id: str):
    """
    Serve volumetric data in custom binary format with 40-byte header.
    
    Binary Format:
    - Header (40 bytes): width, height, depth (uint32 each), data_type (uint32), reserved (28 bytes)
    - Data: float32 array of normalized voxel values (0.0-1.0)
    """
    try:
        # Get file path from storage
        file_path = file_storage.get_file_path(file_id)
        if not file_path:
            raise HTTPException(status_code=404, detail=f"File {file_id} not found")
        
        # Process file (with caching)
        binary_blob = processor.process_file(file_path, cache_key=file_id)
        
        # Return binary response
        return Response(
            content=binary_blob,
            media_type="application/octet-stream",
            headers={
                "Content-Disposition": f'attachment; filename="volume_{file_id}.bin"'
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


@router.post("/volumetric/upload")
async def upload_volumetric_file(file: UploadFile = File(...)):
    """
    Upload and process a NIfTI file (.nii or .nii.gz)
    Returns the file_id for subsequent requests
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
        
        # Save file and get file_id
        file_id = file_storage.save_file(file_content, file.filename)
        
        # Pre-process and cache the file
        file_path = file_storage.get_file_path(file_id)
        processor.process_file(file_path, cache_key=file_id)
        
        return {
            "file_id": file_id,
            "filename": file.filename,
            "message": "File uploaded and processed successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")


@router.get("/volumetric/list")
async def list_available_files():
    """
    List all available volumetric files
    """
    try:
        files = file_storage.list_files()
        return {"files": files, "count": len(files)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

