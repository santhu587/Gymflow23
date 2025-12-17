import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getMember, createMember, updateMember } from '../services/members'
import { getPlans } from '../services/plans'
import { getTrainers } from '../services/trainers'
import { gsap } from 'gsap'

export default function MemberForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [plans, setPlans] = useState([])
  const [trainers, setTrainers] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    plan_type: 'GENERAL',
    start_date: '',
    end_date: '',
    status: 'ACTIVE',
    assigned_trainer: '',
  })
  const formRef = useRef(null)

  useEffect(() => {
    loadPlans()
    loadTrainers()
    if (id) {
      loadMember()
    }
  }, [id])

  useEffect(() => {
    try {
      if (formRef.current) {
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
      console.error('MemberForm GSAP error:', error)
      // Ensure visibility even if animation fails
      if (formRef.current) {
        formRef.current.style.opacity = '1'
        formRef.current.style.visibility = 'visible'
      }
    }
  }, [])

  const loadPlans = async () => {
    try {
      const data = await getPlans()
      setPlans(data)
    } catch (err) {
      console.error('Failed to load plans:', err)
    }
  }

  const loadTrainers = async () => {
    try {
      const data = await getTrainers()
      setTrainers(data.results || data)
    } catch (err) {
      console.error('Failed to load trainers:', err)
    }
  }

  const loadMember = async () => {
    try {
      const member = await getMember(id)
      setFormData({
        name: member.name,
        phone: member.phone,
        plan_type: member.plan_type,
        start_date: member.start_date,
        end_date: member.end_date,
        status: member.status,
        assigned_trainer: member.assigned_trainer || '',
      })
    } catch (err) {
      setError('Failed to load member')
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (id) {
        await updateMember(id, formData)
      } else {
        await createMember(formData)
      }
      navigate('/dashboard/members')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save member')
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

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0" style={{ color: '#1d1d1f' }}>
      <div className="mb-6 sm:mb-8">
        <h1 className="apple-hero mb-2 text-2xl sm:text-3xl">{id ? 'Edit Member' : 'Add New Member'}</h1>
        <p className="apple-subhead text-sm sm:text-base">Fill in the member details below</p>
      </div>

      {error && (
        <div className="glass-card rounded-[20px] p-4 mb-6 border-red-500/30">
          <p className="apple-body text-red-400">{error}</p>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="glass-card rounded-[30px] p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="apple-body text-sm text-white/60 mb-2 block">Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
              placeholder="Member name"
            />
          </div>

          <div>
            <label className="apple-body text-sm text-white/60 mb-2 block">Phone *</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
              placeholder="Phone number"
            />
          </div>

          <div>
            <label className="apple-body text-sm text-white/60 mb-2 block">Plan Type *</label>
            <select
              name="plan_type"
              required
              value={formData.plan_type}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-[20px] text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition apple-body"
            >
              <option value="GENERAL">General Training</option>
              <option value="PT">Personal Training</option>
            </select>
          </div>

          <div>
            <label className="apple-body text-sm text-white/60 mb-2 block">Status *</label>
            <select
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-[20px] text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition apple-body"
            >
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="FROZEN">Frozen</option>
            </select>
          </div>

          <div>
            <label className="apple-body text-sm text-white/60 mb-2 block">Start Date *</label>
            <input
              type="date"
              name="start_date"
              required
              value={formData.start_date}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-[20px] text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition apple-body"
            />
          </div>

          <div>
            <label className="apple-body text-sm text-white/60 mb-2 block">End Date *</label>
            <input
              type="date"
              name="end_date"
              required
              value={formData.end_date}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-[20px] text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition apple-body"
            />
          </div>

          <div className="md:col-span-2">
            <label className="apple-body text-sm text-white/60 mb-2 block">Assigned Trainer</label>
            <select
              name="assigned_trainer"
              value={formData.assigned_trainer}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-[20px] text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition apple-body"
            >
              <option value="">None</option>
              {trainers.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name} {t.specialization ? `(${t.specialization})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 apple-button apple-button-primary disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Member'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/members')}
            className="apple-button apple-button-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
