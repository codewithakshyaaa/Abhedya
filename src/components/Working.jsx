import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: "01",
    title: "Submit & Scan",
    description: "Drop in a link, QR code, text, or email-we scan it instantly.",
    detail:
      "Just paste a suspicious link, scan a QR code, forward a text message, or connect your Gmail-Check-It Analyzer reads it the moment you submit it. No copying into separate tools, no waiting around. It's built to understand exactly what kind of content you've shared and starts working on it right away.",
    image: "/images/1.png",
  },
  {
    number: "02",
    title: "AI Detects the Threat",
    description: "Our engine checks it for phishing, malware, and scams in seconds.",
    detail:
      "Behind the scenes, our AI engine compares what you submitted against real-time threat patterns-phishing attempts, malware payloads, and social engineering tricks. It doesn't just say 'safe' or 'unsafe'-it tells you exactly what was found and why, in simple to understand manner.",
    image: "/images/2.png",
  },
  {
    number: "03",
    title: "Get Your First Aid Report",
    description: "A ready-to-submit PDF report, generated automatically.",
    detail:
      "If a threat is confirmed, First Aid takes over and builds a complete report for you-formatted and worded the way cybercrime portals, banks, or your IT team expect. No writing it yourself, no figuring out what details to include. Just download the PDF and submit it to the right place.",
    image: "/images/3.png",
  },
];

function Working() {
  return (
    <div className='relative w-full min-h-screen overflow-x-hidden bg-black text-zinc-200'>
      <div className='relative z-10 py-10 px-6 sm:px-10 md:px-16'>
        <h1 className="font-poppins font-bold text-4xl sm:text-5xl tracking-tight text-zinc-50">
          <span className="text-red-500">How</span> it works?
        </h1>
        <p className='mt-4 text-zinc-400 text-base max-w-md'>
          From the first scan to the final report, Abhedya stays one step ahead of every threat.
          No jargon, no guesswork — just a clear path from suspicion to safety.
          Quietly watching, instantly acting, always on your side.
        </p>
      </div>

      <div className='relative z-10 px-6 sm:px-10 md:px-16 pb-20 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8'>
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className='group relative h-[420px] rounded-3xl overflow-hidden border border-zinc-800 cursor-pointer'
          >
            <img
              src={step.image}
              alt={step.title}
              className='absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110'
            />

            <div className='absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 transition-opacity duration-500 group-hover:opacity-95'></div>

            <span className='absolute top-6 left-6 font-poppins font-bold text-5xl text-zinc-700/60 group-hover:text-red-500/30 transition-colors duration-500'>
              {step.number}
            </span>

            <div className='absolute inset-x-0 bottom-0 p-6 transition-all duration-500 ease-out group-hover:opacity-0 group-hover:translate-y-4'>
              <h3 className='font-poppins font-bold text-2xl text-zinc-50'>{step.title}</h3>
              <p className='mt-2 text-zinc-400 text-sm leading-relaxed'>{step.description}</p>
            </div>

            <div className='absolute inset-0 flex items-center p-7 opacity-0 translate-y-4 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0'>
              <div>
                <h3 className='font-poppins font-bold text-xl text-red-500 mb-3'>{step.title}</h3>
                <p className='text-zinc-200 text-sm leading-relaxed'>{step.detail}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className='absolute bottom-0 left-0 w-full h-32 sm:h-40 bg-linear-to-t from-black to-transparent z-10'></div>
    </div>
  );
}

export default Working;