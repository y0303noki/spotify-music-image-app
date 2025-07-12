import React, { useEffect, useState } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Callback from './pages/Callback'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const [isCallback, setIsCallback] = useState(false)

  useEffect(() => {
    console.log('App component mounted')
    console.log('Current pathname:', window.location.pathname)
    console.log('Current search:', window.location.search)
    console.log('Current hash:', window.location.hash)
    
    // ルートパスでcodeパラメータがある場合はコールバック処理
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    
    if (code && window.location.pathname === '/spotify-music-image-app/' || window.location.pathname === '/') {
      console.log('Code found in root path, showing callback')
      setIsCallback(true)
    }
  }, [])

  if (isCallback) {
    return <Callback />
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App 