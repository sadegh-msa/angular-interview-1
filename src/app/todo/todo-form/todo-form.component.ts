import {
  Component,
  computed,
  effect,
  inject,
  input,
  resource,
  signal,
  untracked
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TodoRestService } from '../todo-rest.service';
import type { Todo } from '../todo.model';

@Component({
  selector: 'app-todo-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss',
})
export class TodoFormComponent {
  readonly #router = inject(Router);
  readonly #todoRestService = inject(TodoRestService);

  readonly #todoResource = resource({
    request: () => this.id(),
    loader: ({ request }) => this.#todoRestService.get(request),
  });
  readonly form = new FormGroup({
    id: new FormControl(0),
    title: new FormControl('', Validators.required),
    completed: new FormControl(false),
    userId: new FormControl(1),
  });
  readonly formType = computed(() => this.id() ? 'edit' : 'add');
  readonly isLoading = computed(() => this.#todoResource.isLoading());
  readonly isSaving = signal(false);
  id = input<number>();

  constructor() {
    effect(() => {
      const todo = this.#todoResource.value();

      untracked(() => {
        if (this.formType() === 'edit') {
          this.form.patchValue((todo || {}) as Todo);
        }
      });
    });
  }

  async save() {
    this.isSaving.set(true);
    await this.#todoRestService.save(this.form.value as Todo);
    await this.#router.navigate(['/', 'todo', 'list']);
  }
}
