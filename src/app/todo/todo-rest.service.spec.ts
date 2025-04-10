import { TestBed } from '@angular/core/testing';

import { TodoRestService } from './todo-rest.service';

describe('TodoRestService', () => {
  let service: TodoRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
