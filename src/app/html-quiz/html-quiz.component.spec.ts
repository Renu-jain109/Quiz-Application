import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlQuizComponent } from './html-quiz.component';

describe('HtmlQuizComponent', () => {
  let component: HtmlQuizComponent;
  let fixture: ComponentFixture<HtmlQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HtmlQuizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HtmlQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
