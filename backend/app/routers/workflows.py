"""Workflow Automation API Router."""
from fastapi import APIRouter, HTTPException
from typing import Optional

from app.schemas.workflows import (
    WorkflowTemplate,
    WorkflowInstance,
    WorkflowStatus,
    WorkflowTriggerRequest,
    WorkflowExecuteResponse
)
from app.services.workflows import workflow_automation_service

router = APIRouter()


@router.get("/templates", response_model=list[WorkflowTemplate])
async def list_templates():
    """
    List all available workflow templates.
    
    Returns predefined automation workflows for:
    - Service follow-ups
    - Insurance reminders
    - Maintenance schedules
    - Recall notifications
    - Vehicle onboarding
    """
    return await workflow_automation_service.list_templates()


@router.get("/templates/{template_id}", response_model=WorkflowTemplate)
async def get_template(template_id: str):
    """Get a specific workflow template."""
    template = await workflow_automation_service.get_template(template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template


@router.post("/trigger", response_model=WorkflowExecuteResponse)
async def trigger_workflow(request: WorkflowTriggerRequest):
    """
    Trigger a workflow execution.
    
    Starts a workflow instance based on the specified template.
    Returns execution status and log.
    """
    try:
        return await workflow_automation_service.trigger_workflow(request)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/instances", response_model=list[WorkflowInstance])
async def list_instances(status: Optional[WorkflowStatus] = None):
    """List workflow instances with optional status filter."""
    return await workflow_automation_service.list_instances(status)


@router.get("/instances/{instance_id}", response_model=WorkflowInstance)
async def get_instance(instance_id: str):
    """Get a specific workflow instance."""
    instance = await workflow_automation_service.get_instance(instance_id)
    if not instance:
        raise HTTPException(status_code=404, detail="Instance not found")
    return instance


@router.get("/demo")
async def demo_workflow():
    """
    Demo endpoint showing workflow automation.
    
    Triggers a sample workflow and returns the execution result.
    """
    # Get first template
    templates = await workflow_automation_service.list_templates()
    
    if not templates:
        return {"error": "No templates available"}
    
    # Trigger the first template
    request = WorkflowTriggerRequest(
        template_id=templates[0].id,
        vehicle_id="demo-vehicle-001",
        owner_id="demo-owner-001",
        trigger_data={"source": "demo_api"}
    )
    
    result = await workflow_automation_service.trigger_workflow(request)
    
    return {
        "template_used": templates[0],
        "execution_result": result,
        "note": "This demonstrates automated workflow execution"
    }


@router.get("/demo/all")
async def demo_all_workflows():
    """Demo all available workflow templates."""
    templates = await workflow_automation_service.list_templates()
    
    results = []
    for template in templates:
        request = WorkflowTriggerRequest(
            template_id=template.id,
            vehicle_id=f"demo-vehicle-{template.id}",
            owner_id=f"demo-owner-{template.id}",
            trigger_data={"source": "demo_api"}
        )
        
        try:
            result = await workflow_automation_service.trigger_workflow(request)
            results.append({
                "template": template.name,
                "category": template.category,
                "result": result
            })
        except Exception as e:
            results.append({
                "template": template.name,
                "error": str(e)
            })
    
    return {
        "workflows_executed": len(results),
        "results": results
    }

