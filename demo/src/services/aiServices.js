/**
 * AI Services - Mock API client for AI/Automation features
 * 
 * This file provides mock implementations of AI services that would
 * normally connect to the FastAPI backend. For demo purposes, these
 * return simulated data directly.
 */

// Helper to simulate API delay
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================================
// VIN DECODER SERVICE - Real NHTSA API Integration
// ============================================================================

const NHTSA_VIN_API = 'https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues';

export async function decodeVIN(vin) {
    const cleanVin = vin.trim().toUpperCase();
    
    if (cleanVin.length !== 17) {
        return { isValid: false, error: "VIN must be exactly 17 characters" };
    }

    // Validate VIN format (no I, O, Q)
    const invalidChars = /[IOQ]/;
    if (invalidChars.test(cleanVin)) {
        return { isValid: false, error: "VIN contains invalid characters (I, O, Q are not used)" };
    }

    try {
        const response = await fetch(`${NHTSA_VIN_API}/${cleanVin}?format=json`);
        const data = await response.json();

        if (!data.Results || !data.Results[0]) {
            return { isValid: false, error: "Unable to decode VIN. Please verify the VIN is correct." };
        }

        const r = data.Results[0];
        
        // NHTSA returns "Invalid" or empty for failed decodes
        const make = r.Make || '';
        const model = r.Model || '';
        const year = r.ModelYear || '';

        if (!make || !model || make === 'Invalid' || model === 'Invalid') {
            return { 
                isValid: false, 
                error: "VIN could not be decoded. This may be an invalid or unsupported VIN." 
            };
        }

        return {
            isValid: true,
            vin: cleanVin,
            manufacturer: make,
            model: model,
            year: parseInt(year) || new Date().getFullYear(),
            country: r.PlantCountry || r.PlantCompanyName || 'Unknown',
            vehicleType: r.BodyClass || r.VehicleType || 'Passenger Car',
            fuelType: r.FuelTypePrimary || r.FuelTypePrimary1 || 'Gasoline',
            transmission: r.TransmissionStyle || 'Automatic',
            engine: r.EngineModel || r.DisplacementL || '',
            driveType: r.DriveType || '',
            trim: r.Trim || '',
            series: r.Series || ''
        };
    } catch (err) {
        console.error('VIN decode error:', err);
        return { 
            isValid: false, 
            error: "Failed to connect to VIN decoder. Please check your connection and try again." 
        };
    }
}

// ============================================================================
// PREDICTIVE MAINTENANCE SERVICE
// ============================================================================

export async function getPredictiveMaintenance(vehicles) {
    await simulateDelay(600);
    
    const predictions = vehicles.map(vehicle => {
        const mileage = vehicle.mileage || 50000;
        const daysSinceService = Math.floor(Math.random() * 90) + 30;
        const daysUntilService = Math.max(7, 90 - daysSinceService);
        
        let serviceType = "Oil Change";
        let riskLevel = "low";
        let cost = 75;
        
        if (mileage % 30000 < 5000) {
            serviceType = "Major Service";
            riskLevel = "medium";
            cost = 450;
        } else if (mileage % 15000 < 2000) {
            serviceType = "Brake Inspection";
            riskLevel = "medium";
            cost = 150;
        } else if (mileage > 100000) {
            serviceType = "Transmission Service";
            riskLevel = "high";
            cost = 350;
        }
        
        if (daysUntilService < 14) riskLevel = "high";
        if (daysUntilService < 7) riskLevel = "critical";
        
        const today = new Date();
        const predictedDate = new Date(today.getTime() + daysUntilService * 24 * 60 * 60 * 1000);
        
        return {
            vehicleId: vehicle.id,
            vin: vehicle.vin,
            predictedDate: predictedDate.toISOString().split('T')[0],
            predictedMileage: mileage + Math.floor(daysUntilService * 35),
            serviceType,
            confidenceScore: 0.85 + Math.random() * 0.1,
            riskLevel,
            estimatedCost: cost + Math.floor(Math.random() * 50),
            reason: `Based on current mileage (${mileage.toLocaleString()} mi) and service history`,
            componentsAtRisk: riskLevel === "high" || riskLevel === "critical" 
                ? ["Brake Pads", "Air Filter", "Cabin Filter"].slice(0, Math.floor(Math.random() * 3) + 1)
                : []
        };
    });
    
    return {
        predictions,
        modelVersion: "v1.0.0",
        generatedAt: new Date().toISOString()
    };
}

