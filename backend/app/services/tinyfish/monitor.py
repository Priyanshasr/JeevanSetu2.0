"""
TinyFish Monitor API service.
Create and manage recurring monitors for provider websites and search queries.
POST/GET/DELETE https://agent.tinyfish.ai/v1/monitors
"""
from typing import Optional, List
from app.services.tinyfish.client import tinyfish_client


async def create_fetch_monitor(
    name: str,
    url: str,
    schedule_cron: str = "0 9 * * *",
    purpose: str = "Provider contact details or services changed",
    webhook_url: Optional[str] = None,
) -> dict:
    """Create a page monitor using TinyFish Fetch."""
    payload = {
        "type": "fetch",
        "name": name,
        "config": {
            "url": url,
            "format": "markdown",
        },
        "schedule_cron": schedule_cron,
        "purpose": purpose,
    }
    if webhook_url:
        payload["webhook_url"] = webhook_url

    return await tinyfish_client.post(tinyfish_client.MONITORS_URL, json=payload)


async def create_search_monitor(
    name: str,
    query: str,
    schedule_cron: str = "0 */6 * * *",
    recency_minutes: int = 1440,
    result_limit: int = 5,
    purpose: str = "New healthcare facilities or emergency services announced",
    webhook_url: Optional[str] = None,
) -> dict:
    """Create a topic search monitor."""
    payload = {
        "type": "search",
        "name": name,
        "config": {
            "query": query,
            "recency_minutes": recency_minutes,
            "result_limit": result_limit,
        },
        "schedule_cron": schedule_cron,
        "purpose": purpose,
    }
    if webhook_url:
        payload["webhook_url"] = webhook_url

    return await tinyfish_client.post(tinyfish_client.MONITORS_URL, json=payload)


async def list_monitors() -> List[dict]:
    """List all registered monitors."""
    try:
        response = await tinyfish_client.get(tinyfish_client.MONITORS_URL)
        if isinstance(response, list):
            return response
        return response.get("monitors", [])
    except Exception as e:
        print(f"[TinyFish Monitor] Error listing monitors: {e}")
        return []


async def delete_monitor(monitor_id: str) -> dict:
    """Delete a monitor by ID."""
    url = f"{tinyfish_client.MONITORS_URL}/{monitor_id}"
    return await tinyfish_client.delete(url)
