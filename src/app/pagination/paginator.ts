import type { Signal } from '@angular/core';

export interface Paginator {
  start: Signal<number>;
  page: Signal<number>;
  limit: Signal<number>;
}
