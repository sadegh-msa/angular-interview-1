import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PaginationService } from './pagination.service';

describe('PaginationService', () => {
  let service: PaginationService;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteStub = {
      queryParams: of({ start: '0', limit: '10' }),
    };

    TestBed.configureTestingModule({
      providers: [
        PaginationService,
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    });

    service = TestBed.inject(PaginationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize paginator with default values', () => {
    const paginator = service.paginator;
    expect(paginator.start()).toBe(0);
    expect(paginator.limit()).toBe(10);
  });

  it('should reset start to default value', () => {
    service.reset();
    expect(service.paginator.start()).toBe(0);
  });

  /*it('should navigate to the next page', () => {
    service.nextPage();
    expect(service.paginator.start()).toBe(10);
    expect(routerSpy.navigate).toHaveBeenCalledWith([], {
      relativeTo: activatedRouteStub,
      queryParams: { start: 10, limit: 10 },
      queryParamsHandling: 'merge',
      onSameUrlNavigation: 'ignore',
    });
  });

  it('should navigate to the previous page', () => {
    service.nextPage(); // Move to the next page first
    service.previousPage();
    expect(service.paginator.start()).toBe(0);
    expect(routerSpy.navigate).toHaveBeenCalledWith([], {
      relativeTo: activatedRouteStub,
      queryParams: { start: 0, limit: 10 },
      queryParamsHandling: 'merge',
      onSameUrlNavigation: 'ignore',
    });
  });

  it('should not navigate to a negative page', () => {
    service.previousPage();
    expect(service.paginator.start()).toBe(0);
    expect(routerSpy.navigate).toHaveBeenCalledWith([], {
      relativeTo: activatedRouteStub,
      queryParams: { start: 0, limit: 10 },
      queryParamsHandling: 'merge',
      onSameUrlNavigation: 'ignore',
    });
  });*/

  it('should update limit and reflect in paginator', () => {
    service.limit = 20;
    expect(service.paginator.limit()).toBe(20);
  });
});
