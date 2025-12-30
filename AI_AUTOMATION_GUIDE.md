# AI and Automation Enhancement Guide

This document describes the advanced AI and automation features added to the Automotive Database Management System.

## Overview

The system has been enhanced with the following AI-powered capabilities:

1. **Predictive Maintenance** - ML-based service predictions
2. **VIN Decoder** - Automatic vehicle information extraction
3. **Recall Matching** - NHTSA recall database integration
4. **Vehicle Valuation** - AI-powered market value estimation
5. **Cost Anomaly Detection** - Fraud and error detection
6. **Document Processing** - OCR-based data extraction
7. **Natural Language Search** - Query using plain English
8. **Workflow Automation** - Automated task execution
9. **AI Insights** - Fleet analytics and recommendations
10. **Smart Notifications** - Automated alerts and reminders

## Architecture

```
Frontend (React)                    Backend (FastAPI)
+------------------+               +------------------+
|                  |               |                  |
| Smart Search     |<------------->| /api/search      |
| VIN Decoder      |<------------->| /api/vin         |
| Predictive Maint |<------------->| /api/predictions |
| AI Insights      |<------------->| /api/insights    |
| Workflows        |<------------->| /api/workflows   |
|                  |               |                  |
+------------------+               +------------------+
        |                                   |
        v                                   v
+------------------+               +------------------+
| Supabase         |               | Mock AI Services |
| (PostgreSQL)     |               | (Simulated ML)   |
+------------------+               +------------------+
```

## New Database Tables

The following tables have been added in `schema_ai.sql`:

| Table | Purpose |
|-------|---------|
| `maintenance_prediction` | Stores AI-generated maintenance predictions |
| `cost_anomaly` | Records detected cost anomalies |
| `vehicle_valuation` | Tracks vehicle value estimates over time |
| `notification_rule` | Configurable notification triggers |
| `notification` | User notifications and alerts |
| `workflow_template` | Reusable workflow definitions |
| `workflow_instance` | Running workflow executions |
| `workflow_step_execution` | Individual step results |
| `ai_insight` | Generated insights and recommendations |
| `nl_query_log` | Natural language query history |
| `vin_decode_cache` | Cached VIN decode results |
| `document_processing_job` | Document OCR job queue |
| `recall_sync_log` | Recall database sync history |

## Frontend Components

New React components in `demo/src/components/`:

| Component | Route | Description |
|-----------|-------|-------------|
| `SmartSearch.js` | `/smart-search` | Natural language query interface |
| `PredictiveMaintenance.js` | `/predictive-maintenance` | ML predictions dashboard |
| `VINDecoder.js` | `/vin-decoder` | VIN lookup and decode tool |
| `WorkflowAutomation.js` | `/workflows` | Workflow management UI |
| `AIInsights.js` | Dashboard | Insight cards and alerts |

## Backend Services

All services in `backend/app/services/` use mock implementations for demo:

### VIN Decoder Service
```python
# Decode a VIN
from app.services.vin_decoder import vin_decoder_service
result = await vin_decoder_service.decode("1HGBH41JXMN109186")
# Returns: manufacturer, model, year, type, fuel, transmission
```

### Predictive Maintenance Service
```python
# Get maintenance predictions
from app.services.predictions import predictive_maintenance_service
predictions = await predictive_maintenance_service.predict(vehicles)
# Returns: predicted_date, service_type, risk_level, estimated_cost
```

### Recall Matching Service
```python
# Check for recalls
from app.services.recalls import recall_matching_service
matches = await recall_matching_service.check_fleet(vehicles)
# Returns: matching recalls with severity and remedies
```

### Vehicle Valuation Service
```python
# Estimate vehicle value
from app.services.valuations import vehicle_valuation_service
valuation = await vehicle_valuation_service.valuate(vehicle_data)
# Returns: estimated_value, value_range, depreciation_factors
```

### Natural Language Search Service
```python
# Parse natural language query
from app.services.search import natural_language_search_service
parsed = await natural_language_search_service.parse(request)
# Returns: entity, filters, SQL equivalent, confidence
```

## Frontend AI Services

The `demo/src/services/aiServices.js` file provides client-side mock implementations:

