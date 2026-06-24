from groq import Groq
from dotenv import load_dotenv
import json, re, os

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def _parse_json(raw: str) -> dict:
    raw = re.sub(r"^```[a-z]*\n?", "", raw.strip())
    raw = re.sub(r"\n?```$", "", raw.strip())
    match = re.search(r'\{[\s\S]*\}', raw)
    return json.loads(match.group(0) if match else raw)


async def generate_report(issue_type: str, description: str, victim_details: dict) -> dict:
    prompt = (
        "You are a cybercrime technical report writer for Indian law enforcement. "
        "Generate a professional incident report. Return ONLY a JSON object with:\n"
        '  "title"          : string, report title\n'
        '  "incident_type"  : string\n'
        '  "severity"       : "high" | "medium" | "low"\n'
        '  "summary"        : string, 2–3 sentence executive summary\n'
        '  "timeline"       : list of strings, key events in order\n'
        '  "technical_details" : string, technical analysis paragraph\n'
        '  "impact"         : string, impact assessment paragraph\n'
        '  "recommendations": list of strings, 4–5 remediation steps\n'
        '  "legal_refs"     : list of relevant Indian IT Act sections\n\n'
        f"Issue type: {issue_type}\n"
        f"Description: {description}\n"
        f"Victim details: {json.dumps(victim_details)}\n\n"
        "Output JSON now:"
    )

    try:
        resp = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant",
            temperature=0.1,
            max_tokens=1500,
        )
        return _parse_json(resp.choices[0].message.content)
    except Exception as e:
        return {
            "title":             f"Incident Report — {issue_type}",
            "incident_type":     issue_type,
            "severity":          "medium",
            "summary":           description[:300],
            "timeline":          [],
            "technical_details": description,
            "impact":            "Impact assessment unavailable.",
            "recommendations":   ["File complaint at cybercrime.gov.in", "Call helpline 1930"],
            "legal_refs":        ["IT Act Section 66", "IT Act Section 66C"],
            "error":             str(e),
        }