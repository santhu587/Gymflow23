import { useEffect, useState, useRef } from 'react'
import { getPayments, createPayment, getOutstandingDues } from '../services/payments'
import { getMembers } from '../services/members'
import { format } from 'date-fns'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [outstanding, setOutstanding] = useState(null)
  const [formData, setFormData] = useState({
    member: '',
    amount: '',
    payment_mode: 'Cash',
    payment_date: new Date().toISOString().split('T')[0],
    notes: '',
  })
  const tableRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    try {
      if (payments.length > 0 && tableRef.current) {
        // Ensure visibility first
        Array.from(tableRef.current.children).forEach(child => {
          child.style.opacity = '1'
          child.style.visibility = 'visible'
        })
        gsap.from(tableRef.current.children, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power2.out',
        })
      }
    } catch (error) {
      console.error('Payments GSAP error:', error)
      // Ensure visibility even if animation fails
      if (tableRef.current) {
        Array.from(tableRef.current.children).forEach(child => {
          child.style.opacity = '1'
          child.style.visibility = 'visible'
        })
      }
    }
  }, [payments])

  useEffect(() => {
    try {
      if (showForm && formRef.current) {
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
      console.error('Payments form GSAP error:', error)
      // Ensure visibility even if animation fails
      if (formRef.current) {
        formRef.current.style.opacity = '1'
        formRef.current.style.visibility = 'visible'
      }
    }
  }, [showForm])

  const loadData = async () => {
    try {
      setLoading(true)
      const [paymentsData, membersData] = await Promise.all([getPayments(), getMembers()])
      setPayments(paymentsData.results || paymentsData)
      setMembers(membersData.results || membersData)
    } catch (err) {
      setError('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleMemberSelect = async (memberId) => {
    if (!memberId) {
      setSelectedMember(null)
      setOutstanding(null)
      return
    }

    try {
      const member = members.find((m) => m.id === parseInt(memberId))
      setSelectedMember(member)
      const dues = await getOutstandingDues(memberId)
      setOutstanding(dues)
      setFormData({ ...formData, member: memberId, amount: dues.outstanding_dues || '' })
    } catch (err) {
      console.error('Failed to load outstanding dues:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await createPayment({
        ...formData,
        member: parseInt(formData.member),
        amount: parseFloat(formData.amount),
      })
      setShowForm(false)
      setFormData({
        member: '',
        amount: '',
        payment_mode: 'Cash',
        payment_date: new Date().toISOString().split('T')[0],
        notes: '',
      })
      setSelectedMember(null)
      setOutstanding(null)
      loadData()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create payment')
    }
  }

  const handleChange = (e) => {
    if (e.target.name === 'member') {
      handleMemberSelect(e.target.value)
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      })
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8" style={{ color: '#1d1d1f' }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="apple-hero mb-2 text-2xl sm:text-3xl">Payments</h1>
          <p className="apple-subhead text-sm sm:text-base">Record and track member payments</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="apple-button apple-button-primary"
        >
          {showForm ? 'Cancel' : 'Record Payment'}
        </button>
      </div>

      {error && (
        <div className="glass-card rounded-[20px] p-4 border-red-500/30">
          <p className="apple-body text-red-400">{error}</p>
        </div>
      )}

      {showForm && (
        <div ref={formRef} className="bento-card p-8">
          <h2 className="apple-headline text-2xl mb-6">Record New Payment</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="apple-body text-sm text-white/60 mb-2 block">Member *</label>
              <select
                name="member"
                required
                value={formData.member}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-[20px] text-white focus:outline-none focus:border-white/30 focus:bg-gray-100 transition apple-body"
              >
                <option value="">Select a member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.phone})
                  </option>
                ))}
              </select>
            </div>

            {outstanding && (
              <div className="glass-card rounded-[20px] p-5 bg-blue-500/10 border-blue-500/30">
                <div className="space-y-2">
                  <p className="apple-body text-gray-700">
                    <span className="font-semibold">Plan Price:</span> ₹
                    {outstanding.plan_price.toLocaleString()}
                  </p>
                  <p className="apple-body text-gray-700">
                    <span className="font-semibold">Total Paid:</span> ₹
                    {outstanding.total_payments.toLocaleString()}
                  </p>
                  <p className="apple-body font-semibold text-blue-400">
                    <span>Outstanding:</span> ₹{outstanding.outstanding_dues.toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="apple-body text-sm text-white/60 mb-2 block">Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  required
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
                />
              </div>

              <div>
                <label className="apple-body text-sm text-white/60 mb-2 block">Payment Mode *</label>
                <select
                  name="payment_mode"
                  required
                  value={formData.payment_mode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-[20px] text-white focus:outline-none focus:border-white/30 focus:bg-gray-100 transition apple-body"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Online">Online</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="apple-body text-sm text-white/60 mb-2 block">Payment Date *</label>
                <input
                  type="date"
                  name="payment_date"
                  required
                  value={formData.payment_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-[20px] text-white focus:outline-none focus:border-white/30 focus:bg-gray-100 transition apple-body"
                />
              </div>

              <div>
                <label className="apple-body text-sm text-white/60 mb-2 block">Notes</label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
                  placeholder="Optional notes"
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button type="submit" className="flex-1 apple-button apple-button-primary">
                Record Payment
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setFormData({
                    member: '',
                    amount: '',
                    payment_mode: 'Cash',
                    payment_date: new Date().toISOString().split('T')[0],
                    notes: '',
                  })
                  setSelectedMember(null)
                  setOutstanding(null)
                }}
                className="apple-button apple-button-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bento-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="apple-body text-left py-3 sm:py-4 px-4 sm:px-6 text-gray-600 font-medium text-sm">Member</th>
                    <th className="apple-body text-left py-3 sm:py-4 px-4 sm:px-6 text-gray-600 font-medium text-sm">Amount</th>
                    <th className="apple-body text-left py-3 sm:py-4 px-4 sm:px-6 text-gray-600 font-medium text-sm">Mode</th>
                    <th className="apple-body text-left py-3 sm:py-4 px-4 sm:px-6 text-gray-600 font-medium text-sm">Date</th>
                  </tr>
                </thead>
                <tbody ref={tableRef}>
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-4 sm:px-6 py-8 sm:py-12 text-center">
                        <p className="apple-body text-gray-500">No payments found</p>
                      </td>
                    </tr>
                  ) : (
                  payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <p className="apple-body font-semibold text-sm">
                          {payment.member_name || payment.member_details?.name}
                        </p>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <p className="apple-body font-semibold text-sm">₹{payment.amount.toLocaleString()}</p>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {payment.payment_mode}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <p className="apple-body text-gray-600 text-sm">
                          {format(new Date(payment.payment_date), 'MMM dd, yyyy')}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {payments.length === 0 ? (
              <div className="glass-card rounded-[20px] p-8 text-center">
                <p className="apple-body text-gray-500">No payments found</p>
              </div>
            ) : (
              payments.map((payment) => (
                <div
                  key={payment.id}
                  className="glass-card rounded-[20px] p-4 sm:p-6 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="apple-body font-semibold text-base mb-1">
                        {payment.member_name || payment.member_details?.name}
                      </h3>
                      <p className="apple-body text-sm text-gray-600">
                        {format(new Date(payment.payment_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="apple-body font-semibold text-lg text-gray-900">
                        ₹{payment.amount.toLocaleString()}
                      </p>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 mt-1 inline-block">
                        {payment.payment_mode}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
