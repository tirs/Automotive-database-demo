"""Anomaly detection schemas."""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from .common import Severity


class ServiceRecordData(BaseModel):
    """Service record data for anomaly detection."""
    service_record_id: str
    vehicle_id: str
    service_date: date
    service_type: str
    total_cost: float
    labor_cost: float
    parts_cost: Optional[float] = 0
    parts_count: int = 0
    labor_hours: Optional[float] = None
    service_center_id: Optional[str] = None


class CostAnomaly(BaseModel):
    """Detected cost anomaly."""
    service_record_id: str
    vehicle_id: str
    anomaly_type: str
    anomaly_score: float = Field(..., ge=-1, le=1)
    severity: Severity
    expected_cost: float
    actual_cost: float
    deviation_percentage: float
    explanation: str
    recommendations: list[str] = []


class AnomalyDetectionRequest(BaseModel):
    """Request for anomaly detection."""
    service_records: list[ServiceRecordData]


class AnomalyDetectionResponse(BaseModel):
    """Response with detected anomalies."""
    anomalies: list[CostAnomaly]
    total_records_analyzed: int
    anomalies_found: int
    analysis_timestamp: str
    model_version: str

