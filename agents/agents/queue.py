"""Priority queue for agent requests."""
import uuid
from enum import IntEnum
from dataclasses import dataclass, field
from typing import Any


class QueuePriority(IntEnum):
    HIGH = 1    # Real-time user operations
    NORMAL = 2  # Post-meeting processing, plan generation
    LOW = 3     # Embedding indexing, connection suggestions


@dataclass(order=True)
class QueueItem:
    priority: int
    id: str = field(default_factory=lambda: str(uuid.uuid4()), compare=False)
    request: Any = field(compare=False)


class AgentQueue:
    """Priority queue for processing agent requests in order of importance."""

    def __init__(self):
        self._queue: list[QueueItem] = []
        self._status: dict[str, str] = {}  # request_id -> status

    async def enqueue(
        self, request: Any, priority: QueuePriority = QueuePriority.NORMAL
    ) -> str:
        """Add a request to the queue. Returns a request ID."""
        item = QueueItem(priority=priority.value, request=request)
        self._queue.append(item)
        self._queue.sort()
        self._status[item.id] = "queued"
        return item.id

    async def dequeue(self) -> QueueItem | None:
        """Get the next item from the queue (highest priority first)."""
        if not self._queue:
            return None
        item = self._queue.pop(0)
        self._status[item.id] = "processing"
        return item

    def get_status(self, request_id: str) -> str:
        """Get the status of a queued request."""
        return self._status.get(request_id, "not_found")

    def mark_completed(self, request_id: str):
        """Mark a request as completed."""
        self._status[request_id] = "completed"

    def mark_failed(self, request_id: str):
        """Mark a request as failed."""
        self._status[request_id] = "failed"

    @property
    def size(self) -> int:
        return len(self._queue)
