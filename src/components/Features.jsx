import React from 'react';
import { Link } from 'react-router-dom';
import { Radar, ScanLine, Box, FileText, Users, ShieldCheck } from 'lucide-react';

function Features() {
  const featureData = [
    {
      icon: Radar,
      layer: 'Layer 01 · Always on',
      title: 'Safety Feed',
      desc: 'Real-time threat monitoring for your area.',
      details:
        'A real-time, community-curated stream of verified threats, local scam alerts, and safety advisories - contextualized in easy to understand non-techincal language.',
      img: '/images/safetyfeed.png',
      live: true,
      path: '/safety-feed',
    },
    {
      icon: ScanLine,
      layer: 'Layer 02 · On demand',
      title: 'Check-It Analyzer',
      desc: 'Scan links, QR codes and messages instantly.',
      details:
        'Instantly scan suspicious links, QR codes, Gmail messages, and SMS. Al engine detects phishing, malware payloads, and social engineering patterns in seconds.',
      img: '/images/checkit.png',
      path: '/check-it-analyzer',
    },
    {
    icon: Box,
    layer: 'Layer 03 · On demand',
    title: 'Cyber-Forge',
    desc: 'Gamified learning for everyday digital safety.',
    details: 'Master cybersecurity one bite at a time. Turn complex security concepts into simple, actionable daily habits with interactive missions that keep your digital life locked down.',
    img: '/images/peek.png',
    path: '/peek',
  },
    {
      icon: FileText,
      layer: 'Layer 04 · After an incident',
      title: 'First Aid — PDF Reports',
      desc: 'Plain-language reports you can share.',
      details:
        'Generates shareable, plain-language security reportsand empower users to document threats and escalate to authorities or IT teams.',
      img: '/images/firstaid.png',
      path: '/first-aid',
    },
    {
      icon: Users,
      layer: 'Layer 05 · Crowdsourced',
      title: 'Community Shield',
      desc: 'A defense network that learns from everyone.',
      details:
        'Users report and flag threats in real time. A crowdsourced defense layer that grows smarter with every contribution',
      img: '/images/community.png',
      path: '/community-shield',
    },
  ];

  return (
    <section className="relative w-full min-h-screen bg-black text-zinc-200">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/images/video1.mp4" type="video/mp4" />
      </video>

      {/* single intentional overlay — keeps the footage visible but readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.78) 45%, rgba(0,0,0,0.96) 100%)',
        }}
      />

      <div className="relative z-10 px-6 sm:px-10 lg:px-20 py-16 lg:py-20">
        <div className="max-w-2xl mb-16 lg:mb-20">
          <div className="flex items-center gap-2 text-red-400/90 font-poppins text-xs tracking-[0.2em] uppercase mb-4">
            <ShieldCheck className="w-4 h-4" />
            Abhedya · Defense stack
          </div>
          <h1 className="font-poppins font-bold text-4xl sm:text-5xl tracking-tight text-zinc-50">
            Five layers of protection,
            <br />
            <span className="text-red-500">always switched on.</span>
          </h1>
          <p className="mt-4 text-zinc-400 text-base max-w-md">
            Protection that never blinks <br />from the quiet watch in the background <br /> to the report you file when it matters most.
          </p>
        </div>

        {/* alternating timeline — order is real here, so the spine earns its place */}
        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/35 to-transparent" />
            <div className="scan-pulse" />
          </div>

          <div className="space-y-12 lg:space-y-16">
            {featureData.map((item, i) => {
              const Icon = item.icon;
              const isRight = i % 2 === 1;
              return (
                <div
                  key={item.title}
                  className={`relative flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-0 ${
                    isRight ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className="w-full lg:basis-[44%]">
                    <div
                      tabIndex={0}
                      className="group relative rounded-2xl overflow-hidden bg-white/[0.04] backdrop-blur-xl border border-white/10 hover:border-red-500/50 focus-within:border-red-500/50 focus:outline-none transition-all duration-300 hover:scale-[1.03] focus-within:scale-[1.03] hover:z-20 focus-within:z-20 hover:shadow-2xl hover:shadow-red-950/50"
                    >
                      {/* photo slot — swap item.img per card whenever you have real shots */}
                      <div className="relative h-56 lg:h-64 overflow-hidden">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* fades the photo into the card below it, instead of a hard edge */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/5" />

                        <div className="absolute top-4 left-4 w-10 h-10 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-red-400">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="absolute top-4 right-4 text-[11px] font-poppins uppercase tracking-widest text-white bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1">
                          {item.layer}
                        </span>
                        {item.live && (
                          <span className="absolute bottom-4 left-4 flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-red-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-dot" />
                            Live
                          </span>
                        )}
                      </div>

                      <div className="p-5">
                        <h2 className="font-poppins font-bold text-xl text-zinc-50">{item.title}</h2>
                        <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                      </div>

                      {/* hover reveal — card pops forward (transform, no reflow) and this
                          panel opens over the photo with the full detail + CTA */}
                      <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 bg-gradient-to-t from-black/95 via-black/85 to-black/25 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300">
                        <h3 className="font-poppins font-bold text-zinc-50 text-lg mb-2">{item.title}</h3>
                        <p className="text-sm text-zinc-200 leading-relaxed mb-3">{item.details}</p>
                        <Link
                          to={item.path}
                          className="self-start inline-flex items-center gap-1 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg transition-colors"
                        >
                          Know more →
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* node on the spine — desktop only */}
                  <div className="hidden lg:flex lg:basis-[12%] justify-center relative z-10">
                    <div className="w-12 h-12 shrink-0 rounded-full bg-black border-2 border-red-500 flex items-center justify-center font-poppins text-sm font-bold text-white">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                  </div>

                  <div className="hidden lg:block lg:basis-[44%]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .live-dot {
          animation: livePulse 1.6s ease-in-out infinite;
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .scan-pulse {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 140px;
          top: -15%;
          background: linear-gradient(to bottom, transparent, rgba(239,68,68,0.95), transparent);
          filter: blur(1px);
          animation: scanMove 6s linear infinite;
        }
        @keyframes scanMove {
          0% { top: -15%; }
          100% { top: 110%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .live-dot, .scan-pulse { animation: none; }
        }
      `}</style>
    </section>
  );
}

export default Features;