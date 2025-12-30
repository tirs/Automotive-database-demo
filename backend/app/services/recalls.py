"""Mock Recall Matching Service.

Simulates NHTSA Recalls API with realistic mock data.
"""
from datetime import date, timedelta
import random
from typing import Optional

from app.schemas.recalls import (
    RecallInfo,
    VehicleRecallMatch,
    RecallCheckResponse
)
from app.schemas.common import Severity


# Mock recall database
MOCK_RECALLS = [
    {
        "manufacturers": ["Toyota"],
        "models": ["Camry", "Corolla", "RAV4"],
        "years": list(range(2018, 2022)),
        "recall": RecallInfo(
            recall_number="21V-842",
            manufacturer="Toyota",
            component="Fuel Pump",
            summary="The fuel pump may fail, causing the engine to stall while driving.",
            consequence="An engine stall while driving increases the risk of a crash.",
            remedy="Dealers will replace the fuel pump free of charge.",
            recall_date=date(2021, 10, 15),
            severity=Severity.CRITICAL
        )
    },
    {
        "manufacturers": ["Honda"],
        "models": ["Civic", "Accord", "CR-V"],
        "years": list(range(2016, 2020)),
        "recall": RecallInfo(
            recall_number="19V-456",
            manufacturer="Honda",
            component="Airbag Inflator",
            summary="The front passenger airbag inflator may rupture during deployment.",
            consequence="A rupturing inflator may cause metal fragments to strike vehicle occupants.",
            remedy="Dealers will replace the airbag inflator free of charge.",
            recall_date=date(2019, 8, 22),
            severity=Severity.CRITICAL
        )
    },
    {
        "manufacturers": ["Ford"],
        "models": ["F-150", "Explorer"],
        "years": list(range(2019, 2023)),
        "recall": RecallInfo(
            recall_number="22V-123",
            manufacturer="Ford",
            component="Rearview Camera",
            summary="The rearview camera display may intermittently fail to display an image.",
            consequence="A blank rearview display increases the risk of a crash while reversing.",
            remedy="Dealers will update the software free of charge.",
            recall_date=date(2022, 3, 8),
            severity=Severity.WARNING
        )
    },
    {
        "manufacturers": ["Chevrolet", "GMC"],
        "models": ["Silverado", "Sierra", "Tahoe", "Yukon"],
        "years": list(range(2020, 2024)),
        "recall": RecallInfo(
            recall_number="23V-567",
            manufacturer="General Motors",
            component="Brake Caliper Bolts",
            summary="The front brake caliper bolts may loosen, causing brake issues.",
            consequence="Loose brake caliper bolts can reduce braking performance.",
            remedy="Dealers will inspect and replace bolts as necessary free of charge.",
            recall_date=date(2023, 5, 12),
            severity=Severity.ALERT
        )
    },
    {
        "manufacturers": ["Tesla"],
        "models": ["Model 3", "Model Y"],
        "years": list(range(2021, 2024)),
        "recall": RecallInfo(
            recall_number="23V-890",
            manufacturer="Tesla",
            component="Suspension Links",
            summary="Rear suspension upper links may be loose or damaged.",
            consequence="Loose suspension components may affect vehicle handling.",
            remedy="Tesla will inspect and replace affected parts free of charge.",
            recall_date=date(2023, 7, 20),
            severity=Severity.WARNING
        )
    },
    {
        "manufacturers": ["BMW"],
        "models": ["3 Series", "5 Series", "X3", "X5"],
        "years": list(range(2017, 2021)),
        "recall": RecallInfo(
            recall_number="20V-234",
            manufacturer="BMW",
            component="EGR Module",
            summary="The EGR (Exhaust Gas Recirculation) module may overheat.",
            consequence="Overheating may cause vehicle fire in rare cases.",
            remedy="Dealers will inspect and replace the EGR module free of charge.",
            recall_date=date(2020, 11, 5),
            severity=Severity.CRITICAL
        )
    },
    {
        "manufacturers": ["Nissan"],
        "models": ["Altima", "Rogue", "Pathfinder"],
        "years": list(range(2018, 2022)),
        "recall": RecallInfo(
            recall_number="21V-678",
            manufacturer="Nissan",
            component="Occupant Detection System",
            summary="The front passenger occupant detection system may malfunction.",
            consequence="If the system fails, the airbag may not deploy properly in a crash.",
            remedy="Dealers will update the software free of charge.",
            recall_date=date(2021, 6, 30),
            severity=Severity.ALERT
        )
    },
    {
        "manufacturers": ["Jeep"],
        "models": ["Wrangler", "Grand Cherokee"],
        "years": list(range(2019, 2023)),
        "recall": RecallInfo(
            recall_number="22V-789",
            manufacturer="Stellantis",
            component="Fuel Line",
            summary="Fuel lines may have been improperly attached.",
            consequence="A loose fuel line may cause fuel leakage and fire risk.",
            remedy="Dealers will inspect and properly attach fuel lines free of charge.",
            recall_date=date(2022, 9, 14),
            severity=Severity.CRITICAL
        )
    },
]


