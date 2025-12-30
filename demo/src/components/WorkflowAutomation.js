import React, { useState, useEffect } from 'react';
import { getWorkflowTemplates, triggerWorkflow } from '../services/aiServices';
import './Components.css';

function WorkflowAutomation() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [executionResult, setExecutionResult] = useState(null);
    const [executingId, setExecutingId] = useState(null);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const data = await getWorkflowTemplates();
            setTemplates(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTrigger = async (templateId) => {
        try {
            setExecutingId(templateId);
            setExecutionResult(null);
            
            const result = await triggerWorkflow(templateId, 'demo-vehicle', 'demo-owner');
            setExecutionResult({
                templateId,
                ...result
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setExecutingId(null);
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            customer_engagement: '#3b82f6',
            compliance: '#f59e0b',
            maintenance: '#10b981',
            safety: '#dc2626',
            onboarding: '#8b5cf6'
        };
        return colors[category] || '#6b7280';
    };

    const getTriggerIcon = (triggerType) => {
        const icons = {
            event: 'E',
            schedule: 'S',
            condition: 'C',
            manual: 'M'
        };
        return icons[triggerType] || '?';
    };

    if (loading) {
        return (
            <div className="glass-container">
                <div className="loading">Loading workflow templates...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-container">
                <div className="error">Error: {error}</div>
            </div>
        );
    }

    return (
        <>
            <div className="page-header">
                <h1>Workflow Automation</h1>
                <p>Automate repetitive tasks with intelligent workflows</p>
            </div>

            <div className="stats-grid" style={{ marginBottom: '24px' }}>
                <div className="stat-card glass-container">
                    <div className="stat-card-content">
                        <div className="stat-info">
                            <h3 className="stat-title">Active Workflows</h3>
                            <div className="stat-value">{templates.filter(t => t.isActive).length}</div>
                        </div>
                    </div>
                </div>
                <div className="stat-card glass-container">
                    <div className="stat-card-content">
                        <div className="stat-info">
                            <h3 className="stat-title">Categories</h3>
                            <div className="stat-value">{new Set(templates.map(t => t.category)).size}</div>
                        </div>
                    </div>
                </div>
                <div className="stat-card glass-container">
                    <div className="stat-card-content">
                        <div className="stat-info">
                            <h3 className="stat-title">Total Steps</h3>
                            <div className="stat-value">{templates.reduce((sum, t) => sum + t.stepsCount, 0)}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-container">
                <h3 className="section-title">Available Workflows</h3>
                <div className="workflows-grid">
                    {templates.map((template) => (
                        <div key={template.id} className="workflow-card">
                            <div className="workflow-header">
                                <div 
                                    className="workflow-category-badge"
                                    style={{ background: getCategoryColor(template.category) }}
                                >
                                    {template.category.replace(/_/g, ' ')}
                                </div>
                                <div 
                                    className="workflow-trigger-badge"
                                    title={`Trigger: ${template.triggerType}`}
                                >
                                    {getTriggerIcon(template.triggerType)}
                                </div>
                            </div>
                            <h4 className="workflow-name">{template.name}</h4>
                            <p className="workflow-description">{template.description}</p>
                            <div className="workflow-meta">
                                <span className="workflow-steps">{template.stepsCount} steps</span>
                                <span className={`workflow-status ${template.isActive ? 'active' : 'inactive'}`}>
                                    {template.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="workflow-actions">
                                <button 
                                    className="btn-primary"
                                    onClick={() => handleTrigger(template.id)}
                                    disabled={executingId === template.id}
                                >
                                    {executingId === template.id ? 'Running...' : 'Run Now'}
                                </button>
                                <button className="btn-secondary">Configure</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {executionResult && (
                <div className="glass-container">
                    <h3 className="section-title">Execution Result</h3>
                    <div className="execution-result">
                        <div className="result-header">
                            <span className={`status-badge ${executionResult.status}`}>
                                {executionResult.status}
                            </span>
                            <span className="instance-id">Instance: {executionResult.instanceId}</span>
                        </div>
                        <div className="result-progress">
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill"
                                    style={{ 
                                        width: `${(executionResult.stepsCompleted / executionResult.totalSteps) * 100}%` 
                                    }}
                                />
                            </div>
                            <span className="progress-text">
                                {executionResult.stepsCompleted} / {executionResult.totalSteps} steps completed
                            </span>
                        </div>
                        {executionResult.executionLog && executionResult.executionLog.length > 0 && (
                            <div className="execution-log">
                                <h4>Execution Log</h4>
                                <ul>
                                    {executionResult.executionLog.map((log, idx) => (
                                        <li key={idx} className={`log-entry ${log.status}`}>
                                            <span className="log-step">{log.stepName}</span>
                                            <span className="log-status">{log.status}</span>
                                            <span className="log-duration">{log.duration}ms</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="glass-container">
                <h3 className="section-title">How Workflows Work</h3>
                <div className="workflow-info">
                    <div className="info-card">
                        <div className="info-icon">E</div>
                        <h4>Event Triggered</h4>
                        <p>Automatically runs when specific events occur, like a service being completed.</p>
                    </div>
                    <div className="info-card">
                        <div className="info-icon">S</div>
                        <h4>Schedule Triggered</h4>
                        <p>Runs on a schedule, like daily checks for expiring insurance.</p>
                    </div>
                    <div className="info-card">
                        <div className="info-icon">C</div>
                        <h4>Condition Triggered</h4>
                        <p>Runs when certain conditions are met, like service being due.</p>
                    </div>
                    <div className="info-card">
                        <div className="info-icon">M</div>
                        <h4>Manual Triggered</h4>
                        <p>Started manually by clicking the Run button.</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default WorkflowAutomation;

