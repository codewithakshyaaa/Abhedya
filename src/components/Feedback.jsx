import React from 'react'
import { motion } from 'framer-motion'

const feedbacks = [
  { initials: "AR", name: "Ananya R.", role: "Cybersecurity student", rating: 5, quote: "Abhedya flagged a phishing link in my inbox before I even clicked it. The regional feed actually speaks my language — it's the first security tool that felt built for India.", tag: "Threat detection", tagType: "pos" },
  { initials: "PM", name: "Priya M.", role: "Product manager", rating: 5, quote: "Speed is insane. Classification happens almost instantly — I didn't even notice it running until I checked the logs. Groq-powered speed is a real differentiator.", tag: "AI speed", tagType: "pos" },
  { initials: "RV", name: "Rohan V.", role: "Small business owner", rating: 3, quote: "Great concept and the product does feel smarter every week. Would love a mobile widget for quick checks — the app itself is solid though.", tag: "Suggestion", tagType: "neu" },
  { initials: "NJ", name: "Neha J.", role: "IT admin", rating: 5, quote: "Deployed Abhedya across our 40-person team. Zero incidents since onboarding. The First Aid report helped one of our employees file a cybercrime complaint in minutes.", tag: "Cyber First Aid", tagType: "pos" },
  { initials: "KS", name: "Kunal S.", role: "Journalist", rating: 4, quote: "As someone constantly clicking links from unknown sources for research, Abhedya feels like a safety net I didn't know I needed. The contextual alerts are incredibly well thought out.", tag: "Safety feed", tagType: "pos" },
  { initials: "DS", name: "Divya S.", role: "College student", rating: 4, quote: "Onboarding took a bit to figure out but once I was in, it just worked. The UI is clean and minimal — doesn't feel like typical security software which is always so overwhelming.", tag: "UX", tagType: "neu" },
  { initials: "VS", name: "Vikram S.", role: "Security Researcher", rating: 5, quote: "The way Abhedya handles edge-case threats is impressive. The AI classification is sharp and the threat reports are structured enough to actually submit to authorities.", tag: "Performance", tagType: "pos" },
  { initials: "LK", name: "Lina K.", role: "Design Lead", rating: 5, quote: "Security software usually looks ancient. Abhedya is the first one that feels like a modern SaaS app I actually enjoy opening.", tag: "UX/UI", tagType: "pos" },
  { initials: "MJ", name: "Mark J.", role: "DevOps Engineer", rating: 4, quote: "Integration was a breeze. API documentation is very clear, and the regional threat feed is a goldmine for staying ahead of local scam patterns.", tag: "API", tagType: "pos" },
  { initials: "TB", name: "Tina B.", role: "Freelance Designer", rating: 3, quote: "Solid protection, but the dashboard can be a bit crowded on smaller screens. Still, better than anything else out there for India-specific threats.", tag: "Dashboard", tagType: "neu" },
  { initials: "SK", name: "Sahil K.", role: "Freelance developer", rating: 5, quote: "A client sent me a suspicious file and I used Abhedya's First Aid to generate a proper report. Turns out it was malware — the incident report helped me escalate it properly.", tag: "Cyber First Aid", tagType: "pos" },
  { initials: "AM", name: "Arjun M.", role: "Startup founder", rating: 5, quote: "We use Abhedya for employee awareness. When one of our team members got phished, the First Aid feature walked them through exactly what to do. Saved us from a bigger mess.", tag: "Incident Response", tagType: "pos" },
]

function Stars({ count }) {
  return (
    <span className="ml-auto text-red-500 text-[11px] tracking-wider flex-shrink-0">
      {"★".repeat(count)}{"☆".repeat(5 - count)}
    </span>
  )
}

function FeedbackCard({ f, index }) {
  const isPos = f.tagType === "pos"
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-zinc-900 border border-zinc-800 hover:border-red-500/30 rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-xl flex flex-col h-full min-w-[280px] sm:min-w-0 snap-start"
    >
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${isPos ? "bg-red-500/15 text-red-500" : "bg-zinc-800 text-zinc-500"}`}>
          {f.initials}
        </div>
        <div className="min-w-0">
          <p className="text-base sm:text-lg font-semibold text-zinc-50 truncate">{f.name}</p>
          <p className="text-xs text-zinc-500 mt-0.5 truncate">{f.role}</p>
        </div>
        <Stars count={f.rating} />
      </div>
      <p className="text-sm sm:text-[15px] text-zinc-300 leading-relaxed font-medium flex-grow">"{f.quote}"</p>
      <span className={`inline-block mt-4 sm:mt-5 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit ${isPos ? "bg-red-500/10 text-red-400" : "bg-zinc-800 text-zinc-500"}`}>
        {f.tag}
      </span>
    </motion.div>
  )
}

function Feedback() {
  return (
    <div className="bg-black text-zinc-200 py-16 sm:py-20 px-6 sm:px-6 md:px-6">
       <div className="relative z-10 py-16 sm:py-20 px-6 sm:px-6 md:px-6">
        <h1 className="font-poppins font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-zinc-50">
          See what our <br /> <span className="text-red-500">community</span> says
        </h1>
        <p className="mt-4 text-zinc-400 text-sm sm:text-base max-w-md leading-relaxed">
          Our platform is built on the strength of our users, and every voice helps us create a safer digital environment. Explore the stories and insights shared by our community.
        </p>
        
        {/* Mobile: Horizontal flex scroll | Desktop: Grid */}
        <div className="flex sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 overflow-x-auto sm:overflow-visible pb-8 sm:pb-0 mt-12 sm:mt-16 md:mt-20 snap-x">
          {feedbacks.map((f, i) => <FeedbackCard key={i} f={f} index={i} />)}
        </div>
      </div>
    </div>
  )
}

export default Feedback