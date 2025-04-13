import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  readonly #HEADERS = {
    'Content-type': 'application/json; charset=UTF-8',
  };

  createUrl(...args: (string | number | boolean | undefined)[]) {
    return args.filter(v => v !== undefined && String(v).trim() !== '').join('/');
  }

  async request<T>(url: string, method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE', body?: unknown) {
    const response = await fetch(url, {
      method,
      headers: this.#HEADERS,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    return await response.json() as T;
  }

  async get<T>(url: string) {
    return this.request<T>(url, 'GET');
  }

  async post<T>(url: string, body?: unknown) {
    return this.request<T>(url, 'POST', body);
  }

  async put<T>(url: string, body?: unknown) {
    return this.request<T>(url, 'PUT', body);
  }

  async patch<T>(url: string, body?: unknown) {
    return this.request<T>(url, 'PATCH', body);
  }

  async delete<T>(url: string) {
    return this.request<unknown>(url, 'DELETE');
  }
}
