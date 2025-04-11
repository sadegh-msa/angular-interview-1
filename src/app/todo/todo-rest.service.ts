import { inject, Injectable } from '@angular/core';
import type { ListParams } from '../common/models/rest';
import { RestService } from '../common/services/rest.service';
import type { Todo } from './todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoRestService {
  readonly #restService = inject(RestService);

  readonly #URL = 'https://jsonplaceholder.typicode.com/todos';

  #createUrl(path = '') {
    return this.#restService.createUrl(this.#URL, path);
  }

  async get(id: number) {
    if (!id) {
      return;
    }

    const url = this.#createUrl(`/${id}`);

    return this.#restService.request<Todo[]>(url);
  }

  async list({ limit, start, filter } = { limit: 10, start: 0 } as ListParams) {
    if (!limit) {
      return new Array<Todo>();
    }

    let url = this.#createUrl(`?_limit=${limit}&_start=${start}`);

    if (filter?.length) {
      url += `&q=${filter}`;
    }

    return this.#restService.request<Todo[]>(url);
  }

  async add(todo: Todo) {
    const url = this.#createUrl();
    return this.#restService.request<Todo[]>(url, 'POST', todo);
  }

  async update(todo: Todo) {
    const url = this.#createUrl(`/${todo.id}`);
    return this.#restService.request<Todo[]>(url, 'PATCH', todo);
  }

  save(todo: Todo) {
    if (todo.id) {
      return this.update(todo);
    }

    return this.add(todo);
  }

  async delete(id: number) {
    if (!id) {
      return;
    }

    const url = this.#createUrl(`/${id}`);
    return this.#restService.request<unknown>(url);
  }
}
