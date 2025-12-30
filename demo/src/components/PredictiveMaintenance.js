import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { getPredictiveMaintenance } from '../services/aiServices';
import './Components.css';

function PredictiveMaintenance() {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRisk, setSelectedRisk] = useState('all');

    useEffect(() => {
        fetchPredictions();
    }, []);

    const fetchPredictions = async () => {
        try {
            setLoading(true);
            
            // Fetch vehicles from Supabase
            let vehicles = [];
            if (supabase) {
                const { data, error: fetchError } = await supabase
                    .from('vehicle')
                    .select(`
                        id,
                        vin,
                        year,
                        mileage,
                        vehicle_model:vehicle_model_id (
                            name,
                            manufacturer:manufacturer_id (
                                name
                            )
                        )
                    `)
                    .limit(20);
                
                if (!fetchError && data) {
                    vehicles = data.map(v => ({
                        id: v.id,
                        vin: v.vin,
                        year: v.year,
                        mileage: v.mileage,
                        manufacturer: v.vehicle_model?.manufacturer?.name || 'Unknown',
                        model: v.vehicle_model?.name || 'Unknown'
                    }));
                }
            }
            
            // Use mock data if no vehicles found
            if (vehicles.length === 0) {
                vehicles = [
                    { id: '1', vin: '1HGBH41JXMN109186', year: 2021, mileage: 45000, manufacturer: 'Honda', model: 'Accord' },
                    { id: '2', vin: '4T1BF1FK5EU123456', year: 2020, mileage: 62000, manufacturer: 'Toyota', model: 'Camry' },
                    { id: '3', vin: '1FA6P8CF5J5123456', year: 2018, mileage: 98000, manufacturer: 'Ford', model: 'Mustang' },
                    { id: '4', vin: '5YJ3E1EA7LF123456', year: 2022, mileage: 25000, manufacturer: 'Tesla', model: 'Model 3' },
                    { id: '5', vin: 'WBAPH5C55BA123456', year: 2019, mileage: 78000, manufacturer: 'BMW', model: '3 Series' },
                ];
            }
            
            const result = await getPredictiveMaintenance(vehicles);
            
            // Merge vehicle info with predictions
            const mergedPredictions = result.predictions.map(pred => {
                const vehicle = vehicles.find(v => v.id === pred.vehicleId);
                return {
                    ...pred,
                    vehicleInfo: vehicle
                };
            });
            
            setPredictions(mergedPredictions);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getRiskStyle = (riskLevel) => {
        const styles = {
            critical: { bg: 'rgba(220, 38, 38, 0.2)', color: '#dc2626', label: 'Critical' },
            high: { bg: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', label: 'High' },
            medium: { bg: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', label: 'Medium' },
            low: { bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981', label: 'Low' }
        };
        return styles[riskLevel] || styles.medium;
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const getDaysUntil = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        const diffTime = date - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const filteredPredictions = selectedRisk === 'all'
        ? predictions
        : predictions.filter(p => p.riskLevel === selectedRisk);

    // Sort by risk level and urgency
    const sortedPredictions = [...filteredPredictions].sort((a, b) => {
        const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        if (riskOrder[a.riskLevel] !== riskOrder[b.riskLevel]) {
            return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
        }
        return getDaysUntil(a.predictedDate) - getDaysUntil(b.predictedDate);
    });

    if (loading) {
        return (
            <div className="glass-container">
                <div className="loading">Analyzing vehicle data for predictions...</div>
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

    const riskCounts = {
        critical: predictions.filter(p => p.riskLevel === 'critical').length,
        high: predictions.filter(p => p.riskLevel === 'high').length,
        medium: predictions.filter(p => p.riskLevel === 'medium').length,
        low: predictions.filter(p => p.riskLevel === 'low').length
    };

    return (
        <>
            <div className="page-header">
                <h1>Predictive Maintenance</h1>
                <p>AI-powered maintenance predictions for your fleet</p>
            </div>

            <div className="stats-grid" style={{ marginBottom: '24px' }}>
                <div className="stat-card glass-container" style={{ borderLeft: '4px solid #dc2626' }}>
                    <div className="stat-card-content">
                        <div className="stat-info">
                            <h3 className="stat-title">Critical</h3>
                            <div className="stat-value">{riskCounts.critical}</div>
                        </div>
                    </div>
                </div>
                <div className="stat-card glass-container" style={{ borderLeft: '4px solid #f59e0b' }}>
                    <div className="stat-card-content">
                        <div className="stat-info">
                            <h3 className="stat-title">High Risk</h3>
                            <div className="stat-value">{riskCounts.high}</div>
                        </div>
                    </div>
                </div>
                <div className="stat-card glass-container" style={{ borderLeft: '4px solid #3b82f6' }}>
                    <div className="stat-card-content">
                        <div className="stat-info">
                            <h3 className="stat-title">Medium Risk</h3>
                            <div className="stat-value">{riskCounts.medium}</div>
                        </div>
                    </div>
                </div>
                <div className="stat-card glass-container" style={{ borderLeft: '4px solid #10b981' }}>
                    <div className="stat-card-content">
                        <div className="stat-info">
                            <h3 className="stat-title">Low Risk</h3>
                            <div className="stat-value">{riskCounts.low}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-container">
                <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 className="section-title" style={{ margin: 0 }}>Maintenance Predictions</h2>
                    <div className="filter-buttons">
                        {['all', 'critical', 'high', 'medium', 'low'].map(risk => (
                            <button
                                key={risk}
                                className={`filter-btn ${selectedRisk === risk ? 'active' : ''}`}
                                onClick={() => setSelectedRisk(risk)}
                            >
                                {risk === 'all' ? 'All' : risk.charAt(0).toUpperCase() + risk.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {sortedPredictions.length === 0 ? (
                    <div className="empty-state">
                        <p>No predictions match the selected filter.</p>
                    </div>
                ) : (
                    <div className="predictions-list">
                        {sortedPredictions.map((prediction) => {
                            const riskStyle = getRiskStyle(prediction.riskLevel);
                            const daysUntil = getDaysUntil(prediction.predictedDate);
                            const vehicle = prediction.vehicleInfo;
                            
                            return (
                                <div 
                                    key={prediction.vehicleId}
                                    className="prediction-card"
                                    style={{ borderLeft: `4px solid ${riskStyle.color}` }}
                                >
                                    <div className="prediction-header">
                                        <div className="vehicle-info">
                                            <h4>
                                                {vehicle?.year} {vehicle?.manufacturer} {vehicle?.model}
                                            </h4>
                                            <span className="vin-display">{vehicle?.vin}</span>
                                        </div>
                                        <div 
                                            className="risk-badge"
                                            style={{ 
                                                background: riskStyle.bg,
                                                color: riskStyle.color
                                            }}
                                        >
                                            {riskStyle.label} Risk
                                        </div>
                                    </div>
                                    
                                    <div className="prediction-body">
                                        <div className="prediction-detail">
                                            <span className="detail-label">Predicted Service</span>
                                            <span className="detail-value">{prediction.serviceType}</span>
                                        </div>
                                        <div className="prediction-detail">
                                            <span className="detail-label">Due Date</span>
                                            <span className="detail-value">
                                                {formatDate(prediction.predictedDate)}
                                                <span className="days-until" style={{ color: daysUntil <= 7 ? '#dc2626' : 'inherit' }}>
                                                    ({daysUntil} days)
                                                </span>
                                            </span>
                                        </div>
                                        <div className="prediction-detail">
                                            <span className="detail-label">Est. Mileage</span>
                                            <span className="detail-value">
                                                {prediction.predictedMileage?.toLocaleString()} mi
                                            </span>
                                        </div>
                                        <div className="prediction-detail">
                                            <span className="detail-label">Est. Cost</span>
                                            <span className="detail-value">
                                                ${prediction.estimatedCost?.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="prediction-detail">
                                            <span className="detail-label">Confidence</span>
                                            <span className="detail-value">
                                                {Math.round(prediction.confidenceScore * 100)}%
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {prediction.componentsAtRisk?.length > 0 && (
                                        <div className="components-at-risk">
                                            <span className="components-label">Components at Risk:</span>
                                            <div className="components-list">
                                                {prediction.componentsAtRisk.map((comp, idx) => (
                                                    <span key={idx} className="component-tag">{comp}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="prediction-reason">
                                        <p>{prediction.reason}</p>
                                    </div>
                                    
                                    <div className="prediction-actions">
                                        <button className="btn-primary">Schedule Service</button>
                                        <button className="btn-secondary">View History</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}

export default PredictiveMaintenance;

