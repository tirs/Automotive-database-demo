"""Recall Matching API Router."""
from fastapi import APIRouter
from typing import Optional

from app.schemas.recalls import (
    RecallInfo,
    VehicleRecallMatch,
    RecallCheckRequest,
    RecallCheckResponse
)
from app.services.recalls import recall_matching_service

router = APIRouter()


@router.post("/check", response_model=RecallCheckResponse)
async def check_recalls(request: RecallCheckRequest):
    """
    Check multiple vehicles for open recalls.
    
    Matches vehicles against mock NHTSA recall database and returns:
    - Vehicles with matching recalls
    - Recall details and severity
    - Priority level for each vehicle
    """
    return await recall_matching_service.check_fleet(request.vehicles)


@router.get("/check/{make}/{model}/{year}", response_model=list[RecallInfo])
async def check_vehicle_recalls(make: str, model: str, year: int):
    """Check recalls for a specific vehicle by make, model, and year."""
    match = await recall_matching_service.check_vehicle(
        vehicle_id="query",
        vin="",
        manufacturer=make,
        model=model,
        year=year
    )
    return match.recalls if match else []


@router.get("/all", response_model=list[RecallInfo])
async def get_all_recalls():
    """Get all known recalls in the mock database."""
    return await recall_matching_service.get_all_recalls()


@router.get("/demo")
async def demo_recall_check():
    """
    Demo endpoint showing recall matching.
    
    Returns recall matches for sample vehicles.
    """
    sample_vehicles = [
        {
            "id": "v1",
            "vin": "1HGBH41JXMN109186",
            "manufacturer": "Toyota",
            "model": "Camry",
            "year": 2020
        },
        {
            "id": "v2",
            "vin": "2HGFG12688H567890",
            "manufacturer": "Honda",
            "model": "Civic",
            "year": 2018
        },
        {
            "id": "v3",
            "vin": "5YJ3E1EA7LF123456",
            "manufacturer": "Tesla",
            "model": "Model 3",
            "year": 2022
        }
    ]
    
    result = await recall_matching_service.check_fleet(sample_vehicles)
    
    return {
        "sample_vehicles": sample_vehicles,
        "result": result,
        "note": "This uses a mock NHTSA recall database for demonstration"
    }

