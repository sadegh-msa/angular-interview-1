import { effect, Injectable, signal, untracked } from '@angular/core';
import type { Paginator } from './paginator';

@Injectable()
export class PaginationService {
  readonly #start = signal(0);
  readonly #page = signal(0);
  readonly #limit = signal(10);
  readonly #onChange = signal(this.paginator);

  set limit(limit: number) {
    this.#limit.set(limit);
  }

  get onChange() {
    return this.#onChange.asReadonly();
  }

  get paginator() {
    return {
      start: this.#start.asReadonly(),
      page: this.#page.asReadonly(),
      limit: this.#limit.asReadonly(),
    } as Paginator;
  }

  constructor() {
    effect(() => {
      this.#limit();
      this.#page();
      this.#start();

      untracked(() => {
        this.#onChange.set(this.paginator);
      });
    });
  }

  #paginate(direction: -1 | 1) {
    const directionValue = this.#page() + direction < 0 ? 0 : direction;
    this.#page.update(v => v + directionValue);
    this.#start.update(v => this.#page() * this.#limit());
  }

  reset() {
    this.#page.set(0);
    this.#start.set(0);
  }

  nextPage() {
    this.#paginate(1);
  }

  previousPage() {
    this.#paginate(-1);
  }

}
