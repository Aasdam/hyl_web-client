import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.sidebarLeftPaddingAdjustment();
  }

  private sidebarLeftPaddingAdjustment() {
    const cssClass = 'css-adjustment';
    const sidebar = document.getElementById('sidebarToggle');
    const toAdjust = [
      document.getElementById('memos'),
      document.getElementById('items'),
      document.getElementById('loans'),
      document.getElementById('profil'),
      document.getElementById('signout')
    ];
    const c = toAdjust.length;

    // Init -> Ajoute un décalage sur la gauche aux liens dans la sidebar pour éviter qu'il ne soit acollé à l'icone
    for (let i = 0; i < c; i++) {
      toAdjust[i].classList.add( cssClass );
    }

    // S'il y a click sur le bouton qui rétracte ou agrandi la sidebar
    // -> On enlève le décalage dans le cas d'une rétractation
    // -> On l'ajoute dans le cas d'un agrandissement (forme normal de la sidebar)
    sidebar.addEventListener('click', () => {
      for (let i = 0; i < c; i++) {
        const element = toAdjust[i];
        if ( !element.classList.contains( cssClass ) ) {
          toAdjust[i].classList.add( cssClass );
        } else {
          element.classList.remove( cssClass );
        }
      }
    });
  }
}
