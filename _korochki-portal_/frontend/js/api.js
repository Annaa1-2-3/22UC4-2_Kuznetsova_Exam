const API_BASE = 'http://localhost:3000/api';

class ApiClient {
  static async request(url, options = {}) {
    try {
      const response = await fetch(API_BASE + url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка сети');
      }

      return await response.json();
    } catch (err) {
      console.error('API Error:', err);
      throw err;
    }
  }

  static async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  static async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  static async getCourses() {
    return this.request('/courses');
  }

  static async getMyApplications(userId) {
    return this.request(`/applications?userId=${userId}`);
  }

  static async createApplication(appData) {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify(appData)
    });
  }

  static async updateApplicationStatus(id, status) {
    return this.request(`/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  static async postReview(applicationId, text) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify({ application_id: applicationId, text })
    });
  }

  static async getAllApplications() {
    return this.request('/admin/applications');
  }
}

window.api = ApiClient;