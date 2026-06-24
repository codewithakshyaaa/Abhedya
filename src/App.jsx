import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './components/Landing'
import Features from './components/Features'
import Marquee from './components/Marquee'
import Working from './components/Working'
import Benefits from './components/Benefits'
import Feedback from './components/Feedback'
import Vision from './components/Vision'
import SafetyFeed from './components/SafetyFeed'
import CheckIt from './components/CheckIt'
import Peek from './components/Peek'
import FirstAid from './components/FirstAid'
import CommunityShield from './components/CommunityShield'

function Home() {
  return (
    <div className='w-full min-h-screen bg-black'>
      <Landing/>
      <Features/>
      <Marquee/>
      <Working/>
      <Benefits/>
      <Feedback/>
      <Vision/>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/safety-feed" element={<SafetyFeed />} />
        <Route path="/check-it-analyzer" element={<CheckIt />} />
        <Route path="/peek" element={<Peek />} />
        <Route path="/first-aid" element={<FirstAid />} />
        <Route path="/community-shield" element={<CommunityShield />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App