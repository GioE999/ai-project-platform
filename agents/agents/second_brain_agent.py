"""SecondBrainAgent - Manages notes, knowledge graph, and semantic search."""
import uuid
from ..schemas.requests import AgentChatRequest
from ..schemas.responses import AgentChatResponse, AgentMetadata, AgentAction


class SecondBrainAgent:
    """Agent that manages notes, suggests connections, and answers questions via RAG."""

    async def process(self, request: AgentChatRequest) -> AgentChatResponse:
        """Process knowledge/note-related requests."""
        content = "I'll help you with your knowledge base."
        actions = []

        text = request.input.lower()
        if "search" in text or "find" in text:
            actions.append(AgentAction(
                type="note.search",
                payload={"query": request.input},
            ))
            content = "Let me search your notes for that."
        elif "connect" in text or "link" in text:
            actions.append(AgentAction(
                type="note.suggest_links",
                payload={},
            ))
            content = "I'll look for connections between your notes."
        elif "summarize" in text:
            actions.append(AgentAction(
                type="note.summarize",
                payload={},
            ))
            content = "I'll summarize that note for you."

        return AgentChatResponse(
            id=str(uuid.uuid4()),
            request_id=request.id,
            agent="second_brain",
            content=content,
            actions=actions,
            metadata=AgentMetadata(),
        )