// ============================================================================
// RECALL MATCHING SERVICE
// ============================================================================

const MOCK_RECALLS = [
    {
        recallNumber: "21V-842",
        manufacturer: "Toyota",
        models: ["Camry", "Corolla", "RAV4"],
        years: [2018, 2019, 2020, 2021],
        component: "Fuel Pump",
        summary: "The fuel pump may fail, causing the engine to stall while driving.",
        consequence: "An engine stall while driving increases the risk of a crash.",
        remedy: "Dealers will replace the fuel pump free of charge.",
        severity: "critical"
    },
    {
        recallNumber: "22V-123",
        manufacturer: "Ford",
        models: ["F-150", "Explorer"],
        years: [2019, 2020, 2021, 2022],
        component: "Rearview Camera",
        summary: "The rearview camera display may intermittently fail.",
        consequence: "A blank rearview display increases the risk of a crash while reversing.",
        remedy: "Dealers will update the software free of charge.",
        severity: "warning"
    },
    {
        recallNumber: "23V-567",
        manufacturer: "Honda",
        models: ["Civic", "Accord", "CR-V"],
        years: [2016, 2017, 2018, 2019],
        component: "Airbag Inflator",
        summary: "The front passenger airbag inflator may rupture during deployment.",
        consequence: "A rupturing inflator may cause metal fragments to strike vehicle occupants.",
        remedy: "Dealers will replace the airbag inflator free of charge.",
        severity: "critical"
    }
];

export async function checkRecalls(vehicles) {
    await simulateDelay(500);
    
    const matches = [];
    
    vehicles.forEach(vehicle => {
        const vehicleRecalls = MOCK_RECALLS.filter(recall => {
            const manufacturerMatch = vehicle.manufacturer?.toLowerCase().includes(recall.manufacturer.toLowerCase()) ||
                                     recall.manufacturer.toLowerCase().includes(vehicle.manufacturer?.toLowerCase() || '');
            const modelMatch = recall.models.some(m => 
                vehicle.model?.toLowerCase().includes(m.toLowerCase()) ||
                m.toLowerCase().includes(vehicle.model?.toLowerCase() || '')
            );
            const yearMatch = recall.years.includes(vehicle.year);
            
            return manufacturerMatch && modelMatch && yearMatch;
        });
        
        if (vehicleRecalls.length > 0) {
            matches.push({
                vehicleId: vehicle.id,
                vin: vehicle.vin,
                manufacturer: vehicle.manufacturer,
                model: vehicle.model,
                year: vehicle.year,
                recalls: vehicleRecalls,
                priority: vehicleRecalls.some(r => r.severity === "critical") ? "critical" : "medium"
            });
        }
    });
    
    return {
        matches,
        totalVehiclesChecked: vehicles.length,
        vehiclesWithRecalls: matches.length,
        totalRecallsFound: matches.reduce((sum, m) => sum + m.recalls.length, 0),
        checkedAt: new Date().toISOString()
    };
}

// ============================================================================
// VEHICLE VALUATION SERVICE
// ============================================================================

