import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeVIN, checkRecalls, getVehicleValuation } from '../services/aiServices';
import './Components.css';

function VINDecoder() {
    const navigate = useNavigate();
    const [vin, setVin] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recallData, setRecallData] = useState(null);
    const [valuationData, setValuationData] = useState(null);
    const [activeTab, setActiveTab] = useState('info');
    const [actionLoading, setActionLoading] = useState(null);

    const sampleVINs = [
        { vin: '1HGBH41JXMN109186', description: 'Honda Accord' },
        { vin: '4T1BF1FK5EU123456', description: 'Toyota Camry' },
        { vin: '5YJ3E1EA7LF654321', description: 'Tesla Model 3' },
        { vin: 'WBAPH5C55BA987654', description: 'BMW 3 Series' },
        { vin: '1FA6P8CF5J5246810', description: 'Ford Mustang' },
    ];

    const handleDecode = async () => {
        if (!vin.trim()) {
            setError('Please enter a VIN');
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            setRecallData(null);
            setValuationData(null);
            setActiveTab('info');
            const decoded = await decodeVIN(vin.trim());
            setResult(decoded);
            
            if (!decoded.isValid) {
                setError(decoded.error);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSampleClick = (sampleVin) => {
        setVin(sampleVin);
        setResult(null);
        setError(null);
        setRecallData(null);
        setValuationData(null);
    };

    const handleAddVehicle = async () => {
        if (!result || !result.isValid) return;
        
        setActionLoading('add');
        try {
            // Simulate adding vehicle - in real app this would call Supabase
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Show success and navigate to vehicles page
            alert(`Vehicle ${result.year} ${result.manufacturer} ${result.model} added successfully!`);
            navigate('/vehicles');
        } catch (err) {
            setError('Failed to add vehicle: ' + err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleCheckRecalls = async () => {
        if (!result || !result.isValid) return;
        
        setActionLoading('recalls');
        try {
            const vehicle = {
                id: 'temp-' + Date.now(),
                vin: result.vin,
                manufacturer: result.manufacturer,
                model: result.model,
                year: result.year
            };
            
            const recalls = await checkRecalls([vehicle]);
            setRecallData(recalls);
            setActiveTab('recalls');
        } catch (err) {
            setError('Failed to check recalls: ' + err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleGetValuation = async () => {
        if (!result || !result.isValid) return;
        
        setActionLoading('valuation');
        try {
            const vehicle = {
                id: 'temp-' + Date.now(),
                vin: result.vin,
                manufacturer: result.manufacturer,
                model: result.model,
                year: result.year,
                mileage: 50000,
                condition: 'good',
                purchasePrice: 35000
            };
            
            const valuation = await getVehicleValuation(vehicle);
            setValuationData(valuation);
            setActiveTab('valuation');
        } catch (err) {
            setError('Failed to get valuation: ' + err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const renderRecallsTab = () => {
        if (!recallData) return null;
        
        if (recallData.apiError) {
            return (
                <div className="no-recalls">
                    <h4>Recall Data Unavailable</h4>
                    <p>Unable to fetch recall data from NHTSA. Please check <a href="https://www.nhtsa.gov/recalls" target="_blank" rel="noopener noreferrer">NHTSA.gov/recalls</a> directly for this VIN.</p>
                </div>
            );
        }
        
        if (recallData.vehiclesWithRecalls === 0) {
            return (
                <div className="no-recalls">
                    <div className="success-icon">OK</div>
                    <h4>No Recalls Found</h4>
                    <p>This vehicle has no open safety recalls.</p>
                </div>
            );
        }
        
        return (
            <div className="recalls-list">
                <div className="recall-summary">
                    <span className="recall-count">{recallData.totalRecallsFound}</span> recall(s) found
                </div>
                {recallData.matches[0]?.recalls.map((recall, idx) => (
                    <div key={idx} className={`recall-item ${recall.severity}`}>
                        <div className="recall-header">
                            <span className="recall-number">{recall.recallNumber}</span>
                            <span className={`recall-severity ${recall.severity}`}>
                                {recall.severity.toUpperCase()}
                            </span>
                        </div>
                        <h4>{recall.component}</h4>
                        <p className="recall-summary-text">{recall.summary}</p>
                        <div className="recall-details">
                            <div className="recall-detail">
                                <span className="detail-label">Consequence:</span>
                                <span>{recall.consequence}</span>
                            </div>
                            <div className="recall-detail">
                                <span className="detail-label">Remedy:</span>
                                <span>{recall.remedy}</span>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={() => navigate('/recalls')}>
                            View All Recalls
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    const renderValuationTab = () => {
        if (!valuationData) return null;
        
        return (
            <div className="valuation-result">
                <div className="valuation-main">
                    <div className="valuation-value">
                        <span className="value-label">Estimated Market Value</span>
                        <span className="value-amount">${valuationData.estimatedValue.toLocaleString()}</span>
                        <span className="value-range">
                            Range: ${valuationData.valueLow.toLocaleString()} - ${valuationData.valueHigh.toLocaleString()}
                        </span>
                    </div>
                    <div className={`confidence-badge ${valuationData.confidenceLevel}`}>
                        {valuationData.confidenceLevel.toUpperCase()} Confidence
                    </div>
                </div>
                
                <div className="valuation-factors">
                    <h4>Value Factors</h4>
                    {valuationData.depreciationFactors.map((factor, idx) => (
                        <div key={idx} className="factor-item">
                            <span className="factor-name">{factor.name}</span>
                            <span className={`factor-value ${factor.adjustmentPercent >= 0 ? 'positive' : 'negative'}`}>
                                {factor.adjustmentPercent >= 0 ? '+' : ''}{factor.adjustmentPercent.toFixed(1)}%
                            </span>
                        </div>
                    ))}
                </div>
                
                <div className="valuation-meta">
                    <span>Market Condition: {valuationData.marketCondition}</span>
                    <span>Value Trend: {valuationData.valueTrend}</span>
                    <span>As of: {valuationData.valuationDate}</span>
                </div>
                
                <button className="btn-primary" onClick={() => navigate('/appraisals')}>
                    View All Appraisals
                </button>
            </div>
        );
    };

    return (
        <>
            <div className="page-header">
                <h1>VIN Decoder</h1>
                <p>Decode Vehicle Identification Numbers to get vehicle details</p>
            </div>

            <div className="glass-container">
                <div className="vin-input-section">
                    <div className="vin-input-group">
                        <input
                            type="text"
                            value={vin}
                            onChange={(e) => setVin(e.target.value.toUpperCase())}
                            placeholder="Enter 17-character VIN"
                            maxLength={17}
                            className="vin-input"
                            onKeyPress={(e) => e.key === 'Enter' && handleDecode()}
                        />
                        <button 
                            className="btn-primary"
                            onClick={handleDecode}
                            disabled={loading}
                        >
                            {loading ? 'Decoding...' : 'Decode VIN'}
                        </button>
                    </div>
                    <div className="vin-length-indicator">
                        {vin.length}/17 characters
                        {vin.length === 17 && <span className="valid-check"> Valid length</span>}
                    </div>
                </div>

                <div className="sample-vins">
                    <h4>Sample VINs to try:</h4>
                    <div className="sample-vin-list">
                        {sampleVINs.map((sample, idx) => (
                            <button
                                key={idx}
                                className="sample-vin-btn"
                                onClick={() => handleSampleClick(sample.vin)}
                            >
                                <span className="sample-vin-code">{sample.vin}</span>
                                <span className="sample-vin-desc">{sample.description}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {error && (
                <div className="glass-container">
                    <div className="error">{error}</div>
                </div>
            )}

            {result && result.isValid && (
                <div className="glass-container">
                    <div className="vin-tabs">
                        <button 
                            className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
                            onClick={() => setActiveTab('info')}
                        >
                            Vehicle Info
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'recalls' ? 'active' : ''}`}
                            onClick={() => setActiveTab('recalls')}
                            disabled={!recallData}
                        >
                            Recalls {recallData && `(${recallData.totalRecallsFound})`}
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'valuation' ? 'active' : ''}`}
                            onClick={() => setActiveTab('valuation')}
                            disabled={!valuationData}
                        >
                            Valuation
                        </button>
                    </div>

                    {activeTab === 'info' && (
                        <>
                            <h3 className="section-title">Decoded Vehicle Information</h3>
                            <div className="decoded-info">
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">VIN</span>
                                        <span className="info-value vin-display">{result.vin}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Manufacturer</span>
                                        <span className="info-value">{result.manufacturer}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Model</span>
                                        <span className="info-value">{result.model}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Year</span>
                                        <span className="info-value">{result.year}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Vehicle Type</span>
                                        <span className="info-value">{result.vehicleType}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Country of Origin</span>
                                        <span className="info-value">{result.country}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Fuel Type</span>
                                        <span className="info-value">{result.fuelType}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Transmission</span>
                                        <span className="info-value">{result.transmission}</span>
                                    </div>
                                </div>

                                <div className="vin-breakdown">
                                    <h4>VIN Breakdown</h4>
                                    <div className="vin-parts">
                                        <div className="vin-part">
                                            <span className="part-chars">{result.vin.substring(0, 3)}</span>
                                            <span className="part-label">WMI (Manufacturer)</span>
                                        </div>
                                        <div className="vin-part">
                                            <span className="part-chars">{result.vin.substring(3, 9)}</span>
                                            <span className="part-label">VDS (Vehicle Details)</span>
                                        </div>
                                        <div className="vin-part">
                                            <span className="part-chars">{result.vin.substring(9, 10)}</span>
                                            <span className="part-label">Year</span>
                                        </div>
                                        <div className="vin-part">
                                            <span className="part-chars">{result.vin.substring(10, 11)}</span>
                                            <span className="part-label">Plant</span>
                                        </div>
                                        <div className="vin-part">
                                            <span className="part-chars">{result.vin.substring(11)}</span>
                                            <span className="part-label">Serial Number</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="action-buttons">
                                    <button 
                                        className="btn-primary"
                                        onClick={handleAddVehicle}
                                        disabled={actionLoading === 'add'}
                                    >
                                        {actionLoading === 'add' ? 'Adding...' : 'Add Vehicle to Database'}
                                    </button>
                                    <button 
                                        className="btn-secondary"
                                        onClick={handleCheckRecalls}
                                        disabled={actionLoading === 'recalls'}
                                    >
                                        {actionLoading === 'recalls' ? 'Checking...' : 'Check Recalls'}
                                    </button>
                                    <button 
                                        className="btn-secondary"
                                        onClick={handleGetValuation}
                                        disabled={actionLoading === 'valuation'}
                                    >
                                        {actionLoading === 'valuation' ? 'Getting...' : 'Get Valuation'}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'recalls' && renderRecallsTab()}
                    {activeTab === 'valuation' && renderValuationTab()}
                </div>
            )}
        </>
    );
}

export default VINDecoder;
