import { TestBed } from '@angular/core/testing';

import { DifficultyLevelService } from './difficulty-level.service';

describe('DifficultyLevelService', () => {
  let service: DifficultyLevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DifficultyLevelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
