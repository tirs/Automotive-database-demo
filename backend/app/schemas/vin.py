"""VIN decoder schemas."""
from pydantic import BaseModel, Field
from typing import Optional


class VINDecodeRequest(BaseModel):
    """Request to decode a VIN."""
    vin: str = Field(..., min_length=17, max_length=17, description="17-character VIN")


class VINDecodeResponse(BaseModel):
    """Decoded VIN information."""
    vin: str
    manufacturer: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    vehicle_type: Optional[str] = None
    body_class: Optional[str] = None
    engine_size: Optional[str] = None
    fuel_type: Optional[str] = None
    transmission: Optional[str] = None
    drive_type: Optional[str] = None
    doors: Optional[int] = None
    plant_city: Optional[str] = None
    plant_country: Optional[str] = None
    is_valid: bool = True
    error_message: Optional[str] = None


class VINValidationResponse(BaseModel):
    """VIN validation result."""
    vin: str
    is_valid: bool
    error_message: Optional[str] = None
    decoded_data: Optional[VINDecodeResponse] = None

