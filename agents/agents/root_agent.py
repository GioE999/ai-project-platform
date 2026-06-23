"""RootAgent - Orchestrator that classifies intent and routes to sub-agents."""
import uuid
import time
from ..schemas.requests import AgentChatRequest
from ..schemas.responses import AgentChatResponse, AgentMetadata
from .task_manager_agent import TaskManagerAgent
from .project_planner_agent import ProjectPlannerAgent
from .conversation_agent import ConversationAgent
from .meeting_agent import MeetingAgent
from .second_brain_agent import SecondBrainAgent
from .evaluator_agent import EvaluatorAgent


class RootAgent:
    """Orchestrator that classifies user intent and routes to appropriate sub-agent."""

    def __init__(self):
        self.task_manager = TaskManagerAgent()
        self.project_planner = ProjectPlannerAgent()
        self.conversation = ConversationAgent()
        self.meeting = MeetingAgent()
        self.second_brain = SecondBrainAgent()
        self.evaluator = EvaluatorAgent()

    async def process(self, request: AgentChatRequest) -> AgentChatResponse:
        """Process a request by classifying intent and routing to sub-agent."""
        start_time = time.time()

        # Determine target agent
        target = request.target_agent or self._classify_intent(request.input)

        # Route to appropriate agent
        try:
            response = await self._route(target, request)
        except Exception:
            # Retry once on failure
            try:
                response = await self._route(target, request)
            except Exception as retry_error:
                latency = int((time.time() - start_time) * 1000)
                return AgentChatResponse(
                    id=str(uuid.uuid4()),
                    request_id=request.id,
                    agent="root",
                    content=f"Error processing request: {str(retry_error)}",
                    actions=[],
                    metadata=AgentMetadata(latency_ms=latency),
                )

        # Evaluate response quality
        evaluation = await self.evaluator.evaluate(response)
        if not evaluation["passed"]:
            # Could re-route or retry, for now just return as-is
            pass

        latency = int((time.time() - start_time) * 1000)
        response.metadata.latency_ms = latency

        return response

    def _classify_intent(self, input_text: str) -> str:
        """Classify user intent based on input text keywords."""
        text = input_text.lower()

        if any(kw in text for kw in ["task", "todo", "assign", "status", "priority"]):
            return "task_manager"
        elif any(kw in text for kw in ["plan", "project", "milestone", "roadmap"]):
            return "project_planner"
        elif any(kw in text for kw in ["meeting", "schedule", "calendar", "meet"]):
            return "meeting"
        elif any(kw in text for kw in ["note", "brain", "knowledge", "wiki", "link"]):
            return "second_brain"
        elif any(kw in text for kw in ["summarize", "discuss", "thread", "conversation"]):
            return "conversation"
        else:
            return "conversation"  # Default to conversation agent

    async def _route(self, target: str, request: AgentChatRequest) -> AgentChatResponse:
        """Route request to the target agent."""
        agents = {
            "task_manager": self.task_manager,
            "project_planner": self.project_planner,
            "conversation": self.conversation,
            "meeting": self.meeting,
            "second_brain": self.second_brain,
        }

        agent = agents.get(target)
        if not agent:
            raise ValueError(f"Unknown agent: {target}")

        return await agent.process(request)
