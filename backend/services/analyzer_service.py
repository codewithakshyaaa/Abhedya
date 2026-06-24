from sqlalchemy.ext.asyncio import AsyncSession
from groq import Groq
from dotenv import load_dotenv
import json, re, os

from models import ThreatReport

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def _parse_json(raw: str) -> dict:
    raw = re.sub(r"^```[a-z]*\n?", "", raw.strip())
    raw = re.sub(r"\n?```$", "", raw.strip())
    match = re.search(r'\{[\s\S]*\}', raw)
    return json.loads(match.group(0) if match else raw)


async def analyze_input(input_type: str, raw_input: str, db: AsyncSession) -> dict:
    prompt = (
        "You are a cybersecurity threat intelligence engine. Analyze the following "
        f"{'URL' if input_type == 'url' else 'text'} for threats. "
        "Return ONLY a JSON object with these exact keys:\n"
        '  "threat_level"  : "safe" | "suspicious" | "dangerous"\n'
        '  "threat_score"  : float 0.0–10.0\n'
        '  "flags"         : list of short threat flag strings\n'
        '  "explanation"   : 2–3 sentence plain-English explanation\n'
        '  "safety_steps"  : list of 3–5 actionable steps for the user\n\n'
        f"Input to analyze:\n{raw_input}\n\n"
        "Output JSON now:"
    )

    try:
        resp = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant",
            temperature=0.1,
        )
        result = _parse_json(resp.choices[0].message.content)
    except Exception:
        result = {
            "threat_level":  "suspicious",
            "threat_score":  5.0,
            "flags":         ["Analysis failed — treat with caution"],
            "explanation":   "Could not complete analysis. Treat this input with caution.",
            "safety_steps":  ["Do not click unknown links", "Verify the source independently",
                              "Report at cybercrime.gov.in"],
        }

    record = ThreatReport(
        input_type   = input_type,
        raw_input    = raw_input[:2000],
        threat_level = result.get("threat_level", "suspicious"),
        threat_score = float(result.get("threat_score", 5.0)),
        flags        = result.get("flags", []),
        explanation  = result.get("explanation", ""),
        safety_steps = result.get("safety_steps", []),
    )
    db.add(record)
    await db.commit()
    await db.refresh(record)

    return {**result, "id": record.id}