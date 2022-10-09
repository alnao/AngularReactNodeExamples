import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorRoutingComponent } from './error-routing.component';

describe('ErrorRoutingComponent', () => {
  let component: ErrorRoutingComponent;
  let fixture: ComponentFixture<ErrorRoutingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorRoutingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
