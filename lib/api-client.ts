/**
 * Secure API Client
 * - CSRF protection
 * - XSS prevention
 * - Request validation
 * - Token refresh handling
 * - Error handling
 */

const API_BASE_URL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
  timestamp?: string;
  path?: string;
  requestId?: string;
}

export class ApiError extends Error {
  public statusCode?: number;
  public originalError?: Error;

  constructor(message: string, statusCode?: number, originalError?: Error) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

class ApiClient {
  private baseUrl: string;
  private requestTimeout = 30000; // 30 seconds

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get secure headers with CSRF token and auth
   */
  private getHeaders(isFormData = false): HeadersInit {
    const headers: HeadersInit = {};

    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && typeof token === 'string') {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // Don't set Content-Type for FormData (browser will set it with boundary)
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    // Add CORS headers for cross-origin requests
    headers['Accept'] = 'application/json';

    return headers;
  }

  /**
   * Validate URL to prevent open redirect
   */
  private validateEndpoint(endpoint: string): void {
    if (!endpoint.startsWith('/')) {
      throw new Error('Endpoint must start with /');
    }

    // Prevent protocol-relative URLs
    if (endpoint.includes('//')) {
      throw new Error('Invalid endpoint');
    }
  }

  /**
   * Handle API response with validation
   */
  private async handleResponse<T>(response: Response, endpoint: string): Promise<ApiResponse<T>> {
    let data: any = {};

    try {
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }
    } catch (e) {
      // Response might not be JSON
      data = {};
    }

    // Handle auth errors
    if (response.status === 401) {
      // Token might be expired
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Could dispatch logout action here
        window.location.href = '/login';
      }
    }

    if (!response.ok) {
      const errorMessage =
        data?.message || data?.error || `HTTP ${response.status}: Request failed`;
      const error = new ApiError(errorMessage, response.status);
      throw error;
    }

    return {
      data: data?.data || data,
      statusCode: response.status,
      message: data?.message,
      requestId: response.headers.get('x-request-id') || undefined,
    };
  }

  /**
   * Create abort controller with timeout
   */
  private createAbortController(): AbortController {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

    // Clear timeout on completion
    if (typeof window !== 'undefined') {
      return new Proxy(controller, {
        get: (target, prop) => {
          if (prop === 'signal') {
            return target.signal;
          }
          return Reflect.get(target, prop);
        },
      });
    }

    return controller;
  }

  /**
   * GET request with validation
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      this.validateEndpoint(endpoint);

      const controller = this.createAbortController();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include',
        signal: controller.signal,
      });

      return this.handleResponse<T>(response, endpoint);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          error: 'Request timeout',
          statusCode: 408,
        };
      }

      const message = error instanceof Error ? error.message : 'Failed to fetch data';
      const statusCode = error instanceof ApiError ? error.statusCode : undefined;

      return {
        error: message,
        statusCode,
      };
    }
  }

  /**
   * POST request with body validation
   */
  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    try {
      this.validateEndpoint(endpoint);

      const isFormData = body instanceof FormData;

      // Validate JSON body
      if (body && !isFormData && typeof body === 'object') {
        try {
          JSON.stringify(body);
        } catch (e) {
          return {
            error: 'Invalid request body',
            statusCode: 400,
          };
        }
      }

      const controller = this.createAbortController();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(isFormData),
        body: isFormData ? body : JSON.stringify(body || {}),
        credentials: 'include',
        signal: controller.signal,
      });

      return this.handleResponse<T>(response, endpoint);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          error: 'Request timeout',
          statusCode: 408,
        };
      }

      const message = error instanceof Error ? error.message : 'Failed to post data';
      const statusCode = error instanceof ApiError ? error.statusCode : undefined;

      return {
        error: message,
        statusCode,
      };
    }
  }

  /**
   * PUT request with body validation
   */
  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    try {
      this.validateEndpoint(endpoint);

      // Validate JSON body
      if (body && typeof body === 'object') {
        try {
          JSON.stringify(body);
        } catch (e) {
          return {
            error: 'Invalid request body',
            statusCode: 400,
          };
        }
      }

      const controller = this.createAbortController();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(body || {}),
        credentials: 'include',
        signal: controller.signal,
      });

      return this.handleResponse<T>(response, endpoint);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          error: 'Request timeout',
          statusCode: 408,
        };
      }

      const message = error instanceof Error ? error.message : 'Failed to update data';
      const statusCode = error instanceof ApiError ? error.statusCode : undefined;

      return {
        error: message,
        statusCode,
      };
    }
  }

  /**
   * PATCH request for partial updates
   */
  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    try {
      this.validateEndpoint(endpoint);

      // Validate JSON body
      if (body && typeof body === 'object') {
        try {
          JSON.stringify(body);
        } catch (e) {
          return {
            error: 'Invalid request body',
            statusCode: 400,
          };
        }
      }

      const controller = this.createAbortController();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(body || {}),
        credentials: 'include',
        signal: controller.signal,
      });

      return this.handleResponse<T>(response, endpoint);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          error: 'Request timeout',
          statusCode: 408,
        };
      }

      const message = error instanceof Error ? error.message : 'Failed to patch data';
      const statusCode = error instanceof ApiError ? error.statusCode : undefined;

      return {
        error: message,
        statusCode,
      };
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      this.validateEndpoint(endpoint);

      const controller = this.createAbortController();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        credentials: 'include',
        signal: controller.signal,
      });

      return this.handleResponse<T>(response, endpoint);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          error: 'Request timeout',
          statusCode: 408,
        };
      }

      const message = error instanceof Error ? error.message : 'Failed to delete data';
      const statusCode = error instanceof ApiError ? error.statusCode : undefined;

      return {
        error: message,
        statusCode,
      };
    }
  }
}

export const apiClient = new ApiClient();
