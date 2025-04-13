import { TestBed } from '@angular/core/testing';
import { RestService } from './rest.service';

describe('RestService', () => {
  let service: RestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createUrl', () => {
    it('should concatenate arguments into a URL', () => {
      const url = service.createUrl('https://api.example.com', 'todos', 1);
      expect(url).toBe('https://api.example.com/todos/1');
    });
  });

  describe('request methods', () => {
    beforeEach(() => {
      spyOn(window, 'fetch');
    });

    it('should make a GET request and return data', async () => {
      const mockResponse = { id: 1, title: 'Test Todo' };
      (window.fetch as jasmine.Spy).and.returnValue(Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      }));

      const result = await service.get('https://api.example.com/todos/1');
      expect(window.fetch).toHaveBeenCalledWith('https://api.example.com/todos/1', {
        method: 'GET',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should make a POST request with a body and return data', async () => {
      const mockResponse = { id: 1, title: 'New Todo' };
      const body = { title: 'New Todo' };
      (window.fetch as jasmine.Spy).and.returnValue(Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      }));

      const result = await service.post('https://api.example.com/todos', body);
      expect(window.fetch).toHaveBeenCalledWith('https://api.example.com/todos', {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(body),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should make a DELETE request and return data', async () => {
      (window.fetch as jasmine.Spy).and.returnValue(Promise.resolve({
        json: () => Promise.resolve({}),
      }));

      const result = await service.delete('https://api.example.com/todos/1');
      expect(window.fetch).toHaveBeenCalledWith('https://api.example.com/todos/1', {
        method: 'DELETE',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });
      expect(result).toEqual({});
    });
  });
});
