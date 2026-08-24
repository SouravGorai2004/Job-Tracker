import axiosClient from './axiosClient'

export const eventApi = {
    getRecent: (limit = 10) => axiosClient.get('/events/recent', { params: { limit } }),
}