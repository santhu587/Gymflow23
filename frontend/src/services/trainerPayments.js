import api from './api'

export const getTrainerPayments = async (trainerId) => {
  const response = await api.get('/api/members/trainer-payments/', {
    params: { trainer: trainerId },
  })
  return response.data
}

export const createTrainerPayment = async (data) => {
  const response = await api.post('/api/members/trainer-payments/', data)
  return response.data
}
