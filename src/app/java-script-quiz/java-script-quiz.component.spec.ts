import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JavaScriptQuizComponent } from './java-script-quiz.component';

describe('JavaScriptQuizComponent', () => {
  let component: JavaScriptQuizComponent;
  let fixture: ComponentFixture<JavaScriptQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JavaScriptQuizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JavaScriptQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
