"""Mock Document Processing Service.

Simulates OCR and document data extraction.
"""
from datetime import date, timedelta
import random
import re
from typing import Optional

from app.schemas.documents import (
    DocumentProcessRequest,
    DocumentProcessResponse,
    ExtractedField,
    ServiceReceiptData,
    InsuranceCardData
)


# Mock OCR text templates
MOCK_SERVICE_RECEIPT = """
AUTOMOTIVE SERVICE CENTER
123 Main Street, Detroit, MI 48201
Phone: (313) 555-0123

Date: {date}
Invoice #: INV-{invoice_num}

Customer Vehicle:
VIN: {vin}
License Plate: {plate}
Odometer: {odometer} miles

Services Performed:
- Oil Change & Filter         $49.99
- Tire Rotation               $29.99
- Multi-point Inspection      $0.00
- Brake Fluid Flush           $89.99

Labor (2.5 hours @ $95/hr):   $237.50

Parts Total:                  $169.97
Labor Total:                  $237.50
Tax:                          $32.60
------------------------
TOTAL:                        $440.07

Next Service Due: {next_date}
Next Service At: {next_mileage} miles

Thank you for your business!
"""

MOCK_INSURANCE_CARD = """
INSURANCE IDENTIFICATION CARD
{company}

Policy Number: {policy_num}
Effective: {start_date}
Expires: {end_date}

Insured: {insured_name}
Vehicle: {year} {make} {model}
VIN: {vin}

Coverage: {coverage_type}

For claims call: 1-800-555-0199
"""


def _generate_mock_vin() -> str:
    """Generate a realistic mock VIN."""
    chars = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789"
    return "1G1" + "".join(random.choices(chars, k=14))


def _extract_mock_service_receipt(
    document_id: str
) -> DocumentProcessResponse:
    """Generate mock extracted data from a service receipt."""
    today = date.today()
    mock_date = today - timedelta(days=random.randint(1, 30))
    next_service = today + timedelta(days=random.randint(60, 120))
    odometer = random.randint(30000, 80000)
    
    mock_text = MOCK_SERVICE_RECEIPT.format(
        date=mock_date.strftime("%m/%d/%Y"),
        invoice_num=random.randint(10000, 99999),
        vin=_generate_mock_vin(),
        plate=f"ABC-{random.randint(1000, 9999)}",
        odometer=f"{odometer:,}",
        next_date=next_service.strftime("%m/%d/%Y"),
        next_mileage=f"{odometer + 5000:,}"
    )
    
    extracted_fields = [
        ExtractedField(
            field_name="service_date",
            value=mock_date.isoformat(),
            confidence=0.95
        ),
        ExtractedField(
            field_name="invoice_number",
            value=f"INV-{random.randint(10000, 99999)}",
            confidence=0.92
        ),
        ExtractedField(
            field_name="vehicle_vin",
            value=_generate_mock_vin(),
            confidence=0.88
        ),
        ExtractedField(
            field_name="odometer",
            value=str(odometer),
            confidence=0.90
        ),
        ExtractedField(
            field_name="total_cost",
            value="440.07",
            confidence=0.94
        ),
        ExtractedField(
            field_name="labor_cost",
            value="237.50",
            confidence=0.91
        ),
        ExtractedField(
            field_name="service_center",
            value="Automotive Service Center",
            confidence=0.97
        ),
        ExtractedField(
            field_name="next_service_date",
            value=next_service.isoformat(),
            confidence=0.85
        ),
    ]
    
    structured_data = {
        "service_date": mock_date.isoformat(),
        "vehicle_vin": extracted_fields[2].value,
        "license_plate": f"ABC-{random.randint(1000, 9999)}",
        "service_center": "Automotive Service Center",
        "service_type": "maintenance",
        "labor_cost": 237.50,
        "parts": [
            {"name": "Oil Change & Filter", "cost": 49.99},
            {"name": "Tire Rotation", "cost": 29.99},
            {"name": "Multi-point Inspection", "cost": 0.00},
            {"name": "Brake Fluid Flush", "cost": 89.99},
        ],
        "total_cost": 440.07,
        "next_service_date": next_service.isoformat(),
        "next_service_mileage": odometer + 5000,
        "odometer_reading": odometer
    }
    
    return DocumentProcessResponse(
        document_id=document_id,
        document_type="service_receipt",
        processing_status="success",
        confidence_score=0.91,
        extracted_fields=extracted_fields,
        structured_data=structured_data,
        raw_text=mock_text,
        warnings=[],
        processing_time_ms=random.randint(800, 2500)
    )


