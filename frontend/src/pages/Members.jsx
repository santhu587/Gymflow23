import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getMembers, deleteMember } from '../services/members'
import { format } from 'date-fns'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Members() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [nextPage, setNextPage] = useState(null)
  const [prevPage, setPrevPage] = useState(null)
  const tableRef = useRef(null)

  useEffect(() => {
    loadMembers()
  }, [searchQuery, planFilter, statusFilter])

  useEffect(() => {
    try {
      if (members.length > 0 && tableRef.current) {
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
      console.error('Members GSAP error:', error)
      // Ensure visibility even if animation fails
      if (tableRef.current) {
        Array.from(tableRef.current.children).forEach(child => {
          child.style.opacity = '1'
          child.style.visibility = 'visible'
        })
      }
    }
  }, [members])

  const loadMembers = async (url = null) => {
    try {
      setLoading(true)
      const params = {}
      if (searchQuery) params.search = searchQuery
      if (planFilter) params.plan_type = planFilter
      if (statusFilter) params.status = statusFilter

      const data = url
        ? await fetch(url, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }).then((r) => r.json())
        : await getMembers(params)

      setMembers(data.results || data)
      setNextPage(data.next)
      setPrevPage(data.previous)
    } catch (err) {
      setError('Failed to load members')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return

    try {
      await deleteMember(id)
      loadMembers()
    } catch (err) {
      setError('Failed to delete member')
      console.error(err)
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      ACTIVE: 'bg-gray-100 text-green-400 border-green-400/30',
      EXPIRED: 'bg-gray-100 text-red-400 border-red-400/30',
      FROZEN: 'bg-gray-100 text-amber-400 border-amber-400/30',
    }
    return styles[status] || 'bg-gray-100 text-gray-600 border-gray-200'
  }

  return (
    <div className="space-y-8" style={{ color: '#1d1d1f' }}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="apple-hero mb-2">Members</h1>
          <p className="apple-subhead">Manage your gym members</p>
        </div>
        <Link
          to="/dashboard/members/new"
          className="apple-button apple-button-primary"
        >
          Add Member
        </Link>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-[30px] p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition apple-body"
          />
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-gray-200 rounded-[20px] text-white focus:outline-none focus:border-white/30 focus:bg-gray-100 transition apple-body"
          >
            <option value="">All Plans</option>
            <option value="GENERAL">General</option>
            <option value="PT">Personal Training</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-gray-200 rounded-[20px] text-white focus:outline-none focus:border-white/30 focus:bg-gray-100 transition apple-body"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIRED">Expired</option>
            <option value="FROZEN">Frozen</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="glass-card rounded-[20px] p-4 border-red-500/30">
          <p className="apple-body text-red-400">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="bento-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="apple-body text-left py-4 px-6 text-gray-600 font-medium">Name</th>
                    <th className="apple-body text-left py-4 px-6 text-gray-600 font-medium">Phone</th>
                    <th className="apple-body text-left py-4 px-6 text-gray-600 font-medium">Plan</th>
                    <th className="apple-body text-left py-4 px-6 text-gray-600 font-medium">Status</th>
                    <th className="apple-body text-left py-4 px-6 text-gray-600 font-medium">End Date</th>
                    <th className="apple-body text-left py-4 px-6 text-gray-600 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody ref={tableRef}>
                  {members.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <p className="apple-body text-white/40">No members found</p>
                      </td>
                    </tr>
                  ) : (
                    members.map((member) => (
                      <tr
                        key={member.id}
                        className="border-b border-white/5 hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4">
                          <p className="apple-body font-semibold">{member.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="apple-body text-gray-600">{member.phone}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="apple-body text-gray-600">{member.plan_type}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                              member.status
                            )}`}
                          >
                            {member.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="apple-body text-gray-600">
                            {format(new Date(member.end_date), 'MMM dd, yyyy')}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <Link
                              to={`/dashboard/members/${member.id}/edit`}
                              className="apple-body text-white/80 hover:text-white transition"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(member.id)}
                              className="apple-body text-red-400 hover:text-red-300 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {(nextPage || prevPage) && (
            <div className="flex justify-between items-center">
              <button
                onClick={() => loadMembers(prevPage)}
                disabled={!prevPage}
                className="apple-button apple-button-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => loadMembers(nextPage)}
                disabled={!nextPage}
                className="apple-button apple-button-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
