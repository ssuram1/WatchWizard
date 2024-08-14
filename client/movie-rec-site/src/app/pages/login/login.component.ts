
import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import { Router } from'@angular/router';
declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  //dependency injection for Router
  constructor(private router: Router) {}
  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '628877684306-7g35vmm5f0iiq438qkdeplu4mgl9ro62.apps.googleusercontent.com',
      callback: (resp: any) => this.handleLogin(resp)
    });
    //creates google authentication button
    google.accounts.id.renderButton(document.getElementById("google-btn"), {
        theme: 'filled_blue', 
        size: 'large',
        shape: 'rectangle',
        width: 300,
        logo_alignment: 'left'
    })
  }

    private decodeToken(token: string) {
      //access payload of JWT token
      return JSON.parse(atob(token.split(".")[1]));
    }

    //use to decode token and access user credentials
    handleLogin(response: any) {
        if(response) {
          //decode the token to access credentials
          const payload = this.decodeToken(response.credential);
          //store credentials in session
          sessionStorage.setItem("LoggedInUser", JSON.stringify(payload));
          //navigate to home page- CHANGE TO HOME after create HOME PAGE
          this.router.navigate(['movies']);
        }
    }

}
