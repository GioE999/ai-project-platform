"""EvaluatorAgent - Evaluates quality of agent responses."""


class EvaluatorAgent:
    """Agent that evaluates the quality of responses from other agents."""

    async def evaluate(self, response) -> dict:
        """Evaluate the quality of an agent response.

        Returns a dict with:
        - score: float 0-1
        - passed: bool (score >= 0.5)
        - feedback: optional str
        """
        # Placeholder: In production, uses LLM to evaluate
        score = 0.8  # Default passing score

        # Basic quality checks
        if not response.content or len(response.content) < 5:
            score = 0.2

        return {
            "score": score,
            "passed": score >= 0.5,
            "feedback": None if score >= 0.5 else "Response too short or empty",
        }
