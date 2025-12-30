"""Mock Workflow Automation Service.

Simulates workflow execution engine.
"""
from datetime import datetime, timedelta
from typing import Optional
import uuid

from app.schemas.workflows import (
    WorkflowTemplate,
    WorkflowInstance,
    WorkflowStep,
    WorkflowStatus,
    StepStatus,
    WorkflowTriggerRequest,
    WorkflowExecuteResponse
)


# Predefined workflow templates
DEFAULT_TEMPLATES = [
    WorkflowTemplate(
        id="wf-001",
        name="Post-Service Follow-up",
        description="Send follow-up communication after service completion",
        category="customer_engagement",
        trigger_type="event",
        trigger_config={
            "event": "service_record_created",
            "filter": {"service_type": ["repair", "maintenance"]}
        },
        steps=[
            WorkflowStep(
                step_type="wait",
                config={"hours": 24},
                name="Wait 24 hours"
            ),
            WorkflowStep(
                step_type="send_email",
                config={
                    "template": "service_followup",
                    "subject": "How was your recent service?"
                },
                name="Send follow-up email"
            ),
            WorkflowStep(
                step_type="create_notification",
                config={
                    "type": "survey_sent",
                    "priority": "low"
                },
                name="Log notification"
            )
        ]
    ),
    WorkflowTemplate(
        id="wf-002",
        name="Insurance Expiration Reminder",
        description="Send reminders before insurance expires",
        category="compliance",
        trigger_type="schedule",
        trigger_config={
            "schedule": "daily",
            "condition": "insurance_expiring_in_30_days"
        },
        steps=[
            WorkflowStep(
                step_type="condition",
                config={"check": "days_until_expiration", "threshold": 30},
                name="Check expiration window"
            ),
            WorkflowStep(
                step_type="create_notification",
                config={
                    "type": "insurance_expiring",
                    "priority": "high"
                },
                name="Create expiration notification"
            ),
            WorkflowStep(
                step_type="send_email",
                config={
                    "template": "insurance_reminder",
                    "subject": "Your insurance is expiring soon"
                },
                name="Send reminder email"
            )
        ]
    ),
    WorkflowTemplate(
        id="wf-003",
        name="Service Due Reminder Sequence",
        description="Multi-step reminder sequence for upcoming service",
        category="maintenance",
        trigger_type="condition",
        trigger_config={
            "condition": "service_due_within_14_days"
        },
        steps=[
            WorkflowStep(
                step_type="create_notification",
                config={
                    "type": "service_due_soon",
                    "priority": "medium"
                },
                name="Create initial reminder"
            ),
            WorkflowStep(
                step_type="wait",
                config={"days": 7},
                name="Wait 7 days"
            ),
            WorkflowStep(
                step_type="condition",
                config={"check": "service_scheduled", "if_true": "end"},
                name="Check if scheduled"
            ),
            WorkflowStep(
                step_type="create_notification",
                config={
                    "type": "service_due_urgent",
                    "priority": "high"
                },
                name="Create urgent reminder"
            ),
            WorkflowStep(
                step_type="send_sms",
                config={
                    "template": "service_due_sms"
                },
                name="Send SMS reminder"
            )
        ]
    ),
    WorkflowTemplate(
        id="wf-004",
        name="Recall Notification",
        description="Notify owners when a recall affects their vehicle",
        category="safety",
        trigger_type="event",
        trigger_config={
            "event": "recall_matched"
        },
        steps=[
            WorkflowStep(
                step_type="create_notification",
                config={
                    "type": "recall_notice",
                    "priority": "urgent"
                },
                name="Create recall notification"
            ),
            WorkflowStep(
                step_type="send_email",
                config={
                    "template": "recall_notice",
                    "subject": "Important Safety Recall Notice"
                },
                name="Send recall email"
            ),
            WorkflowStep(
                step_type="send_sms",
                config={
                    "template": "recall_sms"
                },
                name="Send recall SMS"
            )
        ]
    ),
    WorkflowTemplate(
        id="wf-005",
        name="New Vehicle Onboarding",
        description="Welcome sequence for new vehicles added to the system",
        category="onboarding",
        trigger_type="event",
        trigger_config={
            "event": "vehicle_created"
        },
        steps=[
            WorkflowStep(
                step_type="enrich_data",
                config={"action": "decode_vin"},
                name="Decode VIN information"
            ),
            WorkflowStep(
                step_type="check_recalls",
                config={},
                name="Check for open recalls"
            ),
            WorkflowStep(
                step_type="create_notification",
                config={
                    "type": "vehicle_added",
                    "priority": "low"
                },
                name="Notify owner of setup"
            ),
            WorkflowStep(
                step_type="generate_valuation",
                config={},
                name="Generate initial valuation"
            )
        ]
    )
]


