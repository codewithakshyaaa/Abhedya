from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone
from groq import Groq
from dotenv import load_dotenv
import asyncio
from concurrent.futures import ThreadPoolExecutor
import json, re, os

from database import AsyncSessionLocal
from models import NewsFeed
from scraper import fetch_all_sources

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

CATEGORIES = ["Phishing", "Online Fraud", "SIM Swap", "Advisory",
               "Ransomware", "Investment Fraud", "Malware", "Awareness"]


def _clean_groq_response(raw: str) -> str:
    raw = re.sub(r"^```[a-z]*\n?", "", raw.strip())
    raw = re.sub(r"\n?```$", "", raw)
    match = re.search(r'\{[\s\S]*\}', raw)
    if match:
        raw = match.group(0)
    raw = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', raw)

    def fix_newlines(s):
        result, in_str, i = [], False, 0
        while i < len(s):
            c = s[i]
            if c == '"' and (i == 0 or s[i-1] != '\\'):
                in_str = not in_str
            if in_str and c == '\n':
                result.append('\\n')
            elif in_str and c == '\r':
                pass
            else:
                result.append(c)
            i += 1
        return ''.join(result)

    return fix_newlines(raw)


def _fallback(title: str, description: str) -> dict:
    return {
        "summary":  (description or title)[:120],
        "details":  (
            f"{description or title}\n\n"
            "This advisory may affect users across India. "
            "Stay cautious and verify information from official sources.\n\n"
            "Report suspicious activity at cybercrime.gov.in or call 1930."
        ),
        "severity": "medium",
        "category": "Advisory",
    }


def _enrich(title: str, description: str) -> dict:
    safe_title = title.replace('"', "'").replace('\\', '')[:200]
    safe_desc  = (description or '').replace('"', "'").replace('\\', '')[:800]

    prompt = (
        "You are a cybersecurity analyst. Return ONLY a JSON object, nothing else.\n"
        "No markdown, no explanation, no text before or after the JSON.\n\n"
        "Required keys:\n"
        '  "summary"  : string, one sentence max 25 words, plain English\n'
        '  "details"  : string, exactly 3 paragraphs joined with \\n\\n. '
        'Para1=what happened, Para2=who is at risk in India, Para3=how to stay safe.\n'
        f'  "severity" : one of exactly: "high" "medium" "low"\n'
        f'  "category" : one of exactly: {CATEGORIES}\n\n'
        f'Article title: {safe_title}\n'
        f'Article description: {safe_desc or "No description."}\n\n'
        "Output the JSON object now:"
    )

    for attempt in range(2):
        try:
            resp = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.1-8b-instant",
                temperature=0.1,
            )
            raw     = resp.choices[0].message.content
            cleaned = _clean_groq_response(raw)
            result  = json.loads(cleaned)

            for key in ("summary", "details", "severity", "category"):
                if key not in result:
                    raise ValueError(f"Missing key: {key}")

            if result["severity"] not in ("high", "medium", "low"):
                result["severity"] = "medium"
            if result["category"] not in CATEGORIES:
                result["category"] = "Advisory"

            result["details"] = result["details"].replace("\\n\\n", "\n\n")
            return result

        except Exception as e:
            print(f"[Groq] Attempt {attempt+1} failed: {e}")

    return _fallback(title, description)


async def run_scraper_and_store():
    print("Step 4: Starting scraper...")

    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor() as pool:
        articles = await loop.run_in_executor(pool, fetch_all_sources)

    print(f"Step 4.5: Got {len(articles)} articles from scraper")

    if not articles:
        print("No articles found.")
        return

    async with AsyncSessionLocal() as db:
        added = 0
        for art in articles:
            title = art["title"].strip()
            if not title or title == "[Removed]":
                continue

            existing = await db.execute(select(NewsFeed).where(NewsFeed.title == title))
            if existing.scalar_one_or_none():
                continue

            print(f"  Enriching: {title[:60]}...")
            enriched = _enrich(title, art.get("description", ""))

            db.add(NewsFeed(
                title        = title,
                summary      = enriched.get("summary", ""),
                details      = enriched.get("details", ""),
                link         = art.get("url", ""),
                state        = art.get("state", "India"),
                severity     = enriched.get("severity", "medium"),
                category     = enriched.get("category", "Advisory"),
                source       = art.get("source", ""),
                time_ago     = art.get("time_ago", "Recently"),
                published_at = art.get("published_at", datetime.now(timezone.utc)),
            ))
            added += 1

        await db.commit()
        print(f"[Feed] Inserted {added} new articles.")


async def get_all_feed(db: AsyncSession):
    result = await db.execute(
        select(NewsFeed).order_by(NewsFeed.published_at.desc())
    )
    return result.scalars().all()


async def get_feed_by_state(state: str, db: AsyncSession):
    result = await db.execute(
        select(NewsFeed)
        .where(NewsFeed.state == state)
        .order_by(NewsFeed.published_at.desc())
    )
    return result.scalars().all()