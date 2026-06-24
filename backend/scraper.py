import feedparser
import time
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timezone
from dateutil import parser as date_parser

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
}

STATES_MAP = {
    "Maharashtra": "cybersecurity fraud news mumbai pune maharashtra",
    "Delhi": "cybersecurity fraud news delhi gurugram noida",
    "Karnataka": "cybersecurity fraud news bangalore bengaluru karnataka",
    "Telangana": "cybersecurity fraud news hyderabad telangana",
    "West Bengal": "cybersecurity fraud news kolkata siliguri west bengal",
    "Tamil Nadu": "cybersecurity fraud news chennai coimbatore tamil nadu",
    "Gujarat": "cybersecurity fraud news ahmedabad surat gujarat",
    "Uttar Pradesh": "cybersecurity fraud news lucknow kanpur uttar pradesh",
    "Rajasthan": "cybersecurity fraud news jaipur rajasthan",
    "Punjab": "cybersecurity fraud news chandigarh amritsar punjab",
    "Kerala": "cybersecurity fraud news kochi thiruvananthapuram kerala",
    "Madhya Pradesh": "cybersecurity fraud news bhopal indore madhya pradesh",
    "Bihar": "cybersecurity fraud news patna bihar",
    "Odisha": "cybersecurity fraud news bhubaneswar odisha",
    "Andhra Pradesh": "cybersecurity fraud news visakhapatnam vijayawada andhra pradesh",
    "Jharkhand": "cybersecurity fraud news ranchi jharkhand",
    "Assam": "cybersecurity fraud news guwahati assam",
    "Haryana": "cybersecurity fraud news faridabad gurgaon haryana",
    "Uttarakhand": "cybersecurity fraud news dehradun uttarakhand",
    "Himachal Pradesh": "cybersecurity fraud news shimla himachal pradesh",
    "Jammu & Kashmir": "cybersecurity fraud news jammu srinagar kashmir",
    "Chhattisgarh": "cybersecurity fraud news raipur chhattisgarh",
    "India": "cybersecurity fraud scam news india 2026",
}

SOURCES = [
    {"name": "CERT-In", "url": "https://www.cert-in.org.in/RSS/cert-in-rss.xml", "state": "India"},
    {"name": "The Hacker News", "url": "https://feeds.feedburner.com/TheHackersNews", "state": "India"},
    {"name": "Economic Times", "url": "https://economictimes.indiatimes.com/tech/cybersecurity/rssfeeds/1628109675.cms", "state": "India"},
    {"name": "Cisco ET", "url": "https://ciso.economictimes.indiatimes.com/rss/cybercrime-fraud", "state": "India"},
]

def _parse_real_date(e) -> datetime:
    if hasattr(e, "published_parsed") and e.published_parsed:
        try:
            return datetime.fromtimestamp(time.mktime(e.published_parsed), tz=timezone.utc)
        except: pass
    date_str = e.get("published", e.get("updated", ""))
    try:
        if date_str:
            dt = date_parser.parse(date_str)
            return dt.replace(tzinfo=timezone.utc) if dt.tzinfo is None else dt.astimezone(timezone.utc)
    except: pass
    return datetime.now(timezone.utc)

def _time_ago(dt: datetime) -> str:
    now = datetime.now(timezone.utc)
    if dt.tzinfo is None: dt = dt.replace(tzinfo=timezone.utc)
    diff = now - dt
    secs = int(diff.total_seconds())
    if secs < 60: return "Just now"
    if secs < 3600: return f"{secs // 60} min ago"
    if secs < 86400: return f"{secs // 3600}h ago"
    if secs < 604800: return f"{secs // 86400}d ago"
    return dt.strftime("%b %d, %Y")

def fetch_all_sources() -> list[dict]:
    raw = []
    
    for state, query in STATES_MAP.items():
        url = f"https://news.google.com/rss/search?q={query.replace(' ', '+')}&hl=en-IN&gl=IN&ceid=IN:en"
        try:
            resp = requests.get(url, headers=HEADERS, timeout=10)
            if resp.status_code == 200:
                feed = feedparser.parse(resp.content)
                for e in feed.entries[:5]: 
                    pub = _parse_real_date(e)
                    raw.append({
                        "title": e.get("title", "").strip(),
                        "description": BeautifulSoup(e.get("summary", ""), "lxml").get_text()[:300],
                        "url": e.get("link", url),
                        "source": f"Google News – {state}",
                        "published_at": pub,
                        "time_ago": _time_ago(pub),
                        "state": state,
                    })
            time.sleep(1.5) # Rate limiting
        except Exception as ex:
            print(f"Error {state}: {ex}")

    for src in SOURCES:
        try:
            resp = requests.get(src["url"], headers=HEADERS, timeout=10)
            feed = feedparser.parse(resp.content)
            for e in feed.entries[:10]:
                pub = _parse_real_date(e)
                raw.append({
                    "title": e.get("title", "").strip(),
                    "description": BeautifulSoup(e.get("summary", ""), "lxml").get_text()[:300],
                    "url": e.get("link", src["url"]),
                    "source": src["name"],
                    "published_at": pub,
                    "time_ago": _time_ago(pub),
                    "state": src["state"],
                })
        except Exception as ex:
            print(f"Error {src['name']}: {ex}")

    seen, unique = set(), []
    for a in raw:
        key = a["title"].lower().strip()
        if key not in seen:
            seen.add(key)
            unique.append(a)
    return sorted(unique, key=lambda x: x["published_at"], reverse=True)

if __name__ == "__main__":
    arts = fetch_all_sources()
    print(f"Total: {len(arts)}")