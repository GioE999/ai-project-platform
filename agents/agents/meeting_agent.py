"""MeetingAgent - Manages Google Meet integration and post-meeting processing."""
import uuid
from ..schemas.requests import AgentChatRequest
from ..schemas.responses import AgentChatResponse, AgentMetadata, AgentAction


class MeetingAgent:
    """Agent that manages meetings, generates summaries, and extracts action items."""

    async def process(self, request: AgentChatRequest) -> AgentChatResponse:
        """Process meeting-related requests."""
        content = "I'll help you with your meeting."
        actions = []

        text = request.input.lower()
        if "schedule" in text or "create" in text:
            actions.append(AgentAction(
                type="meeting.create",
                payload={"title": request.input},
            ))
            content = "I'll schedule that meeting for you."
        elif "summary" in text or "summarize" in text:
            actions.append(AgentAction(
                type="meeting.summarize",
                payload={},
            ))
            content = "I'll generate a summary of the meeting."

        return AgentChatResponse(
            id=str(uuid.uuid4()),
            request_id=request.id,
            agent="meeting",
            content=content,
            actions=actions,
            metadata=AgentMetadata(),
        )
