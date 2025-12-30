"""Valuation schemas."""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from .common import ConfidenceLevel


class ValuationRequest(BaseModel):
    """Request for vehicle valuation."""
    vehicle_id: str
    vin: Optional[str] = None
    manufacturer: str
    model: str
    year: int
    mileage: int
    vehicle_type: str = "sedan"
    condition: str = "good"
    purchase_price: Optional[float] = None
    accident_count: int = 0
    service_record_count: int = 0


class DepreciationFactor(BaseModel):
    """Individual depreciation factor."""
    factor_name: str
    adjustment_percent: float
    description: str


class ValuationResponse(BaseModel):
    """Vehicle valuation result."""
    vehicle_id: str
    estimated_value: float
    value_low: float
    value_high: float
    confidence_level: ConfidenceLevel
    market_condition: str
    valuation_date: date
    depreciation_factors: list[DepreciationFactor]
    comparable_vehicles: list[dict] = []
    value_trend: str  # increasing, stable, decreasing
    notes: Optional[str] = None

