"""Natural Language Search API Router."""
from fastapi import APIRouter

from app.schemas.search import NLSearchRequest, NLSearchResponse
from app.services.search import natural_language_search_service

router = APIRouter()


@router.post("/parse", response_model=NLSearchResponse)
async def parse_query(request: NLSearchRequest):
    """
    Parse a natural language search query.
    
    Converts natural language like "Show all Toyota vehicles with over 100,000 miles"
    into structured query filters that can be used with the database.
    
    Returns:
    - Parsed entity (vehicle, owner, service_record, etc.)
    - Extracted filters
    - SQL-equivalent query
    - Query suggestions
    """
    return await natural_language_search_service.parse(request)


@router.get("/parse")
async def parse_query_get(q: str, max_results: int = 50):
    """Parse a natural language query (GET method for convenience)."""
    request = NLSearchRequest(query=q, max_results=max_results)
    return await natural_language_search_service.parse(request)


@router.get("/demo")
async def demo_natural_language_search():
    """
    Demo endpoint showing natural language query parsing.
    
    Returns parsed results for sample queries.
    """
    sample_queries = [
        "Show all Toyota vehicles with over 100,000 miles",
        "Find overdue inspections",
        "List service records from this month",
        "Show vehicles with expiring insurance",
        "Find Honda cars from 2020",
        "How many vehicles have open recalls"
    ]
    
    results = []
    for query in sample_queries:
        request = NLSearchRequest(query=query)
        parsed = await natural_language_search_service.parse(request)
        results.append({
            "query": query,
            "parsed": parsed
        })
    
    return {
        "examples": results,
        "note": "Natural language queries are converted to structured database queries"
    }


@router.get("/suggestions")
async def get_query_suggestions(entity: str = "vehicle"):
    """Get suggested queries for an entity type."""
    suggestions = {
        "vehicle": [
            "Show all active vehicles",
            "Find vehicles with high mileage",
            "List Toyota vehicles from 2020",
            "Show vehicles needing service",
            "Find cars with expiring insurance"
        ],
        "service_record": [
            "Show all maintenance records",
            "Find repairs over $500",
            "List services from this month",
            "Show warranty services",
            "Find recall services"
        ],
        "inspection": [
            "Show overdue inspections",
            "Find inspections expiring soon",
            "List failed inspections",
            "Show emissions tests"
        ],
        "insurance_policy": [
            "Find expiring policies",
            "Show full coverage policies",
            "List policies by provider"
        ],
        "recall": [
            "Show open recalls",
            "Find critical recalls",
            "List completed recalls"
        ]
    }
    
    return {
        "entity": entity,
        "suggestions": suggestions.get(entity, suggestions["vehicle"])
    }

