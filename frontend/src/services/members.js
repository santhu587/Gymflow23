import api from './api'

export const getMembers = async (params = {}) => {
  const response = await api.get('/api/members/', { params })
  return response.data
}

export const getMember = async (id) => {
  const response = await api.get(`/api/members/${id}/`)
  return response.data
}

export const createMember = async (data) => {
  const response = await api.post('/api/members/', data)
  return response.data
}

export const updateMember = async (id, data) => {
  const response = await api.put(`/api/members/${id}/`, data)
  return response.data
}

export const deleteMember = async (id) => {
  const response = await api.delete(`/api/members/${id}/`)
  return response.data
}

export const searchMembers = async (query, filters = {}) => {
  const params = { q: query, ...filters }
  const response = await api.get('/api/members/search/', { params })
  return response.data
}

