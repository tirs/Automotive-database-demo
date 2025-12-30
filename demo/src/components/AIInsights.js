import React, { useState, useEffect } from 'react';
import { getAIInsights } from '../services/aiServices';
import './Components.css';

function AIInsights() {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchInsights();
    }, []);

    const fetchInsights = async () => {
        try {
            setLoading(true);
            const result = await getAIInsights({ timeRangeDays: 30 });
            setInsights(result.insights);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getSeverityStyle = (severity) => {
        const styles = {
            critical: {
                background: 'rgba(220, 38, 38, 0.15)',
                borderColor: 'rgb(220, 38, 38)',
                iconColor: '#dc2626'
            },
            alert: {
                background: 'rgba(245, 158, 11, 0.15)',
                borderColor: 'rgb(245, 158, 11)',
                iconColor: '#f59e0b'
            },
            warning: {
                background: 'rgba(59, 130, 246, 0.15)',
                borderColor: 'rgb(59, 130, 246)',
                iconColor: '#3b82f6'
            },
            info: {
                background: 'rgba(16, 185, 129, 0.15)',
                borderColor: 'rgb(16, 185, 129)',
                iconColor: '#10b981'
            }
        };
        return styles[severity] || styles.info;
    };

    const getSeverityIcon = (severity) => {
        const icons = {
            critical: '!',
            alert: '!',
            warning: 'i',
            info: 'i'
        };
        return icons[severity] || 'i';
    };

    const filteredInsights = filter === 'all' 
        ? insights 
        : insights.filter(i => i.severity === filter);

    if (loading) {
        return (
            <div className="glass-container">
                <div className="loading">Analyzing fleet data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-container">
                <div className="error">Error loading insights: {error}</div>
            </div>
        );
    }

    return (
        <div className="ai-insights-container">
            <div className="insights-header">
                <h3 className="section-title">AI-Powered Insights</h3>
                <div className="insights-filters">
                    <button 
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({insights.length})
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'critical' ? 'active' : ''}`}
                        onClick={() => setFilter('critical')}
                    >
                        Critical
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'alert' ? 'active' : ''}`}
                        onClick={() => setFilter('alert')}
                    >
                        Alerts
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'info' ? 'active' : ''}`}
                        onClick={() => setFilter('info')}
                    >
                        Info
                    </button>
                    <button 
                        className="filter-btn refresh-btn"
                        onClick={fetchInsights}
                        title="Refresh insights"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {filteredInsights.length === 0 ? (
                <div className="empty-state">
                    <p>No insights match the selected filter.</p>
                </div>
            ) : (
                <div className="insights-grid">
                    {filteredInsights.map((insight) => {
                        const style = getSeverityStyle(insight.severity);
                        return (
                            <div 
                                key={insight.id}
                                className="insight-card"
                                style={{
                                    background: style.background,
                                    borderLeft: `4px solid ${style.borderColor}`
                                }}
                            >
                                <div className="insight-header">
                                    <div 
                                        className="insight-icon"
                                        style={{ 
                                            background: style.borderColor,
                                            color: '#fff'
                                        }}
                                    >
                                        {getSeverityIcon(insight.severity)}
                                    </div>
                                    <div className="insight-meta">
                                        <span className="insight-category">{insight.category}</span>
                                        <span className="insight-confidence">
                                            {Math.round(insight.confidenceScore * 100)}% confidence
                                        </span>
                                    </div>
                                </div>
                                <h4 className="insight-title">{insight.title}</h4>
                                <p className="insight-summary">{insight.summary}</p>
                                {insight.affectedVehicleCount > 0 && (
                                    <div className="insight-affected">
                                        {insight.affectedVehicleCount} vehicle(s) affected
                                    </div>
                                )}
                                <div className="insight-action">
                                    <button 
                                        className="btn-action"
                                        onClick={() => window.location.href = insight.actionUrl}
                                    >
                                        {insight.action}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default AIInsights;

