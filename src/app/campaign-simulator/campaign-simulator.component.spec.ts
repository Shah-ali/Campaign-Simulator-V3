import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignSimulatorComponent } from './campaign-simulator.component';

describe('CampaignSimulatorComponent', () => {
  let component: CampaignSimulatorComponent;
  let fixture: ComponentFixture<CampaignSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignSimulatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
