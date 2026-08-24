import axiosClient from './axiosClient'

export const feedbackApi = {
    create: (data) => axiosClient.post('/feedback', data),
    getAll: () => axiosClient.get('/feedback'),
}