"""
TinyFish Agent API service.
POST https://agent.tinyfish.ai/v1/automation/run
Runs multi-step goal-based browser automation and returns structured results.
"""
from typing import Optional, Any
from app.services.tinyfish.client import tinyfish_client


async def run_agent(url: str, goal: str, output_schema: Optional[dict] = None) -> dict:
    """
    Run TinyFish autonomous agent on a target URL with a natural language goal.
    Returns the automation result dict.
    """
    payload: dict[str, Any] = {
        "url": url,
        "goal": goal,
    }
    if output_schema:
        payload["output_schema"] = output_schema

    response = await tinyfish_client.post(tinyfish_client.AGENT_URL, json=payload)
    return response


async def run_agent_async(url: str, goal: str, output_schema: Optional[dict] = None) -> dict:
    """
    Run TinyFish automation asynchronously for long tasks.
    Returns run_id and status.
    """
    payload: dict[str, Any] = {
        "url": url,
        "goal": goal,
    }
    if output_schema:
        payload["output_schema"] = output_schema

    response = await tinyfish_client.post(tinyfish_client.AGENT_ASYNC_URL, json=payload)
    return response
