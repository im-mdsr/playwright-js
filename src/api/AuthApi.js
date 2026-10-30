class AuthApi {
  constructor(client) {
    this.client = client;
  }

  /** Raw login call; returns the APIResponse (200 with access_token, or 401). */
  login(email, password) {
    return this.client.post('/users/login', { data: { email, password } });
  }

  /**
   * Logs in and returns the JWT. Tokens live only 300 seconds, so request one per scenario
   * rather than caching it for the whole run.
   */
  async token(email, password) {
    const response = await this.login(email, password);
    if (!response.ok()) {
      throw new Error(`API login failed for ${email}: HTTP ${response.status()}`);
    }
    return (await response.json()).access_token;
  }
}

module.exports = { AuthApi };
