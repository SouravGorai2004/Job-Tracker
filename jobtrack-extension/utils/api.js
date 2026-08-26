class JobTrackAPI {
    constructor() {
        this.baseUrl = 'https://job-tracker-ugux.onrender.com/api';
    }

    async request(endpoint, options = {}) {
        const token = (await chrome.storage.local.get('authToken')).authToken;

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    }

    async createApplication(data) {
        return this.request('/applications', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async checkDuplicate(jobUrl) {
        try {
            const apps = await this.request('/applications');
            return apps.some(app => app.jobUrl === jobUrl);
        } catch {
            return false;
        }
    }
}