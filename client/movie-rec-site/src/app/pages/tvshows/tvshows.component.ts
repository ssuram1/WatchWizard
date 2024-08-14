import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { HeaderComponent } from '../../core/components/header/header.component';
import { BannerComponent } from '../../core/components/banner/banner.component';
import { ApiService } from '../../shared/services/api.service';
import { Movie } from '../../shared/directives/movie.model'
import { TvshowCarouselComponent } from '../../shared/components/tvshow-carousel/tvshow-carousel.component';
import { forkJoin, map, Observable } from 'rxjs';


@Component({
  selector: 'app-Tvshows',
  standalone: true,
  providers: [AuthService],
  imports: [CommonModule, HeaderComponent, BannerComponent, TvshowCarouselComponent],
  templateUrl: './Tvshows.component.html',
  styleUrl: './Tvshows.component.scss'
})
export class TvshowsComponent {
    //dependency injection for auth service
  constructor(private auth: AuthService) {}
  //inject api service
  apiservice = inject(ApiService);
  //parse JSON and retrieve name of user
  name = JSON.parse(sessionStorage.getItem("LoggedInUser")!).name;
  profilePicture = JSON.parse(sessionStorage.getItem("LoggedInUser")!).picture;
  //variable to hold banner movie details
  bannerDetail$ = new Observable<any>();
  bannerURL : string = "";
  

  //variables to hold movie data by genre
  comedyTvshows: Movie[] = [];
  dramaTvshows: Movie[] = [];
  actionTvshows: Movie[] = [];
  crimeTvshows: Movie[] = [];
  realityTvshows: Movie[] = [];

  //holds observables returned by API calls
  sources = [
    this.apiservice.getComedyTvshows(),
    this.apiservice.getDramaTvshows(),
    this.apiservice.getActionTvshows(),
    this.apiservice.getCrimeTvshows(),
    this.apiservice.getRealityTvshows()
  ]

  ngOnInit(): void {
    //rxjs method to emit array of results
    forkJoin(this.sources)
    .pipe(
      map(([comedy, drama, action, crime, reality]) => {
        //call first comedy movie as banner movie
        this.bannerDetail$ = this.apiservice.getBannerDetail(comedy[1].title).pipe(
            map(detail => detail || [])
        );
        console.log(this.bannerDetail$.subscribe())
        //read data emitted by Observable
        this.bannerDetail$.subscribe((firstmovie: Movie[]) => {
            this.bannerURL = firstmovie[0].trailer.split('=')[1];
            console.log(this.bannerURL);
        })
        //assign to corresponding variables
        return {comedy, drama, action, crime, reality}
      })
      //execute observable and assign data to corresponding property
    )
    .subscribe((res: any) => {
        this.comedyTvshows = res.comedy as Movie[];
        console.log(this.comedyTvshows);
        this.dramaTvshows = res.drama as Movie[];
        console.log(this.dramaTvshows);
        this.actionTvshows = res.action as Movie[];
        this.crimeTvshows = res.crime as Movie[];
        this.realityTvshows = res.reality as Movie[];
    });
  }
  

  signOut() {
    //clear session information storage
    sessionStorage.removeItem("LoggedInUser")
    this.auth.signOut();
  }
}
