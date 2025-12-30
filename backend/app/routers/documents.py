"""Document Processing API Router."""
from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional

from app.schemas.documents import DocumentProcessRequest, DocumentProcessResponse
from app.services.documents import document_processing_service

router = APIRouter()


@router.post("/process", response_model=DocumentProcessResponse)
async def process_document(request: DocumentProcessRequest):
    """
    Process a document and extract data using mock OCR.
    
    Supports document types:
    - service_receipt: Extracts service details, costs, dates
    - insurance_card: Extracts policy information
    - registration: Extracts vehicle and registration info
    
    Returns structured data extracted from the document.
    """
    return await document_processing_service.process(request)


@router.post("/upload")
async def upload_and_process(
    file: UploadFile = File(...),
    document_type: str = Form(...),
    vehicle_id: Optional[str] = Form(None)
):
    """
    Upload and process a document file.
    
    Note: In this mock implementation, actual file content is not processed.
    Returns mock extracted data based on document type.
    """
    # In a real implementation, we would read the file and process it
    # For mock, we just use the document type
    
    request = DocumentProcessRequest(
        document_id=f"doc-{file.filename}",
        vehicle_id=vehicle_id,
        document_type=document_type,
        file_url=f"/uploads/{file.filename}"
    )
    
    result = await document_processing_service.process(request)
    
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "result": result
    }


@router.get("/demo/{document_type}")
async def demo_document_processing(document_type: str = "service_receipt"):
    """
    Demo endpoint showing document processing.
    
    Returns mock extracted data for the specified document type.
    
    Valid types: service_receipt, insurance_card, registration
    """
    valid_types = ["service_receipt", "insurance_card", "registration"]
    if document_type not in valid_types:
        document_type = "service_receipt"
    
    request = DocumentProcessRequest(
        document_id=f"demo-{document_type}",
        document_type=document_type
    )
    
    result = await document_processing_service.process(request)
    
    return {
        "document_type": document_type,
        "result": result,
        "note": "This is mock OCR data. Real implementation would process actual document images."
    }


@router.get("/supported-types")
async def get_supported_types():
    """Get list of supported document types."""
    return {
        "supported_types": [
            {
                "type": "service_receipt",
                "description": "Service/repair receipts and invoices",
                "extracted_fields": [
                    "service_date", "vehicle_vin", "service_center",
                    "labor_cost", "parts", "total_cost", "next_service_date"
                ]
            },
            {
                "type": "insurance_card",
                "description": "Insurance identification cards",
                "extracted_fields": [
                    "policy_number", "insurance_company", "effective_date",
                    "expiration_date", "vehicle_vin", "coverage_type"
                ]
            },
            {
                "type": "registration",
                "description": "Vehicle registration documents",
                "extracted_fields": [
                    "vehicle_vin", "registration_date", "expiration_date",
                    "state", "plate_number"
                ]
            },
            {
                "type": "title",
                "description": "Vehicle title documents",
                "extracted_fields": [
                    "vehicle_vin", "owner_name", "title_number",
                    "issue_date", "lien_holder"
                ]
            }
        ]
    }

