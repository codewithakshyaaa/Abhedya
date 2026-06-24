import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { HiHome } from "react-icons/hi2"
import {
  HiMagnifyingGlass, HiChevronDown, HiXMark, HiMapPin,
  HiClock, HiArrowTopRightOnSquare, HiChevronUp
} from "react-icons/hi2"

const API = "https://abhedya-production.up.railway.app" || "http://localhost:8000"

const INDIAN_STATES = [
  "All States",
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir",
  "Ladakh","Puducherry","Chandigarh",
]

const SEVERITY_CONFIG = {
  high:   { label: "High Risk", dot: "#ef4444", badge: "rgba(239,68,68,0.12)",  text: "#ef4444" },
  medium: { label: "Medium",    dot: "#f97316", badge: "rgba(249,115,22,0.12)", text: "#f97316" },
  low:    { label: "Advisory",  dot: "#22c55e", badge: "rgba(34,197,94,0.12)",  text: "#22c55e" },
}

const CATEGORY_COLORS = {
  "Phishing":         { bg: "rgba(239,68,68,0.10)",  text: "#f87171" },
  "Online Fraud":     { bg: "rgba(239,68,68,0.10)",  text: "#f87171" },
  "SIM Swap":         { bg: "rgba(234,179,8,0.12)",  text: "#facc15" },
  "Advisory":         { bg: "rgba(59,130,246,0.12)", text: "#60a5fa" },
  "Ransomware":       { bg: "rgba(239,68,68,0.10)",  text: "#f87171" },
  "Investment Fraud": { bg: "rgba(234,179,8,0.12)",  text: "#facc15" },
  "Malware":          { bg: "rgba(239,68,68,0.10)",  text: "#f87171" },
  "Awareness":        { bg: "rgba(34,197,94,0.10)",  text: "#4ade80" },
}

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-zinc-700 border-t-red-500 animate-spin" />
      <p className="text-zinc-500 text-sm font-sans">Loading latest threats…</p>
    </div>
  )
}