export async function getVehicleValuation(vehicle) {
    await simulateDelay(400);
    
    const basePrice = vehicle.purchasePrice || 30000;
    const ageYears = new Date().getFullYear() - vehicle.year;
    const mileage = vehicle.mileage || 50000;
    
    // Depreciation calculation
    const annualDepreciation = 0.15;
    let value = basePrice * Math.pow(1 - annualDepreciation, ageYears);
    
    // Mileage adjustment
    const expectedMileage = ageYears * 12000;
    const mileageDiff = mileage - expectedMileage;
    const mileageAdjustment = 1 - (mileageDiff / 100000) * 0.1;
    value *= Math.max(0.7, Math.min(1.15, mileageAdjustment));
    
    // Condition adjustment
    const conditionMultipliers = { excellent: 1.1, good: 1.0, fair: 0.85, poor: 0.7 };
    value *= conditionMultipliers[vehicle.condition || 'good'];
    
    // Accident adjustment
    const accidentCount = vehicle.accidentCount || 0;
    value *= 1 - (accidentCount * 0.07);
    
    const valueLow = value * 0.92;
    const valueHigh = value * 1.08;
    
    return {
        vehicleId: vehicle.id,
        estimatedValue: Math.round(value),
        valueLow: Math.round(valueLow),
        valueHigh: Math.round(valueHigh),
        confidenceLevel: accidentCount > 0 ? "medium" : "high",
        marketCondition: "normal",
        depreciationFactors: [
            { name: "Age Depreciation", adjustmentPercent: -(1 - Math.pow(1 - annualDepreciation, ageYears)) * 100 },
            { name: "Mileage Adjustment", adjustmentPercent: (mileageAdjustment - 1) * 100 },
        ],
        valueTrend: "stable",
        valuationDate: new Date().toISOString().split('T')[0]
    };
}

// ============================================================================
// AI INSIGHTS SERVICE
// ============================================================================

export async function getAIInsights(options = {}) {
    await simulateDelay(700);
    
    const insightTemplates = [
        {
            type: "cost_trend",
            category: "financial",
            severity: "warning",
            title: "Service Costs Trending Higher",
            summary: "Average service costs have increased by 15% over the past 30 days compared to the previous period.",
            action: "Review service records for potential optimization opportunities",
            actionUrl: "/service-records"
        },
        {
            type: "maintenance_pattern",
            category: "maintenance",
            severity: "info",
            title: "High-Mileage Vehicles Need Attention",
            summary: "5 vehicles have exceeded 100,000 miles and may require more frequent maintenance schedules.",
            action: "Review maintenance intervals for high-mileage fleet vehicles",
            actionUrl: "/vehicles?mileage_gte=100000"
        },
        {
            type: "compliance",
            category: "regulatory",
            severity: "alert",
            title: "Inspections Expiring Soon",
            summary: "3 vehicle inspections expire within the next 30 days.",
            action: "Schedule inspection appointments",
            actionUrl: "/inspections"
        },
        {
            type: "compliance",
            category: "safety",
            severity: "critical",
            title: "Open Recalls Require Action",
            summary: "2 vehicles have unaddressed safety recalls that need immediate attention.",
            action: "Contact dealers to schedule recall repairs",
            actionUrl: "/recalls"
        },
        {
            type: "recommendation",
            category: "optimization",
            severity: "info",
            title: "Preventive Maintenance Opportunity",
            summary: "Switching 4 vehicles to preventive maintenance schedules could reduce repair costs by 25%.",
            action: "Implement preventive maintenance program",
            actionUrl: "/service-records"
        },
        {
            type: "fleet_health",
            category: "operations",
            severity: "info",
            title: "Fleet Compliance Status",
            summary: "92% of vehicles have current inspections and insurance. 3 require immediate attention.",
            action: "Address compliance gaps for flagged vehicles",
            actionUrl: "/dashboard"
        }
    ];
    
    // Randomly select 3-5 insights
    const count = Math.floor(Math.random() * 3) + 3;
    const shuffled = insightTemplates.sort(() => 0.5 - Math.random());
    const insights = shuffled.slice(0, count).map((template, index) => ({
        id: `insight-${Date.now()}-${index}`,
        ...template,
        confidenceScore: 0.75 + Math.random() * 0.2,
        affectedVehicleCount: Math.floor(Math.random() * 8) + 2,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }));
    
    return {
        insights,
        totalGenerated: insights.length,
        generationTimeMs: Math.floor(Math.random() * 500) + 200,
        dataAnalyzed: {
            vehicles: 25,
            serviceRecords: 150,
            timeRangeDays: options.timeRangeDays || 30
        }
    };
}

// ============================================================================
// NOTIFICATION SERVICE
// ============================================================================

