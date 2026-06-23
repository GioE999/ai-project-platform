"""ProjectPlannerAgent - Generates project plans from objectives."""
import uuid
from ..schemas.requests import AgentChatRequest
from ..schemas.responses import AgentChatResponse, AgentMetadata, AgentAction


class ProjectPlannerAgent:
    """Agent that generates structured project plans from objectives."""

    async def process(self, request: AgentChatRequest) -> AgentChatResponse:
        """Process project planning requests."""
        content = (
            "I'll help you plan your project. "
            "Based on your objective, here's a suggested plan."
        )
        actions = [
            AgentAction(
                type="plan.generate",
                payload={"objective": request.input},
            )
        ]

        return AgentChatResponse(
            id=str(uuid.uuid4()),
            request_id=request.id,
            agent="project_planner",
            content=content,
            actions=actions,
            metadata=AgentMetadata(),
        )
