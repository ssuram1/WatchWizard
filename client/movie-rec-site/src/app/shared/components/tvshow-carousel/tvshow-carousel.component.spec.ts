import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvshowCarouselComponent } from './tvshow-carousel.component';

describe('TvshowCarouselComponent', () => {
  let component: TvshowCarouselComponent;
  let fixture: ComponentFixture<TvshowCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TvshowCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TvshowCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
