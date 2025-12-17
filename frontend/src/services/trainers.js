import api from './api'

export const getTrainers = async () => {
  const response = await api.get('/api/members/trainers/')
  return response.data
}

export const createTrainer = async (data) => {
  const response = await api.post('/api/members/trainers/', data)
  return response.data
}

export const updateTrainer = async (id, data) => {
  const response = await api.put(`/api/members/trainers/${id}/`, data)
  return response.data
}

export const deleteTrainer = async (id) => {
  const response = await api.delete(`/api/members/trainers/${id}/`)
  return response.data
}
