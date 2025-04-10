import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'todo',
    children: [
      {
        path: 'list',
        loadComponent: () => import('./todo/todo-list/todo-list.component').then(m => m.TodoListComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./todo/todo-form/todo-form.component').then(m => m.TodoFormComponent)
      }
    ],
  }
];
