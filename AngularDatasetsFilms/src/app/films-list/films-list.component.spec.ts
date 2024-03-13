import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FilmsListComponent } from './films-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FilmsServiceService } from '../service/films-service.service';
import { of } from 'rxjs';

describe('FilmsListComponent', () => {
  let component: FilmsListComponent;
  let fixture: ComponentFixture<FilmsListComponent>;
  let myServiceSpy: jasmine.SpyObj<FilmsServiceService>;

  beforeEach(async () => {
    let spy = jasmine.createSpyObj('FilmsServiceService', ['getList']);
    await TestBed.configureTestingModule({
      declarations: [ FilmsListComponent ]
      ,schemas: [NO_ERRORS_SCHEMA]
      ,imports: [HttpClientTestingModule]
      ,providers : [{ provide: FilmsServiceService, useValue: spy }]
    }).compileComponents();
    
    myServiceSpy = TestBed.inject(FilmsServiceService) as jasmine.SpyObj<FilmsServiceService>;
    myServiceSpy.getList.and.returnValue(of( [ 
      {'name':'Film name','id':'0' ,'releaseDate':'rel','distributor':'dis','genre':'genre','lastModified':null } 
    ]))
    fixture = TestBed.createComponent(FilmsListComponent);
    component = fixture.componentInstance;
    
    fixture.detectChanges();    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  //https://medium.com/widle-studio/angular-unit-testing-without-testbed-a-comprehensive-guide-2e4c557c8da
  
  it('should call FilmsServiceService.getList() on initialization', () => {
    component.ngOnInit();
    expect(myServiceSpy.getList).toHaveBeenCalled();
  });

  it('should render elementi list', () => {
    const fixture = TestBed.createComponent(FilmsListComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('div ul li div h5')?.textContent).toContain('Film name');
  });
  
});
