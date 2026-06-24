from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import List, Optional

from database import get_db
from services.learning_service import get_all_terms, get_term_explained, seed_terms

router = APIRouter()


class TermOut(BaseModel):
    id:         int
    term:       str
    category:   str
    difficulty: str

    class Config:
        from_attributes = True


class TermExplained(TermOut):
    explanation: Optional[str] = None
    actionable:  Optional[List[str]] = None
    example:     Optional[str] = None


class SeedIn(BaseModel):
    terms: List[dict]


@router.get("/terms", response_model=List[TermOut])
async def list_terms(db: AsyncSession = Depends(get_db)):
    return await get_all_terms(db)


@router.get("/terms/{term_id}", response_model=TermExplained)
async def explain_term(term_id: int, db: AsyncSession = Depends(get_db)):
    result = await get_term_explained(term_id, db)
    if not result:
        raise HTTPException(status_code=404, detail="Term not found.")
    return result


@router.post("/seed")
async def seed(body: SeedIn, db: AsyncSession = Depends(get_db)):
    added = await seed_terms(body.terms, db)
    return {"inserted": added}