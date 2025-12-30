# Automotive AI Backend

FastAPI backend providing AI-powered services for the Automotive Database Management System.

## Features

- **VIN Decoder**: Decode Vehicle Identification Numbers to get manufacturer, model, year, and specifications
- **Predictive Maintenance**: AI-powered maintenance predictions based on vehicle data and service history
- **Recall Matching**: Check vehicles against NHTSA recall database (mocked)
- **Vehicle Valuation**: Estimate current market value using ML-based depreciation models
- **Cost Anomaly Detection**: Detect unusual service costs that may indicate errors or fraud
- **Document Processing**: OCR-based data extraction from service receipts and insurance cards (mocked)
- **Natural Language Search**: Convert natural language queries to structured database filters
- **Workflow Automation**: Automated task execution for notifications, reminders, and follow-ups
- **AI Insights**: Generate actionable insights from fleet data analysis
- **Notifications**: Automated notification generation for expiring documents, due services, etc.

## Installation

### Prerequisites

- Python 3.10+
- pip or conda

### Setup with pip

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
```

### Setup with Conda

```bash
conda env create -f environment.yaml
conda activate automotive-ai
```

## Running the Server

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### VIN Decoder
- `POST /api/vin/decode` - Decode a VIN
- `GET /api/vin/decode/{vin}` - Decode a VIN (GET)
- `POST /api/vin/validate` - Validate a VIN

### Predictions
- `POST /api/predictions/maintenance` - Get maintenance predictions for vehicles
- `POST /api/predictions/maintenance/single` - Predict for single vehicle
- `GET /api/predictions/demo` - Demo with sample data

### Recalls
- `POST /api/recalls/check` - Check multiple vehicles for recalls
- `GET /api/recalls/check/{make}/{model}/{year}` - Check specific vehicle
- `GET /api/recalls/all` - Get all known recalls

### Valuations
- `POST /api/valuations/estimate` - Get vehicle valuation
- `POST /api/valuations/batch` - Valuate multiple vehicles
- `GET /api/valuations/demo` - Demo valuation

### Anomaly Detection
- `POST /api/anomalies/analyze` - Analyze service records for anomalies
- `POST /api/anomalies/check` - Check single record
- `GET /api/anomalies/demo` - Demo analysis

### Document Processing
- `POST /api/documents/process` - Process a document
- `POST /api/documents/upload` - Upload and process file
- `GET /api/documents/demo/{document_type}` - Demo extraction
- `GET /api/documents/supported-types` - List supported types

### Natural Language Search
- `POST /api/search/parse` - Parse natural language query
- `GET /api/search/parse?q={query}` - Parse query (GET)
- `GET /api/search/demo` - Demo with sample queries
- `GET /api/search/suggestions` - Get query suggestions

### Workflows
- `GET /api/workflows/templates` - List workflow templates
- `GET /api/workflows/templates/{id}` - Get specific template
- `POST /api/workflows/trigger` - Trigger workflow execution
- `GET /api/workflows/instances` - List workflow instances
- `GET /api/workflows/demo` - Demo workflow execution

### Insights
- `POST /api/insights/generate` - Generate AI insights
- `GET /api/insights/active` - Get active insights
- `GET /api/insights/types` - List insight types
- `GET /api/insights/demo` - Demo insight generation

### Notifications
- `POST /api/notifications/generate` - Generate notifications
- `GET /api/notifications/` - List notifications
- `GET /api/notifications/unread` - Get unread notifications
- `GET /api/notifications/urgent` - Get urgent notifications
- `POST /api/notifications/{id}/read` - Mark as read
- `POST /api/notifications/{id}/dismiss` - Dismiss notification

## Configuration

Create a `.env` file in the backend directory:

```env
# Supabase (optional - for database integration)
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# API Settings
DEBUG=true
USE_MOCK_APIS=true
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── routers/             # API route handlers
│   │   ├── vin_decoder.py
│   │   ├── predictions.py
│   │   ├── recalls.py
│   │   ├── valuations.py
│   │   ├── anomalies.py
│   │   ├── documents.py
│   │   ├── search.py
│   │   ├── workflows.py
│   │   ├── insights.py
│   │   └── notifications.py
│   ├── services/            # Business logic and mock implementations
│   │   ├── vin_decoder.py
│   │   ├── predictions.py
│   │   ├── recalls.py
│   │   ├── valuations.py
│   │   ├── anomalies.py
│   │   ├── documents.py
│   │   ├── search.py
│   │   ├── workflows.py
│   │   ├── insights.py
│   │   └── notifications.py
│   └── schemas/             # Pydantic models
│       ├── common.py
│       ├── vin.py
│       ├── predictions.py
│       ├── recalls.py
│       ├── valuations.py
│       ├── anomalies.py
│       ├── documents.py
│       ├── search.py
│       ├── workflows.py
│       ├── insights.py
│       └── notifications.py
├── requirements.txt
├── environment.yaml
└── README.md
```

## Mock Mode

By default, all services run in mock mode, returning simulated data without requiring external APIs. This is useful for:

- Demo and testing purposes
- Development without API keys
- Offline development

To switch to real API integrations, set `USE_MOCK_APIS=false` in the configuration and implement the actual API calls.

## Extending the Backend

### Adding a New Service

1. Create schema in `app/schemas/`
2. Create service in `app/services/`
3. Create router in `app/routers/`
4. Register router in `app/main.py`

### Connecting to Real APIs

Replace the mock implementations in `app/services/` with actual API calls:

- **VIN Decoder**: NHTSA API (https://vpic.nhtsa.dot.gov/api/)
- **Recalls**: NHTSA Recalls API (https://api.nhtsa.gov/recalls/)
- **Valuations**: KBB or Edmunds API (requires subscription)
- **Document OCR**: AWS Textract, Google Cloud Vision, or Azure Form Recognizer

