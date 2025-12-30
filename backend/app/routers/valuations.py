"""Vehicle Valuation API Router."""
from fastapi import APIRouter

from app.schemas.valuations import ValuationRequest, ValuationResponse
from app.services.valuations import vehicle_valuation_service

router = APIRouter()


@router.post("/estimate", response_model=ValuationResponse)
async def estimate_value(request: ValuationRequest):
    """
    Estimate current market value of a vehicle.
    
    Uses mock ML model to calculate:
    - Estimated market value
    - Value range (low to high)
    - Depreciation factors
    - Comparable vehicle listings
    - Market condition impact
    """
    return await vehicle_valuation_service.valuate(request)


@router.get("/demo")
async def demo_valuation():
    """
    Demo endpoint showing vehicle valuation.
    
    Returns a valuation for a sample vehicle.
    """
    sample_request = ValuationRequest(
        vehicle_id="demo-vehicle-001",
        vin="1HGBH41JXMN109186",
        manufacturer="Toyota",
        model="Camry",
        year=2020,
        mileage=45000,
        vehicle_type="Sedan",
        condition="good",
        purchase_price=28000,
        accident_count=0,
        service_record_count=8
    )
    
    valuation = await vehicle_valuation_service.valuate(sample_request)
    
    return {
        "sample_vehicle": sample_request,
        "valuation": valuation,
        "note": "This valuation uses mock market data and ML models"
    }


@router.post("/batch", response_model=list[ValuationResponse])
async def batch_valuations(requests: list[ValuationRequest]):
    """Generate valuations for multiple vehicles."""
    results = []
    for request in requests:
        valuation = await vehicle_valuation_service.valuate(request)
        results.append(valuation)
    return results

