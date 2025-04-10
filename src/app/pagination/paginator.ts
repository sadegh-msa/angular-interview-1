import type { Signal } from '@angular/core';

export interface Paginator {
  start: Signal<number>;
  limit: Signal<number>;
}
