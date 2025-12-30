"""Mock Notification Service.

Generates and manages notifications.
"""
from datetime import datetime, date, timedelta
from typing import Optional
import uuid
import random

from app.schemas.notifications import (
    Notification,
    NotificationGenerateRequest,
    NotificationGenerateResponse
)
from app.schemas.common import Priority


# Notification templates
NOTIFICATION_TYPES = {
    "service_due": {
        "titles": [
            "Service Due Soon",
            "Maintenance Reminder",
            "Scheduled Service Approaching"
        ],
        "messages": [
            "Your vehicle is due for {service_type} service on {date}.",
            "Maintenance is recommended within the next {days} days.",
            "Service milestone approaching at {mileage} miles."
        ],
        "priority": Priority.MEDIUM,
        "category": "maintenance"
    },
    "insurance_expiring": {
        "titles": [
            "Insurance Expiring Soon",
            "Policy Renewal Required",
            "Insurance Coverage Alert"
        ],
        "messages": [
            "Your insurance policy expires on {date}. Renew to maintain coverage.",
            "Insurance renewal due in {days} days for your {vehicle}.",
            "Action required: Insurance policy ending {date}."
        ],
        "priority": Priority.HIGH,
        "category": "insurance"
    },
    "inspection_due": {
        "titles": [
            "Inspection Due",
            "State Inspection Required",
            "Inspection Expiring"
        ],
        "messages": [
            "Vehicle inspection expires on {date}. Schedule soon.",
            "Inspection due within {days} days to remain compliant.",
            "Your {vehicle} needs inspection before {date}."
        ],
        "priority": Priority.HIGH,
        "category": "compliance"
    },
    "warranty_expiring": {
        "titles": [
            "Warranty Expiring Soon",
            "Extended Warranty Opportunity",
            "Coverage Ending"
        ],
        "messages": [
            "Your warranty expires on {date}. Consider extended coverage.",
            "Warranty coverage ends in {days} days for your {vehicle}.",
            "Last chance to extend warranty coverage before {date}."
        ],
        "priority": Priority.MEDIUM,
        "category": "warranty"
    },
    "recall_notice": {
        "titles": [
            "Safety Recall Notice",
            "Manufacturer Recall",
            "Important Safety Alert"
        ],
        "messages": [
            "Your vehicle has an open recall for {component}. Contact dealer immediately.",
            "Safety recall issued. Schedule repair at your earliest convenience.",
            "Action required: Your {vehicle} is affected by recall {recall_number}."
        ],
        "priority": Priority.URGENT,
        "category": "safety"
    },
    "document_expiring": {
        "titles": [
            "Document Expiring",
            "Registration Renewal Due",
            "Document Update Required"
        ],
        "messages": [
            "Your {document_type} expires on {date}. Update before expiration.",
            "Registration renewal due in {days} days.",
            "Document expires soon. Upload updated version."
        ],
        "priority": Priority.MEDIUM,
        "category": "documents"
    },
    "payment_due": {
        "titles": [
            "Payment Due",
            "Financing Payment Reminder",
            "Payment Scheduled"
        ],
        "messages": [
            "Payment of ${amount} due on {date}.",
            "Your monthly payment is due in {days} days.",
            "Reminder: Financing payment upcoming on {date}."
        ],
        "priority": Priority.HIGH,
        "category": "financial"
    },
    "prediction_alert": {
        "titles": [
            "Maintenance Predicted",
            "Proactive Service Recommended",
            "Predictive Alert"
        ],
        "messages": [
            "AI analysis suggests {service_type} service within {days} days.",
            "Predictive maintenance: {component} may need attention soon.",
            "Based on usage patterns, schedule service before {date}."
        ],
        "priority": Priority.MEDIUM,
        "category": "ai_insights"
    }
}


