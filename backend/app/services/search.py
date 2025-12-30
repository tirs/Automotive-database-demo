"""Mock Natural Language Search Service.

Simulates AI-powered natural language query parsing.
"""
import re
from typing import Optional, Any
from datetime import date, timedelta

from app.schemas.search import (
    NLSearchRequest,
    NLSearchResponse,
    ParsedQuery,
    ParsedFilter
)


# Entity detection patterns
ENTITY_PATTERNS = {
    "vehicle": [
        r"vehicle[s]?", r"car[s]?", r"truck[s]?", r"suv[s]?", r"auto[s]?"
    ],
    "owner": [
        r"owner[s]?", r"customer[s]?", r"client[s]?"
    ],
    "service_record": [
        r"service[s]?", r"maintenance", r"repair[s]?", r"service record[s]?"
    ],
    "inspection": [
        r"inspection[s]?", r"emission[s]?"
    ],
    "insurance_policy": [
        r"insurance", r"polic(?:y|ies)", r"coverage"
    ],
    "warranty": [
        r"warrant(?:y|ies)"
    ],
    "recall": [
        r"recall[s]?"
    ],
    "accident": [
        r"accident[s]?", r"crash(?:es)?", r"collision[s]?"
    ],
    "fuel_record": [
        r"fuel", r"gas", r"mileage"
    ]
}

# Field detection patterns
FIELD_PATTERNS = {
    "status": [
        (r"active", "active"),
        (r"sold", "sold"),
        (r"overdue", "overdue"),
        (r"expired", "expired"),
        (r"pending", "pending"),
        (r"completed", "completed"),
    ],
    "year": [
        (r"(\d{4})", None),  # Extract the year
    ],
    "mileage": [
        (r"over (\d+(?:,\d+)?)\s*(?:miles|mi)", "gt"),
        (r"under (\d+(?:,\d+)?)\s*(?:miles|mi)", "lt"),
        (r"high mileage", "gt:100000"),
        (r"low mileage", "lt:50000"),
    ],
    "manufacturer": [
        (r"toyota", "Toyota"),
        (r"honda", "Honda"),
        (r"ford", "Ford"),
        (r"chevrolet|chevy", "Chevrolet"),
        (r"bmw", "BMW"),
        (r"mercedes", "Mercedes-Benz"),
        (r"tesla", "Tesla"),
        (r"nissan", "Nissan"),
        (r"jeep", "Jeep"),
    ],
    "date_range": [
        (r"this month", "this_month"),
        (r"last month", "last_month"),
        (r"this year", "this_year"),
        (r"last year", "last_year"),
        (r"past (\d+) days?", "days"),
        (r"past (\d+) weeks?", "weeks"),
        (r"past (\d+) months?", "months"),
    ]
}

# Intent patterns
INTENT_PATTERNS = [
    (r"how many|count|total number", "count"),
    (r"list|show|find|get|display", "search"),
    (r"compare", "compare"),
    (r"average|sum|total cost", "aggregate"),
]


def _detect_entity(query: str) -> str:
    """Detect the main entity being queried."""
    query_lower = query.lower()
    
    for entity, patterns in ENTITY_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, query_lower):
                return entity
    
    return "vehicle"  # Default to vehicle


def _detect_intent(query: str) -> str:
    """Detect the query intent."""
    query_lower = query.lower()
    
    for pattern, intent in INTENT_PATTERNS:
        if re.search(pattern, query_lower):
            return intent
    
    return "search"


def _extract_filters(query: str, entity: str) -> list[ParsedFilter]:
    """Extract filters from the query."""
    filters = []
    query_lower = query.lower()
    
    # Status filters
    for pattern, value in FIELD_PATTERNS["status"]:
        if re.search(pattern, query_lower):
            filters.append(ParsedFilter(
                field="status",
                operator="eq",
                value=value
            ))
    
    # Year filter
    year_match = re.search(r"\b(20\d{2})\b", query)
    if year_match:
        filters.append(ParsedFilter(
            field="year",
            operator="eq",
            value=int(year_match.group(1))
        ))
    
    # Mileage filters
    for pattern, op_type in FIELD_PATTERNS["mileage"]:
        match = re.search(pattern, query_lower)
        if match:
            if ":" in str(op_type):
                op, val = op_type.split(":")
                filters.append(ParsedFilter(
                    field="mileage",
                    operator=op,
                    value=int(val)
                ))
            elif match.groups():
                mileage_val = int(match.group(1).replace(",", ""))
                filters.append(ParsedFilter(
                    field="mileage",
                    operator=op_type,
                    value=mileage_val
                ))
    
    # Manufacturer filter
    for pattern, value in FIELD_PATTERNS["manufacturer"]:
        if re.search(pattern, query_lower):
            filters.append(ParsedFilter(
                field="manufacturer",
                operator="eq",
                value=value
            ))
            break
    
    # Date range filters
    today = date.today()
    for pattern, range_type in FIELD_PATTERNS["date_range"]:
        match = re.search(pattern, query_lower)
        if match:
            if range_type == "this_month":
                start = today.replace(day=1)
                filters.append(ParsedFilter(
                    field="created_at",
                    operator="gte",
                    value=start.isoformat()
                ))
            elif range_type == "last_month":
                first_of_month = today.replace(day=1)
                last_month_end = first_of_month - timedelta(days=1)
                last_month_start = last_month_end.replace(day=1)
                filters.append(ParsedFilter(
                    field="created_at",
                    operator="gte",
                    value=last_month_start.isoformat()
                ))
                filters.append(ParsedFilter(
                    field="created_at",
                    operator="lte",
                    value=last_month_end.isoformat()
                ))
            elif range_type == "days" and match.groups():
                days = int(match.group(1))
                start = today - timedelta(days=days)
                filters.append(ParsedFilter(
                    field="created_at",
                    operator="gte",
                    value=start.isoformat()
                ))
            break
    
    # Overdue inspection filter
    if "overdue" in query_lower and entity == "inspection":
        filters.append(ParsedFilter(
            field="expiration_date",
            operator="lt",
            value=today.isoformat()
        ))
    
    # Expiring soon filter
    if "expiring" in query_lower or "expires soon" in query_lower:
        filters.append(ParsedFilter(
            field="expiration_date",
            operator="lte",
            value=(today + timedelta(days=30)).isoformat()
        ))
        filters.append(ParsedFilter(
            field="expiration_date",
            operator="gte",
            value=today.isoformat()
        ))
    
    return filters


