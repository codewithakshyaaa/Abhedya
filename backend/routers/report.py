from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

from services.report_service import generate_report

router = APIRouter()


class ReportRequest(BaseModel):
    issue_type:     str
    description:    str
    victim_details: Optional[dict] = {}


class ReportResponse(BaseModel):
    title:              str
    incident_type:      str
    severity:           str
    summary:            str
    timeline:           List[str]
    technical_details:  str
    impact:             str
    recommendations:    List[str]
    legal_refs:         List[str]


@router.post("/generate", response_model=ReportResponse)
async def create_report(body: ReportRequest):
    return await generate_report(body.issue_type, body.description, body.victim_details)