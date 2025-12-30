"""AI Insights API Router."""
from fastapi import APIRouter
from typing import Optional

from app.schemas.insights import (
    AIInsight,
    InsightGenerationRequest,
    InsightGenerationResponse
)
from app.services.insights import ai_insights_service

router = APIRouter()


@router.post("/generate", response_model=InsightGenerationResponse)
async def generate_insights(request: InsightGenerationRequest):
    """
    Generate AI-powered insights.
    
    Analyzes fleet data to produce insights about:
    - Cost trends
    - Maintenance patterns
    - Fleet health
    - Anomalies
    - Optimization recommendations
    """
    return await ai_insights_service.generate(request)


@router.get("/active", response_model=list[AIInsight])
async def get_active_insights():
    """Get currently active insights."""
    return await ai_insights_service.get_active_insights()


@router.get("/types")
async def get_insight_types():
    """Get available insight types."""
    return {
        "insight_types": [
            {
                "type": "cost_trend",
                "category": "financial",
                "description": "Trends in service and operational costs"
            },
            {
                "type": "maintenance_pattern",
                "category": "maintenance",
                "description": "Patterns in maintenance needs and schedules"
            },
            {
                "type": "fleet_health",
                "category": "operations",
                "description": "Overall fleet status and compliance"
            },
            {
                "type": "anomaly",
                "category": "financial",
                "description": "Detected anomalies in costs or patterns"
            },
            {
                "type": "recommendation",
                "category": "optimization",
                "description": "Recommendations for improvement"
            },
            {
                "type": "compliance",
                "category": "regulatory",
                "description": "Compliance and regulatory insights"
            }
        ]
    }


@router.get("/demo")
async def demo_insights():
    """
    Demo endpoint showing AI insight generation.
    
    Returns sample insights for demonstration.
    """
    # Generate insights with default parameters
    request = InsightGenerationRequest(time_range_days=30)
    result = await ai_insights_service.generate(request)
    
    return {
        "insights": result.insights,
        "metadata": {
            "total_generated": result.total_generated,
            "generation_time_ms": result.generation_time_ms,
            "data_analyzed": result.data_analyzed
        },
        "note": "These insights are generated from mock data analysis"
    }


@router.post("/by-type", response_model=InsightGenerationResponse)
async def get_insights_by_type(insight_types: list[str]):
    """Generate insights filtered by specific types."""
    request = InsightGenerationRequest(insight_types=insight_types)
    return await ai_insights_service.generate(request)

