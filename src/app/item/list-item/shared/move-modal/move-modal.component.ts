import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ItemService} from '../../../item.service';
import {Router} from '@angular/router';
import {ItemComponent} from '../../item/item.component';
import {CategoryComponent} from '../../category/category.component';
import {ClassNameFirstLetter} from '../../../../shared/functions/class-name-first-letter';
import {CheckCategoryDepth} from '../../../../shared/form-validators/async/check-category-depth.async-validator';

@Component({
  selector: 'app-move-modal',
  templateUrl: './move-modal.component.html',
  styleUrls: ['./move-modal.component.scss']
})
export class MoveModalComponent implements OnInit {

  @Input() whoMove: ItemComponent | CategoryComponent;

  private moveForm: FormGroup;
  private disabledButton;

  constructor(private itemService: ItemService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.initMoveForm();
  }

  initMoveForm() {
    this.disabledButton = false;
    const async = [];
    if ( this.whoMove instanceof CategoryComponent ) { async.push(CheckCategoryDepth(this.itemService, this.whoMove.id, 'MOVE')); }
    this.moveForm = this.formBuilder.group({
      categoryMove: ['', [Validators.required], async],
    });
  }

  onSubmitMoveForm() {
    if (!this.disabledButton) {
      this.disabledButton = true;
      const idCategory = this.moveForm.controls.categoryMove.value !== '' ? this.moveForm.controls.categoryMove.value : null;
      if (this.whoMove instanceof CategoryComponent) {
        this.itemService.moveCategory(this.whoMove, idCategory).then(
            value => {
              this.initMoveForm();
            },
            reason => {
              console.log(reason);
              this.router.navigate(['/erreur']);
            }
        );
      } else if (this.whoMove instanceof ItemComponent) {
        this.itemService.moveItem(this.whoMove, idCategory).then(
            () => {
              this.initMoveForm();
            },
            reason => {
              console.log(reason);
              this.router.navigate(['/erreur']);
            }
        );
      } else {
        this.router.navigate(['/erreur']);
      }
    }
  }

  getFullCategoriesInOneArray(): CategoryComponent[] {
    const getFullCategoriesForCategoryComponent = (category: CategoryComponent): CategoryComponent[] => {
      // Sert à supprimer une catégorie dans la liste passé en paramètre où toutes les catégories sont classées sans hierarchie
      const removeCategoryInArrayByIdCat = (pCategories: CategoryComponent[], categoryToRemove: bigint | number): CategoryComponent[] => {
        const index = pCategories.findIndex(pCategory => {
          return Number(categoryToRemove) === Number(pCategory.id);
        });
        if (index !== -1) {
          pCategories.splice(index, 1);
          return pCategories;
        }
      };

      let allCategories = this.itemService.getFullCategoriesInOneArray(null);
      const childCategories = this.itemService.getFullCategoriesInOneArray(category);
      const parentCategory = this.itemService.getParentCategoryOf(category.id);

      // Supprime 'this' de la liste 'allCategories'
      allCategories = removeCategoryInArrayByIdCat(allCategories, category.id);

      // Supprime les catégories enfants de 'this' de la liste 'allCategories'
      if (childCategories != null && childCategories.length > 0) {
        for (const childCategory of childCategories) {
          allCategories = removeCategoryInArrayByIdCat(allCategories, childCategory.id);
        }
      }

      // Supprime la catégorie parent (celle ou il se trouve) de 'this' de la liste 'allCategories' s'il en a une
      if (parentCategory !== null && parentCategory.id !== null) {
        allCategories = removeCategoryInArrayByIdCat(allCategories, parentCategory.id);
        // S'il n'a pas de catégorie parent -> il est dans l'inventaire -> alors inventaire = catégorie parent -> Le supprimer de la liste
      } else if (parentCategory === null || parentCategory.id === null) {
        allCategories = removeCategoryInArrayByIdCat(allCategories, null);
      }
      return allCategories;
    };
    const getFullCategoriesForItemComponent = (item: ItemComponent): CategoryComponent[] =>  {
      // Sert à supprimer un item dans la liste passé en paramètre où toutes les catégories sont classées sans hierarchie
      const removeCategoryByIdItem = (categories: CategoryComponent[], itemToRemove: bigint|number): CategoryComponent[] => {
        const c = categories.length;
        for (let i = 0; i < c; i++) {
          if (categories[i].items != null && categories[i].items.length > 0) {
            const index = categories[i].items.findIndex(pItem => {
              return Number(itemToRemove) === Number(pItem.id);
            });
            if (index !== -1) {
              categories.splice(i, 1);
              return categories;
            }
          }
        }
      };
      let categoryList = this.itemService.getFullCategoriesInOneArray(null);
      categoryList = removeCategoryByIdItem(categoryList, item.id);
      return categoryList;
    };

    // ******************************************************************************************************
    if (this.whoMove instanceof CategoryComponent) {
      return getFullCategoriesForCategoryComponent(this.whoMove);
    } else if (this.whoMove instanceof ItemComponent) {
      return getFullCategoriesForItemComponent(this.whoMove);
    }
  }

  instanceOfCategory() {
    return this.whoMove instanceof CategoryComponent;
  }

  instanceOfItem() {
    return this.whoMove instanceof ItemComponent;
  }
}
