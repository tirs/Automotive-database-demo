import React, { useState } from 'react';
import { decodeVIN } from '../services/aiServices';
import './Components.css';

function VINDecoder() {
    const [vin, setVin] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
                            <button className="btn-primary">Add Vehicle to Database</button>
                            <button className="btn-secondary">Check Recalls</button>
                            <button className="btn-secondary">Get Valuation</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default VINDecoder;

