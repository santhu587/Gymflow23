import { useEffect, useState, useRef } from 'react'
import { getTrainers, createTrainer, updateTrainer, deleteTrainer } from '../services/trainers'
import { getTrainerPayments, createTrainerPayment } from '../services/trainerPayments'
import { format } from 'date-fns'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Trainers() {
  const [trainers, setTrainers] = useState([])
  const [selectedTrainer, setSelectedTrainer] = useState(null)
  const [trainerPayments, setTrainerPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialization: '',
    salary_type: 'COMMISSION',
    base_salary: 0,
    commission_percent: 0,
    is_active: true,
  })
  const [paymentForm, setPaymentForm] = useState({
    trainer: '',
    amount: '',
    payment_mode: 'Cash',
    payment_date: new Date().toISOString().split('T')[0],
    notes: '',
  })
  const [savingTrainer, setSavingTrainer] = useState(false)
  const [savingPayment, setSavingPayment] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    loadTrainers()
  }, [])

  useEffect(() => {
    try {
      if (trainers.length > 0 && listRef.current) {
        // Ensure visibility first
        Array.from(listRef.current.children).forEach(child => {
          child.style.opacity = '1'
          child.style.visibility = 'visible'
        })
        gsap.from(listRef.current.children, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power2.out',
        })
      }
    } catch (error) {
      console.error('Trainers GSAP error:', error)
      // Ensure visibility even if animation fails
      if (listRef.current) {
        Array.from(listRef.current.children).forEach(child => {
          child.style.opacity = '1'
          child.style.visibility = 'visible'
        })
      }
    }
  }, [trainers])

  const loadTrainers = async () => {
    try {
      setLoading(true)
      const data = await getTrainers()
      setTrainers(data.results || data)
    } catch (err) {
      setError('Failed to load trainers')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadPayments = async (trainerId) => {
    try {
      const data = await getTrainerPayments(trainerId)
      setTrainerPayments(data.results || data)
    } catch (err) {
      console.error('Failed to load trainer payments:', err)
    }
  }

  const handleSelectTrainer = (trainer) => {
    setSelectedTrainer(trainer)
    setFormData({
      name: trainer.name,
      phone: trainer.phone || '',
      specialization: trainer.specialization || '',
      salary_type: trainer.salary_type,
      base_salary: trainer.base_salary,
      commission_percent: trainer.commission_percent,
      is_active: trainer.is_active,
    })
    setPaymentForm((prev) => ({
      ...prev,
      trainer: trainer.id,
    }))
    loadPayments(trainer.id)
  }

  const resetTrainerForm = () => {
    setSelectedTrainer(null)
    setFormData({
      name: '',
      phone: '',
      specialization: '',
      salary_type: 'COMMISSION',
      base_salary: 0,
      commission_percent: 0,
      is_active: true,
    })
  }

  const handleTrainerChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value,
    })
  }

  const handlePaymentChange = (e) => {
    setPaymentForm({
      ...paymentForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleTrainerSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSavingTrainer(true)

    try {
      if (selectedTrainer) {
        await updateTrainer(selectedTrainer.id, formData)
      } else {
        await createTrainer(formData)
      }
      resetTrainerForm()
      loadTrainers()
    } catch (err) {
      const data = err.response?.data
      if (data && typeof data === 'object') {
        const msg = Object.entries(data)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join('\n')
        setError(msg)
      } else {
        setError('Failed to save trainer')
      }
    } finally {
      setSavingTrainer(false)
    }
  }

  const handleDeleteTrainer = async (trainerId) => {
    if (!window.confirm('Delete this trainer? This will also delete their payment history.')) return
    try {
      await deleteTrainer(trainerId)
      if (selectedTrainer && selectedTrainer.id === trainerId) {
        setSelectedTrainer(null)
        setTrainerPayments([])
      }
      loadTrainers()
    } catch (err) {
      setError('Failed to delete trainer')
      console.error(err)
    }
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!selectedTrainer) {
      setError('Select a trainer first')
      return
    }

    setSavingPayment(true)
    try {
      await createTrainerPayment({
        ...paymentForm,
        trainer: selectedTrainer.id,
        amount: parseFloat(paymentForm.amount),
      })
      setPaymentForm({
        trainer: selectedTrainer.id,
        amount: '',
        payment_mode: 'Cash',
        payment_date: new Date().toISOString().split('T')[0],
        notes: '',
      })
      loadPayments(selectedTrainer.id)
    } catch (err) {
      const data = err.response?.data
      if (data && typeof data === 'object') {
        const msg = Object.entries(data)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join('\n')
        setError(msg)
      } else {
        setError('Failed to record payment')
      }
    } finally {
      setSavingPayment(false)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8" style={{ color: '#1d1d1f' }}>
      <div>
        <h1 className="apple-hero mb-2 text-2xl sm:text-3xl">Trainers</h1>
        <p className="apple-subhead text-sm sm:text-base">Manage trainers and their payments</p>
      </div>

      {error && (
        <div className="glass-card rounded-[20px] p-4 border-red-500/30">
          <p className="apple-body text-red-400 whitespace-pre-line">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trainers List & Form */}
        <div className="space-y-6">
          <div className="bento-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="apple-headline text-xl sm:text-2xl">Trainers</h2>
              <button
                onClick={resetTrainerForm}
                className="apple-button apple-button-secondary text-sm"
              >
                New Trainer
              </button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
            ) : trainers.length === 0 ? (
              <p className="apple-body text-white/40 text-center py-8">No trainers found</p>
            ) : (
              <div ref={listRef} className="space-y-3">
                {trainers.map((trainer) => (
                  <div
                    key={trainer.id}
                    onClick={() => handleSelectTrainer(trainer)}
                    className={`glass-card rounded-[20px] p-4 cursor-pointer hover:bg-gray-100 transition ${
                      selectedTrainer?.id === trainer.id ? 'bg-gray-100 border-white/30' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="apple-body font-semibold">{trainer.name}</p>
                        <p className="apple-body text-sm text-gray-600">
                          {trainer.phone || 'No phone'} • {trainer.specialization || 'No specialization'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            trainer.is_active
                              ? 'bg-gray-100 text-green-400 border-green-400/30'
                              : 'bg-gray-100 text-red-400 border-red-400/30'
                          }`}
                        >
                          {trainer.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteTrainer(trainer.id)
                          }}
                          className="apple-body text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trainer Form */}
          <div className="bento-card p-6">
            <h2 className="apple-headline text-2xl mb-6">
              {selectedTrainer ? 'Edit Trainer' : 'Add Trainer'}
            </h2>
            <form onSubmit={handleTrainerSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="apple-body text-sm text-gray-600 mb-2 block">Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleTrainerChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
                  />
                </div>
                <div>
                  <label className="apple-body text-sm text-gray-600 mb-2 block">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleTrainerChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
                  />
                </div>
                <div>
                  <label className="apple-body text-sm text-gray-600 mb-2 block">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleTrainerChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
                  />
                </div>
                <div>
                  <label className="apple-body text-sm text-gray-600 mb-2 block">Salary Type</label>
                  <select
                    name="salary_type"
                    value={formData.salary_type}
                    onChange={handleTrainerChange}
                    className="w-full px-4 py-3 bg-white/5 border border-gray-200 rounded-[20px] text-white focus:outline-none focus:border-white/30 focus:bg-gray-100 transition apple-body"
                  >
                    <option value="FIXED">Fixed</option>
                    <option value="COMMISSION">Commission</option>
                    <option value="MIXED">Mixed</option>
                  </select>
                </div>
                <div>
                  <label className="apple-body text-sm text-gray-600 mb-2 block">Base Salary</label>
                  <input
                    type="number"
                    step="0.01"
                    name="base_salary"
                    value={formData.base_salary}
                    onChange={handleTrainerChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
                  />
                </div>
                <div>
                  <label className="apple-body text-sm text-gray-600 mb-2 block">Commission %</label>
                  <input
                    type="number"
                    step="0.01"
                    name="commission_percent"
                    value={formData.commission_percent}
                    onChange={handleTrainerChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleTrainerChange}
                      className="mr-3 w-5 h-5 rounded bg-white/5 border-gray-200 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="apple-body text-sm">Active</span>
                  </label>
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={savingTrainer}
                  className="flex-1 apple-button apple-button-primary disabled:opacity-50"
                >
                  {savingTrainer ? 'Saving...' : selectedTrainer ? 'Update Trainer' : 'Add Trainer'}
                </button>
                <button
                  type="button"
                  onClick={resetTrainerForm}
                  className="apple-button apple-button-secondary"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Payment Section */}
        <div className="space-y-6">
          <div className="bento-card p-6">
            <h2 className="apple-headline text-2xl mb-6">Record Payment</h2>
            {selectedTrainer ? (
              <>
                <p className="apple-body text-gray-600 mb-6">
                  Trainer: <span className="font-semibold text-white">{selectedTrainer.name}</span>
                </p>
                <form onSubmit={handlePaymentSubmit} className="space-y-5">
                  <div>
                    <label className="apple-body text-sm text-gray-600 mb-2 block">Amount *</label>
                    <input
                      type="number"
                      step="0.01"
                      name="amount"
                      required
                      value={paymentForm.amount}
                      onChange={handlePaymentChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
                    />
                  </div>
                  <div>
                    <label className="apple-body text-sm text-gray-600 mb-2 block">Payment Mode *</label>
                    <select
                      name="payment_mode"
                      value={paymentForm.payment_mode}
                      onChange={handlePaymentChange}
                      className="w-full px-4 py-3 bg-white/5 border border-gray-200 rounded-[20px] text-white focus:outline-none focus:border-white/30 focus:bg-gray-100 transition apple-body"
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>
                  <div>
                    <label className="apple-body text-sm text-gray-600 mb-2 block">Payment Date *</label>
                    <input
                      type="date"
                      name="payment_date"
                      required
                      value={paymentForm.payment_date}
                      onChange={handlePaymentChange}
                      className="w-full px-4 py-3 bg-white/5 border border-gray-200 rounded-[20px] text-white focus:outline-none focus:border-white/30 focus:bg-gray-100 transition apple-body"
                    />
                  </div>
                  <div>
                    <label className="apple-body text-sm text-gray-600 mb-2 block">Notes</label>
                    <textarea
                      name="notes"
                      rows="3"
                      value={paymentForm.notes}
                      onChange={handlePaymentChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={savingPayment}
                    className="w-full apple-button apple-button-primary disabled:opacity-50"
                  >
                    {savingPayment ? 'Saving...' : 'Record Payment'}
                  </button>
                </form>
              </>
            ) : (
              <p className="apple-body text-white/40 text-center py-8">
                Select a trainer from the list to record payments.
              </p>
            )}
          </div>

          <div className="bento-card p-6">
            <h2 className="apple-headline text-2xl mb-6">Recent Payments</h2>
            {selectedTrainer ? (
              trainerPayments.length === 0 ? (
                <p className="apple-body text-white/40 text-center py-8">No payments found for this trainer.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="apple-body text-left py-3 text-gray-600 font-medium">Amount</th>
                        <th className="apple-body text-left py-3 text-gray-600 font-medium">Mode</th>
                        <th className="apple-body text-left py-3 text-gray-600 font-medium">Date</th>
                        <th className="apple-body text-left py-3 text-gray-600 font-medium">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trainerPayments.map((p) => (
                        <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="py-3 apple-body font-semibold">₹{p.amount.toLocaleString()}</td>
                          <td className="py-3 apple-body text-gray-600">{p.payment_mode}</td>
                          <td className="py-3 apple-body text-gray-600">
                            {format(new Date(p.payment_date), 'MMM dd, yyyy')}
                          </td>
                          <td className="py-3 apple-body text-gray-600">{p.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <p className="apple-body text-white/40 text-center py-8">
                Select a trainer to view their payment history.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
