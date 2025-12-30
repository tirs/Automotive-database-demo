"""Predictive Maintenance API Router."""
from fastapi import APIRouter
from typing import Optional

from app.schemas.predictions import (
    VehicleData,
    MaintenancePrediction,
    MaintenancePredictionRequest,
    MaintenancePredictionResponse
)
from app.services.predictions import predictive_maintenance_service

router = APIRouter()


@router.post("/maintenance", response_model=MaintenancePredictionResponse)
async def predict_maintenance(request: MaintenancePredictionRequest):
    """
    Generate maintenance predictions for vehicles.
    
    Analyzes vehicle data and service history to predict:
    - When next service is due
    - What type of service is recommended
    - Risk level if service is delayed
    - Estimated cost
    - Components that may need attention
    """
    return await predictive_maintenance_service.predict(request.vehicles)


@router.post("/maintenance/single", response_model=MaintenancePrediction)
async def predict_single_vehicle(vehicle: VehicleData):
    """Generate maintenance prediction for a single vehicle."""
    return await predictive_maintenance_service.predict_single(vehicle)


@router.get("/demo")
async def demo_prediction():
    """
    Demo endpoint with sample prediction.
    
    Returns a prediction for a sample vehicle to demonstrate the API.
    """
    from datetime import date
    
    sample_vehicle = VehicleData(
        vehicle_id="demo-vehicle-001",
        vin="1HGBH41JXMN109186",
        manufacturer="Honda",
        model="Accord",
        year=2021,
        mileage=45000,
        last_service_date=date(2024, 8, 15),
        last_service_type="oil_change",
        last_service_mileage=42000,
        vehicle_type="sedan"
    )
    
    prediction = await predictive_maintenance_service.predict_single(sample_vehicle)
    
    return {
        "sample_vehicle": sample_vehicle,
        "prediction": prediction,
        "note": "This is a demo prediction using mock ML models"
    }