def _extract_mock_insurance_card(
    document_id: str
) -> DocumentProcessResponse:
    """Generate mock extracted data from an insurance card."""
    today = date.today()
    start_date = today - timedelta(days=random.randint(30, 180))
    end_date = start_date + timedelta(days=365)
    
    companies = [
        "State Farm Insurance",
        "Progressive Insurance",
        "GEICO",
        "Allstate Insurance",
        "Liberty Mutual"
    ]
    
    coverage_types = [
        "Full Coverage",
        "Liability Only",
        "Comprehensive"
    ]
    
    makes = ["Toyota", "Honda", "Ford", "Chevrolet", "BMW"]
    models = ["Camry", "Civic", "F-150", "Malibu", "3 Series"]
    
    company = random.choice(companies)
    coverage = random.choice(coverage_types)
    make = random.choice(makes)
    model = random.choice(models)
    year = random.randint(2018, 2024)
    vin = _generate_mock_vin()
    
    mock_text = MOCK_INSURANCE_CARD.format(
        company=company,
        policy_num=f"POL-{random.randint(100000, 999999)}",
        start_date=start_date.strftime("%m/%d/%Y"),
        end_date=end_date.strftime("%m/%d/%Y"),
        insured_name="John A. Smith",
        year=year,
        make=make,
        model=model,
        vin=vin,
        coverage_type=coverage
    )
    
    extracted_fields = [
        ExtractedField(
            field_name="insurance_company",
            value=company,
            confidence=0.96
        ),
        ExtractedField(
            field_name="policy_number",
            value=f"POL-{random.randint(100000, 999999)}",
            confidence=0.93
        ),
        ExtractedField(
            field_name="effective_date",
            value=start_date.isoformat(),
            confidence=0.90
        ),
        ExtractedField(
            field_name="expiration_date",
            value=end_date.isoformat(),
            confidence=0.91
        ),
        ExtractedField(
            field_name="insured_name",
            value="John A. Smith",
            confidence=0.94
        ),
        ExtractedField(
            field_name="vehicle_vin",
            value=vin,
            confidence=0.87
        ),
        ExtractedField(
            field_name="coverage_type",
            value=coverage,
            confidence=0.89
        ),
    ]
    
    structured_data = {
        "policy_number": extracted_fields[1].value,
        "insurance_company": company,
        "insured_name": "John A. Smith",
        "vehicle_vin": vin,
        "effective_date": start_date.isoformat(),
        "expiration_date": end_date.isoformat(),
        "coverage_type": coverage
    }
    
    return DocumentProcessResponse(
        document_id=document_id,
        document_type="insurance_card",
        processing_status="success",
        confidence_score=0.92,
        extracted_fields=extracted_fields,
        structured_data=structured_data,
        raw_text=mock_text,
        warnings=[],
        processing_time_ms=random.randint(600, 1800)
    )


class DocumentProcessingService:
    """Mock document processing service."""
    
    async def process(
        self, request: DocumentProcessRequest
    ) -> DocumentProcessResponse:
        """Process a document and extract data."""
        doc_type = request.document_type.lower()
        
        if "receipt" in doc_type or "service" in doc_type:
            return _extract_mock_service_receipt(request.document_id)
        elif "insurance" in doc_type:
            return _extract_mock_insurance_card(request.document_id)
        elif "registration" in doc_type:
            # Simplified registration extraction
            return DocumentProcessResponse(
                document_id=request.document_id,
                document_type="registration",
                processing_status="success",
                confidence_score=0.88,
                extracted_fields=[
                    ExtractedField(
                        field_name="vehicle_vin",
                        value=_generate_mock_vin(),
                        confidence=0.90
                    ),
                    ExtractedField(
                        field_name="registration_date",
                        value=date.today().isoformat(),
                        confidence=0.85
                    ),
                    ExtractedField(
                        field_name="expiration_date",
                        value=(date.today() + timedelta(days=365)).isoformat(),
                        confidence=0.87
                    ),
                ],
                structured_data={
                    "vehicle_vin": _generate_mock_vin(),
                    "registration_date": date.today().isoformat(),
                    "expiration_date": (date.today() + timedelta(days=365)).isoformat(),
                    "state": "MI",
                    "plate_number": f"ABC-{random.randint(1000, 9999)}"
                },
                warnings=[],
                processing_time_ms=random.randint(500, 1500)
            )
        else:
            # Unknown document type
            return DocumentProcessResponse(
                document_id=request.document_id,
                document_type=request.document_type,
                processing_status="partial",
                confidence_score=0.50,
                extracted_fields=[],
                structured_data=None,
                warnings=["Unknown document type, limited extraction performed"],
                processing_time_ms=random.randint(300, 800)
            )


# Singleton instance
document_processing_service = DocumentProcessingService()

