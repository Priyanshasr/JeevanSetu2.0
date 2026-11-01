"""
TinyFish Fetch API service.
POST https://api.fetch.tinyfish.ai
Body: {urls: ["url1", "url2"]} (max 10 URLs)
"""
from typing import List, Optional
from app.services.tinyfish.client import tinyfish_client


class FetchedPage:
    def __init__(self, data: dict):
        self.url: str = data.get("url", "")
        self.final_url: str = data.get("final_url", self.url)
        self.title: str = data.get("title", "")
        self.description: str = data.get("description", "")
        self.language: str = data.get("language", "")
        self.format: str = data.get("format", "markdown")
        self.text: str = data.get("text", "")

    def to_dict(self) -> dict:
        return {
            "url": self.url,
            "final_url": self.final_url,
            "title": self.title,
            "description": self.description,
            "language": self.language,
            "format": self.format,
            "text": self.text,
        }


class FetchResponse:
    def __init__(self, data: dict):
        self.results: List[FetchedPage] = [
            FetchedPage(r) for r in data.get("results", [])
        ]
        self.errors: List[dict] = data.get("errors", [])

    def to_dict(self) -> dict:
        return {
            "results": [r.to_dict() for r in self.results],
            "errors": self.errors,
        }


async def fetch(urls: List[str]) -> FetchResponse:
    """
    Fetch and extract content from up to 10 URLs via TinyFish Fetch API.
    Returns parsed page content in markdown format.
    """
    # API enforces max 10 URLs per request
    urls = urls[:10]
    data = await tinyfish_client.post(tinyfish_client.FETCH_URL, json={"urls": urls})
    return FetchResponse(data)