```javascript
import { 
    decodeVIN,
    getPredictiveMaintenance,
    checkRecalls,
    getVehicleValuation,
    getAIInsights,
    parseNaturalLanguageQuery
} from '../services/aiServices';

// Decode VIN
const vehicleInfo = await decodeVIN('1HGBH41JXMN109186');

// Get predictions
const predictions = await getPredictiveMaintenance(vehicles);

// Check recalls
const recallMatches = await checkRecalls(vehicles);

// Get insights
const insights = await getAIInsights({ timeRangeDays: 30 });
```

## Running the System

### Frontend Only (Mock Mode)

```bash
cd demo
npm install
npm start
```

The frontend will use built-in mock services that simulate AI responses.

### Full Stack (Backend + Frontend)

1. Start the backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

2. Start the frontend:
```bash
cd demo
npm start
```

3. Configure the frontend to use the backend:
```env
REACT_APP_AI_API_URL=http://localhost:8000/api
```

## Database Setup

1. Run the base schema:
```sql
\i schema.sql
```

2. Run enhancement tables:
```sql
\i schema_enhancements.sql
```

3. Run AI/Automation tables:
```sql
\i schema_ai.sql
```

4. Load sample data:
```sql
\i sample_data.sql
\i sample_data_enhancements.sql
\i sample_data_ai.sql
```

## Workflow Templates

Pre-built workflow templates:

| Workflow | Trigger | Actions |
|----------|---------|---------|
| Post-Service Follow-up | Service created | Wait 24h, send email, log |
| Insurance Expiration | Daily check | Notify, email, SMS |
| Service Due Reminder | Condition | Notify, wait, remind |
| Recall Notification | Recall matched | Urgent notify, email, SMS |
| Vehicle Onboarding | Vehicle created | Decode VIN, check recalls, valuate |

## AI Insight Types

| Type | Category | Example |
|------|----------|---------|
| `cost_trend` | Financial | "Service costs up 18% this month" |
| `maintenance_pattern` | Maintenance | "6 vehicles need major service" |
| `fleet_health` | Operations | "94% compliance rate" |
| `anomaly` | Financial | "3 unusual cost entries detected" |
| `recommendation` | Optimization | "Switch to preventive maintenance" |
| `compliance` | Regulatory | "4 inspections expiring soon" |

## Natural Language Query Examples

| Query | Parsed Entity | Filters |
|-------|---------------|---------|
| "Show all Toyota vehicles" | vehicle | manufacturer = Toyota |
| "Find high mileage cars" | vehicle | mileage > 100000 |
| "List overdue inspections" | inspection | expiration_date < today |
| "How many recalls are open" | recall | status != completed |

## Extending the System

### Adding a New AI Service

1. Create schema: `backend/app/schemas/your_service.py`
2. Create service: `backend/app/services/your_service.py`
3. Create router: `backend/app/routers/your_service.py`
4. Register in `backend/app/main.py`
5. Add frontend service: `demo/src/services/aiServices.js`
6. Create component: `demo/src/components/YourComponent.js`
7. Add route in `demo/src/App.js`

### Connecting Real APIs

Replace mock implementations with real API calls:

| Service | Real API |
|---------|----------|
| VIN Decoder | NHTSA vPIC API (free) |
| Recalls | NHTSA Recalls API (free) |
| Valuations | KBB/Edmunds API (paid) |
| Document OCR | AWS Textract / Google Vision |
| ML Predictions | Custom trained models |

## API Documentation

When the backend is running, access:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Best Practices

1. **Confidence Thresholds**: Only act on predictions with confidence > 0.7
2. **Anomaly Review**: All detected anomalies should be manually reviewed
3. **Workflow Testing**: Test workflows in mock mode before production
4. **Rate Limiting**: Implement rate limits for external API calls
5. **Data Privacy**: Ensure VIN/owner data is handled securely

## Troubleshooting

### Frontend not showing AI features
- Check that new routes are added to `App.js`
- Verify `aiServices.js` is imported correctly
- Clear browser cache and restart dev server

### Backend API errors
- Ensure all dependencies installed: `pip install -r requirements.txt`
- Check Python version >= 3.10
- Verify port 8000 is not in use

### Database schema errors
- Run SQL files in correct order
- Check for existing table conflicts
- Verify UUID extension is enabled

## Future Enhancements

Potential additions:

- [ ] Real ML model training pipeline
- [ ] Integration with OBD-II devices
- [ ] Mobile push notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Voice command integration
- [ ] Automated parts ordering
- [ ] Integration with dealer management systems

