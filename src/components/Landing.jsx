import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SiBuzzfeed } from "react-icons/si";
import { FaCheckCircle } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * i, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

const links = [
  { label: "Cyber Forge",             to: "/peek"             },
  { label: "First Aid",        to: "/first-aid"        },
  { label: "Community Shield", to: "/community-shield" },
];

function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className='relative w-full min-h-screen overflow-x-hidden bg-black text-zinc-200'>
      <video
        autoPlay
        muted
        loop
        playsInline
        className='absolute top-0 left-0 w-full h-full object-cover z-0'
      >
        <source src="/images/video.mp4" type="video/mp4" />
      </video>

      <div className='absolute inset-0 bg-black/70 z-10' />

      {/* ── NAVBAR ── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className='relative z-30 flex items-center justify-between px-6 sm:px-10 md:px-16 pt-6 w-full'
      >
        <Link to="/">
          <h1 className='font-poppins text-2xl text-zinc-50'>
            Abhed<span className='text-red-500'>ya</span>
          </h1>
        </Link>

        {/* Desktop links */}
        <div className='hidden md:flex items-center gap-6 lg:gap-8'>
          {links.map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -2 }}
            >
              <Link
                to={item.to}
                className='font-sans text-base font-light text-zinc-300 hover:text-red-400 transition-colors'
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Hamburger */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className='md:hidden p-2 text-zinc-300 hover:text-red-400 transition-colors'
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </motion.button>
      </motion.nav>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className='absolute top-[68px] left-0 right-0 z-40 bg-black/95 border-b border-zinc-800 backdrop-blur-md px-6 py-5 flex flex-col gap-4'
          >
            {links.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.06, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className='block font-sans text-base font-light text-zinc-300 hover:text-red-400 transition-colors py-1'
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <main className='relative z-20 flex flex-col items-center justify-center min-h-[85vh] px-6 sm:px-10 text-center'>
        <div className='space-y-1 sm:space-y-2 mb-8 sm:mb-12'>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className='text-3xl sm:text-4xl md:text-6xl font-poppins font-bold drop-shadow-lg'
          >
            <span className="text-red-500">Stay</span> on guard,
          </motion.h1>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className='text-3xl sm:text-4xl md:text-6xl font-poppins font-bold text-zinc-400 drop-shadow-lg'
          >
            Your safety is <span className="text-red-500">never </span>hard
          </motion.h1>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className='max-w-2xl font-sans text-sm sm:text-base md:text-lg font-light text-zinc-300 space-y-2'
        >
          <p>
            <span className="text-red-500 font-bold tracking-wider">ABHEDYA</span> is your proactive digital security first-aid kit.
          </p>
          <p>
            A companion that empowers you to verify and act before threats materialize.
            We replace complex technical alerts with clear actionable guidance to keep you protected in real-time.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className='flex flex-col sm:flex-row gap-4 mt-10 sm:mt-16 w-full max-w-xs sm:max-w-sm'
        >
          <Link to="/safety-feed" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className='w-full flex items-center justify-center gap-3 px-6 py-3 font-poppins font-medium rounded-full text-zinc-100 bg-red-700 hover:bg-red-600 transition-colors shadow-lg'
            >
              Safety feed
              <SiBuzzfeed className="text-xl" />
            </motion.button>
          </Link>

          <Link to="/check-it-analyzer" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className='w-full flex items-center justify-center gap-3 px-6 py-3 font-poppins font-medium rounded-full text-zinc-100 bg-red-700 hover:bg-red-600 transition-colors shadow-lg'
            >
              Analyze it
              <FaCheckCircle className="text-xl" />
            </motion.button>
          </Link>
        </motion.div>
      </main>

      {/* Bottom fade */}
      <div className='absolute bottom-0 left-0 w-full h-32 sm:h-40 bg-gradient-to-t from-black to-transparent z-10' />
    </div>
  );
}

export default Landing;