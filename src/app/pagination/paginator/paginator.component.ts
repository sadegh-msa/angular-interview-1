import { Component, effect, inject, input, output, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationService } from '../pagination.service';

@Component({
  selector: 'app-paginator',
  imports: [
    FormsModule
  ],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  providers: [PaginationService]
})
export class PaginatorComponent {
  readonly #paginationService = inject(PaginationService);
  readonly paginator = this.#paginationService.paginator;

  reset = input<unknown>();
  start = output<number>();
  limit = output<number>();

  constructor() {
    effect(() => {
      const start = this.paginator.start();
      untracked(() => this.start.emit(start));
    });

    effect(() => {
      const limit = this.paginator.limit();
      untracked(() => this.limit.emit(limit));
    });

    effect(() => {
      const reset = this.reset();

      untracked(() => {
        if (reset !== undefined) {
          this.#paginationService.reset();
        }
      });
    });
  }

  previousPage() {
    this.#paginationService.previousPage();
  }

  nextPage() {
    this.#paginationService.nextPage();
  }

  setPageSize(size: number) {
    this.#paginationService.limit = size;
  }
}
