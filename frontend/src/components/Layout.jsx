import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { getMyGym } from '../services/gyms'

export default function Layout() {
  const { logout } = useAuth()
  const location = useLocation()
  const [gymName, setGymName] = useState('GymFlow')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                <span className="text-base sm:text-lg">💪</span>
              </div>
              <span className="apple-body font-semibold text-gray-900 text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">{gymName}</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
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
                className="apple-body px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
              >
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <div className="flex flex-col space-y-2">
                <MobileNavLink to="/dashboard" active={isActive('/dashboard')} onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </MobileNavLink>
                <MobileNavLink to="/dashboard/gym" active={isActive('/dashboard/gym')} onClick={() => setMobileMenuOpen(false)}>
                  Gym Profile
                </MobileNavLink>
                <MobileNavLink to="/dashboard/members" active={isActive('/dashboard/members')} onClick={() => setMobileMenuOpen(false)}>
                  Members
                </MobileNavLink>
                <MobileNavLink to="/dashboard/trainers" active={isActive('/dashboard/trainers')} onClick={() => setMobileMenuOpen(false)}>
                  Trainers
                </MobileNavLink>
                <MobileNavLink to="/dashboard/payments" active={isActive('/dashboard/payments')} onClick={() => setMobileMenuOpen(false)}>
                  Payments
                </MobileNavLink>
                <button
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="apple-body px-4 py-2 text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 sm:pt-20 px-4 sm:px-6 py-8 sm:py-12 pb-20 sm:pb-24">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 sm:py-3 px-4 sm:px-6 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 text-center">
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
      className={`apple-body px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
        active
          ? 'text-gray-900 bg-gray-100'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ to, active, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`apple-body px-4 py-3 rounded-lg transition-all text-base ${
        active
          ? 'text-gray-900 bg-gray-100 font-medium'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      {children}
    </Link>
  )
}
