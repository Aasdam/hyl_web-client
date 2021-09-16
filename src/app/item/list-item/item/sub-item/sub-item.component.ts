import {Component, Input, OnInit} from '@angular/core';
import {ClassNameFirstLetter} from '../../../../shared/functions/class-name-first-letter';

@Component({
  selector: 'app-sub-item',
  templateUrl: './sub-item.component.html',
  styleUrls: ['./sub-item.component.scss']
})
export class SubItemComponent implements OnInit {

  @Input() id: bigint;
  @Input() reference: string;
  @Input() urlImages: {id: bigint, url: string, name: string}[];
  @Input() description: string;
  @Input() trackingSheets: {id: bigint, date: Date, comment: string}[];

  private expandSubitem = false;
  private deleteSubItemModal = false;
  private renameSubItemModal = false;

  constructor() { }

  ngOnInit() {
  }

  getClassNameFirstLetter(this): string {
    return ClassNameFirstLetter(this);
  }

  deleteSubItemClick() {
    this.deleteSubItemModal = true;
    const interval = setInterval( () => {
      $('#deleteModal' + this.id + this.getClassNameFirstLetter()).modal('show');
      clearInterval(interval);
    }, 500);
    return false;
  }

  renameSubItemClick() {
    this.renameSubItemModal = true;
    const interval = setInterval( () => {
      $('#renameModal' + this.id + this.getClassNameFirstLetter()).modal('show');
      clearInterval(interval);
    }, 500);
    return false;
  }

  expandSubitemModalOn() {
    const subitem = this;
    subitem.expandSubitem = true;
    subitem.deleteSubItemModal = true; // Acces au modal via un bouton dans le expandSubItem

    const interval = setInterval( () => {
      $('#expandSubItemModal' + this.id).modal('show');

      const expandSubitemClosingElement = [
        $('#expandSubitemCross' + this.id),
      ];
      for (const htmlElement of expandSubitemClosingElement) {
        htmlElement.get()[0].addEventListener('click', event);
      }
      function event() {
        subitem.expandSubitem = false;
      }

      clearInterval(interval);
    }, 250 );
  }
}
