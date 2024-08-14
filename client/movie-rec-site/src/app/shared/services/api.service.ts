import { Injectable, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../directives/movie.model'
import { Content } from '../directives/content.model';

//can be injected into other components
@Injectable({
    providedIn: 'root'
})
export class ApiService {
    //node.js backend URL
    private apiURL = 'http://localhost:3000';

    //use to make HTTP requests
    constructor(private http:HttpClient) { }

    //methods to retrieve endpoint to get movies by genre
    //Comedy
    getComedyMovies(): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${this.apiURL}/api/movies?genre=comedy`);
    }
    //Drama
    getDramaMovies(): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${this.apiURL}/api/movies?genre=drama`);
    }
    //Action
    getActionMovies(): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${this.apiURL}/api/movies?genre=action`);
    }
    //Science Fiction
    getSciFiMovies(): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${this.apiURL}/api/movies?genre=science fiction`);
    }
    //Romance
    getRomanceMovies(): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${this.apiURL}/api/movies?genre=romance`);
    }
    //Banner Movie or TV Show Details using search endpoint
    getBannerDetail(title: String): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${this.apiURL}/api/search?search_value=${title}&search_field=name`);
    }


    //methods to retrieve endpoint to get movies by genre
     //Comedy
    getComedyTvshows(): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${this.apiURL}/api/tvshows?genre=comedy`);
    }
    //Drama
    getDramaTvshows(): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${this.apiURL}/api/tvshows?genre=drama`);
    }
    //Action
    getActionTvshows(): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${this.apiURL}/api/tvshows?genre=action`);
    }
    //Science Fiction
    getCrimeTvshows(): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${this.apiURL}/api/tvshows?genre=crime`);
    }
    //Romance
    getRealityTvshows(): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${this.apiURL}/api/tvshows?genre=reality`);
    }

    //Content Details
    getContentDetails(contentID : String): Observable<Content[]> {
        return this.http.get<Content[]>(`${this.apiURL}/api/details?contentID=${contentID}`);
    }
}