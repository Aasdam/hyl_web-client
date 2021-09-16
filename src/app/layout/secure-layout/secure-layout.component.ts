import {Component, OnInit} from '@angular/core';
import {Router, Routes, RoutesRecognized} from '@angular/router';
import {ListItemComponent} from '../../item/list-item/list-item.component';
import {ProfilComponent} from '../../user/profil/profil.component';
import {ListLoanComponent} from '../../loan/list-loan/list-loan.component';
import {MemoComponent} from '../../memo/memo.component';

export const SECURE_ROUTES: Routes = [
  {path: 'inventaire', component: ListItemComponent},
  {path: 'profil', component: ProfilComponent},
  {path: 'prets-en-cours', component: ListLoanComponent, data: {etat: 'en cours'}},
  {path: 'prets-termines', component: ListLoanComponent, data: {etat: 'terminés'}},
  {path: 'memos', component: MemoComponent},
];

@Component({
  selector: 'app-secure-layout',
  templateUrl: './secure-layout.component.html',
  styleUrls: ['./secure-layout.component.scss']
})
export class SecureLayoutComponent implements OnInit {

  style: string;

  constructor(private router: Router) {}

  ngOnInit() {
    this.initStyle();
  }

  initStyle() {
    this.style = this.router.url.slice(1);
    if (this.style.includes('prets')) { this.style = 'prets'; }

    this.router.events.subscribe((event: RoutesRecognized) => {
      if (event && event.urlAfterRedirects) {
        if (event.urlAfterRedirects === '/inventaire') {
          this.style = 'inventaire';
        } else if (event.urlAfterRedirects === '/profil') {
          this.style = 'profil';
        } else if (event.urlAfterRedirects === '/prets-en-cours'
                  || event.urlAfterRedirects === '/prets-termines') {
          this.style = 'prets';
        }
        if (event.urlAfterRedirects === '/memos') {
          this.style = 'memos';
        }
      }
    });
  }
}
