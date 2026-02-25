import React, { useState, useEffect } from 'react';
import { getWorkflowTemplates, triggerWorkflow } from '../services/aiServices';
import { supabase } from '../supabaseClient';
import './Components.css';
import './DetailModal.css';

function WorkflowAutomation() {
    const [templates, setTemplates] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [executionResult, setExecutionResult] = useState(null);
    const [executingId, setExecutingId] = useState(null);
    const [runModal, setRunModal] = useState(null);
    const [configModal, setConfigModal] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [selectedOwner, setSelectedOwner] = useState('');
    const [configEnabled, setConfigEnabled] = useState({});

    useEffect(() => {
        fetchTemplates();
        fetchVehiclesAndOwners();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const data = await getWorkflowTemplates();
            setTemplates(data);
            setConfigEnabled(data.reduce((acc, t) => ({ ...acc, [t.id]: t.isActive }), {}));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchVehiclesAndOwners = async () => {
        if (!supabase) return;
        try {
            const [vehiclesRes, ownersRes] = await Promise.all([
                supabase.from('vehicle').select('id, vin, year').order('year', { ascending: false }).limit(100),
                supabase.from('owner').select('id, first_name, last_name, owner_type')
            ]);
            if (!vehiclesRes.error) setVehicles(vehiclesRes.data || []);
            if (!ownersRes.error) setOwners(ownersRes.data || []);
        } catch (_) {}
    };

    const openRunModal = (template) => {
        setRunModal(template);
        setSelectedVehicle(vehicles[0]?.id || '');
        setSelectedOwner(owners[0]?.id || '');
    };

    const closeRunModal = () => {
        setRunModal(null);
    };

    const handleTrigger = async () => {
        if (!runModal) return;
        const vehicleId = selectedVehicle || vehicles[0]?.id || 'demo-vehicle';
        const ownerId = selectedOwner || owners[0]?.id || 'demo-owner';
        try {
            setExecutingId(runModal.id);
            setExecutionResult(null);
            closeRunModal();
            const result = await triggerWorkflow(runModal.id, vehicleId, ownerId);
            setExecutionResult({ templateId: runModal.id, templateName: runModal.name, ...result });
        } catch (err) {
            setError(err.message);
        } finally {
            setExecutingId(null);
        }
    };

    const openConfigModal = (template) => {
        setConfigModal(template);
    };

    const closeConfigModal = () => {
        setConfigModal(null);
    };

    const handleConfigSave = () => {
        if (configModal) {
            const newActive = configEnabled[configModal.id] ?? configModal.isActive;
            setTemplates(prev => prev.map(t =>
                t.id === configModal.id ? { ...t, isActive: newActive } : t
            ));
        }
        closeConfigModal();
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
        const icons = { event: 'E', schedule: 'S', condition: 'C', manual: 'M' };
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
                                    onClick={() => openRunModal(template)}
                                    disabled={executingId === template.id}
                                >
                                    {executingId === template.id ? 'Running...' : 'Run Now'}
                                </button>
                                <button
                                    className="btn-secondary"
                                    onClick={() => openConfigModal(template)}
                                >
                                    Configure
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {runModal && (
                <div className="modal-overlay" onClick={closeRunModal}>
                    <div className="modal-content glass-container" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Run: {runModal.name}</h2>
                            <button className="modal-close" onClick={closeRunModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <p className="detail-label" style={{ marginBottom: 8 }}>Select vehicle and owner to run this workflow</p>
                            <div className="detail-grid" style={{ marginBottom: 24 }}>
                                <div className="detail-item">
                                    <span className="detail-label">Vehicle</span>
                                    <select
                                        className="detail-select"
                                        value={selectedVehicle}
                                        onChange={(e) => setSelectedVehicle(e.target.value)}
                                    >
                                        {vehicles.length === 0 ? (
                                            <option value="">No vehicles in database</option>
                                        ) : (
                                            vehicles.map((v) => (
                                                <option key={v.id} value={v.id}>
                                                    {v.vin} ({v.year})
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Owner</span>
                                    <select
                                        className="detail-select"
                                        value={selectedOwner}
                                        onChange={(e) => setSelectedOwner(e.target.value)}
                                    >
                                        {owners.length === 0 ? (
                                            <option value="">No owners in database</option>
                                        ) : (
                                            owners.map((o) => (
                                                <option key={o.id} value={o.id}>
                                                    {o.first_name} {o.last_name} {o.owner_type !== 'individual' ? `(${o.owner_type})` : ''}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className="edit-actions">
                                <button className="btn-cancel" onClick={closeRunModal}>Cancel</button>
                                <button
                                    className="btn-save"
                                    onClick={handleTrigger}
                                >
                                    Run Workflow
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {configModal && (
                <div className="modal-overlay" onClick={closeConfigModal}>
                    <div className="modal-content glass-container" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Configure: {configModal.name}</h2>
                            <button className="modal-close" onClick={closeConfigModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-section">
                                <h3>Workflow Settings</h3>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Category</span>
                                        <span className="detail-value">{configModal.category.replace(/_/g, ' ')}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Trigger Type</span>
                                        <span className="detail-value">{configModal.triggerType}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Steps</span>
                                        <span className="detail-value">{configModal.stepsCount}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Status</span>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <input
                                                type="checkbox"
                                                checked={configEnabled[configModal.id] ?? configModal.isActive}
                                                onChange={() => setConfigEnabled(prev => ({ ...prev, [configModal.id]: !(prev[configModal.id] ?? configModal.isActive) }))}
                                            />
                                            <span>Active</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="edit-actions" style={{ marginTop: 24 }}>
                                <button className="btn-cancel" onClick={closeConfigModal}>Cancel</button>
                                <button className="btn-save" onClick={handleConfigSave}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {executionResult && (
                <div className="glass-container">
                    <h3 className="section-title">Execution Result: {executionResult.templateName || executionResult.templateId}</h3>
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
