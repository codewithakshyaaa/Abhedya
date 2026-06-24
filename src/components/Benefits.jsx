import React from 'react'
import { motion } from 'framer-motion'

const comparison = [
  {
    name: "Community-Driven Defense",
    abhedya: "Features a crowdsourced defense layer that grows smarter with every contribution.",
    other: "Often rely on centralized and isolated protection systems.",
  },
  {
    name: "AI-Powered Speed",
    abhedya: "Leverages Groq and Llama-3 for ultra-low-latency threat classification.",
    other: "Frequently use legacy models that are often slower.",
  },
  {
    name: "Contextual Safety Feed",
    abhedya: "Provides a curated stream of threats and advisories contextualized to your specific region in your language.",
    other: "Mostly display generic, global threat databases.",
  },
  {
    name: "Cyber First Aid",
    abhedya: "Generates structured, AI-powered incident reports you can directly submit to cybercrime.gov.in.",
    other: "Offer no guidance on what to do after an attack — you're left to figure it out alone.",
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
}

function Benefits() {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-black text-zinc-200">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover saturate-[1.4] hue-rotate-[-10deg] brightness-[0.35]"
        >
          <source src="https://www.pexels.com/download/video/16548256/" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-black/75" />
        <div className="absolute inset-0 pointer-events-none bg-[rgba(170,0,0,0.10)] mix-blend-color" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_35%,_rgba(0,0,0,0.65)_100%)]" />
      </div>

      {/* Content — same left padding as surrounding sections */}
      <div className="relative z-10 py-16 sm:py-20 px-6 sm:px-10 md:px-16">

        {/* Heading */}
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-poppins font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-zinc-50"
        >
          Why <span className="text-red-500">Abhedya</span>?
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 text-zinc-400 text-sm sm:text-base max-w-md leading-relaxed"
        >
          While others act in isolation, Abhedya builds a smarter, crowdsourced defense layer that grows more resilient with every user report.
        </motion.p>

        {/* ── DESKTOP TABLE (md+) ── */}
        <div className="hidden md:block mt-12">
          <table className="w-full border-collapse">
            <thead>
              <motion.tr
                {...fadeUp}
                transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="border-b border-zinc-800"
              >
                <th className="text-left font-poppins text-base text-zinc-500 font-semibold pb-4 pr-8 border-r border-zinc-800 w-[26%]">Feature</th>
                <th className="text-left font-poppins text-base text-red-500 font-semibold pb-4 px-8 border-r border-zinc-800 w-[37%]">Abhedya</th>
                <th className="text-left font-poppins text-base text-zinc-300 font-semibold pb-4 pl-8 w-[37%]">Others</th>
              </motion.tr>
            </thead>
            <tbody>
              {comparison.map((item, index) => (
                <motion.tr
                  key={index}
                  {...fadeUp}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-zinc-800/60 hover:bg-white/[0.025] transition-colors duration-200"
                >
                  <td className="font-poppins font-semibold text-sm text-zinc-300 py-6 pr-8 border-r border-zinc-800 align-top">
                    {item.name}
                  </td>
                  <td className="font-poppins text-sm text-red-400 py-6 px-8 border-r border-zinc-800 align-top leading-relaxed">
                    {item.abhedya}
                  </td>
                  <td className="font-poppins text-sm text-zinc-500 py-6 pl-8 align-top leading-relaxed">
                    {item.other}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── MOBILE CARDS (below md) ── */}
        <div className="flex flex-col gap-4 mt-10 md:hidden">
          {comparison.map((item, index) => (
            <motion.div
              key={index}
              {...fadeUp}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4"
            >
              <p className="font-poppins font-semibold text-sm text-zinc-200">{item.name}</p>

              <div className="flex gap-3">
                <span className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-red-500" />
                <div>
                  <p className="text-[10px] font-mono tracking-widest text-red-500 uppercase mb-1">Abhedya</p>
                  <p className="text-sm text-red-400 leading-relaxed">{item.abhedya}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-zinc-600" />
                <div>
                  <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-1">Others</p>
                  <p className="text-sm text-zinc-500 leading-relaxed">{item.other}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Benefits