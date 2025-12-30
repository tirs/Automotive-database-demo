"""Notification schemas."""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .common import Priority


class NotificationStatus(str):
    UNREAD = "unread"
    READ = "read"
    DISMISSED = "dismissed"
    ACTIONED = "actioned"


class Notification(BaseModel):
    """Notification model."""
    id: str
    vehicle_id: Optional[str] = None
    owner_id: Optional[str] = None
    title: str
    message: str
    priority: Priority
    notification_type: str
    category: str
    status: str = "unread"
    action_url: Optional[str] = None
    action_label: Optional[str] = None
    created_at: datetime
    read_at: Optional[datetime] = None


class NotificationGenerateRequest(BaseModel):
    """Request to generate notifications."""
    check_services: bool = True
    check_insurance: bool = True
    check_inspections: bool = True
    check_warranties: bool = True
    check_recalls: bool = True
    check_documents: bool = True


class NotificationGenerateResponse(BaseModel):
    """Response from notification generation."""
    notifications_generated: int
    by_type: dict
    by_priority: dict