export async function getNotifications(options = {}) {
    await simulateDelay(300);
    
    const notificationTypes = [
        { type: "service_due", title: "Service Due Soon", priority: "medium", category: "maintenance" },
        { type: "insurance_expiring", title: "Insurance Expiring", priority: "high", category: "insurance" },
        { type: "inspection_due", title: "Inspection Due", priority: "high", category: "compliance" },
        { type: "recall_notice", title: "Safety Recall Notice", priority: "urgent", category: "safety" },
        { type: "warranty_expiring", title: "Warranty Expiring", priority: "medium", category: "warranty" },
        { type: "prediction_alert", title: "Maintenance Predicted", priority: "medium", category: "ai_insights" },
    ];
    
    const notifications = notificationTypes.map((template, index) => {
        const daysAhead = Math.floor(Math.random() * 30) + 7;
        const futureDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
        
        return {
            id: `notif-${Date.now()}-${index}`,
            ...template,
            message: `Action required within ${daysAhead} days. Due date: ${futureDate.toLocaleDateString()}.`,
            status: Math.random() > 0.3 ? "unread" : "read",
            vehicleId: `vehicle-${index + 1}`,
            createdAt: new Date().toISOString(),
            actionUrl: `/${template.category}`,
            actionLabel: "View Details"
        };
    });
    
    // Filter by status if provided
    let filtered = notifications;
    if (options.status) {
        filtered = notifications.filter(n => n.status === options.status);
    }
    if (options.priority) {
        filtered = filtered.filter(n => n.priority === options.priority);
    }
    
    return filtered.slice(0, options.limit || 20);
}

// ============================================================================
// NATURAL LANGUAGE SEARCH SERVICE
// ============================================================================

export async function parseNaturalLanguageQuery(query) {
    await simulateDelay(400);
    
    const queryLower = query.toLowerCase();
    
    // Detect entity
    let entity = "vehicle";
    if (queryLower.includes("service") || queryLower.includes("maintenance")) {
        entity = "service_record";
    } else if (queryLower.includes("inspection")) {
        entity = "inspection";
    } else if (queryLower.includes("insurance")) {
        entity = "insurance_policy";
    } else if (queryLower.includes("recall")) {
        entity = "recall";
    } else if (queryLower.includes("owner") || queryLower.includes("customer")) {
        entity = "owner";
    }
    
    // Extract filters
    const filters = [];
    
    // Status filters
    if (queryLower.includes("active")) {
        filters.push({ field: "status", operator: "eq", value: "active" });
    }
    if (queryLower.includes("overdue") || queryLower.includes("expired")) {
        filters.push({ field: "expiration_date", operator: "lt", value: new Date().toISOString().split('T')[0] });
    }
    
    // Manufacturer filters
    const manufacturers = ["toyota", "honda", "ford", "chevrolet", "bmw", "tesla", "nissan"];
    for (const mfr of manufacturers) {
        if (queryLower.includes(mfr)) {
            filters.push({ field: "manufacturer", operator: "eq", value: mfr.charAt(0).toUpperCase() + mfr.slice(1) });
            break;
        }
    }
    
    // Year filter
    const yearMatch = queryLower.match(/\b(20\d{2})\b/);
    if (yearMatch) {
        filters.push({ field: "year", operator: "eq", value: parseInt(yearMatch[1]) });
    }
    
    // Mileage filters
    if (queryLower.includes("high mileage") || queryLower.includes("over 100")) {
        filters.push({ field: "mileage", operator: "gt", value: 100000 });
    }
    
    // Intent detection
    let intent = "search";
    if (queryLower.includes("how many") || queryLower.includes("count")) {
        intent = "count";
    } else if (queryLower.includes("compare")) {
        intent = "compare";
    }
    
    return {
        originalQuery: query,
        parsedQuery: {
            entity,
            filters,
            joins: [],
            sortField: "created_at",
            sortDirection: "desc",
            limit: 50,
            intent
        },
        sqlEquivalent: `SELECT * FROM ${entity} WHERE ${filters.length > 0 ? filters.map(f => `${f.field} ${f.operator} '${f.value}'`).join(' AND ') : '1=1'}`,
        confidence: 0.75 + (filters.length * 0.05),
        suggestions: [
            "Show all Toyota vehicles with over 100,000 miles",
            "Find overdue inspections",
            "List service records from this month"
        ],
        explanation: `Searching ${entity.replace('_', ' ')}s${filters.length > 0 ? ` with ${filters.length} filter(s)` : ''}`
    };
}

