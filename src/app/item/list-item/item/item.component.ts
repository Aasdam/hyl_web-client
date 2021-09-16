import {Component, Input, OnInit} from '@angular/core';
import {SubItemComponent} from './sub-item/sub-item.component';
import {ClassNameFirstLetter} from '../../../shared/functions/class-name-first-letter';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.scss'],
})
export class ItemComponent implements OnInit {

  @Input() id: bigint;
  @Input() name: string;
  @Input() description: string;
  @Input() subItems: SubItemComponent[];

  private renameItemModal = false;
  private moveItemModal = false;
  private deleteItemModal = false;
  private addSubItemModal = false;

  constructor() { }

  ngOnInit() {}

  getClassNameFirstLetter(this): string {
    return ClassNameFirstLetter(this);
  }

  renameItemClick() {
    this.renameItemModal = true;
    const interval = setInterval( () => {
      $('#renameModal' + this.id + this.getClassNameFirstLetter()).modal('show');
      clearInterval(interval);
    }, 500);
  }
  moveItemClick() {
    this.moveItemModal = true;
    const interval = setInterval( () => {
      $('#moveModal' + this.id + this.getClassNameFirstLetter()).modal('show');
      clearInterval(interval);
    }, 500);
  }
  deleteItemClick() {
    this.deleteItemModal = true;
    const interval = setInterval( () => {
      $('#deleteModal' + this.id + this.getClassNameFirstLetter()).modal('show');
      clearInterval(interval);
    }, 500);
  }
  addSubItemClick() {
    this.addSubItemModal = true;
    const interval = setInterval( () => {
      $('#addSubItemModal' + this.id + this.getClassNameFirstLetter()).modal('show');
      clearInterval(interval);
    }, 500);
  }
}
