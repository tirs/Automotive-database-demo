"""Anomaly Detection API Router."""
from fastapi import APIRouter
from datetime import date

from app.schemas.anomalies import (
    ServiceRecordData,
    CostAnomaly,
    AnomalyDetectionRequest,
    AnomalyDetectionResponse
)
from app.services.anomalies import anomaly_detection_service

router = APIRouter()


@router.post("/analyze", response_model=AnomalyDetectionResponse)
async def analyze_costs(request: AnomalyDetectionRequest):
    """
    Analyze service records for cost anomalies.
    
    Uses mock ML model to detect:
    - Unusually high costs
    - Excessive labor charges
    - Unexpected charges on warranty/recall work
    - Price spikes compared to historical data
    """
    return await anomaly_detection_service.analyze(request.service_records)


@router.post("/check", response_model=CostAnomaly | None)
async def check_single_record(record: ServiceRecordData):
    """Check a single service record for anomalies."""
    return await anomaly_detection_service.analyze_single(record)


@router.get("/demo")
async def demo_anomaly_detection():
    """
    Demo endpoint showing anomaly detection.
    
    Returns analysis of sample service records.
    """
    sample_records = [
        ServiceRecordData(
            service_record_id="sr-001",
            vehicle_id="v-001",
            service_date=date(2024, 10, 15),
            service_type="maintenance",
            total_cost=175.00,
            labor_cost=100.00,
            parts_cost=75.00,
            parts_count=2,
            labor_hours=1.5
        ),
        ServiceRecordData(
            service_record_id="sr-002",
            vehicle_id="v-001",
            service_date=date(2024, 11, 20),
            service_type="repair",
            total_cost=1250.00,  # Potentially high
            labor_cost=800.00,
            parts_cost=450.00,
            parts_count=3,
            labor_hours=6.0
        ),
        ServiceRecordData(
            service_record_id="sr-003",
            vehicle_id="v-002",
            service_date=date(2024, 12, 1),
            service_type="recall",
            total_cost=150.00,  # Should be free
            labor_cost=150.00,
            parts_cost=0,
            parts_count=0,
            labor_hours=1.0
        ),
        ServiceRecordData(
            service_record_id="sr-004",
            vehicle_id="v-003",
            service_date=date(2024, 12, 10),
            service_type="maintenance",
            total_cost=95.00,  # Normal
            labor_cost=50.00,
            parts_cost=45.00,
            parts_count=1,
            labor_hours=0.5
        )
    ]
    
    result = await anomaly_detection_service.analyze(sample_records)
    
    return {
        "sample_records": sample_records,
        "analysis": result,
        "note": "Anomalies are detected using statistical analysis and ML patterns"
    }

