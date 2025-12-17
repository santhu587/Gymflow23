import api from './api'

export const getPlans = async () => {
  const response = await api.get('/api/plans/')
  return response.data
}

