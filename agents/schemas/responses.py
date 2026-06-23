"""Response schemas for agent API."""
from pydantic import BaseModel
from typing import Optional, Any


class AgentAction(BaseModel):
    type: str
    payload: dict[str, Any] = {}
    result: Optional[Any] = None


class AgentMetadata(BaseModel):
    tokens_used: int = 0
    latency_ms: int = 0
    cost: float = 0.0


class AgentChatResponse(BaseModel):
    id: str
    request_id: str
    agent: str
    content: str
    actions: list[AgentAction] = []
    metadata: AgentMetadata = AgentMetadata()
