"""Natural language search schemas."""
from pydantic import BaseModel
from typing import Optional, Any


class NLSearchRequest(BaseModel):
    """Natural language search request."""
    query: str
    context: Optional[str] = None  # Additional context
    max_results: int = 50


class ParsedFilter(BaseModel):
    """Parsed filter from natural language."""
    field: str
    operator: str  # eq, gt, lt, gte, lte, contains, is_null
    value: Any


class ParsedQuery(BaseModel):
    """Parsed natural language query."""
    entity: str
    filters: list[ParsedFilter]
    joins: list[str] = []
    sort_field: Optional[str] = None
    sort_direction: str = "desc"
    limit: Optional[int] = None
    intent: str  # search, count, aggregate, compare


class NLSearchResponse(BaseModel):
    """Natural language search response."""
    original_query: str
    parsed_query: ParsedQuery
    sql_equivalent: Optional[str] = None
    confidence: float
    suggestions: list[str] = []
    explanation: str

