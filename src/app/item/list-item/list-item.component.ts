import {Component, Input, OnInit} from '@angular/core';
import {ItemService} from '../item.service';
import {CategoryComponent} from './category/category.component';
import {Subscription} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {

    // Evite bug en attendant les infos venant du service
   @Input() category: CategoryComponent = new CategoryComponent();
   private categorySubscription: Subscription;

   private addCategoryModal = false;
   private addItemModal = false;

  constructor(private itemService: ItemService,
              private formBuilder: FormBuilder,
              private router: Router) {}

  ngOnInit() {
      this.initCategorySuscription();
      this.fillMainCategory();
  }

  private initCategorySuscription() {
      this.categorySubscription = this.itemService.categoryStorageSubject.subscribe(
          (category: CategoryComponent) => {
              this.category = category;
          }
      );
  }

  private fillMainCategory() {
      this.itemService.getItemsFormatInCategory().catch(
          reason => {
              console.log(reason);
              this.router.navigate(['/erreur']);
          }
      );
  }

  private addCategoryClick() {
      this.addCategoryModal = true;
      const interval = setInterval( () => {
          $('#addCategoryModal' + this.category.id).modal('show');
          clearInterval(interval);
      }, 500);
  }

  private addItemClick() {
      this.addItemModal = true;
      const interval = setInterval( () => {
          $('#addItemModal' + this.category.id).modal('show');
          clearInterval(interval);
      }, 500);
  }
}
