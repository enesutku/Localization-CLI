// providers/perplexity.js
const BaseProvider = require('./base');

class PerplexityProvider extends BaseProvider {
  constructor(config) {
    super(config);
    this.apiKey = config.apiKeys.perplexity;
    this.endpoint = config.endpoints.perplexity;
  }

  async translate(items, targetLanguage, sourceLanguage = 'English') {
    const prompt = this.buildPrompt(items, targetLanguage, sourceLanguage, this.config.appContext);
    const rawResponse = await this.makeRequest(prompt);
    return this.parseResponse(rawResponse, items.length);
  }

  async makeRequest(prompt) {
    const axios = require('axios');
    
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
    if (new URL(this.endpoint.baseURL).hostname === 'api.perplexity.ai') {
      headers['X-Pplx-Integration'] = 'localization-cli';
    }

    const response = await axios.post(
      `${this.endpoint.baseURL}/chat/completions`,
      {
        model: this.endpoint.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 4000
      },
      { headers }
    );

    return response.data.choices[0].message.content;
  }
}

module.exports = PerplexityProvider;