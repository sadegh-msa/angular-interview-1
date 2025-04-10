import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  readonly #HEADERS = {
    'Content-type': 'application/json; charset=UTF-8',
  };

  createUrl(...args: string[]) {
    return args.join('/');
  }

  async request<T>(url: string, method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET', body?: any) {
    const response = await fetch(url, {
      method,
      headers: this.#HEADERS,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    return await response.json() as T;
  }
}
