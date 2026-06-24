import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiHome } from "react-icons/hi2";
import { IoShieldCheckmark } from "react-icons/io5";
import { TbAlertTriangle, TbShieldCheck, TbSkull } from "react-icons/tb";

const API_BASE ="https://abhedya-production.up.railway.app"  || "http://localhost:8000"

const THREAT_CONFIG = {
  safe: {
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/30",
    bar: "bg-gradient-to-r from-green-600 to-green-400",
    glow: "shadow-[0_0_32px_rgba(34,197,94,0.12)]",
    label: "SAFE",
    icon: TbShieldCheck,
    iconColor: "text-green-400",
  },
  suspicious: {
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/30",
    bar: "bg-gradient-to-r from-yellow-600 to-yellow-400",
    glow: "shadow-[0_0_32px_rgba(234,179,8,0.12)]",
    label: "SUSPICIOUS",
    icon: TbAlertTriangle,
    iconColor: "text-yellow-400",
  },
  dangerous: {
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/30",
    bar: "bg-gradient-to-r from-red-700 to-red-400",
    glow: "shadow-[0_0_32px_rgba(239,68,68,0.15)]",
    label: "DANGEROUS",
    icon: TbSkull,
    iconColor: "text-red-400",
  },
}

function CheckIt() {
  const [mode, setMode]       = useState("url")
  const [input, setInput]     = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")
  const [result, setResult]   = useState(null)

  const handleAnalyze = async () => {
    if (!input.trim()) { setError("Please enter a URL or text to analyze."); return }
    setLoading(true); setError(""); setResult(null)
    try {
      const res = await fetch(`${API_BASE}/analyzer/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input_type: mode, content: input.trim() }),
      })
      if (!res.ok) throw new Error("Analysis failed. Please try again.")
      setResult(await res.json())
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  const handleClear = () => { setInput(""); setResult(null); setError("") }

  const cfg = result ? (THREAT_CONFIG[result.threat_level] || THREAT_CONFIG.suspicious) : null
  const scoreWidth = result ? `${Math.min(result.threat_score * 10, 100)}%` : "0%"
  const VerdictIcon = cfg?.icon

  return (
    <div className="relative w-full min-h-screen bg-black text-zinc-200 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-red-400 to-black opacity-80" />
      <div className="absolute inset-0 bg-black/70" />

      {/* Navbar — unchanged */}
      <nav className="relative z-20 flex items-center justify-between px-6 sm:px-10 md:px-16 pt-6">
        <h1 className="font-poppins text-2xl text-zinc-50">
          Abhed<span className="text-red-500">ya</span>
        </h1>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-sans text-sm text-white px-3 py-1.5 rounded-full border border-zinc-700 hover:border-red-500 hover:text-red-500 transition-colors duration-200 whitespace-nowrap"
        >
          <HiHome size={16} />
          <span>BACK TO HOME</span>
        </Link>
      </nav>

      {/* Page content — centered, max-w-2xl, same horizontal padding as nav */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 sm:px-10 md:px-0 py-10">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-red-400 uppercase">Threat Analyzer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-zinc-50 leading-tight tracking-tight">
            Check It Before You Click
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Paste a suspicious link or message — we'll tell you if it's safe.
          </p>
        </div>

        {/* Input card */}
        <div className="bg-white/[0.03] border border-zinc-800/70 rounded-2xl p-5 backdrop-blur-sm mb-4">

          {/* Mode Toggle */}
          <div className="flex gap-1.5 mb-5 bg-black/50 border border-zinc-800 rounded-xl p-1">
            {["url", "text"].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setResult(null); setError(""); setInput("") }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 ${
                  mode === m
                    ? "bg-red-600 text-white shadow-md shadow-red-950/50"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {m === "url" ? "🔗  URL" : "💬  Message / Text"}
              </button>
            ))}
          </div>

          {/* Input field */}
          <div className="mb-4">
            {mode === "url" ? (
              <input
                value={input}
                onChange={e => { setInput(e.target.value); setError("") }}
                onKeyDown={e => e.key === "Enter" && handleAnalyze()}
                placeholder="https://suspicious-link.com/offer?ref=win"
                className="w-full bg-black/40 border border-zinc-700/60 text-zinc-200 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/15 transition-all placeholder:text-zinc-600 font-mono"
              />
            ) : (
              <textarea
                value={input}
                onChange={e => { setInput(e.target.value); setError("") }}
                rows={4}
                placeholder="Paste the suspicious message, SMS, or email content here..."
                className="w-full bg-black/40 border border-zinc-700/60 text-zinc-200 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/15 transition-all resize-none placeholder:text-zinc-600"
              />
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
              <span className="shrink-0 mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2.5">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-500 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold tracking-wide transition-all duration-200"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <IoShieldCheckmark size={16} />
                  Analyze
                </>
              )}
            </button>
            {(result || input) && (
              <button
                onClick={handleClear}
                className="px-5 py-3 rounded-xl border border-zinc-700/60 hover:border-zinc-600 text-zinc-500 hover:text-zinc-300 text-sm transition-all duration-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {result && cfg && (
          <div className="space-y-3">

            {/* Verdict */}
            <div className={`border rounded-2xl px-5 py-4 ${cfg.bg} ${cfg.glow}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-black/25 border border-white/5">
                    <VerdictIcon size={22} className={cfg.iconColor} />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Verdict</p>
                    <p className={`text-xl font-bold tracking-wide ${cfg.color}`}>{cfg.label}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-0.5">Threat Score</p>
                  <p className={`font-mono font-bold ${cfg.color}`}>
                    <span className="text-2xl">{result.threat_score.toFixed(1)}</span>
                    <span className="text-sm text-zinc-600">/10</span>
                  </p>
                </div>
              </div>
              <div className="w-full h-1 bg-black/30 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${cfg.bar}`} style={{ width: scoreWidth }} />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-zinc-600 mt-1">
                <span>SAFE</span><span>DANGEROUS</span>
              </div>
            </div>

            {/* Flags */}
            {result.flags?.length > 0 && (
              <div className="bg-white/[0.03] border border-zinc-800/70 rounded-2xl px-5 py-4">
                <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-3">Threat Flags</p>
                <div className="flex flex-wrap gap-2">
                  {result.flags.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-1.5">
                      <span className="text-[9px]">▲</span>{f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* What we found + What to do */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.explanation && (
                <div className="bg-white/[0.03] border border-zinc-800/70 rounded-2xl px-5 py-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="w-0.5 h-4 rounded-full bg-red-500/60" />
                    <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">What We Found</p>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">{result.explanation}</p>
                </div>
              )}
              {result.safety_steps?.length > 0 && (
                <div className="bg-white/[0.03] border border-zinc-800/70 rounded-2xl px-5 py-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="w-0.5 h-4 rounded-full bg-green-500/60" />
                    <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">What To Do</p>
                  </div>
                  <ul className="space-y-2">
                    {result.safety_steps.map((s, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-zinc-300">
                        <span className="text-green-500 shrink-0 mt-0.5 text-xs">✓</span>
                        <span className="leading-relaxed">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between text-xs text-zinc-700 border-t border-zinc-800/50 pt-4">
          <span className="font-sans">Cybercrime helpline</span>
          <a href="tel:1930" className="text-red-500/60 font-mono hover:text-red-400 transition-colors tracking-widest">1930</a>
        </div>

      </div>
    </div>
  )
}

export default CheckIt