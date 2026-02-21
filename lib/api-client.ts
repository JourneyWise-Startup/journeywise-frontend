// API client configuration for frontend
const API_BASE_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api');

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
  timestamp?: string;
  path?: string;
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

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(isFormData = false): HeadersInit {
    const headers: HeadersInit = {
      Authorization: '',
    };

    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // Don't set Content-Type for FormData (browser will set it automatically)
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data: any = {};
    
    try {
      data = await response.json();
    } catch (e) {
      // Response might not be JSON
      data = {};
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `HTTP ${response.status}: An error occurred`;
      const error = new ApiError(errorMessage, response.status);
      throw error;
    }

    return {
      data: data?.data || data,
      statusCode: response.status,
    };
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include',
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch data';
      const statusCode = error instanceof ApiError ? error.statusCode : undefined;
      return {
        error: message,
        statusCode,
      };
    }
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    try {
      const isFormData = body instanceof FormData;
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(isFormData),
        body: isFormData ? body : JSON.stringify(body || {}),
        credentials: 'include',
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to post data';
      const statusCode = error instanceof ApiError ? error.statusCode : undefined;
      return {
        error: message,
        statusCode,
      };
    }
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(body || {}),
        credentials: 'include',
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update data';
      const statusCode = error instanceof ApiError ? error.statusCode : undefined;
      return {
        error: message,
        statusCode,
      };
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        credentials: 'include',
      });

      return this.handleResponse<T>(response);
    } catch (error) {
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
