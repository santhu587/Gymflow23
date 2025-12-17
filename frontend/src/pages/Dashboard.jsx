import { useEffect, useState, useRef } from 'react'
import { getDashboardStats } from '../services/dashboard'
import { format } from 'date-fns'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const statsRef = useRef(null)
  const cardsRef = useRef(null)

  useEffect(() => {
    loadStats()
  }, [])

  useEffect(() => {
    try {
      if (stats && statsRef.current) {
        // Ensure visibility first
        Array.from(statsRef.current.children).forEach(child => {
          child.style.opacity = '1'
          child.style.visibility = 'visible'
        })
        gsap.from(statsRef.current.children, {
          opacity: 0,
          y: 30,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
        })
      }
      if (stats && cardsRef.current) {
        // Ensure visibility first
        Array.from(cardsRef.current.children).forEach(child => {
          child.style.opacity = '1'
          child.style.visibility = 'visible'
        })
        gsap.from(cardsRef.current.children, {
          opacity: 0,
          x: -30,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
          },
        })
      }
    } catch (error) {
      console.error('Dashboard GSAP error:', error)
      // Ensure visibility even if animation fails
      if (statsRef.current) {
        Array.from(statsRef.current.children).forEach(child => {
          child.style.opacity = '1'
          child.style.visibility = 'visible'
        })
      }
      if (cardsRef.current) {
        Array.from(cardsRef.current.children).forEach(child => {
          child.style.opacity = '1'
          child.style.visibility = 'visible'
        })
      }
    }
  }, [stats])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await getDashboardStats()
      setStats(data)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card rounded-[24px] p-6 border-red-200">
        <p className="apple-body text-red-600">{error}</p>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-12" style={{ color: '#1d1d1f' }}>
      {/* Hero Section */}
      <section>
        <h1 className="apple-hero mb-4">Welcome Back</h1>
        <p className="apple-subhead">Here's your gym performance overview</p>
      </section>

      {/* Stats Grid - Bento Style */}
      <section ref={statsRef} className="bento-grid">
        <StatCard
          title="Total Members"
          value={stats.total_members}
          icon="👥"
          className="col-span-1 md:col-span-2"
        />
        <StatCard
          title="Active Members"
          value={stats.active_members}
          icon="✅"
        />
        <StatCard
          title="Expired Members"
          value={stats.expired_members}
          icon="⏰"
        />
        <StatCard
          title="Monthly Revenue"
          value={`₹${stats.monthly_revenue.toLocaleString()}`}
          icon="💰"
        />
      </section>

      {/* Revenue & Expiring - Bento Grid */}
      <section ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bento-card p-8">
          <h3 className="apple-headline text-2xl mb-6">Revenue Breakdown</h3>
          <div className="space-y-4">
            <RevenueRow
              label="Personal Training"
              value={stats.pt_revenue}
              color="from-purple-500/20 to-pink-500/20"
            />
            <RevenueRow
              label="General Training"
              value={stats.general_revenue}
              color="from-blue-500/20 to-cyan-500/20"
            />
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-[16px]">
                <span className="apple-body font-semibold">Total Revenue</span>
                <span className="apple-headline text-2xl">
                  ₹{(stats.pt_revenue + stats.general_revenue).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bento-card p-8">
          <h3 className="apple-headline text-2xl mb-6">Expiring Soon</h3>
          {stats.expiring_soon && stats.expiring_soon.length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {stats.expiring_soon.map((member) => (
                <div
                  key={member.id}
                  className="glass-card rounded-[16px] p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="apple-body font-semibold">{member.name}</p>
                      <p className="apple-body text-sm text-gray-500">{member.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="apple-body text-sm text-gray-600">{member.plan_type}</p>
                      <p className="apple-body text-xs text-gray-500">
                        {format(new Date(member.end_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="apple-body text-gray-500 text-center py-8">No members expiring soon</p>
          )}
        </div>
      </section>

      {/* Recent Payments */}
      <section className="bento-card p-8">
        <h3 className="apple-headline text-2xl mb-6">Recent Payments</h3>
        {stats.recent_payments && stats.recent_payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="apple-body text-left py-4 text-gray-600 font-medium">Member</th>
                  <th className="apple-body text-left py-4 text-gray-600 font-medium">Amount</th>
                  <th className="apple-body text-left py-4 text-gray-600 font-medium">Mode</th>
                  <th className="apple-body text-left py-4 text-gray-600 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="apple-body py-4">{payment.member_name}</td>
                    <td className="apple-body py-4 font-semibold">
                      ₹{payment.amount.toLocaleString()}
                    </td>
                    <td className="apple-body py-4">
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">
                        {payment.payment_mode}
                      </span>
                    </td>
                    <td className="apple-body py-4 text-gray-600">
                      {format(new Date(payment.payment_date), 'MMM dd, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="apple-body text-gray-500 text-center py-8">No recent payments</p>
        )}
      </section>
    </div>
  )
}

function StatCard({ title, value, icon, className = '' }) {
  return (
    <div className={`bento-card p-8 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="apple-body text-sm text-gray-600 mb-2 uppercase tracking-wide">{title}</p>
          <p className="apple-headline text-4xl">{value}</p>
        </div>
        <div className="text-5xl opacity-60">{icon}</div>
      </div>
    </div>
  )
}

function RevenueRow({ label, value, color }) {
  return (
    <div className={`flex justify-between items-center p-4 bg-gradient-to-r ${color} rounded-[20px]`}>
      <span className="apple-body">{label}</span>
      <span className="apple-body font-semibold">₹{value.toLocaleString()}</span>
    </div>
  )
}
