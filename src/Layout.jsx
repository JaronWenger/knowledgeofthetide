import { useState, useEffect, useCallback } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Activity } from 'lucide-react'
import tideIcon from './assets/tideicon.png'
import { useMarketData } from './hooks/useMarketData'
import './App.css'

function Layout() {
  const [scrolled, setScrolled] = useState(false)
  const { data, loading, errors, refreshKey } = useMarketData()
  const navigate = useNavigate()
  const location = useLocation()

  const routes = ['/ideas', '/trends', '/economy', '/fed', '/startups', '/community', '/sources']

  const handleKeyDown = useCallback((e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
    const idx = routes.indexOf(location.pathname)
    if (e.key === 'ArrowRight' && idx < routes.length - 1) {
      navigate(routes[idx + 1])
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      navigate(routes[idx - 1])
    }
  }, [location.pathname, navigate])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  const liveSourceCount = Object.keys(data).filter((k) => data[k] !== null).length

  return (
    <div className="app">
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <NavLink to="/" className="nav-brand">
          <img src={tideIcon} alt="Tide" className="nav-logo" />
          <span>Knowledge of the Tide</span>
        </NavLink>
        <ul className="nav-links">
          <li><NavLink to="/ideas">Ideas</NavLink></li>
          <li><NavLink to="/trends">Trends</NavLink></li>
          <li><NavLink to="/economy">Global</NavLink></li>
          <li><NavLink to="/fed">U.S. Data</NavLink></li>
          <li><NavLink to="/startups">Startups</NavLink></li>
          <li><NavLink to="/community">Community</NavLink></li>
          <li><NavLink to="/sources">Sources</NavLink></li>
        </ul>
        <div className="nav-status">
          <div className="pulse" />
          {loading ? 'LOADING...' : `${liveSourceCount} SOURCES LIVE`}
        </div>
      </nav>

      <Outlet context={{ data, loading, errors, refreshKey }} />

      <footer className="footer">
        <ul className="footer-links">
          <li><NavLink to="/trends">Trends</NavLink></li>
          <li><NavLink to="/economy">Economy</NavLink></li>
          <li><NavLink to="/startups">Startups</NavLink></li>
          <li><NavLink to="/community">Community</NavLink></li>
          <li><NavLink to="/ideas">Ideas</NavLink></li>
        </ul>
        <p>&copy; {new Date().getFullYear()} Knowledge of the Tide. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Layout
