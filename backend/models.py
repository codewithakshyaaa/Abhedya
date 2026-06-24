from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime, timezone
from database import Base


class NewsFeed(Base):
    __tablename__ = "news_feed"

    id           = Column(Integer, primary_key=True, index=True)
    title        = Column(String(500), unique=True, nullable=False)
    summary      = Column(Text)
    details      = Column(Text)
    link         = Column(String(1000))
    state        = Column(String(100), default="India")
    severity     = Column(String(20), default="medium")
    category     = Column(String(100), default="Advisory")
    source       = Column(String(200), default="")
    time_ago     = Column(String(50), default="Recently")
    published_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    created_at   = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class ThreatReport(Base):
    __tablename__ = "threat_reports"

    id           = Column(Integer, primary_key=True, index=True)
    input_type   = Column(String(10), nullable=False)
    raw_input    = Column(Text, nullable=False)
    threat_level = Column(String(20))
    threat_score = Column(Float, default=0.0)
    flags        = Column(JSONB, default=list)
    explanation  = Column(Text)
    safety_steps = Column(JSONB, default=list)
    created_at   = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class SecurityTerm(Base):
    __tablename__ = "security_terms"

    id             = Column(Integer, primary_key=True, index=True)
    term           = Column(String(200), unique=True, nullable=False)
    category       = Column(String(100), default="General")
    difficulty     = Column(String(20), default="beginner")
    explanation    = Column(Text)
    actionable     = Column(JSONB, default=list)
    example        = Column(Text)
    created_at     = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))