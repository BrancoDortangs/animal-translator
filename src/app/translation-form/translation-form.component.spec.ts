import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationFormComponent } from './translation-form.component';

describe('TranslationFormComponent', () => {
  let component: TranslationFormComponent;
  let fixture: ComponentFixture<TranslationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslationFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TranslationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
