"""Workflow schemas."""
from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime
from enum import Enum


class WorkflowStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    PAUSED = "paused"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class StepStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"


class WorkflowStep(BaseModel):
    """Workflow step definition."""
    step_type: str  # send_email, send_sms, wait, condition, create_notification
    config: dict
    name: Optional[str] = None


class WorkflowTemplate(BaseModel):
    """Workflow template."""
    id: Optional[str] = None
    name: str
    description: Optional[str] = None
    category: str = "general"
    trigger_type: str  # event, schedule, manual
    trigger_config: dict
    steps: list[WorkflowStep]
    is_active: bool = True


class WorkflowInstance(BaseModel):
    """Running workflow instance."""
    id: str
    template_id: str
    template_name: str
    vehicle_id: Optional[str] = None
    owner_id: Optional[str] = None
    status: WorkflowStatus
    current_step: int
    total_steps: int
    started_at: datetime
    completed_at: Optional[datetime] = None
    execution_log: list[dict] = []


class WorkflowTriggerRequest(BaseModel):
    """Request to trigger a workflow."""
    template_id: str
    vehicle_id: Optional[str] = None
    owner_id: Optional[str] = None
    trigger_data: dict = {}


class WorkflowExecuteResponse(BaseModel):
    """Response after workflow execution."""
    instance_id: str
    status: WorkflowStatus
    steps_completed: int
    total_steps: int
    execution_log: list[dict]
    next_scheduled_step: Optional[dict] = None

