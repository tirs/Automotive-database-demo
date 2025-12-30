"""Mock Predictive Maintenance Service.

Simulates ML-based maintenance predictions using rule-based logic.
"""
from datetime import date, timedelta
from typing import Optional
import random

from app.schemas.predictions import (
    VehicleData,
    MaintenancePrediction,
    MaintenancePredictionResponse
)
from app.schemas.common import RiskLevel
from app.config import get_settings

settings = get_settings()


# Service interval rules (miles between services)
SERVICE_INTERVALS = {
    "oil_change": 5000,
    "tire_rotation": 7500,
    "brake_inspection": 15000,
    "transmission_service": 30000,
    "coolant_flush": 30000,
    "spark_plugs": 60000,
    "timing_belt": 90000,
    "major_service": 30000,
}

# Average service costs
SERVICE_COSTS = {
    "oil_change": 75,
    "tire_rotation": 50,
    "brake_inspection": 100,
    "brake_replacement": 450,
    "transmission_service": 200,
    "coolant_flush": 150,
    "spark_plugs": 250,
    "timing_belt": 800,
    "major_service": 500,
    "air_filter": 50,
    "cabin_filter": 60,
}

# Components that wear based on mileage
COMPONENTS_BY_MILEAGE = [
    (30000, ["brake_pads", "air_filter", "cabin_filter"]),
    (50000, ["battery", "tires", "brake_rotors"]),
    (75000, ["shocks", "struts", "water_pump"]),
    (100000, ["timing_belt", "spark_plugs", "alternator"]),
    (120000, ["transmission", "catalytic_converter"]),
]


def _calculate_risk_level(days_until: int, mileage_margin: int) -> RiskLevel:
    """Calculate risk level based on time and mileage."""
    if days_until <= 0 or mileage_margin <= 0:
        return RiskLevel.CRITICAL
    elif days_until <= 14 or mileage_margin <= 500:
        return RiskLevel.HIGH
    elif days_until <= 30 or mileage_margin <= 1500:
        return RiskLevel.MEDIUM
    return RiskLevel.LOW


def _get_components_at_risk(mileage: int) -> list[str]:
    """Get components that may need attention based on mileage."""
    components = []
    for threshold, comps in COMPONENTS_BY_MILEAGE:
        if mileage >= threshold - 5000:  # Within 5000 miles of threshold
            components.extend(comps)
    return list(set(components))[:3]  # Return top 3


def _calculate_next_service(
    vehicle: VehicleData
) -> tuple[date, str, int, float, str]:
    """Calculate when next service is due."""
    today = date.today()
    
    # Calculate age
    age_years = vehicle.age_years or (today.year - vehicle.year)
    
    # Determine daily mileage rate
    if vehicle.last_service_date and vehicle.last_service_mileage:
        days_since = (today - vehicle.last_service_date).days
        if days_since > 0:
            daily_miles = (vehicle.mileage - vehicle.last_service_mileage) / days_since
        else:
            daily_miles = 35  # Average daily driving
    else:
        # Estimate based on age and current mileage
        if age_years > 0:
            daily_miles = vehicle.mileage / (age_years * 365)
        else:
            daily_miles = 35
    
    daily_miles = max(10, min(100, daily_miles))  # Clamp to reasonable range
    
    # Determine next service based on mileage intervals
    next_services = []
    
    for service_type, interval in SERVICE_INTERVALS.items():
        miles_since_service = vehicle.mileage % interval
        miles_until = interval - miles_since_service
        days_until = int(miles_until / daily_miles) if daily_miles > 0 else 30
        
        next_services.append({
            "type": service_type,
            "miles_until": miles_until,
            "days_until": days_until,
            "cost": SERVICE_COSTS.get(service_type, 100)
        })
    
    # Sort by urgency (days until)
    next_services.sort(key=lambda x: x["days_until"])
    
    # Get most urgent service
    next_service = next_services[0]
    
    predicted_date = today + timedelta(days=max(1, next_service["days_until"]))
    predicted_mileage = vehicle.mileage + next_service["miles_until"]
    
    # Generate prediction reason
    reason = f"Based on current mileage ({vehicle.mileage:,} mi) and driving pattern "
    reason += f"({daily_miles:.0f} mi/day), {next_service['type'].replace('_', ' ')} "
    reason += f"is recommended within {next_service['days_until']} days."
    
    return (
        predicted_date,
        next_service["type"],
        predicted_mileage,
        next_service["cost"] * (1 + random.uniform(-0.1, 0.1)),  # Add some variance
        reason
    )


class PredictiveMaintenanceService:
    """Mock predictive maintenance service."""
    
    async def predict(
        self, vehicles: list[VehicleData]
    ) -> MaintenancePredictionResponse:
        """Generate maintenance predictions for vehicles."""
        predictions = []
        
        for vehicle in vehicles:
            pred_date, service_type, pred_mileage, cost, reason = \
                _calculate_next_service(vehicle)
            
            days_until = (pred_date - date.today()).days
            mileage_margin = pred_mileage - vehicle.mileage if pred_mileage else 5000
            
            risk_level = _calculate_risk_level(days_until, mileage_margin)
            components = _get_components_at_risk(vehicle.mileage)
            
            # Calculate confidence based on data availability
            confidence = 0.85
            if not vehicle.last_service_date:
                confidence -= 0.1
            if not vehicle.last_service_mileage:
                confidence -= 0.1
            
            predictions.append(MaintenancePrediction(
                vehicle_id=vehicle.vehicle_id,
                predicted_service_date=pred_date,
                predicted_mileage=pred_mileage,
                recommended_service_type=service_type.replace("_", " ").title(),
                confidence_score=round(confidence, 2),
                risk_level=risk_level,
                estimated_cost=round(cost, 2),
                prediction_reason=reason,
                urgency_days=max(0, days_until),
                components_at_risk=components
            ))
        
        return MaintenancePredictionResponse(
            predictions=predictions,
            model_version=settings.model_version,
            generated_at=date.today().isoformat()
        )
    
    async def predict_single(self, vehicle: VehicleData) -> MaintenancePrediction:
        """Generate prediction for a single vehicle."""
        response = await self.predict([vehicle])
        return response.predictions[0]


# Singleton instance
predictive_maintenance_service = PredictiveMaintenanceService()

