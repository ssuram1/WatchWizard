import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgFor, NgIf} from '@angular/common';
import Swiper from 'swiper';
import { Movie } from '../../directives/movie.model';
import { DescriptionPipe } from '../../pipes/description.pipe';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tvshow-carousel',
  standalone: true,
  imports: [CommonModule, NgFor, DescriptionPipe, NgIf],
  animations: [
    //add fade animation to smooth hover transitions
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        //300ms delay and change opacity for transition
        animate(300, style({ opacity: 1 }))
      ])
    ])
  ],
  templateUrl: './tvshow-carousel.component.html',
  styleUrl: './tvshow-carousel.component.scss'
})
export class TvshowCarouselComponent implements OnInit, AfterViewInit{
  //input for array of video Content
  @Input() videoContents: Movie[] = [];
  //input for title of carousel
  @Input() title!: string;
  @ViewChild('swiperContainer') swiperContainer!: ElementRef
  selectedContent: string | null = null;
  constructor(private router: Router) { }
  ngAfterViewInit(): void {
    //initialize swiper
    this.initSwiper();
  }
  ngOnInit() {
  }

  private initSwiper() {
      return new Swiper(this.swiperContainer.nativeElement, {
        //options to configure Swiper instance
        slidesPerView: 3,
        //move 2 slides at a time when navigate
        slidesPerGroup: 2,
        //center active slide within view port
        centeredSlides: true,
        //carousel scrolls indefinitely
        loop: true,
        breakpoints: {
          //settings by screen size
          600: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 5,
            centeredSlides: true,
            loop: true
          },
          900: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 5,
            centeredSlides: true,
            loop: true
          },
          1200: {
            slidesPerView: 4,
            slidesPerGroup: 4,
            spaceBetween: 5,
            centeredSlides: false,
            loop: true
          },
          1500: {
            slidesPerView: 5,
            slidesPerGroup: 5,
            spaceBetween: 5,
            centeredSlides: false,
            loop: true
          },
          1800: {
            slidesPerView: 5,
            slidesPerGroup: 6,
            spaceBetween: 5,
            centeredSlides: false,
            loop: true
          }
        }
      })
  }
  //set selectedContent property
  //use to display movie details when hover
  setHoverMovie(movie: Movie) {
    this.selectedContent = movie.title
  }
  //clear selectedContent
  clearHoverMovie(){
    this.selectedContent = null;
  }

 //go to movie details card using contentID
  goToDetails(movie: Movie) {
    this.router.navigate(['/content-details', movie.contentID])
  }

}
