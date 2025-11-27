"""
FastAPI application for NeuroScan Layer 1 - Volumetric Data Server
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import volumetric

app = FastAPI(
    title="NeuroScan API",
    description="Volumetric visualization data server",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite/React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(volumetric.router, prefix="/api", tags=["volumetric"])


@app.get("/")
async def root():
    return {"message": "NeuroScan Layer 1 API", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}

