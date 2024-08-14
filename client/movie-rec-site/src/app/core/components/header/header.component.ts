import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  //dependency injection for auth service
  constructor(private auth: AuthService) {}
  // navList = ["Home", "TV Shows","Movies", "Releases"]
  navList = [
    // {name: 'Home', link: '/'},
    {name: 'Movies', link: '/movies'},
    {name: 'TV Shows', link: '/tvshows'}, 
    // {name: 'Releases', link: '/releases'}
  ]
  name = JSON.parse(sessionStorage.getItem("LoggedInUser")!).name;
  profilePicture = JSON.parse(sessionStorage.getItem("LoggedInUser")!).picture;
}
