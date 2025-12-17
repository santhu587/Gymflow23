import api from './api'

export const getMyGym = async () => {
  const response = await api.get('/api/members/gyms/')
  const data = response.data
  if (Array.isArray(data) && data.length > 0) {
    return data[0]
  }
  return null
}

export const createGym = async (gym) => {
  const response = await api.post('/api/members/gyms/', gym)
  return response.data
}

export const updateGym = async (id, gym) =>
  (await api.put(`/api/members/gyms/${id}/`, gym)).data
