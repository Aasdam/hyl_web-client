import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.scss']
})
export class SignoutComponent implements OnInit {

   private disabledButton = false;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  onLogout() {
    if (!this.disabledButton) {
        this.disabledButton = true;
        this.authService.signout().then(
            () => {
                this.router.navigate(['/connexion']);
            },
            reason => {
                console.log(reason);
                this.router.navigate(['/erreur']);
            }
        );
    }
  }
}
