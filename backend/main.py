from fastapi import FastAPI, Header, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from dotenv import load_dotenv
import os

from database import engine, Base, AsyncSessionLocal
from routers import feed, analyzer, learning, report
from services.feed_service import run_scraper_and_store
from services.learning_service import seed_terms

load_dotenv()

CRON_SECRET = os.getenv("CRON_SECRET", "abhedya-cron-2025")

DEFAULT_TERMS = [
    {"term": "Phishing", "category": "Social Engineering", "difficulty": "beginner"},
    {"term": "Vishing", "category": "Social Engineering", "difficulty": "beginner"},
    {"term": "Smishing", "category": "Social Engineering", "difficulty": "beginner"},
    {"term": "Pretexting", "category": "Social Engineering", "difficulty": "intermediate"},
    {"term": "Baiting", "category": "Social Engineering", "difficulty": "intermediate"},
    {"term": "Quid Pro Quo", "category": "Social Engineering", "difficulty": "advanced"},
    {"term": "Tailgating", "category": "Social Engineering", "difficulty": "beginner"},
    {"term": "Deepfake Scam", "category": "Social Engineering", "difficulty": "intermediate"},
    {"term": "Spear Phishing", "category": "Social Engineering", "difficulty": "intermediate"},
    {"term": "Whaling", "category": "Social Engineering", "difficulty": "advanced"},
    {"term": "Watering Hole Attack", "category": "Social Engineering", "difficulty": "advanced"},
    {"term": "Ransomware", "category": "Malware", "difficulty": "advanced"},
    {"term": "Keylogger", "category": "Malware", "difficulty": "intermediate"},
    {"term": "Spyware", "category": "Malware", "difficulty": "intermediate"},
    {"term": "Trojan Horse", "category": "Malware", "difficulty": "intermediate"},
    {"term": "Worm", "category": "Malware", "difficulty": "advanced"},
    {"term": "Rootkit", "category": "Malware", "difficulty": "advanced"},
    {"term": "Adware", "category": "Malware", "difficulty": "beginner"},
    {"term": "Fileless Malware", "category": "Malware", "difficulty": "advanced"},
    {"term": "Botnet", "category": "Malware", "difficulty": "advanced"},
    {"term": "Logic Bomb", "category": "Malware", "difficulty": "intermediate"},
    {"term": "OTP Fraud", "category": "Fraud", "difficulty": "beginner"},
    {"term": "UPI Fraud", "category": "Fraud", "difficulty": "beginner"},
    {"term": "SIM Swap", "category": "Identity Theft", "difficulty": "intermediate"},
    {"term": "Identity Theft", "category": "Identity Theft", "difficulty": "beginner"},
    {"term": "Credential Stuffing", "category": "Fraud", "difficulty": "intermediate"},
    {"term": "Card Skimming", "category": "Fraud", "difficulty": "intermediate"},
    {"term": "Romance Scam", "category": "Fraud", "difficulty": "beginner"},
    {"term": "Investment Fraud", "category": "Fraud", "difficulty": "beginner"},
    {"term": "Account Takeover", "category": "Identity Theft", "difficulty": "intermediate"},
    {"term": "Synthetic Identity Theft", "category": "Identity Theft", "difficulty": "advanced"},
    {"term": "Man in the Middle Attack", "category": "Network", "difficulty": "advanced"},
    {"term": "Brute Force Attack", "category": "Network", "difficulty": "intermediate"},
    {"term": "SQL Injection", "category": "Network", "difficulty": "advanced"},
    {"term": "Cross-Site Scripting (XSS)", "category": "Network", "difficulty": "advanced"},
    {"term": "DDoS Attack", "category": "Network", "difficulty": "advanced"},
    {"term": "Packet Sniffing", "category": "Network", "difficulty": "advanced"},
    {"term": "DNS Spoofing", "category": "Network", "difficulty": "advanced"},
    {"term": "Session Hijacking", "category": "Network", "difficulty": "advanced"},
    {"term": "Port Scanning", "category": "Network", "difficulty": "intermediate"},
    {"term": "Zero-Day Exploit", "category": "Network", "difficulty": "advanced"},
    {"term": "Two Factor Authentication", "category": "General", "difficulty": "beginner"},
    {"term": "Encryption", "category": "General", "difficulty": "intermediate"},
    {"term": "VPN", "category": "General", "difficulty": "beginner"},
    {"term": "Firewall", "category": "General", "difficulty": "beginner"},
    {"term": "Public Wi-Fi Risks", "category": "General", "difficulty": "beginner"},
    {"term": "Password Hashing", "category": "General", "difficulty": "advanced"},
    {"term": "Endpoint Security", "category": "General", "difficulty": "intermediate"},
    {"term": "Biometric Security", "category": "General", "difficulty": "beginner"},
    {"term": "Data Breach", "category": "General", "difficulty": "beginner"},
    {"term": "Incident Response", "category": "General", "difficulty": "intermediate"},
    {"term": "Patch Management", "category": "General", "difficulty": "intermediate"},
    {"term": "Social Engineering", "category": "Social Engineering", "difficulty": "beginner"},
    {"term": "Dark Web", "category": "General", "difficulty": "intermediate"},
    {"term": "Cookie Hijacking", "category": "Network", "difficulty": "intermediate"},
    {"term": "Digital Forensics", "category": "General", "difficulty": "advanced"},
    {"term": "Air Gapping", "category": "General", "difficulty": "advanced"},
    {"term": "Steganography", "category": "General", "difficulty": "advanced"},
    {"term": "Honey Pot", "category": "General", "difficulty": "advanced"},
    {"term": "Privilege Escalation", "category": "Network", "difficulty": "advanced"},
    {"term": "Man in the Browser", "category": "Network", "difficulty": "advanced"},
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Database Initialization
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Seed Learning Terms
    async with AsyncSessionLocal() as db:
        await seed_terms(DEFAULT_TERMS, db)
    yield

app = FastAPI(title="CyberSafety API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://abhedya-production.up.railway.app"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(feed.router,     prefix="/feed",     tags=["Safety Feed"])
app.include_router(analyzer.router, prefix="/analyzer", tags=["Check It Analyzer"])
app.include_router(learning.router, prefix="/learn",    tags=["Gamified Learning"])
app.include_router(report.router,   prefix="/report",   tags=["Report Generator"])

@app.get("/health")
async def health():
    return {"status": "ok", "time": datetime.now(timezone.utc).isoformat()}

@app.get("/api/cron")
async def cron_trigger(
    background_tasks: BackgroundTasks, 
    authorization: str = Header(default="")
):
    if authorization != f"Bearer {CRON_SECRET}":
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    background_tasks.add_task(run_scraper_and_store)
    return {"status": "accepted", "message": "Scraper started in background"}