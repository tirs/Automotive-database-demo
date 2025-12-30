"""Document processing schemas."""
from pydantic import BaseModel
from typing import Optional
from datetime import date


class DocumentProcessRequest(BaseModel):
    """Request to process a document."""
    document_id: str
    vehicle_id: Optional[str] = None
    document_type: str  # service_receipt, insurance_card, registration, title
    file_url: Optional[str] = None
    base64_content: Optional[str] = None


class ExtractedField(BaseModel):
    """Extracted field from document."""
    field_name: str
    value: str
    confidence: float
    bounding_box: Optional[dict] = None


class ServiceReceiptData(BaseModel):
    """Extracted service receipt data."""
    service_date: Optional[date] = None
    vehicle_vin: Optional[str] = None
    license_plate: Optional[str] = None
    service_center: Optional[str] = None
    service_type: Optional[str] = None
    labor_cost: Optional[float] = None
    parts: list[dict] = []
    total_cost: Optional[float] = None
    next_service_date: Optional[date] = None
    next_service_mileage: Optional[int] = None
    odometer_reading: Optional[int] = None


class InsuranceCardData(BaseModel):
    """Extracted insurance card data."""
    policy_number: Optional[str] = None
    insurance_company: Optional[str] = None
    insured_name: Optional[str] = None
    vehicle_vin: Optional[str] = None
    effective_date: Optional[date] = None
    expiration_date: Optional[date] = None
    coverage_type: Optional[str] = None


class DocumentProcessResponse(BaseModel):
    """Response with processed document data."""
    document_id: str
    document_type: str
    processing_status: str  # success, partial, failed
    confidence_score: float
    extracted_fields: list[ExtractedField]
    structured_data: Optional[dict] = None
    raw_text: Optional[str] = None
    warnings: list[str] = []
    processing_time_ms: int

