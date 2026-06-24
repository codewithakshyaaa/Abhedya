from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from groq import Groq
from dotenv import load_dotenv
import json, re, os

from models import SecurityTerm

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def _parse_json(raw: str) -> dict:
    raw = re.sub(r"^```[a-z]*\n?", "", raw.strip())
    raw = re.sub(r"\n?```$", "", raw.strip())
    match = re.search(r'\{[\s\S]*\}', raw)
    return json.loads(match.group(0) if match else raw)


async def get_all_terms(db: AsyncSession):
    result = await db.execute(select(SecurityTerm).order_by(SecurityTerm.term))
    return result.scalars().all()


async def get_term_explained(term_id: int, db: AsyncSession) -> dict:
    result = await db.execute(select(SecurityTerm).where(SecurityTerm.id == term_id))
    term = result.scalar_one_or_none()
    if not term:
        return None

    if term.explanation:
        return {
            "id":          term.id,
            "term":        term.term,
            "category":    term.category,
            "difficulty":  term.difficulty,
            "explanation": term.explanation,
            "actionable":  term.actionable,
            "example":     term.example,
        }

    prompt = (
        "You are a friendly cybersecurity teacher for everyday Indian internet users. "
        f"Explain the term '{term.term}' in simple layman's language. "
        "Return ONLY a JSON object:\n"
        '  "explanation" : 2–3 sentence plain explanation\n'
        '  "actionable"  : list of 3 practical steps a common person should take\n'
        '  "example"     : one real-world example relevant to India\n\n'
        "Output JSON now:"
    )

    try:
        resp = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant",
            temperature=0.2,
        )
        data = _parse_json(resp.choices[0].message.content)
        term.explanation = data.get("explanation", "")
        term.actionable  = data.get("actionable", [])
        term.example     = data.get("example", "")
        await db.commit()
        await db.refresh(term)
    except Exception:
        data = {"explanation": term.term, "actionable": [], "example": ""}

    return {
        "id":          term.id,
        "term":        term.term,
        "category":    term.category,
        "difficulty":  term.difficulty,
        "explanation": term.explanation,
        "actionable":  term.actionable,
        "example":     term.example,
    }


async def seed_terms(terms: list[dict], db: AsyncSession) -> int:
    added = 0
    for t in terms:
        existing = await db.execute(select(SecurityTerm).where(SecurityTerm.term == t["term"]))
        if existing.scalar_one_or_none():
            continue
        db.add(SecurityTerm(
            term       = t["term"],
            category   = t.get("category", "General"),
            difficulty = t.get("difficulty", "beginner"),
        ))
        added += 1
    await db.commit()
    return added