"""AI Insights schemas."""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .common import Severity


class AIInsight(BaseModel):
    """AI-generated insight."""
    id: str
    insight_type: str  # cost_trend, maintenance_pattern, fleet_health, anomaly, recommendation
    category: str
    title: str
    summary: str
    details: Optional[dict] = None
    affected_vehicle_count: int = 0
    severity: Severity
    confidence_score: float
    action_recommended: Optional[str] = None
    action_url: Optional[str] = None
    created_at: datetime
    expires_at: Optional[datetime] = None


class InsightGenerationRequest(BaseModel):
    """Request to generate insights."""
    vehicle_ids: Optional[list[str]] = None  # None means all vehicles
    insight_types: Optional[list[str]] = None  # None means all types
    time_range_days: int = 30


class InsightGenerationResponse(BaseModel):
    """Response with generated insights."""
    insights: list[AIInsight]
    total_generated: int
    generation_time_ms: int
    data_analyzed: dict

