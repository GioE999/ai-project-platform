"""Request schemas for agent API."""
from pydantic import BaseModel
from typing import Optional


class AgentContext(BaseModel):
    thread_id: Optional[str] = None
    project_id: Optional[str] = None
    task_id: Optional[str] = None
    note_id: Optional[str] = None
    meeting_id: Optional[str] = None


class AgentChatRequest(BaseModel):
    id: str
    user_id: str
    input: str
    context: AgentContext = AgentContext()
    target_agent: Optional[str] = None
