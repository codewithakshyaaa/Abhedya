from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from database import get_db
from services.feed_service import get_all_feed, get_feed_by_state

router = APIRouter()


class NewsFeedOut(BaseModel):
    id:           int
    title:        str
    summary:      str
    details:      str
    link:         str
    state:        str
    severity:     str
    category:     str
    source:       str
    time_ago:     str
    published_at: datetime

    class Config:
        from_attributes = True


@router.get("/", response_model=List[NewsFeedOut])
async def get_feed(
    state: Optional[str] = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    if state:
        return await get_feed_by_state(state, db)
    return await get_all_feed(db)