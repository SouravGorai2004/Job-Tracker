import axiosClient from './axiosClient'

export const applicationApi = {
    getAll: () => axiosClient.get('/applications'),
    search: (params) => axiosClient.get('/applications/search', { params }),
    getById: (id) => axiosClient.get(`/applications/${id}`),
    create: (data) => axiosClient.post('/applications', data),
    update: (id, data) => axiosClient.put(`/applications/${id}`, data),
    updateStatus: (id, data) => axiosClient.patch(`/applications/${id}/status`, data),
    delete: (id) => axiosClient.delete(`/applications/${id}`),
    getTimeline: (id) => axiosClient.get(`/applications/${id}/events`),
    addEvent: (applicationId, data) => axiosClient.post(`/applications/${applicationId}/events`, data), // NEW
    updateEvent: (applicationId, eventId, data) => axiosClient.put(`/applications/${applicationId}/events/${eventId}`, data), // NEW
    deleteEvent: (applicationId, eventId) => axiosClient.delete(`/applications/${applicationId}/events/${eventId}`), // NEW
}