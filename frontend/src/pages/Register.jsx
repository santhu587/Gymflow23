import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { gsap } from 'gsap'

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    phone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const formRef = useRef(null)

  useEffect(() => {
    if (formRef.current) {
      // Ensure visibility first
      formRef.current.style.opacity = '1'
      formRef.current.style.visibility = 'visible'
      try {
        gsap.from(formRef.current, {
          opacity: 0,
          y: 30,
          duration: 1.2,
          ease: 'power3.out',
        })
      } catch (error) {
        console.error('Register GSAP error:', error)
        // Ensure visibility even if animation fails
        if (formRef.current) {
          formRef.current.style.opacity = '1'
          formRef.current.style.visibility = 'visible'
        }
      }
    }
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.password2) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setLoading(true)

    try {
      // Register user
      await api.post('/api/auth/register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.password2,
        phone: formData.phone || undefined,
      })

      // Auto-login after registration (optimized)
      const loginResult = await login(formData.username, formData.password)

      if (loginResult.success) {
        navigate('/dashboard')
      } else {
        setError('Registration successful but login failed. Please try logging in.')
      }
    } catch (err) {
      const errorMessage = err.response?.data
      if (typeof errorMessage === 'object') {
        const errors = Object.entries(errorMessage)
          .map(([key, value]) => {
            if (Array.isArray(value)) {
              return `${key}: ${value.join(', ')}`
            }
            return `${key}: ${value}`
          })
          .join('\n')
        setError(errors)
      } else {
        setError(err.response?.data?.detail || err.response?.data?.message || 'Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-6 py-12" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <div ref={formRef} className="max-w-md w-full" style={{ opacity: 1 }}>
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-[20px] flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">💪</span>
          </div>
          <h1 className="apple-hero mb-4">Create Account</h1>
          <p className="apple-subhead">Start managing your gym today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="glass-card rounded-[16px] p-4 border-red-200">
              <p className="apple-body text-red-600 whitespace-pre-line">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="username" className="apple-body text-sm text-gray-700 mb-2 block">
              Username *
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label htmlFor="email" className="apple-body text-sm text-gray-700 mb-2 block">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="apple-body text-sm text-gray-700 mb-2 block">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
              placeholder="+1234567890"
            />
          </div>

          <div>
            <label htmlFor="password" className="apple-body text-sm text-gray-700 mb-2 block">
              Password *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label htmlFor="password2" className="apple-body text-sm text-gray-700 mb-2 block">
              Confirm Password *
            </label>
            <input
              id="password2"
              name="password2"
              type="password"
              required
              value={formData.password2}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full apple-button apple-button-primary disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <div className="text-center">
            <p className="apple-body text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 transition">
                Sign in
              </Link>
            </p>
          </div>
        </form>

        {/* Footer Credit */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 text-center">
          <p className="apple-body text-xs text-gray-500">
            Design and Developed by <span className="font-medium text-gray-700">Santhosh Chandra</span>
          </p>
        </div>
      </div>
    </div>
  )
}
