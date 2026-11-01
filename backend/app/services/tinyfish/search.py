"""
TinyFish Search API service.
GET https://api.search.tinyfish.ai
Query params: query, location, language, recency_minutes
"""
from typing import Optional, List
from app.services.tinyfish.client import tinyfish_client


class SearchResult:
    def __init__(self, data: dict):
        self.position: int = data.get("position", 0)
        self.site_name: str = data.get("site_name", "")
        self.title: str = data.get("title", "")
        self.snippet: str = data.get("snippet", "")
        self.url: str = data.get("url", "")

    def to_dict(self) -> dict:
        return {
            "position": self.position,
            "site_name": self.site_name,
            "title": self.title,
            "snippet": self.snippet,
            "url": self.url,
        }


class SearchResponse:
    def __init__(self, data: dict):
        self.query: str = data.get("query", "")
        self.results: List[SearchResult] = [
            SearchResult(r) for r in data.get("results", [])
        ]
        self.total_results: int = data.get("total_results", 0)
        self.page: int = data.get("page", 1)

    def get_urls(self) -> List[str]:
        return [r.url for r in self.results if r.url]

    def to_dict(self) -> dict:
        return {
            "query": self.query,
            "results": [r.to_dict() for r in self.results],
            "total_results": self.total_results,
            "page": self.page,
        }


async def search(
    query: str,
    location: Optional[str] = None,
    language: Optional[str] = None,
    recency_minutes: Optional[int] = None,
) -> SearchResponse:
    """
    Search the web via TinyFish Search API.
    Returns a SearchResponse with parsed results.
    """
    params = {"query": query}
    if location:
        params["location"] = location
    if language:
        params["language"] = language
    if recency_minutes:
        params["recency_minutes"] = recency_minutes

    data = await tinyfish_client.get(tinyfish_client.SEARCH_URL, params=params)
    return SearchResponse(data)
