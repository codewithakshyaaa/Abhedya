import React from 'react'
import { motion } from "motion/react"

function Marquee() {
  return (
      <div className='relative w-full h-10 bg-red-700 overflow-hidden flex items-center'>
        <motion.div 
          className='flex gap-10 px-3 text-white font-poppins whitespace-nowrap'
          initial={{ x: "0" }} 
          animate={{ x: "-50%" }} 
          transition={{ ease: "linear", repeat: Infinity, duration: 15, repeatType: "loop" }}
        >
          {[
            "SCAN LINKS", "DETECT PHISHING", "ISOLATE THREATS", "REPORT INSTANTLY", "STAY PROTECTED",
            "SCAN LINKS", "DETECT PHISHING", "ISOLATE THREATS", "REPORT INSTANTLY", "STAY PROTECTED",
            "SCAN LINKS", "DETECT PHISHING", "ISOLATE THREATS", "REPORT INSTANTLY", "STAY PROTECTED",
            "SCAN LINKS", "DETECT PHISHING", "ISOLATE THREATS", "REPORT INSTANTLY", "STAY PROTECTED"
          ].map((text, index) => (
            <motion.h1 
              key={index}
              className='cursor-pointer'
              whileHover={{ scale: 1.1, color: "#000" }}
              transition={{ duration: 0.3 }}
            >
              {text}
            </motion.h1>
          ))}
        </motion.div>
      </div>
  )
}

export default Marquee