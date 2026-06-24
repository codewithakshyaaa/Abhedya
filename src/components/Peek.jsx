import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiHome } from "react-icons/hi2";
import { TbShieldCheck, TbAlertTriangle, TbSkull, TbBrain, TbArrowRight, TbRefresh } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000"

const DIFFICULTY_CONFIG = {
  beginner:     { color: "text-green-400",  icon: TbShieldCheck,   label: "BEGINNER"     },
  intermediate: { color: "text-yellow-400", icon: TbAlertTriangle, label: "INTERMEDIATE" },
  advanced:     { color: "text-red-400",    icon: TbSkull,         label: "ADVANCED"     },
}

const CATEGORY_COLORS = {
  "General":            "text-zinc-400 border-zinc-700 bg-zinc-800/40",
  "Social Engineering": "text-purple-400 border-purple-700/50 bg-purple-900/20",
  "Malware":            "text-red-400 border-red-700/50 bg-red-900/20",
  "Network":            "text-blue-400 border-blue-700/50 bg-blue-900/20",
  "Identity Theft":     "text-orange-400 border-orange-700/50 bg-orange-900/20",
  "Fraud":              "text-yellow-400 border-yellow-700/50 bg-yellow-900/20",
}

const cardVariants = {
  initial: { opacity: 0, y: 24, scale: 0.97 },
  animate: { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -16, scale: 0.97, transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } },
}

const revealVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0,  transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } },
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } }
}

const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } },
}

const buttonVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
}

