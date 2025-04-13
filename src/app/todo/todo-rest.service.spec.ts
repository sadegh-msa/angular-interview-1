import { TestBed } from '@angular/core/testing';
import { TodoRestService } from './todo-rest.service';
import { RestService } from '../common/services/rest.service';
import type { Todo } from './todo.model';


describe('TodoRestService', () => {
  const mockTodo: Todo = { id: 1, title: 'New Todo', completed: false, userId: 1 };
  const idLessTodo = { ...mockTodo, id: 0 };
  const apiUrl = 'https://jsonplaceholder.typicode.com/todos';

  let service: TodoRestService;
  let restServiceSpy: jasmine.SpyObj<RestService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('RestService', ['createUrl', 'get', 'post', 'patch', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        TodoRestService,
        { provide: RestService, useValue: spy },
      ],
    });

    service = TestBed.inject(TodoRestService);
    restServiceSpy = TestBed.inject(RestService) as jasmine.SpyObj<RestService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call RestService.get for get method', async () => {
    restServiceSpy.get.and.returnValue(Promise.resolve(mockTodo));

    const result = await service.get(1);
    expect(restServiceSpy.createUrl).toHaveBeenCalledWith(apiUrl, 1);
    expect(restServiceSpy.get).toHaveBeenCalled();
    expect(result).toEqual(mockTodo);
  });

  it('should call RestService.get for list method', async () => {
    const mockTodos: Todo[] = [mockTodo];
    restServiceSpy.get.and.returnValue(Promise.resolve(mockTodos));

    const result = await service.list({ limit: 10, start: 0 });
    expect(restServiceSpy.createUrl).toHaveBeenCalledWith(apiUrl, '?_limit=10&_start=0');
    expect(restServiceSpy.get).toHaveBeenCalled();
    expect(result).toEqual(mockTodos);
  });

  it('should call RestService.post for add method', async () => {
    const expectedUrl = apiUrl;
    restServiceSpy.createUrl.and.returnValue(expectedUrl);
    restServiceSpy.post.and.returnValue(Promise.resolve(mockTodo));

    const result = await service.add(idLessTodo);
    expect(restServiceSpy.createUrl).toHaveBeenCalledWith(apiUrl, undefined);
    expect(restServiceSpy.post).toHaveBeenCalledWith(expectedUrl, idLessTodo);
    expect(result).toEqual(mockTodo);
  });

  it('should call RestService.patch for update method', async () => {
    const expectedUrl = `${apiUrl}/1`;
    restServiceSpy.createUrl.and.returnValue(expectedUrl);
    restServiceSpy.patch.and.returnValue(Promise.resolve(mockTodo));

    const result = await service.update(mockTodo);
    expect(restServiceSpy.createUrl).toHaveBeenCalledWith(apiUrl, 1);
    expect(restServiceSpy.patch).toHaveBeenCalledWith(expectedUrl, mockTodo);
    expect(result).toEqual(mockTodo);
  });

  it('should call add for save method if no id is present', async () => {
    spyOn(service, 'add').and.returnValue(Promise.resolve(mockTodo));

    const result = await service.save(idLessTodo);
    expect(service.add).toHaveBeenCalledWith(idLessTodo);
    expect(result).toEqual(mockTodo);
  });

  it('should call update for save method if id is present', async () => {
    spyOn(service, 'update').and.returnValue(Promise.resolve(mockTodo));

    const result = await service.save(mockTodo);
    expect(service.update).toHaveBeenCalledWith(mockTodo);
    expect(result).toEqual(mockTodo);
  });

  it('should call RestService.delete for delete method', async () => {
    const expectedUrl = `${apiUrl}/1`;
    restServiceSpy.createUrl.and.returnValue(expectedUrl);
    restServiceSpy.delete.and.returnValue(Promise.resolve({}));

    const result = await service.delete(1);
    expect(restServiceSpy.createUrl).toHaveBeenCalledWith(apiUrl, 1);
    expect(restServiceSpy.delete).toHaveBeenCalledWith(expectedUrl);
    expect(result).toEqual({});
  });
});