// ============================================================================
// WORKFLOW SERVICE
// ============================================================================

export async function getWorkflowTemplates() {
    await simulateDelay(300);
    
    return [
        {
            id: "wf-001",
            name: "Post-Service Follow-up",
            description: "Send follow-up communication after service completion",
            category: "customer_engagement",
            triggerType: "event",
            stepsCount: 3,
            isActive: true
        },
        {
            id: "wf-002",
            name: "Insurance Expiration Reminder",
            description: "Send reminders before insurance expires",
            category: "compliance",
            triggerType: "schedule",
            stepsCount: 3,
            isActive: true
        },
        {
            id: "wf-003",
            name: "Service Due Reminder Sequence",
            description: "Multi-step reminder sequence for upcoming service",
            category: "maintenance",
            triggerType: "condition",
            stepsCount: 5,
            isActive: true
        },
        {
            id: "wf-004",
            name: "Recall Notification",
            description: "Notify owners when a recall affects their vehicle",
            category: "safety",
            triggerType: "event",
            stepsCount: 3,
            isActive: true
        },
        {
            id: "wf-005",
            name: "New Vehicle Onboarding",
            description: "Welcome sequence for new vehicles added to the system",
            category: "onboarding",
            triggerType: "event",
            stepsCount: 4,
            isActive: true
        }
    ];
}

export async function triggerWorkflow(templateId, vehicleId, ownerId) {
    await simulateDelay(500);
    
    return {
        instanceId: `inst-${Date.now()}`,
        status: "running",
        stepsCompleted: 1,
        totalSteps: 3,
        executionLog: [
            {
                stepIndex: 0,
                stepName: "Initial Setup",
                status: "completed",
                duration: 150
            }
        ],
        startedAt: new Date().toISOString()
    };
}

// ============================================================================
// COST ANOMALY SERVICE
// ============================================================================

export async function detectCostAnomalies(serviceRecords) {
    await simulateDelay(500);
    
    const anomalies = [];
    
    serviceRecords.forEach(record => {
        // Check for warranty/recall charges
        if ((record.serviceType === "recall" || record.serviceType === "warranty") && record.totalCost > 50) {
            anomalies.push({
                serviceRecordId: record.id,
                vehicleId: record.vehicleId,
                anomalyType: "unexpected_charge",
                severity: "alert",
                expectedCost: 0,
                actualCost: record.totalCost,
                deviationPercentage: 100,
                explanation: `${record.serviceType} service should typically be free but was charged $${record.totalCost}`,
                recommendations: ["Verify if this charge is correct", "Check warranty/recall coverage"]
            });
        }
        
        // Check for high costs
        const expectedCosts = { maintenance: 150, repair: 400, inspection: 75 };
        const expected = expectedCosts[record.serviceType] || 200;
        
        if (record.totalCost > expected * 2) {
            anomalies.push({
                serviceRecordId: record.id,
                vehicleId: record.vehicleId,
                anomalyType: "high_cost",
                severity: "warning",
                expectedCost: expected,
                actualCost: record.totalCost,
                deviationPercentage: ((record.totalCost - expected) / expected) * 100,
                explanation: `Service cost of $${record.totalCost} is significantly higher than expected $${expected}`,
                recommendations: ["Review itemized invoice", "Compare with other service centers"]
            });
        }
    });
    
    return {
        anomalies,
        totalRecordsAnalyzed: serviceRecords.length,
        anomaliesFound: anomalies.length,
        analysisTimestamp: new Date().toISOString()
    };
}

const aiServices = {
    decodeVIN,
    getPredictiveMaintenance,
    checkRecalls,
    getVehicleValuation,
    getAIInsights,
    getNotifications,
    parseNaturalLanguageQuery,
    getWorkflowTemplates,
    triggerWorkflow,
    detectCostAnomalies
};

export default aiServices;

