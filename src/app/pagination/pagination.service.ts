import { effect, inject, Injectable, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import type { Paginator } from './paginator';

@Injectable()
export class PaginationService {
  readonly #start = signal(0);
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
      limit: this.#limit.asReadonly(),
    } as Paginator;
  }

  constructor() {
    effect(() => {
      this.#limit();
      this.#start();

      untracked(() => {
        this.#onChange.set(this.paginator);
      });
    });
  }

  #paginate(direction: -1 | 1) {
    const directionValue = this.#start() + (direction * this.#limit()) < 0 ? 0 : direction;
    this.#start.update(v => v + directionValue * this.#limit());
  }

  reset() {
    this.#start.set(0);
  }

  nextPage() {
    this.#paginate(1);
  }

  previousPage() {
    this.#paginate(-1);
  }

}
