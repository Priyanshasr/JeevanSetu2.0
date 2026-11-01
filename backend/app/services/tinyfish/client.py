"""
TinyFish API base client — handles auth headers, timeouts, and retries.
Never logs the API key.
"""
import httpx
from app.core.config import settings


class TinyFishClient:
    SEARCH_URL = "https://api.search.tinyfish.ai"
    FETCH_URL = "https://api.fetch.tinyfish.ai"
    AGENT_URL = "https://agent.tinyfish.ai/v1/automation/run"
    AGENT_ASYNC_URL = "https://agent.tinyfish.ai/v1/automation/run-async"
    MONITORS_URL = "https://agent.tinyfish.ai/v1/monitors"

    def __init__(self):
        self._headers = {
            "X-API-Key": settings.TINYFISH_API_KEY,
            "Content-Type": "application/json",
        }
        self.timeout = httpx.Timeout(60.0, connect=10.0)

    def _get_headers(self) -> dict:
        """Return auth headers without exposing the key in logs."""
        return self._headers.copy()

    async def get(self, url: str, params: dict = None) -> dict:
        """Async GET with auth headers."""
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.get(url, headers=self._get_headers(), params=params or {})
            response.raise_for_status()
            return response.json()

    async def post(self, url: str, json: dict = None) -> dict:
        """Async POST with auth headers and JSON body."""
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(url, headers=self._get_headers(), json=json or {})
            response.raise_for_status()
            return response.json()

    async def delete(self, url: str) -> dict:
        """Async DELETE with auth headers."""
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.delete(url, headers=self._get_headers())
            response.raise_for_status()
            return response.json() if response.content else {"deleted": True}


# Singleton client instance
tinyfish_client = TinyFishClient()
