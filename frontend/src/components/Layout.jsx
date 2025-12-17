import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { getMyGym } from '../services/gyms'

export default function Layout() {
  const { logout } = useAuth()
  const location = useLocation()
  const [gymName, setGymName] = useState('GymFlow')

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  useEffect(() => {
    const loadGymName = async () => {
      try {
        const gym = await getMyGym()
        if (gym && gym.name) {
          setGymName(gym.name)
        }
      } catch (err) {
        console.error('Failed to load gym name:', err)
      }
    }
    loadGymName()
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Glassmorphism Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                <span className="text-lg">💪</span>
              </div>
              <span className="apple-body font-semibold text-gray-900">{gymName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <NavLink to="/dashboard" active={isActive('/dashboard')}>
                Dashboard
              </NavLink>
              <NavLink to="/dashboard/gym" active={isActive('/dashboard/gym')}>
                Gym Profile
              </NavLink>
              <NavLink to="/dashboard/members" active={isActive('/dashboard/members')}>
                Members
              </NavLink>
              <NavLink to="/dashboard/trainers" active={isActive('/dashboard/trainers')}>
                Trainers
              </NavLink>
              <NavLink to="/dashboard/payments" active={isActive('/dashboard/payments')}>
                Payments
              </NavLink>
              <button
                onClick={logout}
                className="apple-body px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 px-6 py-12 pb-24">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center space-x-2">
            <p className="apple-body text-xs text-gray-400">Design & Development by</p>
            <a
              href="https://sansatechsolution.com"
              target="_blank"
              rel="noopener noreferrer"
              className="apple-body text-xs text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              SansaTechSolution.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`apple-body px-4 py-2 rounded-lg transition-all ${
        active
          ? 'text-gray-900 bg-gray-100'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      {children}
    </Link>
  )
}
