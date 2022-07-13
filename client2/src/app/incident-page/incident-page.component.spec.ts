import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentPageComponent } from './incident-page.component';

describe('IncidentPageComponent', () => {
  let component: IncidentPageComponent;
  let fixture: ComponentFixture<IncidentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
