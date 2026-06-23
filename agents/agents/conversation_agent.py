"""ConversationAgent - Handles conversation threads."""
import uuid
from ..schemas.requests import AgentChatRequest
from ..schemas.responses import AgentChatResponse, AgentMetadata


class ConversationAgent:
    """Agent that manages conversation threads, summarizes, and suggests next steps."""

    async def process(self, request: AgentChatRequest) -> AgentChatResponse:
        """Process conversation requests."""
        content = "I understand your message. Let me help with that."

        return AgentChatResponse(
            id=str(uuid.uuid4()),
            request_id=request.id,
            agent="conversation",
            content=content,
            actions=[],
            metadata=AgentMetadata(),
        )
