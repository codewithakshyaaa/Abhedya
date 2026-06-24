import React from 'react'
import { Link } from 'react-router-dom'
import { HiHome } from "react-icons/hi2";
import { motion } from "framer-motion";
import { TbHeart, TbUsers, TbClock } from "react-icons/tb";

function CommunityShield() {
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
          <span>BACK TO HOME</span>
        </Link>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[88vh] px-6 text-center">

        {/* Pulsing icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 rounded-full bg-red-500/20 blur-2xl scale-150" />
          <div className="relative w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <TbUsers size={36} className="text-red-400" />
            {/* Ping dot */}
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
              <span className="relative w-2 h-2 rounded-full bg-red-500" />
            </span>
          </div>
        </motion.div>

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 mb-4"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-mono tracking-widest text-red-400 uppercase">Community Shield</span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-4xl font-semibold text-zinc-50 leading-tight tracking-tight mb-4 max-w-lg"
        >
          This shield needs more{" "}
          <span className="inline-flex items-center gap-1.5 text-red-400">
            hands <TbHeart size={28} className="inline mb-1" />
          </span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm text-zinc-500 max-w-sm leading-relaxed mb-10"
        >
          Community Shield is being built with love and care. We're gathering the right people, tools, and voices to make it truly powerful. Come back soon — it'll be worth the wait.
        </motion.p>

        {/* Status card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm bg-zinc-900/60 border border-zinc-800 rounded-2xl px-6 py-5 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-800 border border-zinc-700/50">
              <TbClock size={16} className="text-zinc-400" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase">Status</p>
              <p className="text-sm text-zinc-300 font-medium">Under Construction</p>
            </div>
            <span className="ml-auto text-[10px] font-mono text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-2.5 py-1">
              SOON
            </span>
          </div>

          <div className="border-t border-zinc-800/80 pt-4 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-800 border border-zinc-700/50">
              <TbUsers size={16} className="text-zinc-400" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase">What's coming</p>
              <p className="text-sm text-zinc-300 font-medium">Community-powered scam alerts</p>
            </div>
          </div>
        </motion.div>

        {/* Back CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.42 }}
          className="mt-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-600 hover:text-red-400 transition-colors duration-200 uppercase"
          >
            <HiHome size={13} /> Return Home
          </Link>
        </motion.div>

      </div>
    </div>
  )
}

export default CommunityShield