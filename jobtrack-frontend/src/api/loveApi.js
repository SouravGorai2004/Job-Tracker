import axiosClient from './axiosClient'

export const loveApi = {
    send: () => axiosClient.post('/love'),
    getAll: () => axiosClient.get('/love'),
}