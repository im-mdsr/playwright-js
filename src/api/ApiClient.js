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

  get(path, opts) {
    return this.request.get(`${this.baseUrl}${path}`, this.#options(opts));
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
