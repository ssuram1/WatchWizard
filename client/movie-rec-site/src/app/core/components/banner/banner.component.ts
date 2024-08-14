import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Movie } from '../../../shared/directives/movie.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss'
})
export class BannerComponent implements OnChanges{
    @Input({required : true}) bannerTitle = '';
    @Input() bannerOverview = '';
    @Input() bannerURL = 'pBk4NYhWNMM';
    @Input() contentID = '';

    //add routine for More Info button
    constructor(private router: Router) { }

    //must sanitize external links
    private sanitizer = inject(DomSanitizer);
    videoURL = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.bannerURL}?autoplay=1&mute=1&loop=1&playlist=${this.bannerURL}&controls=0`)
    ngOnChanges(changes: SimpleChanges): void {
      if(changes['bannerURL']) {
        this.videoURL = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.bannerURL}?autoplay=1&mute=1&loop=1&controls=0`)
      }
    }
    //go to movie details card using contentID of banner content
    goToDetails(contentID: string) {
      this.router.navigate(['/content-details', this.contentID])
    }
}