def _generate_sql_equivalent(parsed: ParsedQuery) -> str:
    """Generate SQL-like query for explanation."""
    sql = f"SELECT * FROM {parsed.entity}"
    
    if parsed.filters:
        conditions = []
        for f in parsed.filters:
            op_map = {
                "eq": "=",
                "gt": ">",
                "lt": "<",
                "gte": ">=",
                "lte": "<=",
                "contains": "LIKE"
            }
            op = op_map.get(f.operator, "=")
            val = f"'{f.value}'" if isinstance(f.value, str) else f.value
            conditions.append(f"{f.field} {op} {val}")
        sql += " WHERE " + " AND ".join(conditions)
    
    if parsed.sort_field:
        sql += f" ORDER BY {parsed.sort_field} {parsed.sort_direction.upper()}"
    
    if parsed.limit:
        sql += f" LIMIT {parsed.limit}"
    
    return sql


def _generate_suggestions(query: str, entity: str) -> list[str]:
    """Generate query suggestions."""
    suggestions = []
    
    if entity == "vehicle":
        suggestions = [
            "Show all Toyota vehicles with over 100,000 miles",
            "List vehicles with overdue inspections",
            "Find cars with expiring insurance"
        ]
    elif entity == "service_record":
        suggestions = [
            "Show all maintenance records from this month",
            "Find repairs costing over $500",
            "List warranty services"
        ]
    elif entity == "inspection":
        suggestions = [
            "Show overdue inspections",
            "Find inspections expiring this month",
            "List failed inspections"
        ]
    
    return suggestions[:3]


class NaturalLanguageSearchService:
    """Mock natural language search service."""
    
    async def parse(self, request: NLSearchRequest) -> NLSearchResponse:
        """Parse a natural language query."""
        query = request.query.strip()
        
        # Detect main entity
        entity = _detect_entity(query)
        
        # Detect intent
        intent = _detect_intent(query)
        
        # Extract filters
        filters = _extract_filters(query, entity)
        
        # Determine sort
        sort_field = None
        sort_direction = "desc"
        
        if "newest" in query.lower() or "recent" in query.lower():
            sort_field = "created_at"
            sort_direction = "desc"
        elif "oldest" in query.lower():
            sort_field = "created_at"
            sort_direction = "asc"
        elif "highest" in query.lower() and "mileage" in query.lower():
            sort_field = "mileage"
            sort_direction = "desc"
        elif "lowest" in query.lower() and "mileage" in query.lower():
            sort_field = "mileage"
            sort_direction = "asc"
        
        # Determine joins
        joins = []
        if entity == "vehicle":
            if any(f.field == "manufacturer" for f in filters):
                joins.append("vehicle_model")
                joins.append("manufacturer")
        
        # Build parsed query
        parsed = ParsedQuery(
            entity=entity,
            filters=filters,
            joins=joins,
            sort_field=sort_field,
            sort_direction=sort_direction,
            limit=request.max_results,
            intent=intent
        )
        
        # Generate SQL equivalent
        sql = _generate_sql_equivalent(parsed)
        
        # Generate explanation
        explanation = f"Searching {entity.replace('_', ' ')}s"
        if filters:
            explanation += f" with {len(filters)} filter(s)"
        if sort_field:
            explanation += f", sorted by {sort_field}"
        
        # Calculate confidence
        confidence = 0.85 if filters else 0.70
        if len(query.split()) > 10:
            confidence -= 0.1  # Complex queries have lower confidence
        
        return NLSearchResponse(
            original_query=query,
            parsed_query=parsed,
            sql_equivalent=sql,
            confidence=round(confidence, 2),
            suggestions=_generate_suggestions(query, entity),
            explanation=explanation
        )


# Singleton instance
natural_language_search_service = NaturalLanguageSearchService()

