import { effect, inject, Injectable, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, type Params, Router } from '@angular/router';
import type { Paginator } from './paginator';

@Injectable()
export class PaginationService {
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);

  readonly #START = 0;
  readonly #LIMIT = 10;

  readonly #start = signal(this.#START);
  readonly #limit = signal(this.#LIMIT);

  set limit(limit: number) {
    this.#limit.set(limit);
  }

  get paginator() {
    return {
      start: this.#start.asReadonly(),
      limit: this.#limit.asReadonly(),
    } as Paginator;
  }

  constructor() {
    this.#activatedRoute.queryParams
      .pipe(takeUntilDestroyed())
      .subscribe(({ start, limit }) => {
        this.#start.set(!isNaN(+start) ? +start : this.#START);
        this.#limit.set(!isNaN(+limit) ? +limit : this.#LIMIT);
      });

    effect(() => {
      this.#limit();
      this.#start();

      untracked(() => {
        this.#updateCurrentRoute();
      });
    });
  }

  #updateCurrentRoute() {
    const queryParams: Params = { start: this.#start(), limit: this.#limit() };
    this.#router.navigate(
      [],
      {
        relativeTo: this.#activatedRoute,
        queryParams,
        queryParamsHandling: 'merge',
        onSameUrlNavigation: 'ignore',
      }
    ).then();
  }

  #paginate(direction: -1 | 1) {
    const directionValue = this.#start() + (direction * this.#limit()) < 0 ? 0 : direction;
    this.#start.update(v => v + directionValue * this.#limit());
  }

  reset() {
    this.#start.set(this.#START);
  }

  nextPage() {
    this.#paginate(1);
  }

  previousPage() {
    this.#paginate(-1);
  }

}
