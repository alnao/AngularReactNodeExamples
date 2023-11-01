import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmsListComponent } from './films-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FilmsListComponent', () => {
  let component: FilmsListComponent;
  let fixture: ComponentFixture<FilmsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilmsListComponent ],schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
