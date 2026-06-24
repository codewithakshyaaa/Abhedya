from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Literal, List

from database import get_db
from services.analyzer_service import analyze_input

router = APIRouter()


class AnalyzeRequest(BaseModel):
    input_type: Literal["url", "text"]
    content:    str


class AnalyzeResponse(BaseModel):
    id:           int
    threat_level: str
    threat_score: float
    flags:        List[str]
    explanation:  str
    safety_steps: List[str]


@router.post("/", response_model=AnalyzeResponse)
async def check_input(body: AnalyzeRequest, db: AsyncSession = Depends(get_db)):
    if not body.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty.")
    return await analyze_input(body.input_type, body.content.strip(), db)