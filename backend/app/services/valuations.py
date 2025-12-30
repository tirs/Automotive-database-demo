"""Mock Vehicle Valuation Service.

Simulates KBB/Edmunds-style vehicle valuation with ML-based depreciation.
"""
from datetime import date
from typing import Optional
import math

from app.schemas.valuations import (
    ValuationRequest,
    ValuationResponse,
    DepreciationFactor
)
from app.schemas.common import ConfidenceLevel


# Base MSRP estimates by manufacturer (rough averages)
BASE_MSRP = {
    "Toyota": 32000,
    "Honda": 30000,
    "Ford": 35000,
    "Chevrolet": 34000,
    "BMW": 55000,
    "Mercedes-Benz": 60000,
    "Audi": 52000,
    "Tesla": 50000,
    "Jeep": 38000,
    "Nissan": 28000,
    "Volkswagen": 30000,
    "Hyundai": 26000,
    "Kia": 25000,
    "Subaru": 32000,
    "Mazda": 28000,
    "Lexus": 48000,
    "Volvo": 45000,
}

# Depreciation curves by vehicle type (annual rate)
DEPRECIATION_RATES = {
    "Truck": 0.12,
    "SUV": 0.14,
    "Sedan": 0.16,
    "Coupe": 0.18,
    "Sports Car": 0.15,
    "Luxury": 0.20,
    "Electric": 0.18,
}

# Condition multipliers
CONDITION_MULTIPLIERS = {
    "excellent": 1.10,
    "good": 1.00,
    "fair": 0.85,
    "poor": 0.70,
}

# Market condition multipliers
MARKET_CONDITIONS = {
    "strong": 1.05,
    "normal": 1.00,
    "weak": 0.95,
}


def _estimate_base_price(manufacturer: str, vehicle_type: str) -> float:
    """Estimate base price based on manufacturer."""
    base = BASE_MSRP.get(manufacturer, 30000)
    
    # Adjust for vehicle type
    type_adjustments = {
        "Truck": 1.2,
        "SUV": 1.1,
        "Sports Car": 1.3,
        "Luxury": 1.4,
        "Sedan": 1.0,
        "Coupe": 1.05,
    }
    
    return base * type_adjustments.get(vehicle_type, 1.0)


def _calculate_depreciation(
    base_value: float,
    age_years: int,
    vehicle_type: str
) -> tuple[float, float]:
    """Calculate depreciated value using exponential decay."""
    rate = DEPRECIATION_RATES.get(vehicle_type, 0.15)
    
    # First year has steeper depreciation
    if age_years >= 1:
        value = base_value * 0.80  # 20% first year
        value = value * ((1 - rate) ** (age_years - 1))
    else:
        value = base_value * 0.95  # 5% for less than a year
    
    depreciation_percent = (1 - (value / base_value)) * 100
    return value, depreciation_percent


def _adjust_for_mileage(
    value: float,
    mileage: int,
    age_years: int
) -> tuple[float, float]:
    """Adjust value based on mileage relative to expected."""
    expected_annual = 12000
    expected_mileage = age_years * expected_annual
    mileage_diff = mileage - expected_mileage
    
    # Each 10k miles over/under adjusts value by 2%
    adjustment_rate = 0.02 * (mileage_diff / 10000)
    adjustment = 1 - max(-0.15, min(0.15, adjustment_rate))  # Cap at +/- 15%
    
    adjusted_value = value * adjustment
    adjustment_percent = (adjustment - 1) * 100
    
    return adjusted_value, adjustment_percent


def _adjust_for_condition(
    value: float,
    condition: str
) -> tuple[float, float]:
    """Adjust value based on condition."""
    multiplier = CONDITION_MULTIPLIERS.get(condition.lower(), 1.0)
    adjusted_value = value * multiplier
    adjustment_percent = (multiplier - 1) * 100
    return adjusted_value, adjustment_percent


def _adjust_for_accidents(
    value: float,
    accident_count: int
) -> tuple[float, float]:
    """Adjust value based on accident history."""
    # Each accident reduces value by 5-10%
    reduction_per_accident = 0.07
    total_reduction = min(0.30, accident_count * reduction_per_accident)
    multiplier = 1 - total_reduction
    
    adjusted_value = value * multiplier
    adjustment_percent = (multiplier - 1) * 100
    
    return adjusted_value, adjustment_percent


