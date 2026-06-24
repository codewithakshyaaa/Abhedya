import feedparser
import time
from bs4 import BeautifulSoup
from datetime import datetime, timezone
from dateutil import parser as date_parser

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"}

# Har state ke liye Google search queries — aur zyada states cover
STATES_MAP = {
    "Maharashtra":      "cybersecurity fraud news mumbai pune maharashtra",
    "Delhi":            "cybersecurity fraud news delhi gurugram noida",
    "Karnataka":        "cybersecurity fraud news bangalore bengaluru karnataka",
    "Telangana":        "cybersecurity fraud news hyderabad telangana",
    "West Bengal":      "cybersecurity fraud news kolkata siliguri west bengal",
    "Tamil Nadu":       "cybersecurity fraud news chennai coimbatore tamil nadu",
    "Gujarat":          "cybersecurity fraud news ahmedabad surat gujarat",
    "Uttar Pradesh":    "cybersecurity fraud news lucknow kanpur uttar pradesh",
    "Rajasthan":        "cybersecurity fraud news jaipur rajasthan",
    "Punjab":           "cybersecurity fraud news chandigarh amritsar punjab",
    "Kerala":           "cybersecurity fraud news kochi thiruvananthapuram kerala",
    "Madhya Pradesh":   "cybersecurity fraud news bhopal indore madhya pradesh",
    "Bihar":            "cybersecurity fraud news patna bihar",
    "Odisha":           "cybersecurity fraud news bhubaneswar odisha",
    "Andhra Pradesh":   "cybersecurity fraud news visakhapatnam vijayawada andhra pradesh",
    "Jharkhand":        "cybersecurity fraud news ranchi jharkhand",
    "Assam":            "cybersecurity fraud news guwahati assam",
    "Haryana":          "cybersecurity fraud news faridabad gurgaon haryana",
    "Uttarakhand":      "cybersecurity fraud news dehradun uttarakhand",
    "Himachal Pradesh": "cybersecurity fraud news shimla himachal pradesh",
    "Jammu & Kashmir":  "cybersecurity fraud news jammu srinagar kashmir",
    "Chhattisgarh":     "cybersecurity fraud news raipur chhattisgarh",
    "India":            "cybersecurity fraud scam news india 2026",
}

SOURCES = [
    {"name": "CERT-In",          "url": "https://www.cert-in.org.in/RSS/cert-in-rss.xml",                                 "state": "India"},
    {"name": "The Hacker News",  "url": "https://feeds.feedburner.com/TheHackersNews",                                    "state": "India"},
    {"name": "Economic Times",   "url": "https://economictimes.indiatimes.com/tech/cybersecurity/rssfeeds/1628109675.cms", "state": "India"},
    {"name": "Cisco ET",         "url": "https://ciso.economictimes.indiatimes.com/rss/cybercrime-fraud",                 "state": "India"},
]


def _parse_real_date(e) -> datetime:
    """RSS entry se timezone-aware datetime nikalo."""
    # 1. published_parsed (most reliable)
    if hasattr(e, "published_parsed") and e.published_parsed:
        try:
            return datetime.fromtimestamp(time.mktime(e.published_parsed), tz=timezone.utc)
        except Exception:
            pass

    # 2. String fallback
    date_str = e.get("published", e.get("updated", ""))
    try:
        if date_str:
            dt = date_parser.parse(date_str)
            return dt.replace(tzinfo=timezone.utc) if dt.tzinfo is None else dt.astimezone(timezone.utc)
    except Exception:
        pass

    return datetime.now(timezone.utc)


def _time_ago(dt: datetime) -> str:
    """datetime → human-readable relative time string."""
    now   = datetime.now(timezone.utc)
    # Make sure dt is timezone-aware
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    diff  = now - dt
    secs  = int(diff.total_seconds())

    if secs < 60:
        return "Just now"
    if secs < 3600:
        m = secs // 60
        return f"{m} min ago"
    if secs < 86400:
        h = secs // 3600
        return f"{h}h ago"
    if secs < 604800:          # 7 days
        d = secs // 86400
        return f"{d}d ago"
    if secs < 2592000:         # 30 days
        w = secs // 604800
        return f"{w}w ago"

    # Older than a month — show actual date
    return dt.strftime("%b %d, %Y")


def fetch_all_sources() -> list[dict]:
    raw = []

    # 1. State-wise Google News (8 articles per state for better coverage)
    for state, query in STATES_MAP.items():
        url = (
            f"https://news.google.com/rss/search?q={query.replace(' ', '+')}"
            f"&hl=en-IN&gl=IN&ceid=IN:en"
        )
        try:
            feed = feedparser.parse(url)
            for e in feed.entries[:8]:          # <── 5 → 8
                title = e.get("title", "").strip()
                if not title or len(title) < 10:
                    continue
                pub = _parse_real_date(e)
                raw.append({
                    "title":        title,
                    "description":  BeautifulSoup(e.get("summary", ""), "lxml").get_text()[:500],
                    "url":          e.get("link", url),
                    "source":       f"Google News – {state}",
                    "published_at": pub,
                    "time_ago":     _time_ago(pub),        # <── ADDED
                    "state":        state,                 # <── scraper ka state trust karo
                })
        except Exception as ex:
            print(f"Error fetching {state}: {ex}")

    # 2. General sources (CERT-In, THN, ET)
    for src in SOURCES:
        try:
            feed = feedparser.parse(src["url"])
            for e in feed.entries[:15]:         # <── 10 → 15
                title = e.get("title", "").strip()
                if not title or len(title) < 10:
                    continue
                pub = _parse_real_date(e)
                raw.append({
                    "title":        title,
                    "description":  BeautifulSoup(
                                        e.get("summary", e.get("description", "")),
                                        "lxml"
                                    ).get_text()[:500],
                    "url":          e.get("link", src["url"]),
                    "source":       src["name"],
                    "published_at": pub,
                    "time_ago":     _time_ago(pub),        # <── ADDED
                    "state":        src["state"],
                })
        except Exception as ex:
            print(f"Skipping {src['name']}: {ex}")

    # Deduplication (title key)
    seen, unique = set(), []
    for a in raw:
        key = a["title"].lower().strip()
        if key not in seen:
            seen.add(key)
            unique.append(a)

    unique.sort(key=lambda x: x["published_at"], reverse=True)
    return unique


if __name__ == "__main__":
    arts = fetch_all_sources()
    print(f"Total articles: {len(arts)}")
    for a in arts[:20]:
        print(f"[{a['time_ago']:>12}] [{a['state']:>20}] {a['title'][:70]}")