function Peek() {
  const [terms, setTerms]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState("")
  const [current, setCurrent]     = useState(null)
  const [revealed, setRevealed]   = useState(null)
  const [fetching, setFetching]   = useState(false)
  const [score, setScore]         = useState(0)
  const [seen, setSeen]           = useState([])
  const [flipped, setFlipped]     = useState(false)
  const [cardKey, setCardKey]     = useState(0)

  useEffect(() => { fetchTerms() }, [])

  const fetchTerms = async () => {
    setLoading(true); setError("")
    try {
      const res = await fetch(`${API_BASE}/learn/terms`)
      if (!res.ok) throw new Error("Could not load terms.")
      const data = await res.json()
      setTerms(data)
      if (data.length > 0) pickNext(data, [])
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  const pickNext = (pool, seenIds) => {
    const unseen = pool.filter(t => !seenIds.includes(t.id))
    const list   = unseen.length > 0 ? unseen : pool
    const pick   = list[Math.floor(Math.random() * list.length)]
    setCurrent(pick)
    setRevealed(null)
    setFlipped(false)
    setCardKey(k => k + 1)
  }

  const handleReveal = async () => {
    if (!current) return
    setFetching(true)
    try {
      const res = await fetch(`${API_BASE}/learn/terms/${current.id}`)
      if (!res.ok) throw new Error("Could not load explanation.")
      const data = await res.json()
      setRevealed(data)
      setFlipped(true)
      const newSeen = [...seen, current.id]
      setSeen(newSeen)
      setScore(s => s + 1)
    } catch (e) { setError(e.message) }
    finally { setFetching(false) }
  }

  const handleNext  = () => pickNext(terms, seen)
  const handleReset = () => { setSeen([]); setScore(0); pickNext(terms, []) }

  const diff     = current ? (DIFFICULTY_CONFIG[current.difficulty] || DIFFICULTY_CONFIG.beginner) : null
  const DiffIcon = diff?.icon
  const catCls   = current ? (CATEGORY_COLORS[current.category] || "text-zinc-400 border-zinc-700 bg-zinc-800/40") : ""
  const progress = terms.length > 0 ? Math.round((seen.length / terms.length) * 100) : 0

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

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 sm:px-10 md:px-0 py-10">

        {/* Header */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-sans tracking-widest text-red-400 uppercase">Cyber Flashcards</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-zinc-50 leading-tight tracking-tight">
            Learn the Language
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Tap a card to reveal what the term means and how to protect yourself.
          </p>
        </motion.div>

        {/* Score + Progress */}
        <AnimatePresence>
          {terms.length > 0 && (
            <motion.div
              className="mb-6 bg-white/[0.03] border border-zinc-800/70 rounded-2xl px-5 py-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TbBrain size={15} className="text-red-400" />
                  <span className="text-xs font-sans text-zinc-500">{seen.length} / {terms.length} terms seen</span>
                </div>
                <motion.span
                  key={score}
                  className="text-xs font-sans text-red-400 font-semibold"
                  initial={{ scale: 1.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {score} learned
                </motion.span>
              </div>
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-700 to-red-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-sans text-zinc-700 mt-1">
                <span>START</span><span>COMPLETE</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div
              className="flex flex-col items-center justify-center py-24 gap-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <svg className="animate-spin h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <p className="text-xs font-sans text-zinc-600 tracking-widest">LOADING TERMS...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="bg-red-500/10 border border-red-500/25 rounded-xl px-5 py-4 text-sm text-red-400 mb-4 flex items-center justify-between"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            >
              <span>{error}</span>
              <button onClick={fetchTerms} className="text-xs font-sans text-red-300 hover:text-white transition-colors border border-red-500/30 px-2.5 py-1 rounded-lg">Retry</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No terms */}
        {!loading && !error && terms.length === 0 && (
          <div className="text-center py-20 text-zinc-500 text-sm">
            No terms found. Seed via <span className="font-sans text-zinc-400">POST /learn/seed</span>.
          </div>
        )}

        {/* Card area */}
        {!loading && current && (
          <div className="space-y-3">

            {/* Flashcard with AnimatePresence for card swap */}
            <AnimatePresence mode="wait">
              <motion.div
                key={cardKey}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="bg-white/[0.03] border border-zinc-800/70 rounded-2xl overflow-hidden"
              >
                {/* Card front — always visible */}
                <div className="px-6 pt-6 pb-5">
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <span className={`text-[10px] font-sans border rounded-lg px-2.5 py-1 tracking-wider ${catCls}`}>
                      {current.category}
                    </span>
                    <div className={`flex items-center gap-1.5 text-[10px] font-sans ${diff.color}`}>
                      <DiffIcon size={13} />
                      <span>{diff.label}</span>
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-zinc-50 tracking-tight leading-tight">
                    {current.term}
                  </h3>
                </div>

                {/* Divider */}
                <div className="mx-6 h-px bg-zinc-800/80" />

                {/* Revealed content */}
                <AnimatePresence mode="wait">
                  {flipped && revealed ? (
                    <motion.div
                      key="revealed"
                      variants={staggerContainer}
                      initial="initial"
                      animate="animate"
                      className="px-6 py-5 space-y-4"
                    >
                      <motion.p variants={staggerItem} className="text-sm text-zinc-300 leading-relaxed">
                        {revealed.explanation}
                      </motion.p>

                      {revealed.example && (
                        <motion.div
                          variants={staggerItem}
                          className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3"
                        >
                          <p className="text-[10px] font-sans text-zinc-500 uppercase tracking-wider mb-1.5">Real Example</p>
                          <p className="text-sm text-zinc-400 italic leading-relaxed">{revealed.example}</p>
                        </motion.div>
                      )}

                      {revealed.actionable?.length > 0 && (
                        <motion.div variants={staggerItem}>
                          <div className="flex items-center gap-2 mb-2.5">
                            <span className="w-0.5 h-3.5 rounded-full bg-green-500/60" />
                            <p className="text-[10px] font-sans text-zinc-500 uppercase tracking-wider">How to stay safe</p>
                          </div>
                          <ul className="space-y-2">
                            {revealed.actionable.map((step, i) => (
                              <motion.li
                                key={i}
                                className="flex gap-2.5 text-sm text-zinc-300"
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.28, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                              >
                                <span className="text-red-500 shrink-0 mt-0.5 text-xs">→</span>
                                <span className="leading-relaxed">{step}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="hidden"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="px-6 py-5"
                    >
                      <p className="text-sm text-zinc-500 font-poppins">Tap "Reveal" to see the explanation.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>

            {/* Action buttons */}
            <AnimatePresence mode="wait">
              {!flipped ? (
                <motion.button
                  key="reveal-btn"
                  variants={buttonVariants}
                  initial="initial"
                  animate="animate"
                  exit={{ opacity: 0, y: -6, transition: { duration: 0.18 } }}
                  onClick={handleReveal}
                  disabled={fetching}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold tracking-wide transition-colors duration-200"
                >
                  {fetching ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Loading...
                    </>
                  ) : (
                    <>Reveal <TbArrowRight size={15} /></>
                  )}
                </motion.button>
              ) : (
                <motion.div
                  key="next-btns"
                  variants={buttonVariants}
                  initial="initial"
                  animate="animate"
                  exit={{ opacity: 0, y: -6, transition: { duration: 0.18 } }}
                  className="grid grid-cols-2 gap-2.5"
                >
                  <motion.button
                    onClick={handleNext}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors duration-200"
                  >
                    Next Card <TbArrowRight size={15} />
                  </motion.button>
                  <motion.button
                    onClick={handleReset}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-700/70 hover:border-zinc-600 text-zinc-400 hover:text-zinc-200 text-sm transition-colors duration-200"
                  >
                    <TbRefresh size={15} />
                    Restart
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Completion banner */}
            <AnimatePresence>
              {seen.length === terms.length && terms.length > 0 && (
                <motion.div
                  className="bg-green-500/10 border border-green-500/25 rounded-2xl px-5 py-4 text-center"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1,    y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="text-sm text-green-400 font-semibold">You've seen all {terms.length} terms! 🎉</p>
                  <p className="text-xs text-zinc-600 mt-1">Cards will now repeat. Tap Restart to reset progress.</p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between text-xs text-zinc-700 border-t border-zinc-800/50 pt-4">
          <span className="font-sans">Cybercrime helpline</span>
          <a href="tel:1930" className="text-red-500/60 font-sans hover:text-red-400 transition-colors tracking-widest">1930</a>
        </div>

      </div>
    </div>
  )
}

export default Peek