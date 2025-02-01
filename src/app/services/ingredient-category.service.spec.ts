import { TestBed } from '@angular/core/testing';

import { IngredientCategoryService } from './ingredient-category.service';

describe('IngredientCategoryService', () => {
  let service: IngredientCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
