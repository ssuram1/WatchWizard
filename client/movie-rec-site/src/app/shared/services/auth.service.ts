declare var google: any;
import { Injectable } from '@angular/core';
import { Router } from'@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private router: Router) {}

    signOut() {
        //google feature to sign out
        google.accounts.id.disableAutoSelect();
        //navigate back to home page
        this.router.navigate(['/'])
    }
}