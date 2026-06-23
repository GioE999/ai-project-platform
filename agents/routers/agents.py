"""Agent API endpoints."""
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from ..schemas.requests import AgentChatRequest
from ..schemas.responses import AgentChatResponse
from ..agents.root_agent import RootAgent

router = APIRouter()
root_agent = RootAgent()


@router.post("/chat", response_model=AgentChatResponse)
async def chat(request: AgentChatRequest):
    """Process a chat request through the agent system."""
    try:
        response = await root_agent.process(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))


@router.get("/chat/{request_id}/stream")
async def chat_stream(request_id: str):
    """Stream agent responses via Server-Sent Events."""

    async def event_generator():
        yield f'data: {{"status": "processing", "requestId": "{request_id}"}}\n\n'
        yield f'data: {{"status": "completed", "requestId": "{request_id}"}}\n\n'

    return StreamingResponse(event_generator(), media_type="text/event-stream")
