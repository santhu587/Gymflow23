import { useEffect, useState, useRef } from 'react'
import { getMyGym, createGym, updateGym } from '../services/gyms'
import { gsap } from 'gsap'

export default function GymProfile() {
  const [gym, setGym] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: 'India',
    postal_code: '',
    description: '',
    opening_hours: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const formRef = useRef(null)

  useEffect(() => {
    loadGym()
  }, [])

  useEffect(() => {
    try {
      if (formRef.current && !loading) {
        // Ensure visibility first
        formRef.current.style.opacity = '1'
        formRef.current.style.visibility = 'visible'
        gsap.from(formRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: 'power3.out',
        })
      }
    } catch (error) {
      console.error('GymProfile GSAP error:', error)
      // Ensure visibility even if animation fails
      if (formRef.current) {
        formRef.current.style.opacity = '1'
        formRef.current.style.visibility = 'visible'
      }
    }
  }, [loading])

  const loadGym = async () => {
    try {
      setLoading(true)
      const data = await getMyGym()
      if (data) {
        setGym(data)
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          address_line1: data.address_line1 || '',
          address_line2: data.address_line2 || '',
          city: data.city || '',
          state: data.state || '',
          country: data.country || 'India',
          postal_code: data.postal_code || '',
          description: data.description || '',
          opening_hours: data.opening_hours || '',
        })
      }
    } catch (err) {
      console.error('Failed to load gym profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      let result
      if (gym && gym.id) {
        result = await updateGym(gym.id, formData)
      } else {
        result = await createGym(formData)
      }
      setGym(result)
      setSuccess('Gym profile saved successfully.')
    } catch (err) {
      const data = err.response?.data
      if (data && typeof data === 'object') {
        const msg = Object.entries(data)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join('\n')
        setError(msg)
      } else {
        setError('Failed to save gym profile')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-0" style={{ color: '#1d1d1f' }}>
      <div>
        <h1 className="apple-hero mb-2 text-2xl sm:text-3xl">Gym Profile</h1>
        <p className="apple-subhead text-sm sm:text-base">
          Set up your gym name and location details. This helps keep your records organized.
        </p>
      </div>

      {error && (
        <div className="glass-card rounded-[20px] p-4 border-red-500/30">
          <p className="apple-body text-red-400 whitespace-pre-line">{error}</p>
        </div>
      )}
      {success && (
        <div className="glass-card rounded-[20px] p-4 border-green-500/30">
          <p className="apple-body text-green-400">{success}</p>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="glass-card rounded-[30px] p-8 space-y-6">
        <div>
          <label className="apple-body text-sm text-white/60 mb-2 block">Gym Name *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
            placeholder="Your gym name"
          />
        </div>

        <div>
          <label className="apple-body text-sm text-white/60 mb-2 block">Gym Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
            placeholder="Phone number"
          />
        </div>

        <div>
          <label className="apple-body text-sm text-white/60 mb-2 block">Address Line 1</label>
          <input
            type="text"
            name="address_line1"
            value={formData.address_line1}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
            placeholder="Street address"
          />
        </div>

        <div>
          <label className="apple-body text-sm text-white/60 mb-2 block">Address Line 2</label>
          <input
            type="text"
            name="address_line2"
            value={formData.address_line2}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
            placeholder="Apartment, suite, etc."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="apple-body text-sm text-white/60 mb-2 block">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
              placeholder="City"
            />
          </div>
          <div>
            <label className="apple-body text-sm text-white/60 mb-2 block">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
              placeholder="State"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="apple-body text-sm text-white/60 mb-2 block">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
              placeholder="Country"
            />
          </div>
          <div>
            <label className="apple-body text-sm text-white/60 mb-2 block">Postal Code</label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
              placeholder="Postal code"
            />
          </div>
        </div>

        <div>
          <label className="apple-body text-sm text-white/60 mb-2 block">Opening Hours</label>
          <input
            type="text"
            name="opening_hours"
            placeholder="e.g. Mon–Sat 6am–10pm"
            value={formData.opening_hours}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
          />
        </div>

        <div>
          <label className="apple-body text-sm text-white/60 mb-2 block">Description</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body resize-none"
            placeholder="Describe your gym..."
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full apple-button apple-button-primary disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Gym Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}
