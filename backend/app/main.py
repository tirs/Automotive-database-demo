"""FastAPI Application for Automotive AI Services."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import (
    vin_decoder,
    predictions,
    recalls,
    valuations,
    anomalies,
    documents,
    search,
    workflows,
    insights,
    notifications
)

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-powered automotive database management services",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(vin_decoder.router, prefix="/api/vin", tags=["VIN Decoder"])
app.include_router(predictions.router, prefix="/api/predictions", tags=["Predictions"])
app.include_router(recalls.router, prefix="/api/recalls", tags=["Recalls"])
app.include_router(valuations.router, prefix="/api/valuations", tags=["Valuations"])
app.include_router(anomalies.router, prefix="/api/anomalies", tags=["Anomaly Detection"])
app.include_router(documents.router, prefix="/api/documents", tags=["Document Processing"])
app.include_router(search.router, prefix="/api/search", tags=["Natural Language Search"])
app.include_router(workflows.router, prefix="/api/workflows", tags=["Workflow Automation"])
app.include_router(insights.router, prefix="/api/insights", tags=["AI Insights"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "running",
        "mock_mode": settings.use_mock_apis,
        "endpoints": {
            "docs": "/docs",
            "vin_decoder": "/api/vin",
            "predictions": "/api/predictions",
            "recalls": "/api/recalls",
            "valuations": "/api/valuations",
            "anomalies": "/api/anomalies",
            "documents": "/api/documents",
            "search": "/api/search",
            "workflows": "/api/workflows",
            "insights": "/api/insights",
            "notifications": "/api/notifications"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "version": settings.app_version
    }