def _find_matching_recalls(
    manufacturer: str,
    model: str,
    year: int
) -> list[RecallInfo]:
    """Find recalls matching a vehicle."""
    matches = []
    
    manufacturer_lower = manufacturer.lower()
    model_lower = model.lower()
    
    for recall_entry in MOCK_RECALLS:
        # Check manufacturer
        mfr_match = any(
            m.lower() in manufacturer_lower or manufacturer_lower in m.lower()
            for m in recall_entry["manufacturers"]
        )
        
        # Check model
        model_match = any(
            m.lower() in model_lower or model_lower in m.lower()
            for m in recall_entry["models"]
        )
        
        # Check year
        year_match = year in recall_entry["years"]
        
        if mfr_match and model_match and year_match:
            matches.append(recall_entry["recall"])
    
    return matches


def _calculate_priority(recalls: list[RecallInfo]) -> str:
    """Calculate priority based on recall severity."""
    if any(r.severity == Severity.CRITICAL for r in recalls):
        return "critical"
    elif any(r.severity == Severity.ALERT for r in recalls):
        return "high"
    elif any(r.severity == Severity.WARNING for r in recalls):
        return "medium"
    return "low"


class RecallMatchingService:
    """Mock recall matching service."""
    
    async def check_vehicle(
        self,
        vehicle_id: str,
        vin: str,
        manufacturer: str,
        model: str,
        year: int
    ) -> Optional[VehicleRecallMatch]:
        """Check a single vehicle for recalls."""
        recalls = _find_matching_recalls(manufacturer, model, year)
        
        if not recalls:
            return None
        
        return VehicleRecallMatch(
            vehicle_id=vehicle_id,
            vin=vin,
            manufacturer=manufacturer,
            model=model,
            year=year,
            recalls=recalls,
            priority=_calculate_priority(recalls),
            total_recalls=len(recalls)
        )
    
    async def check_fleet(
        self,
        vehicles: list[dict]
    ) -> RecallCheckResponse:
        """Check multiple vehicles for recalls."""
        matches = []
        
        for v in vehicles:
            match = await self.check_vehicle(
                vehicle_id=v.get("id", v.get("vehicle_id", "")),
                vin=v.get("vin", ""),
                manufacturer=v.get("manufacturer", ""),
                model=v.get("model", ""),
                year=v.get("year", 2020)
            )
            if match:
                matches.append(match)
        
        total_recalls = sum(m.total_recalls for m in matches)
        
        return RecallCheckResponse(
            matches=matches,
            total_vehicles_checked=len(vehicles),
            vehicles_with_recalls=len(matches),
            total_recalls_found=total_recalls,
            checked_at=date.today().isoformat()
        )
    
    async def get_all_recalls(self) -> list[RecallInfo]:
        """Get all known recalls."""
        return [entry["recall"] for entry in MOCK_RECALLS]


# Singleton instance
recall_matching_service = RecallMatchingService()

