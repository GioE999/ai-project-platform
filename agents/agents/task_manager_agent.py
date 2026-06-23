"""TaskManagerAgent - Manages tasks via natural language."""
import uuid
from ..schemas.requests import AgentChatRequest
from ..schemas.responses import AgentChatResponse, AgentMetadata, AgentAction


class TaskManagerAgent:
    """Agent that manages tasks via natural language commands."""

    async def process(self, request: AgentChatRequest) -> AgentChatResponse:
        """Process task management requests."""
        # Placeholder: In production, uses LLM to parse intent and call API
        content = f"I'll help you manage tasks. You said: '{request.input}'"
        actions = []

        # Simple keyword-based action detection (placeholder for LLM)
        text = request.input.lower()
        if "create" in text or "add" in text:
            actions.append(AgentAction(
                type="task.create",
                payload={"name": request.input, "status": "pending"},
            ))
            content = "I'll create a task based on your request."
        elif "complete" in text or "done" in text:
            actions.append(AgentAction(
                type="task.update_status",
                payload={"status": "completed"},
            ))
            content = "I'll mark that task as completed."
        elif "list" in text or "show" in text:
            actions.append(AgentAction(type="task.list", payload={}))
            content = "Here are your tasks."

        return AgentChatResponse(
            id=str(uuid.uuid4()),
            request_id=request.id,
            agent="task_manager",
            content=content,
            actions=actions,
            metadata=AgentMetadata(),
        )
