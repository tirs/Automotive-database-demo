"""Notifications API Router."""
from fastapi import APIRouter, HTTPException
from typing import Optional

from app.schemas.notifications import (
    Notification,
    NotificationGenerateRequest,
    NotificationGenerateResponse
)
from app.schemas.common import Priority
from app.services.notifications import notification_service

router = APIRouter()


@router.post("/generate", response_model=NotificationGenerateResponse)
async def generate_notifications(request: NotificationGenerateRequest):
    """
    Generate notifications based on current data.
    
    Checks for and generates notifications about:
    - Due services
    - Expiring insurance
    - Due inspections
    - Expiring warranties
    - Open recalls
    - Expiring documents
    """
    return await notification_service.generate(request)


@router.get("/", response_model=list[Notification])
async def get_notifications(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    limit: int = 50
):
    """Get notifications with optional filters."""
    priority_enum = None
    if priority:
        try:
            priority_enum = Priority(priority)
        except ValueError:
            pass
    
    return await notification_service.get_notifications(
        status=status,
        priority=priority_enum,
        limit=limit
    )


@router.get("/unread", response_model=list[Notification])
async def get_unread_notifications(limit: int = 50):
    """Get unread notifications."""
    return await notification_service.get_notifications(
        status="unread",
        limit=limit
    )


@router.get("/urgent", response_model=list[Notification])
async def get_urgent_notifications():
    """Get urgent and high priority notifications."""
    all_notifs = await notification_service.get_notifications(limit=100)
    return [n for n in all_notifs if n.priority in [Priority.URGENT, Priority.HIGH]]


@router.post("/{notification_id}/read")
async def mark_notification_read(notification_id: str):
    """Mark a notification as read."""
    success = await notification_service.mark_read(notification_id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"success": True, "notification_id": notification_id}


@router.post("/{notification_id}/dismiss")
async def dismiss_notification(notification_id: str):
    """Dismiss a notification."""
    success = await notification_service.dismiss(notification_id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"success": True, "notification_id": notification_id}


@router.get("/summary")
async def get_notification_summary():
    """Get summary of notifications."""
    all_notifs = await notification_service.get_notifications(limit=1000)
    
    by_status = {}
    by_priority = {}
    by_category = {}
    
    for n in all_notifs:
        by_status[n.status] = by_status.get(n.status, 0) + 1
        by_priority[n.priority.value] = by_priority.get(n.priority.value, 0) + 1
        by_category[n.category] = by_category.get(n.category, 0) + 1
    
    return {
        "total": len(all_notifs),
        "by_status": by_status,
        "by_priority": by_priority,
        "by_category": by_category
    }


@router.get("/demo")
async def demo_notifications():
    """
    Demo endpoint showing notification generation.
    
    Generates sample notifications for demonstration.
    """
    request = NotificationGenerateRequest(
        check_services=True,
        check_insurance=True,
        check_inspections=True,
        check_warranties=True,
        check_recalls=True,
        check_documents=True
    )
    
    result = await notification_service.generate(request)
    notifications = await notification_service.get_notifications(limit=20)
    
    return {
        "generation_result": result,
        "sample_notifications": notifications[:10],
        "note": "These are mock notifications for demonstration"
    }

