"""Prediction schemas."""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from .common import RiskLevel, ConfidenceLevel


class VehicleData(BaseModel):
    """Vehicle data for predictions."""
    vehicle_id: str
    vin: Optional[str] = None
    manufacturer: Optional[str] = None
    model: Optional[str] = None
    year: int
    mileage: int
    last_service_date: Optional[date] = None
    last_service_type: Optional[str] = None
    last_service_mileage: Optional[int] = None
    vehicle_type: Optional[str] = "sedan"
    age_years: Optional[int] = None


class MaintenancePrediction(BaseModel):
    """Maintenance prediction result."""
    vehicle_id: str
    predicted_service_date: date
    predicted_mileage: Optional[int] = None
    recommended_service_type: str
    confidence_score: float = Field(..., ge=0, le=1)
    risk_level: RiskLevel
    estimated_cost: Optional[float] = None
    prediction_reason: str
    urgency_days: int
    components_at_risk: list[str] = []


class MaintenancePredictionRequest(BaseModel):
    """Request for maintenance prediction."""
    vehicles: list[VehicleData]


class MaintenancePredictionResponse(BaseModel):
    """Response with maintenance predictions."""
    predictions: list[MaintenancePrediction]
    model_version: str
    generated_at: str

