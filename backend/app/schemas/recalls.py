"""Recall schemas."""
from pydantic import BaseModel
from typing import Optional
from datetime import date
from .common import Severity


class RecallInfo(BaseModel):
    """Recall information."""
    recall_number: str
    manufacturer: str
    component: str
    summary: str
    consequence: str
    remedy: str
    recall_date: Optional[date] = None
    severity: Severity = Severity.WARNING


class VehicleRecallMatch(BaseModel):
    """Vehicle matched with recalls."""
    vehicle_id: str
    vin: str
    manufacturer: str
    model: str
    year: int
    recalls: list[RecallInfo]
    priority: str
    total_recalls: int


class RecallCheckRequest(BaseModel):
    """Request to check recalls for vehicles."""
    vehicles: list[dict]


class RecallCheckResponse(BaseModel):
    """Response with recall matches."""
    matches: list[VehicleRecallMatch]
    total_vehicles_checked: int
    vehicles_with_recalls: int
    total_recalls_found: int
    checked_at: str

