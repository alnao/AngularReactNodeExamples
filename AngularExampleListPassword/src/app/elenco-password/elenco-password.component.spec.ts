import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElencoPasswordComponent } from './elenco-password.component';

describe('ElencoPasswordComponent', () => {
  let component: ElencoPasswordComponent;
  let fixture: ComponentFixture<ElencoPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElencoPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElencoPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
