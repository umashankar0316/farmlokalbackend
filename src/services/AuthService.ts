import axios from 'axios';
import { redis } from '../config/redis';
import { config } from '../config/env';

const TOKEN_KEY = 'oauth_token';
const EXPIRY_BUFFER = 60; // Refresh 60s before expiry

export class AuthService {
  private static fetchPromise: Promise<string> | null = null;

  static async getAccessToken(): Promise<string> {
    // 1. Try fetching from Redis
    const cachedToken = await redis.get(TOKEN_KEY);
    if (cachedToken) return cachedToken;

    // 2. Handle concurrency: if a fetch is already in progress, wait for it
    if (this.fetchPromise) return this.fetchPromise;

    // 3. Start new fetch
    this.fetchPromise = this.fetchNewToken();
    try {
      const token = await this.fetchPromise;
      return token;
    } finally {
      this.fetchPromise = null;
    }
  }

  private static async fetchNewToken(): Promise<string> {
    try {
      // Mock OAuth2 provider call
      // In a real app, you would use config.oauth.tokenUrl
      console.log('Fetching new OAuth token from provider...');
      
      // Simulating an API call
      const mockResponse = {
        access_token: 'mock-access-token-' + Date.now(),
        expires_in: 3600
      };

      const { access_token, expires_in } = mockResponse;
      
      // Cache with buffer to prevent edge-case expiry
      await redis.set(TOKEN_KEY, access_token, 'EX', expires_in - EXPIRY_BUFFER);
      
      return access_token;
    } catch (error) {
      console.error('OAuth Token Fetch Error', error);
      throw new Error('Failed to authenticate');
    }
  }
}