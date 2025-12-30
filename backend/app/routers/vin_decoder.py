"""VIN Decoder API Router."""
from fastapi import APIRouter, HTTPException

from app.schemas.vin import VINDecodeRequest, VINDecodeResponse, VINValidationResponse
from app.services.vin_decoder import vin_decoder_service

router = APIRouter()


@router.post("/decode", response_model=VINDecodeResponse)
async def decode_vin(request: VINDecodeRequest):
    """
    Decode a VIN and return vehicle information.
    
    Uses mock NHTSA data to decode the VIN and return:
    - Manufacturer
    - Model
    - Year
    - Vehicle type
    - Engine specifications
    - Transmission
    - Drive type
    - Manufacturing location
    """
    return await vin_decoder_service.decode(request.vin)


@router.get("/decode/{vin}", response_model=VINDecodeResponse)
async def decode_vin_get(vin: str):
    """Decode a VIN (GET method for convenience)."""
    if len(vin) != 17:
        raise HTTPException(status_code=400, detail="VIN must be exactly 17 characters")
    return await vin_decoder_service.decode(vin)


@router.post("/validate", response_model=VINValidationResponse)
async def validate_vin(request: VINDecodeRequest):
    """
    Validate a VIN and optionally decode it.
    
    Returns validation status and decoded data if valid.
    """
    return await vin_decoder_service.validate(request.vin)


@router.get("/validate/{vin}", response_model=VINValidationResponse)
async def validate_vin_get(vin: str):
    """Validate a VIN (GET method for convenience)."""
    return await vin_decoder_service.validate(vin)

