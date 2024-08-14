import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { HeaderComponent } from '../../core/components/header/header.component';
import { BannerComponent } from '../../core/components/banner/banner.component';
import { ApiService } from '../../shared/services/api.service';
import { Movie } from '../../shared/directives/movie.model'
import { MovieCarouselComponent } from '../../shared/components/movie-carousel/movie-carousel.component';
import { forkJoin, map, Observable } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-movies',
  standalone: true,
  providers: [AuthService],
  imports: [CommonModule, HeaderComponent, BannerComponent, RouterModule, MovieCarouselComponent],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent implements OnInit{
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
  comedyMovies: Movie[] = [];
  dramaMovies: Movie[] = [];
  actionMovies: Movie[] = [];
  scifiMovies: Movie[] = [];
  romanceMovies: Movie[] = [];

  //holds observables returned by API calls
  sources = [
    this.apiservice.getComedyMovies(),
    this.apiservice.getDramaMovies(),
    this.apiservice.getActionMovies(),
    this.apiservice.getSciFiMovies(),
    this.apiservice.getRomanceMovies()
  ]

  ngOnInit(): void {
    //rxjs method to emit array of results
    forkJoin(this.sources)
    .pipe(
      map(([comedy, drama, action, scifi, romance]) => {
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
        return {comedy, drama, action, scifi, romance}
      })
      //execute observable and assign data to corresponding property
    ).subscribe((res: any) => {
        this.comedyMovies = res.comedy as Movie[];
        console.log(this.comedyMovies);
        this.dramaMovies = res.drama as Movie[];
        this.actionMovies = res.action as Movie[];
        this.scifiMovies = res.scifi as Movie[];
        this.romanceMovies = res.romance as Movie[];
    });
  }
  

  signOut() {
    //clear session information storage
    sessionStorage.removeItem("LoggedInUser")
    this.auth.signOut();
  }
}