def _get_market_condition() -> str:
    """Get current market condition (mock)."""
    # In a real implementation, this would analyze market data
    return "normal"


def _generate_comparable_vehicles(
    manufacturer: str,
    model: str,
    year: int,
    estimated_value: float
) -> list[dict]:
    """Generate mock comparable vehicle listings."""
    comparables = []
    
    # Generate 3 comparable vehicles with slight variations
    for i in range(3):
        variance = 0.9 + (i * 0.1)  # 90%, 100%, 110% of estimated value
        price = estimated_value * variance
        mileage_variance = 10000 - (i * 5000)
        
        comparables.append({
            "source": ["AutoTrader", "Cars.com", "CarGurus"][i],
            "price": round(price, 0),
            "mileage": max(0, 45000 + mileage_variance),
            "condition": ["Good", "Excellent", "Fair"][i],
            "location": ["Local", "50 miles", "100 miles"][i],
            "listing_date": "2024-01-15"
        })
    
    return comparables


class VehicleValuationService:
    """Mock vehicle valuation service."""
    
    async def valuate(self, request: ValuationRequest) -> ValuationResponse:
        """Calculate vehicle valuation."""
        today = date.today()
        age_years = today.year - request.year
        
        # Get base price
        if request.purchase_price:
            base_price = request.purchase_price
        else:
            base_price = _estimate_base_price(
                request.manufacturer,
                request.vehicle_type
            )
        
        depreciation_factors = []
        
        # Calculate base depreciation
        value, dep_pct = _calculate_depreciation(
            base_price, age_years, request.vehicle_type
        )
        depreciation_factors.append(DepreciationFactor(
            factor_name="Age Depreciation",
            adjustment_percent=-dep_pct,
            description=f"{age_years} years of ownership depreciation"
        ))
        
        # Mileage adjustment
        value, mileage_adj = _adjust_for_mileage(value, request.mileage, age_years)
        depreciation_factors.append(DepreciationFactor(
            factor_name="Mileage Adjustment",
            adjustment_percent=mileage_adj,
            description=f"{request.mileage:,} miles vs {age_years * 12000:,} expected"
        ))
        
        # Condition adjustment
        value, condition_adj = _adjust_for_condition(value, request.condition)
        depreciation_factors.append(DepreciationFactor(
            factor_name="Condition Rating",
            adjustment_percent=condition_adj,
            description=f"Vehicle in {request.condition} condition"
        ))
        
        # Accident adjustment
        if request.accident_count > 0:
            value, accident_adj = _adjust_for_accidents(value, request.accident_count)
            depreciation_factors.append(DepreciationFactor(
                factor_name="Accident History",
                adjustment_percent=accident_adj,
                description=f"{request.accident_count} accident(s) on record"
            ))
        
        # Market condition
        market_condition = _get_market_condition()
        market_mult = MARKET_CONDITIONS.get(market_condition, 1.0)
        value *= market_mult
        
        # Calculate range
        value_low = value * 0.92
        value_high = value * 1.08
        
        # Determine confidence
        if request.accident_count > 0:
            confidence = ConfidenceLevel.MEDIUM
        elif age_years > 10:
            confidence = ConfidenceLevel.MEDIUM
        else:
            confidence = ConfidenceLevel.HIGH
        
        # Get comparables
        comparables = _generate_comparable_vehicles(
            request.manufacturer,
            request.model,
            request.year,
            value
        )
        
        # Determine value trend
        if market_condition == "strong":
            trend = "increasing"
        elif market_condition == "weak":
            trend = "decreasing"
        else:
            trend = "stable"
        
        return ValuationResponse(
            vehicle_id=request.vehicle_id,
            estimated_value=round(value, 2),
            value_low=round(value_low, 2),
            value_high=round(value_high, 2),
            confidence_level=confidence,
            market_condition=market_condition,
            valuation_date=today,
            depreciation_factors=depreciation_factors,
            comparable_vehicles=comparables,
            value_trend=trend,
            notes=f"Based on {request.manufacturer} {request.model} market analysis"
        )


# Singleton instance
vehicle_valuation_service = VehicleValuationService()