def _generate_mock_notification(
    notification_type: str,
    vehicle_id: Optional[str] = None,
    owner_id: Optional[str] = None
) -> Notification:
    """Generate a mock notification."""
    template = NOTIFICATION_TYPES.get(notification_type, NOTIFICATION_TYPES["service_due"])
    
    # Generate placeholder values
    future_date = date.today() + timedelta(days=random.randint(7, 60))
    values = {
        "date": future_date.strftime("%B %d, %Y"),
        "days": random.randint(7, 30),
        "mileage": f"{random.randint(50, 150) * 1000:,}",
        "vehicle": random.choice(["2022 Toyota Camry", "2021 Honda CR-V", "2023 Ford F-150"]),
        "service_type": random.choice(["oil change", "brake inspection", "tire rotation"]),
        "component": random.choice(["airbag", "fuel pump", "brake caliper"]),
        "recall_number": f"23V-{random.randint(100, 999)}",
        "document_type": random.choice(["registration", "title", "insurance card"]),
        "amount": f"{random.randint(200, 800):.2f}"
    }
    
    title = random.choice(template["titles"])
    message = random.choice(template["messages"]).format(**values)
    
    return Notification(
        id=f"notif-{uuid.uuid4().hex[:8]}",
        vehicle_id=vehicle_id or f"veh-{uuid.uuid4().hex[:8]}",
        owner_id=owner_id or f"own-{uuid.uuid4().hex[:8]}",
        title=title,
        message=message,
        priority=template["priority"],
        notification_type=notification_type,
        category=template["category"],
        status="unread",
        action_url=f"/{template['category']}",
        action_label="View Details",
        created_at=datetime.now()
    )


class NotificationService:
    """Mock notification service."""
    
    def __init__(self):
        self.notifications: list[Notification] = []
    
    async def generate(
        self, request: NotificationGenerateRequest
    ) -> NotificationGenerateResponse:
        """Generate notifications based on request."""
        generated = []
        by_type = {}
        by_priority = {p.value: 0 for p in Priority}
        
        # Generate notifications for each enabled type
        if request.check_services:
            for _ in range(random.randint(1, 3)):
                notif = _generate_mock_notification("service_due")
                generated.append(notif)
                by_type["service_due"] = by_type.get("service_due", 0) + 1
                by_priority[notif.priority.value] += 1
        
        if request.check_insurance:
            for _ in range(random.randint(0, 2)):
                notif = _generate_mock_notification("insurance_expiring")
                generated.append(notif)
                by_type["insurance_expiring"] = by_type.get("insurance_expiring", 0) + 1
                by_priority[notif.priority.value] += 1
        
        if request.check_inspections:
            for _ in range(random.randint(0, 2)):
                notif = _generate_mock_notification("inspection_due")
                generated.append(notif)
                by_type["inspection_due"] = by_type.get("inspection_due", 0) + 1
                by_priority[notif.priority.value] += 1
        
        if request.check_warranties:
            for _ in range(random.randint(0, 1)):
                notif = _generate_mock_notification("warranty_expiring")
                generated.append(notif)
                by_type["warranty_expiring"] = by_type.get("warranty_expiring", 0) + 1
                by_priority[notif.priority.value] += 1
        
        if request.check_recalls:
            for _ in range(random.randint(0, 1)):
                notif = _generate_mock_notification("recall_notice")
                generated.append(notif)
                by_type["recall_notice"] = by_type.get("recall_notice", 0) + 1
                by_priority[notif.priority.value] += 1
        
        if request.check_documents:
            for _ in range(random.randint(0, 1)):
                notif = _generate_mock_notification("document_expiring")
                generated.append(notif)
                by_type["document_expiring"] = by_type.get("document_expiring", 0) + 1
                by_priority[notif.priority.value] += 1
        
        # Add prediction-based notification
        if random.random() > 0.5:
            notif = _generate_mock_notification("prediction_alert")
            generated.append(notif)
            by_type["prediction_alert"] = by_type.get("prediction_alert", 0) + 1
            by_priority[notif.priority.value] += 1
        
        self.notifications.extend(generated)
        
        return NotificationGenerateResponse(
            notifications_generated=len(generated),
            by_type=by_type,
            by_priority=by_priority
        )
    
    async def get_notifications(
        self,
        status: Optional[str] = None,
        priority: Optional[Priority] = None,
        limit: int = 50
    ) -> list[Notification]:
        """Get notifications with optional filters."""
        # Generate some mock notifications if empty
        if not self.notifications:
            await self.generate(NotificationGenerateRequest())
        
        result = self.notifications.copy()
        
        if status:
            result = [n for n in result if n.status == status]
        if priority:
            result = [n for n in result if n.priority == priority]
        
        return sorted(result, key=lambda n: n.created_at, reverse=True)[:limit]
    
    async def mark_read(self, notification_id: str) -> bool:
        """Mark a notification as read."""
        for notif in self.notifications:
            if notif.id == notification_id:
                notif.status = "read"
                notif.read_at = datetime.now()
                return True
        return False
    
    async def dismiss(self, notification_id: str) -> bool:
        """Dismiss a notification."""
        for notif in self.notifications:
            if notif.id == notification_id:
                notif.status = "dismissed"
                return True
        return False


# Singleton instance
notification_service = NotificationService()

