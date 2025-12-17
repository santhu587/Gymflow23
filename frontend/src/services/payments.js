import api from './api'

export const getPayments = async (params = {}) => {
  const response = await api.get('/api/payments/', { params })
  return response.data
}

export const createPayment = async (data) => {
  const response = await api.post('/api/payments/', data)
  return response.data
}

export const getMemberPayments = async (memberId) => {
  const response = await api.get(`/api/payments/member_payments/?member_id=${memberId}`)
  return response.data
}

export const getOutstandingDues = async (memberId) => {
  const response = await api.get(`/api/payments/outstanding_dues/?member_id=${memberId}`)
  return response.data
}

