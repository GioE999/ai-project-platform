"""FastAPI entry point for the AI Agent Service."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import agents_router

app = FastAPI(
    title="AI Project Platform - Agent Service",
    version="0.1.0",
    description="Multi-agent orchestration service using LangGraph",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents_router, prefix="/agents")


@app.get("/health")
async def health():
    return {"status": "ok"}
