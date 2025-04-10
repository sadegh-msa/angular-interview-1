import { Component, computed, inject, resource, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, skip } from 'rxjs';
import { PaginatorComponent } from '../../pagination/paginator/paginator.component';
import { TodoRestService } from '../todo-rest.service';

@Component({
  selector: 'app-todo-list',
  imports: [
    RouterLink,
    FormsModule,
    PaginatorComponent
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent {
  readonly #todoRestService = inject(TodoRestService);

  readonly #todoResource = resource({
    request: () => ({
      limit: this.paginatorLimit(),
      start: this.paginatorStart(),
      filter: this.filterText()
    }),
    loader: ({ request }) => this.#todoRestService.list(request),
    defaultValue: [],
  });

  readonly paginatorStart = signal(0);
  readonly paginatorLimit = signal(0);
  readonly filter = signal('');
  readonly filterText = toSignal(toObservable(this.filter).pipe(skip(1), debounceTime(500)));
  readonly todos = computed(() => this.#todoResource.value());
  readonly isLoading = computed(() => this.#todoResource.isLoading());
}
