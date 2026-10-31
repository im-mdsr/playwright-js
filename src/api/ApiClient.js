const { apiUrl } = require('../config/env');

/**
 * Thin wrapper over Playwright's APIRequestContext: one place for base URL, JSON and bearer auth.
 * It returns raw APIResponse objects so tests can assert on status and body themselves.
 */
class ApiClient {
  constructor(request, baseUrl = apiUrl) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  #options({ token, params, data } = {}) {
    const options = {};
    if (token) options.headers = { Authorization: `Bearer ${token}` };
    if (params) options.params = params;
    if (data !== undefined) options.data = data;
    return options;
  }

  /**
   * GET is safe to repeat, so a dropped connection (ECONNRESET, timeout) or a gateway error from
   * the shared demo site is retried instead of failing the scenario. Other methods are not
   * retried: a repeated POST could create the thing twice.
   */
  async get(path, opts) {
    const attempts = 3;
    for (let attempt = 1; ; attempt++) {
      try {
        const response = await this.request.get(`${this.baseUrl}${path}`, this.#options(opts));
        if (![502, 503, 504].includes(response.status()) || attempt === attempts) return response;
      } catch (error) {
        if (attempt === attempts) throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    }
  }

  post(path, opts) {
    return this.request.post(`${this.baseUrl}${path}`, this.#options(opts));
  }

  put(path, opts) {
    return this.request.put(`${this.baseUrl}${path}`, this.#options(opts));
  }

  delete(path, opts) {
    return this.request.delete(`${this.baseUrl}${path}`, this.#options(opts));
  }
}

module.exports = { ApiClient };