function NewsCard({ item }) {
  const [expanded, setExpanded] = useState(false)
  const sev = SEVERITY_CONFIG[item.severity] ?? SEVERITY_CONFIG.medium
  const cat = CATEGORY_COLORS[item.category] ?? { bg: "rgba(161,161,170,0.12)", text: "#a1a1aa" }

  return (
    <div className={`group relative bg-zinc-900/60 border rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 ${
      expanded ? "border-red-500/50 bg-zinc-900/90" : "border-zinc-800 hover:border-red-500/40 hover:bg-zinc-900/80"
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-xs font-sans font-medium px-2.5 py-1 rounded-full"
            style={{ background: sev.badge, color: sev.text }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sev.dot }} />
            {sev.label}
          </span>
          <span className="inline-flex text-xs font-sans px-2.5 py-1 rounded-full"
            style={{ background: cat.bg, color: cat.text }}>
            {item.category}
          </span>
        </div>
        {item.link
          ? <a href={item.link} target="_blank" rel="noopener noreferrer"
              className="text-zinc-600 hover:text-red-500 transition-colors flex-shrink-0 mt-0.5">
              <HiArrowTopRightOnSquare size={15} />
            </a>
          : <span className="text-zinc-800 flex-shrink-0 mt-0.5"><HiArrowTopRightOnSquare size={15} /></span>
        }
      </div>

      <h3 className="font-poppins font-semibold text-zinc-100 text-sm sm:text-base leading-snug group-hover:text-white transition-colors">
        {item.title}
      </h3>

      <p className="font-sans text-zinc-400 text-xs sm:text-sm leading-relaxed">
        {item.summary}
      </p>

      {expanded && (
        <div className="mt-1 pt-4 border-t border-zinc-700/60 flex flex-col gap-3">
          {(item.details || "")
            .replace(/\\n\\n/g, "\n\n")
            .split("\n\n")
            .filter(Boolean)
            .map((para, i) => (
              <p key={i} className="font-sans text-zinc-300 text-xs sm:text-sm leading-relaxed">
                {para.trim()}
              </p>
            ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-zinc-800 mt-auto">
        <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
          <HiMapPin size={13} />
          <span>{item.state}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-zinc-600 text-xs font-sans truncate max-w-[120px]">{item.source}</span>
          <div className="flex items-center gap-1 text-zinc-500 text-xs">
            <HiClock size={13} />
            <span>{item.time_ago}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => setExpanded(p => !p)}
        className={`inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-sans font-medium border transition-all duration-200 ${
          expanded
            ? "border-red-500/40 text-red-400 bg-red-500/[0.08] hover:bg-red-500/15"
            : "border-zinc-700 text-zinc-400 hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/5"
        }`}
      >
        {expanded ? <><HiChevronUp size={13} /> Show Less</> : <>Know More <HiChevronDown size={13} /></>}
      </button>
    </div>
  )
}

function SafetyFeed() {
  const [search,        setSearch]        = useState("")
  const [selectedState, setSelectedState] = useState("All States")
  const [stateDropOpen, setStateDropOpen] = useState(false)
  const [loading,       setLoading]       = useState(true)
  const [newsData,      setNewsData]      = useState([])
  const stateRef = useRef(null)

  useEffect(() => {
    axios.get(`${API}/feed/`)
      .then(res => {
        const d = res.data
        setNewsData(Array.isArray(d) ? d : d.data ?? [])
      })
      .catch(err => console.error("Feed fetch failed:", err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const h = e => {
      if (stateRef.current && !stateRef.current.contains(e.target)) setStateDropOpen(false)
    }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  const filtered = newsData.filter(item => {
    const matchState = selectedState === "All States" || item.state === selectedState
    const q = search.toLowerCase()
    return matchState && (
      !q ||
      item.title.toLowerCase().includes(q)    ||
      item.summary.toLowerCase().includes(q)  ||
      item.category.toLowerCase().includes(q) ||
      item.state.toLowerCase().includes(q)
    )
  })

  return (
    <div className="relative w-full min-h-screen bg-black text-zinc-200 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-red-400 to-black opacity-80" />
      <div className="absolute inset-0 bg-black/70" />

      <nav className="relative z-20 flex items-center justify-between px-6 sm:px-10 md:px-16 pt-6">
        <h1 className="font-poppins text-2xl text-zinc-50">
          Abhed<span className="text-red-500">ya</span>
        </h1>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-sans text-sm text-white px-3 py-1.5 rounded-full border border-zinc-700 hover:border-red-500 hover:text-red-500 transition-colors duration-200 whitespace-nowrap"
        >
          <HiHome size={16} />
          <span className="hidden sm:inline">BACK TO HOME</span>
        </Link>
      </nav>

      <div className="relative z-20 flex flex-col items-center text-center px-6 sm:px-10 pt-20 sm:pt-28 md:pt-16">
        <h1 className="font-poppins font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-zinc-50">
          Safety<span className="text-red-500"> Feed</span>
        </h1>
        <p className="mt-4 max-w-xl text-zinc-300 font-sans font-light text-sm sm:text-base leading-relaxed">
          Navigate the digital world safely with curated, location-based cybersecurity insights delivered to your feed.
        </p>
      </div>

      <div className="relative z-30 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-6 sm:px-10 md:px-16 mt-10">
        <div className="flex-1 relative">
          <HiMagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search threats, categories, or locations…"
            className="w-full bg-zinc-900/80 border border-zinc-700 text-zinc-200 placeholder-zinc-600 font-sans text-sm rounded-full pl-9 pr-9 py-2.5 focus:outline-none focus:border-red-500/60 transition-colors duration-200"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
              <HiXMark size={15} />
            </button>
          )}
        </div>

        <div className="relative flex-shrink-0" ref={stateRef}>
          <button
            onClick={() => setStateDropOpen(p => !p)}
            className="inline-flex items-center gap-2 font-sans text-sm text-zinc-200 bg-zinc-900/80 border border-zinc-700 hover:border-red-500/60 px-4 py-2.5 rounded-full transition-colors duration-200 whitespace-nowrap w-full sm:w-auto justify-between sm:justify-start"
          >
            <HiMapPin size={15} className="text-red-500 flex-shrink-0" />
            <span className="flex-1 sm:flex-none text-left truncate max-w-[160px]">{selectedState}</span>
            <HiChevronDown size={15} className={`text-zinc-500 flex-shrink-0 transition-transform duration-200 ${stateDropOpen ? "rotate-180" : ""}`} />
          </button>

          {stateDropOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-zinc-950 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden z-[9999]">
              <div className="max-h-64 overflow-y-auto py-1" style={{ scrollbarWidth: "none" }}>
                {INDIAN_STATES.map(state => (
                  <button
                    key={state}
                    onClick={() => { setSelectedState(state); setStateDropOpen(false) }}
                    className={`w-full text-left px-4 py-2 text-sm font-sans transition-colors duration-150 ${
                      selectedState === state ? "text-red-400 bg-red-500/10" : "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-20 px-6 sm:px-10 md:px-16 mt-8 pb-20">
        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center mb-1">
              <HiMagnifyingGlass size={20} className="text-zinc-600" />
            </div>
            <p className="font-poppins text-zinc-300 text-base">No results found</p>
            <p className="font-sans text-zinc-600 text-sm max-w-xs">Try a different search term or change the selected state.</p>
            <button
              onClick={() => { setSearch(""); setSelectedState("All States") }}
              className="mt-2 text-xs text-red-500 border border-red-500/30 px-4 py-1.5 rounded-full hover:bg-red-500/10 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="font-sans text-xs text-zinc-600 mb-5">
              Showing <span className="text-zinc-400">{filtered.length}</span> {filtered.length === 1 ? "alert" : "alerts"}
              {selectedState !== "All States" && <> in <span className="text-zinc-400">{selectedState}</span></>}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(item => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SafetyFeed