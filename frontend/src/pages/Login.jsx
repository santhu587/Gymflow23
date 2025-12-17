import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { gsap } from 'gsap'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const formRef = useRef(null)

  useEffect(() => {
    try {
      if (formRef.current) {
        // Set initial visibility
        formRef.current.style.opacity = '1'
        formRef.current.style.visibility = 'visible'
        // Then animate
        gsap.from(formRef.current, {
          opacity: 0,
          y: 30,
          duration: 1.2,
          ease: 'power3.out',
        })
      }
    } catch (error) {
      console.error('Login GSAP error:', error)
      // Ensure visibility even if animation fails
      if (formRef.current) {
        formRef.current.style.opacity = '1'
        formRef.current.style.visibility = 'visible'
      }
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(username, password)
    setLoading(false)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-6" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <div ref={formRef} className="max-w-md w-full" style={{ opacity: 1, visibility: 'visible' }}>
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-[20px] flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">💪</span>
          </div>
          <h1 className="apple-hero mb-4">Sign In</h1>
          <p className="apple-subhead">Welcome back to GymFlow</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="glass-card rounded-[16px] p-4 border-red-200">
              <p className="apple-body text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="username" className="apple-body text-sm text-gray-700 mb-2 block">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="password" className="apple-body text-sm text-gray-700 mb-2 block">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full apple-button apple-button-primary disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center">
            <p className="apple-body text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 transition">
                Register here
              </Link>
            </p>
          </div>
        </form>

        {/* Footer Credit */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
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
      </div>
    </div>
  )
}
