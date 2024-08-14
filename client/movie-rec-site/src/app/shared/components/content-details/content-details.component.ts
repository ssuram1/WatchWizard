import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Movie } from '../../directives/movie.model';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Content } from '../../directives/content.model';

@Component({
  selector: 'app-content-details',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './content-details.component.html',
  styleUrl: './content-details.component.scss'
})
export class ContentDetailsComponent implements OnInit {
  //property to hold content details- either Movie type or undefined
    content: Content | undefined;
    sources: Content[] | undefined
  //inject ActivatedRoute and ApiService
  constructor(private route: ActivatedRoute, private apiService: ApiService) { }
  //called when component initializes- use to fetch movie data
  ngOnInit(): void{
    //get contentID
    //retrieve contentID from route parameter
    //this.route.snapshot gives route at time of initialization
    const contentID = this.route.snapshot.paramMap.get('id')
    if (contentID) {
      this.apiService.getContentDetails(contentID).subscribe(content => {
        //returns result as array- take first result for content results
        this.content = content[0];
        //use to iterate over sources
        this.sources = content;
      })
    }
  }

}
