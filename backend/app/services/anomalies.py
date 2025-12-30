"""Mock Cost Anomaly Detection Service.

Simulates ML-based anomaly detection for service costs.
"""
from datetime import date
from typing import Optional
import statistics

from app.schemas.anomalies import (
    ServiceRecordData,
    CostAnomaly,
    AnomalyDetectionRequest,
    AnomalyDetectionResponse
)
from app.schemas.common import Severity
from app.config import get_settings

settings = get_settings()


# Expected costs by service type (mean, std_dev)
EXPECTED_COSTS = {
    "maintenance": (150, 50),
    "repair": (400, 150),
    "inspection": (75, 25),
    "recall": (0, 0),  # Should be free
    "warranty": (0, 0),  # Should be free
    "oil_change": (75, 20),
    "brake_service": (350, 100),
    "tire_service": (200, 80),
    "transmission": (500, 200),
    "engine": (800, 300),
}

# Labor rate expectations (per hour)
EXPECTED_LABOR_RATE = (85, 150)  # min, max reasonable

# Parts cost ratio expectations (parts / total)
EXPECTED_PARTS_RATIO = (0.3, 0.6)  # 30-60% of total should be parts


def _normalize_service_type(service_type: str) -> str:
    """Normalize service type string."""
    service_type = service_type.lower().strip()
    
    # Map common variations
    mappings = {
        "oil change": "oil_change",
        "brake": "brake_service",
        "brakes": "brake_service",
        "tire": "tire_service",
        "tires": "tire_service",
    }
    
    for key, value in mappings.items():
        if key in service_type:
            return value
    
    return service_type


def _detect_cost_anomaly(
    record: ServiceRecordData,
    historical_avg: Optional[float] = None
) -> Optional[CostAnomaly]:
    """Detect if a service record has cost anomalies."""
    service_type = _normalize_service_type(record.service_type)
    
    # Get expected cost range
    expected = EXPECTED_COSTS.get(service_type, EXPECTED_COSTS["repair"])
    expected_mean, expected_std = expected
    
    # Use historical average if provided
    if historical_avg:
        expected_mean = historical_avg
        expected_std = expected_mean * 0.3  # Assume 30% std dev
    
    # Check for free services that have costs
    if service_type in ["recall", "warranty"] and record.total_cost > 50:
        return CostAnomaly(
            service_record_id=record.service_record_id,
            vehicle_id=record.vehicle_id,
            anomaly_type="unexpected_charge",
            anomaly_score=-0.8,
            severity=Severity.ALERT,
            expected_cost=0,
            actual_cost=record.total_cost,
            deviation_percentage=100.0,
            explanation=f"{service_type.title()} service should typically be free but was charged ${record.total_cost:.2f}",
            recommendations=[
                "Verify if this charge is correct",
                "Check warranty/recall coverage",
                "Contact service center for clarification"
            ]
        )
    
    # Skip if expected is zero (recall/warranty)
    if expected_mean == 0:
        return None
    
    # Calculate z-score
    if expected_std > 0:
        z_score = (record.total_cost - expected_mean) / expected_std
    else:
        z_score = 0
    
    # Convert to anomaly score (-1 to 1 range, negative = anomaly)
    anomaly_score = -min(1, max(-1, z_score / 3))
    
    # Calculate deviation
    if expected_mean > 0:
        deviation = ((record.total_cost - expected_mean) / expected_mean) * 100
    else:
        deviation = 0
    
    # Check if cost is anomalous (more than 2 std deviations)
    is_anomaly = abs(z_score) > 2
    
    if not is_anomaly:
        return None
    
    # Determine severity
    if abs(z_score) > 4:
        severity = Severity.CRITICAL
    elif abs(z_score) > 3:
        severity = Severity.ALERT
    else:
        severity = Severity.WARNING
    
    # Determine anomaly type
    if record.total_cost > expected_mean + 2 * expected_std:
        anomaly_type = "high_cost"
        explanation = f"Service cost of ${record.total_cost:.2f} is significantly higher than expected ${expected_mean:.2f}"
        recommendations = [
            "Review itemized invoice for accuracy",
            "Compare with other service centers",
            "Verify all charges are legitimate"
        ]
    elif record.labor_cost > record.total_cost * 0.7:
        anomaly_type = "labor_excessive"
        explanation = f"Labor cost (${record.labor_cost:.2f}) represents {(record.labor_cost/record.total_cost)*100:.0f}% of total"
        recommendations = [
            "Verify labor hours billed",
            "Check labor rate against market rate",
            "Request detailed time breakdown"
        ]
    else:
        anomaly_type = "price_spike"
        explanation = f"Service cost shows unusual deviation from expected range"
        recommendations = [
            "Compare with historical service costs",
            "Verify no duplicate charges"
        ]
    
    return CostAnomaly(
        service_record_id=record.service_record_id,
        vehicle_id=record.vehicle_id,
        anomaly_type=anomaly_type,
        anomaly_score=round(anomaly_score, 2),
        severity=severity,
        expected_cost=round(expected_mean, 2),
        actual_cost=record.total_cost,
        deviation_percentage=round(deviation, 1),
        explanation=explanation,
        recommendations=recommendations
    )


class AnomalyDetectionService:
    """Mock anomaly detection service."""
    
    async def analyze(
        self, records: list[ServiceRecordData]
    ) -> AnomalyDetectionResponse:
        """Analyze service records for cost anomalies."""
        anomalies = []
        
        # Group by vehicle for historical context
        vehicle_costs = {}
        for record in records:
            if record.vehicle_id not in vehicle_costs:
                vehicle_costs[record.vehicle_id] = []
            vehicle_costs[record.vehicle_id].append(record.total_cost)
        
        # Calculate historical averages
        historical_avgs = {}
        for vehicle_id, costs in vehicle_costs.items():
            if len(costs) > 1:
                historical_avgs[vehicle_id] = statistics.mean(costs)
        
        # Analyze each record
        for record in records:
            historical_avg = historical_avgs.get(record.vehicle_id)
            anomaly = _detect_cost_anomaly(record, historical_avg)
            if anomaly:
                anomalies.append(anomaly)
        
        return AnomalyDetectionResponse(
            anomalies=anomalies,
            total_records_analyzed=len(records),
            anomalies_found=len(anomalies),
            analysis_timestamp=date.today().isoformat(),
            model_version=settings.model_version
        )
    
    async def analyze_single(
        self, record: ServiceRecordData
    ) -> Optional[CostAnomaly]:
        """Analyze a single service record."""
        return _detect_cost_anomaly(record)


# Singleton instance
anomaly_detection_service = AnomalyDetectionService()

