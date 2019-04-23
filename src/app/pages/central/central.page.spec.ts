import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralPage } from './central.page';

describe('CentralPage', () => {
  let component: CentralPage;
  let fixture: ComponentFixture<CentralPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentralPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentralPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
