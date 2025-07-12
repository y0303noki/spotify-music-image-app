import React, { useEffect } from 'react'
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Callback from './pages/Callback'
import Dashboard from './pages/Dashboard'
import './App.css'

// ルートパスでのコールバック処理を行うコンポーネント
const RootCallback: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const code = urlParams.get('code')
    
    if (code) {
      console.log('Code found in root path, redirecting to callback')
      // クエリパラメータを保持したまま/callbackにリダイレクト
      navigate(`/callback${location.search}`)
    }
  }, [navigate, location.search])

  return <Login />
}

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
          <Route path="/" element={<RootCallback />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App 