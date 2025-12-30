"""Mock AI Insights Service.

Generates AI-powered insights and recommendations.
"""
from datetime import datetime, date, timedelta
from typing import Optional
import uuid
import random

from app.schemas.insights import (
    AIInsight,
    InsightGenerationRequest,
    InsightGenerationResponse
)
from app.schemas.common import Severity


# Insight templates
INSIGHT_TEMPLATES = [
    {
        "type": "cost_trend",
        "category": "financial",
        "templates": [
            {
                "title": "Service Costs Trending Higher",
                "summary": "Average service costs have increased by {percent}% over the past {days} days compared to the previous period.",
                "severity": Severity.WARNING,
                "action": "Review service records for potential optimization opportunities"
            },
            {
                "title": "Fuel Efficiency Declining",
                "summary": "Fleet fuel efficiency has dropped by {percent}% this month. Consider maintenance checks.",
                "severity": Severity.INFO,
                "action": "Schedule fuel system inspections for affected vehicles"
            }
        ]
    },
    {
        "type": "maintenance_pattern",
        "category": "maintenance",
        "templates": [
            {
                "title": "High-Mileage Vehicles Need Attention",
                "summary": "{count} vehicles have exceeded 100,000 miles and may require more frequent maintenance schedules.",
                "severity": Severity.INFO,
                "action": "Review maintenance intervals for high-mileage fleet vehicles"
            },
            {
                "title": "Brake Services Due Across Fleet",
                "summary": "{count} vehicles are approaching brake service intervals within the next 30 days.",
                "severity": Severity.WARNING,
                "action": "Schedule brake inspections proactively"
            }
        ]
    },
    {
        "type": "fleet_health",
        "category": "operations",
        "templates": [
            {
                "title": "Fleet Compliance Status",
                "summary": "{percent}% of vehicles have current inspections and insurance. {count} require immediate attention.",
                "severity": Severity.ALERT,
                "action": "Address compliance gaps for flagged vehicles"
            },
            {
                "title": "Vehicle Age Distribution Alert",
                "summary": "{percent}% of the fleet is over 5 years old. Consider replacement planning.",
                "severity": Severity.INFO,
                "action": "Evaluate total cost of ownership for aging vehicles"
            }
        ]
    },
    {
        "type": "anomaly",
        "category": "financial",
        "templates": [
            {
                "title": "Unusual Service Costs Detected",
                "summary": "{count} service records in the past 30 days show costs significantly above average.",
                "severity": Severity.ALERT,
                "action": "Review flagged service records for accuracy"
            },
            {
                "title": "Duplicate Charges Possible",
                "summary": "Pattern analysis suggests {count} potential duplicate service entries.",
                "severity": Severity.WARNING,
                "action": "Audit identified service records"
            }
        ]
    },
    {
        "type": "recommendation",
        "category": "optimization",
        "templates": [
            {
                "title": "Consolidate Service Providers",
                "summary": "Using {count} different service centers. Consolidation could reduce costs by 10-15%.",
                "severity": Severity.INFO,
                "action": "Evaluate service center performance and negotiate fleet rates"
            },
            {
                "title": "Preventive Maintenance Opportunity",
                "summary": "Switching {count} vehicles to preventive maintenance schedules could reduce repair costs by 25%.",
                "severity": Severity.INFO,
                "action": "Implement preventive maintenance program"
            },
            {
                "title": "Insurance Premium Optimization",
                "summary": "Fleet has {percent}% claim-free rate. Consider renegotiating premiums.",
                "severity": Severity.INFO,
                "action": "Review insurance policies at renewal"
            }
        ]
    },
    {
        "type": "compliance",
        "category": "regulatory",
        "templates": [
            {
                "title": "Inspections Expiring Soon",
                "summary": "{count} vehicle inspections expire within the next 30 days.",
                "severity": Severity.WARNING,
                "action": "Schedule inspection appointments"
            },
            {
                "title": "Open Recalls Require Action",
                "summary": "{count} vehicles have unaddressed safety recalls.",
                "severity": Severity.CRITICAL,
                "action": "Contact dealers to schedule recall repairs immediately"
            },
            {
                "title": "Registration Renewals Due",
                "summary": "{count} vehicle registrations need renewal this month.",
                "severity": Severity.WARNING,
                "action": "Process registration renewals"
            }
        ]
    }
]


def _generate_mock_value(template_type: str) -> dict:
    """Generate mock values for template placeholders."""
    return {
        "percent": random.randint(5, 35),
        "count": random.randint(2, 15),
        "days": random.choice([7, 14, 30, 60, 90]),
        "amount": random.randint(500, 5000)
    }


def _select_insights(
    insight_types: Optional[list[str]] = None,
    count: int = 5
) -> list[dict]:
    """Select relevant insight templates."""
    selected = []
    
    available = INSIGHT_TEMPLATES.copy()
    if insight_types:
        available = [t for t in available if t["type"] in insight_types]
    
    # Randomly select from available templates
    for template_group in available:
        if len(selected) >= count:
            break
        
        for template in template_group["templates"]:
            if len(selected) >= count:
                break
            if random.random() > 0.5:  # 50% chance to include each
                selected.append({
                    "type": template_group["type"],
                    "category": template_group["category"],
                    **template
                })
    
    return selected[:count]


class AIInsightsService:
    """Mock AI insights service."""
    
    async def generate(
        self, request: InsightGenerationRequest
    ) -> InsightGenerationResponse:
        """Generate AI insights."""
        start_time = datetime.now()
        
        # Select insight templates
        templates = _select_insights(
            insight_types=request.insight_types,
            count=random.randint(4, 8)
        )
        
        insights = []
        for template in templates:
            values = _generate_mock_value(template["type"])
            
            # Format title and summary with values
            title = template["title"]
            summary = template["summary"].format(**values)
            
            insight = AIInsight(
                id=f"insight-{uuid.uuid4().hex[:8]}",
                insight_type=template["type"],
                category=template["category"],
                title=title,
                summary=summary,
                details={
                    "values": values,
                    "analysis_period_days": request.time_range_days
                },
                affected_vehicle_count=values["count"],
                severity=template["severity"],
                confidence_score=round(random.uniform(0.75, 0.95), 2),
                action_recommended=template["action"],
                action_url=f"/dashboard?insight={template['type']}",
                created_at=datetime.now(),
                expires_at=datetime.now() + timedelta(days=7)
            )
            insights.append(insight)
        
        # Calculate processing time
        processing_time = int((datetime.now() - start_time).total_seconds() * 1000)
        
        return InsightGenerationResponse(
            insights=insights,
            total_generated=len(insights),
            generation_time_ms=processing_time + random.randint(100, 500),
            data_analyzed={
                "vehicles": random.randint(20, 100),
                "service_records": random.randint(100, 500),
                "time_range_days": request.time_range_days
            }
        )
    
    async def get_active_insights(self) -> list[AIInsight]:
        """Get currently active insights."""
        response = await self.generate(InsightGenerationRequest())
        return response.insights


# Singleton instance
ai_insights_service = AIInsightsService()

