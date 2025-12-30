import React, { useState, useEffect } from 'react';
import { parseNaturalLanguageQuery } from '../services/aiServices';
import { supabase } from '../supabaseClient';
import './Components.css';

function SmartSearch() {
    const [query, setQuery] = useState('');
    const [parsedResult, setParsedResult] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recentQueries, setRecentQueries] = useState([]);

    const exampleQueries = [
        "Show all Toyota vehicles",
        "Find vehicles with over 100,000 miles",
        "List overdue inspections",
        "Show active vehicles from 2020",
        "Find Honda cars needing service",
        "How many vehicles have open recalls"
    ];

    useEffect(() => {
        // Load recent queries from localStorage
        const saved = localStorage.getItem('recentSmartQueries');
        if (saved) {
            setRecentQueries(JSON.parse(saved).slice(0, 5));
        }
    }, []);

    const saveQuery = (q) => {
        const updated = [q, ...recentQueries.filter(r => r !== q)].slice(0, 5);
        setRecentQueries(updated);
        localStorage.setItem('recentSmartQueries', JSON.stringify(updated));
    };

    const handleSearch = async (searchQuery = query) => {
        if (!searchQuery.trim()) return;
        
        try {
            setLoading(true);
            setError(null);
            saveQuery(searchQuery);
            
            // Parse the natural language query
            const parsed = await parseNaturalLanguageQuery(searchQuery);
            setParsedResult(parsed);
            
            // Execute the search against Supabase if available
            if (supabase && parsed.parsedQuery) {
                const { entity, filters } = parsed.parsedQuery;
                
                let queryBuilder = supabase.from(entity).select('*');
                
                // Apply filters
                filters.forEach(filter => {
                    switch (filter.operator) {
                        case 'eq':
                            queryBuilder = queryBuilder.eq(filter.field, filter.value);
                            break;
                        case 'gt':
                            queryBuilder = queryBuilder.gt(filter.field, filter.value);
                            break;
                        case 'lt':
                            queryBuilder = queryBuilder.lt(filter.field, filter.value);
                            break;
                        case 'gte':
                            queryBuilder = queryBuilder.gte(filter.field, filter.value);
                            break;
                        case 'lte':
                            queryBuilder = queryBuilder.lte(filter.field, filter.value);
                            break;
                        case 'contains':
                            queryBuilder = queryBuilder.ilike(filter.field, `%${filter.value}%`);
                            break;
                        default:
                            break;
                    }
                });
                
                queryBuilder = queryBuilder.limit(parsed.parsedQuery.limit || 50);
                
                const { data, error: queryError } = await queryBuilder;
                
                if (queryError) {
                    console.warn('Supabase query error:', queryError);
                    // Use mock results on error
                    setSearchResults(generateMockResults(entity, filters.length));
                } else {
                    setSearchResults(data || []);
                }
            } else {
                // Generate mock results for demo
                setSearchResults(generateMockResults(
                    parsed.parsedQuery?.entity || 'vehicle',
                    parsed.parsedQuery?.filters?.length || 0
                ));
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const generateMockResults = (entity, filterCount) => {
        const count = Math.max(3, 10 - filterCount * 2);
        const results = [];
        
        for (let i = 0; i < count; i++) {
            if (entity === 'vehicle') {
                results.push({
                    id: `v-${i}`,
                    vin: `1HGBH41J${String(i).padStart(2, '0')}N109186`,
                    year: 2020 + (i % 4),
                    manufacturer: ['Toyota', 'Honda', 'Ford', 'BMW'][i % 4],
                    model: ['Camry', 'Civic', 'F-150', '3 Series'][i % 4],
                    mileage: 30000 + (i * 15000),
                    status: i % 5 === 0 ? 'sold' : 'active'
                });
            } else if (entity === 'service_record') {
                results.push({
                    id: `sr-${i}`,
                    service_date: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    service_type: ['maintenance', 'repair', 'inspection'][i % 3],
                    total_cost: 100 + (i * 50),
                    description: `Service record ${i + 1}`
                });
            } else if (entity === 'inspection') {
                results.push({
                    id: `insp-${i}`,
                    inspection_date: new Date(Date.now() - i * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    inspection_type: ['state', 'emissions', 'safety'][i % 3],
                    passed: i % 3 !== 0,
                    expiration_date: new Date(Date.now() + (30 - i * 10) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                });
            } else {
                results.push({
                    id: `item-${i}`,
                    name: `${entity} item ${i + 1}`,
                    created_at: new Date().toISOString()
                });
            }
        }
        
        return results;
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const renderResults = () => {
        if (searchResults.length === 0) {
            return <p className="no-results">No results found for your query.</p>;
        }

        const entity = parsedResult?.parsedQuery?.entity || 'vehicle';
        
        return (
            <div className="search-results">
                <div className="results-header">
                    <h4>{searchResults.length} Results Found</h4>
                    <span className="results-entity">Entity: {entity}</span>
                </div>
                <div className="modern-table-container">
                    <table className="modern-table">
                        <thead>
                            <tr>
                                {Object.keys(searchResults[0] || {}).slice(0, 6).map(key => (
                                    <th key={key}>{key.replace(/_/g, ' ').toUpperCase()}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {searchResults.slice(0, 10).map((result, idx) => (
                                <tr key={result.id || idx}>
                                    {Object.values(result).slice(0, 6).map((value, i) => (
                                        <td key={i}>
                                            {typeof value === 'boolean' 
                                                ? (value ? 'Yes' : 'No')
                                                : typeof value === 'number'
                                                    ? value.toLocaleString()
                                                    : String(value)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="page-header">
                <h1>Smart Search</h1>
                <p>Search your data using natural language queries</p>
            </div>

            <div className="glass-container">
                <div className="smart-search-input">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask a question like 'Show all Toyota vehicles with over 100,000 miles'"
                        className="search-input-large"
                    />
                    <button 
                        className="btn-primary search-btn"
                        onClick={() => handleSearch()}
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>

                <div className="search-suggestions">
                    <div className="suggestions-section">
                        <h4>Try these examples:</h4>
                        <div className="suggestion-chips">
                            {exampleQueries.map((example, idx) => (
                                <button
                                    key={idx}
                                    className="suggestion-chip"
                                    onClick={() => {
                                        setQuery(example);
                                        handleSearch(example);
                                    }}
                                >
                                    {example}
                                </button>
                            ))}
                        </div>
                    </div>

                    {recentQueries.length > 0 && (
                        <div className="suggestions-section">
                            <h4>Recent searches:</h4>
                            <div className="suggestion-chips recent">
                                {recentQueries.map((recent, idx) => (
                                    <button
                                        key={idx}
                                        className="suggestion-chip recent"
                                        onClick={() => {
                                            setQuery(recent);
                                            handleSearch(recent);
                                        }}
                                    >
                                        {recent}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="glass-container">
                    <div className="error">Error: {error}</div>
                </div>
            )}

            {parsedResult && (
                <div className="glass-container">
                    <h3 className="section-title">Query Analysis</h3>
                    <div className="query-analysis">
                        <div className="analysis-row">
                            <span className="analysis-label">Confidence:</span>
                            <span className="analysis-value">
                                <span 
                                    className="confidence-bar"
                                    style={{ 
                                        width: `${parsedResult.confidence * 100}%`,
                                        background: parsedResult.confidence > 0.8 ? '#10b981' : parsedResult.confidence > 0.6 ? '#f59e0b' : '#dc2626'
                                    }}
                                />
                                {Math.round(parsedResult.confidence * 100)}%
                            </span>
                        </div>
                        <div className="analysis-row">
                            <span className="analysis-label">Entity:</span>
                            <span className="analysis-value entity-tag">
                                {parsedResult.parsedQuery?.entity?.replace(/_/g, ' ')}
                            </span>
                        </div>
                        <div className="analysis-row">
                            <span className="analysis-label">Intent:</span>
                            <span className="analysis-value">{parsedResult.parsedQuery?.intent}</span>
                        </div>
                        {parsedResult.parsedQuery?.filters?.length > 0 && (
                            <div className="analysis-row">
                                <span className="analysis-label">Filters:</span>
                                <div className="filters-list">
                                    {parsedResult.parsedQuery.filters.map((filter, idx) => (
                                        <span key={idx} className="filter-tag">
                                            {filter.field} {filter.operator} {String(filter.value)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="analysis-row">
                            <span className="analysis-label">SQL Equivalent:</span>
                            <code className="sql-preview">{parsedResult.sqlEquivalent}</code>
                        </div>
                        <div className="analysis-row">
                            <span className="analysis-label">Explanation:</span>
                            <span className="analysis-value">{parsedResult.explanation}</span>
                        </div>
                    </div>
                </div>
            )}

            {parsedResult && searchResults.length >= 0 && (
                <div className="glass-container">
                    <h3 className="section-title">Search Results</h3>
                    {renderResults()}
                </div>
            )}
        </>
    );
}

export default SmartSearch;

