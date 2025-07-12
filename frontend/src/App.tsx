import React, { useEffect } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Callback from './pages/Callback'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  useEffect(() => {
    console.log('App component mounted')
    console.log('Current pathname:', window.location.pathname)
    console.log('Current search:', window.location.search)
    console.log('Current hash:', window.location.hash)
  }, [])

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