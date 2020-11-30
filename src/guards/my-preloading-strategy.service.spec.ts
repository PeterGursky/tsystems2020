import { TestBed } from '@angular/core/testing';

import { MyPreloadingStrategyService } from './my-preloading-strategy.service';

describe('MyPreloadingStrategyService', () => {
  let service: MyPreloadingStrategyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyPreloadingStrategyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
