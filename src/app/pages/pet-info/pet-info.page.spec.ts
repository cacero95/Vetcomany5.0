import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PetInfoPage } from './pet-info.page';

describe('PetInfoPage', () => {
  let component: PetInfoPage;
  let fixture: ComponentFixture<PetInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PetInfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