class WorkflowAutomationService:
    """Mock workflow automation service."""
    
    def __init__(self):
        self.templates = {t.id: t for t in DEFAULT_TEMPLATES}
        self.instances: dict[str, WorkflowInstance] = {}
    
    async def list_templates(self) -> list[WorkflowTemplate]:
        """List all workflow templates."""
        return list(self.templates.values())
    
    async def get_template(self, template_id: str) -> Optional[WorkflowTemplate]:
        """Get a specific template."""
        return self.templates.get(template_id)
    
    async def trigger_workflow(
        self, request: WorkflowTriggerRequest
    ) -> WorkflowExecuteResponse:
        """Trigger a workflow execution."""
        template = self.templates.get(request.template_id)
        if not template:
            raise ValueError(f"Template {request.template_id} not found")
        
        # Create instance
        instance_id = f"inst-{uuid.uuid4().hex[:8]}"
        now = datetime.now()
        
        instance = WorkflowInstance(
            id=instance_id,
            template_id=template.id,
            template_name=template.name,
            vehicle_id=request.vehicle_id,
            owner_id=request.owner_id,
            status=WorkflowStatus.RUNNING,
            current_step=0,
            total_steps=len(template.steps),
            started_at=now,
            execution_log=[]
        )
        
        # Simulate step execution
        execution_log = []
        completed_steps = 0
        
        for i, step in enumerate(template.steps):
            step_log = {
                "step_index": i,
                "step_name": step.name or f"Step {i+1}",
                "step_type": step.step_type,
                "status": "completed",
                "started_at": (now + timedelta(seconds=i)).isoformat(),
                "completed_at": (now + timedelta(seconds=i+1)).isoformat(),
                "duration_ms": 100 + (i * 50)
            }
            
            # Simulate step-specific behavior
            if step.step_type == "wait":
                step_log["output"] = {
                    "waiting": True,
                    "resume_at": (now + timedelta(
                        hours=step.config.get("hours", 0),
                        days=step.config.get("days", 0)
                    )).isoformat()
                }
                step_log["status"] = "pending"  # Wait steps are pending
            elif step.step_type == "send_email":
                step_log["output"] = {
                    "email_sent": True,
                    "template": step.config.get("template"),
                    "recipient": "owner@example.com"
                }
            elif step.step_type == "create_notification":
                step_log["output"] = {
                    "notification_created": True,
                    "notification_id": f"notif-{uuid.uuid4().hex[:8]}"
                }
            elif step.step_type == "condition":
                step_log["output"] = {
                    "condition_met": True,
                    "checked": step.config.get("check")
                }
            else:
                step_log["output"] = {"success": True}
            
            execution_log.append(step_log)
            
            if step_log["status"] == "completed":
                completed_steps += 1
            elif step_log["status"] == "pending":
                # Stop at wait steps
                break
        
        # Determine final status
        if completed_steps == len(template.steps):
            final_status = WorkflowStatus.COMPLETED
        else:
            final_status = WorkflowStatus.RUNNING
        
        instance.execution_log = execution_log
        instance.current_step = completed_steps
        instance.status = final_status
        
        if final_status == WorkflowStatus.COMPLETED:
            instance.completed_at = now + timedelta(seconds=len(template.steps))
        
        self.instances[instance_id] = instance
        
        # Find next scheduled step if any
        next_step = None
        if completed_steps < len(template.steps):
            pending_step = template.steps[completed_steps]
            if pending_step.step_type == "wait":
                next_step = {
                    "step_index": completed_steps,
                    "step_name": pending_step.name,
                    "scheduled_for": execution_log[-1].get("output", {}).get("resume_at")
                }
        
        return WorkflowExecuteResponse(
            instance_id=instance_id,
            status=final_status,
            steps_completed=completed_steps,
            total_steps=len(template.steps),
            execution_log=execution_log,
            next_scheduled_step=next_step
        )
    
    async def get_instance(self, instance_id: str) -> Optional[WorkflowInstance]:
        """Get a workflow instance."""
        return self.instances.get(instance_id)
    
    async def list_instances(
        self,
        status: Optional[WorkflowStatus] = None
    ) -> list[WorkflowInstance]:
        """List workflow instances."""
        instances = list(self.instances.values())
        if status:
            instances = [i for i in instances if i.status == status]
        return instances


# Singleton instance
workflow_automation_service = WorkflowAutomationService()

