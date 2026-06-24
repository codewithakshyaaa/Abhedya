import React, { useEffect, useRef, useState } from 'react'
import { Mail, ArrowUpRight } from 'lucide-react'

const Github = ({ size = 18, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.95.1-.75.4-1.25.73-1.53-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.04 11.04 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.21.66.79.55A10.51 10.51 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
    </svg>
)

const Linkedin = ({ size = 18, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.25 2.36 4.25 5.44v6.3ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
)

// Fades + lifts children into place the first time they scroll into view.
// Pure IntersectionObserver + CSS transitions — no animation library needed.
function Reveal({ children, className = '', delay = 0, as = 'div' }) {
    const ref = useRef(null)
    const [visible, setVisible] = useState(false)
    const Tag = as

    useEffect(() => {
        const node = ref.current
        if (!node) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.15 }
        )
        observer.observe(node)
        return () => observer.disconnect()
    }, [])

    return (
        <Tag
            ref={ref}
            className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}
            style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
        >
            {children}
        </Tag>
    )
}

function Vision() {
  return (
    <div className="relative w-full min-h-screen bg-black text-zinc-200">
    <style>{`
        .reveal {
            opacity: 0;
            transform: translateY(28px);
            transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .reveal-visible {
            opacity: 1;
            transform: translateY(0);
        }
        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(18px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .hero-fade-1 { animation: fadeUp 0.7s ease both; }
        .hero-fade-2 { animation: fadeUp 0.7s ease 0.15s both; }
        @media (prefers-reduced-motion: reduce) {
            .reveal, .hero-fade-1, .hero-fade-2 {
                animation: none !important;
                transition: none !important;
                opacity: 1 !important;
                transform: none !important;
            }
        }
    `}</style>

    <div className='relative z-10 py-10 px-6 sm:px-10 md:px-16'>
        <h1 className="hero-fade-1 font-poppins font-bold text-4xl sm:text-5xl tracking-tight text-zinc-50">
                The<span className="text-red-500"> Vision:</span>
        </h1>
        <p className='hero-fade-2 mt-4 text-zinc-400 text-base'>
            Making security intuitive, transparent and accessible to everyone.
        </p>
    </div>

    {/* ---------- Story section ---------- */}
    <Reveal className="relative z-10 px-6 sm:px-10 md:px-16 py-10 sm:py-10">
        <div className="flex flex-col md:flex-row gap-8 md:gap-14 md:items-start">
            {/* Photo placeholder — replace the inner div with:
                <img src="/your-photo.jpg" alt="[Your Name]" className="w-full h-full object-cover" />
            */}
            <div className="flex-shrink-0">
                <img className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 flex items-center justify-center hover:border-red-500/60 object-cover" src="/images/profile.jpg" alt="" />
            </div>

            <div className="flex-1">
                <h2 className="font-poppins font-bold text-3xl sm:text-4xl tracking-tight text-zinc-50">
                    Hi, I&apos;m <span className="text-red-500">AKSHYA TIWARY</span>
                </h2>

                <div className="mt-6 max-w-3xl space-y-5 text-zinc-400 text-base leading-relaxed">
                    <p>
                        I&apos;m currently a B.Tech Computer Science student. I spend
                        my time exploring the intersection of AI, full-stack development, and digital
                        security.
                    </p>
                    <p>
                        Abhedya started as a spark of curiosity, a desire to bridge the gap between
                        complex digital threats and everyday user safety. As a student, I witnessed how
                        overwhelming security software can feel, and I realized that true protection
                        shouldn&apos;t be a closed-off, intimidating fortress. Instead, I envisioned a
                        collaborative defense network-one that learns, evolves, and grows stronger
                        through the shared experiences of its community.
                    </p>
                    <p>
                        To me, building Abhedya is more than just writing code; it&apos;s about crafting
                        a digital safety net that feels human, intuitive, and genuinely helpful. My goal
                        is to transform technical complexity into a simple, seamless experience for
                        everyone, ensuring that safety is accessible, not burdensome.
                    </p>
                    <p>
                        Technology is at its best when it&apos;s built by people and for people.
                    </p>
                </div>
            </div>
        </div>
    </Reveal>
    <Reveal className="relative z-10 px-6 sm:px-10 md:px-16 py-16 sm:py-20 ">
        <span className="font-poppins text-xs font-semibold tracking-[0.2em] text-red-500 uppercase">
            Get in touch
        </span>

        <h2 className="mt-4 font-poppins font-bold text-3xl sm:text-4xl tracking-tight text-zinc-50">
            Let&apos;s<span className="text-red-500"> Connect</span>
        </h2>

        <p className="mt-4 max-w-xl text-zinc-400 text-base">
            Whether you have feedback, ideas, or just want to chat about tech, I'm always listening.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
            <a
                href="https://github.com/codewithakshyaaa"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-full border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-200 transition-all duration-200 hover:border-red-500 hover:text-red-500 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
                <Github size={18} />
                GitHub
                <ArrowUpRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <a
                href="https://www.linkedin.com/in/akshya-tiwary-2659b0371/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-full border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-200 transition-all duration-200 hover:border-red-500 hover:text-red-500 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
                <Linkedin size={18} />
                LinkedIn
                <ArrowUpRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=akshyatiwary7@gmail.com"
                className="group inline-flex items-center gap-2.5 rounded-full border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-200 transition-all duration-200 hover:border-red-500 hover:text-red-500 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
                <Mail size={18} />
                Gmail
                <ArrowUpRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
        </div>
    </Reveal>

    {/* ---------- Footer ---------- */}
    <Reveal as="footer" className="relative z-10 border-t border-zinc-800 px-6 sm:px-10 md:px-16 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <span className="font-poppins font-bold text-lg text-zinc-50">
                    Abhed<span className="text-red-500">ya</span>
                </span>
                <p className="mt-1 text-xs text-zinc-500">
                    Security that learns, evolves, and grows with its community.
                </p>
            </div>

            <div className="flex items-center gap-5">
                <a
                    href="https://github.com/codewithakshyaaa"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="text-zinc-500 transition-all duration-200 hover:text-red-500 hover:-translate-y-0.5"
                >
                    <Github size={18} />
                </a>
                <a
                    href="https://www.linkedin.com/in/akshya-tiwary-2659b0371/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="text-zinc-500 transition-all duration-200 hover:text-red-500 hover:-translate-y-0.5"
                >
                    <Linkedin size={18} />
                </a>
                <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=akshyatiwary7@gmail.com"
                    aria-label="Email"
                    className="text-zinc-500 transition-all duration-200 hover:text-red-500 hover:-translate-y-0.5"
                >
                    <Mail size={18} />
                </a>
            </div>
        </div>

        <p className="mt-6 text-xs text-zinc-600">
            © 2026 Abhedya. Built with care.
        </p>
    </Reveal>
    </div>
  )
}

export default Vision