import axiosClient from './axiosClient'

export const adminApi = {
    getStats: () => axiosClient.get('/admin/stats'),
}