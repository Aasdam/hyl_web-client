import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CategoryComponent} from './list-item/category/category.component';
import {Subject} from 'rxjs';
import {ItemComponent} from './list-item/item/item.component';
import {isUndefined} from 'util';
import {SubItemComponent} from './list-item/item/sub-item/sub-item.component';
import {environment} from '../../environments/environment';
import {TrackingSheetComponent} from './list-item/item/sub-item/tracking-sheet/tracking-sheet.component';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private host = environment.gatewayUrl + environment.itemUrl;

  private categoryStorage: CategoryComponent;
  categoryStorageSubject = new Subject<CategoryComponent>();

  constructor(private httpClient: HttpClient) { }

  emitCategoryStorage() {
    this.categoryStorageSubject.next([this.categoryStorage].slice()[0]);
  }

  checkCategoryName(name: string) {
    const params = {name};
    return this.httpClient.get(this.host + '/check-category-name', {params});
  }

  checkItemName(name: string) {
    const params = {name};
    return this.httpClient.get(this.host + '/check-item-name', {params});
  }

  checkSubItemRef(reference: string) {
    const params = {reference};
    return this.httpClient.get(this.host + '/check-sub-ref', {params});
  }

  checkMaxSubItem() {
    return this.httpClient.get(this.host + '/check-max-sub');
  }

  checkCategoryDepth(idCategory: bigint, idCategoryToMove: bigint, type: string) {
    const params = {idCategory: String(idCategory), idCategoryToMove: String(idCategoryToMove), type};
    return this.httpClient.get(this.host + '/check-category-depth', {params});
  }

  getItemsFormatInCategory() {
    return this.httpClient.get<CategoryComponent>(this.host + '/').toPromise().then(
        categoryData => {
          this.categoryStorage = categoryData;
          this.categoryStorage.id = null;
          this.categoryStorage.name = 'Inventaire';
          this.emitCategoryStorage();
        }
    );
  }

  getFullItemsInOneArray(category: CategoryComponent) {
    const categoryInOneArray = this.getFullCategoriesInOneArray(category);
    const items: Array<ItemComponent> = [];
    for (const pCategory of categoryInOneArray) {
      if ( pCategory.items ) {
        for (const item of pCategory.items) {
          items.push(item);
        }
      }
    }
    return items;

  }

  getFullCategoriesInOneArray(category: CategoryComponent): CategoryComponent[] {

    const categories: CategoryComponent[] = [];
    if ( category === null ) {
      category = this.categoryStorage;
      if (!isUndefined(category)) { categories.push(this.categoryStorage); }
    }
    if (!isUndefined(category) && category.categories != null) {
      const c = category.categories.length;

      for (let i = 0; i < c; i++) {
        categories.push(category.categories[i]);

        if (category.categories[i].categories !== null && category.categories[i].categories.length !== 0) {
          const childCategories = this.getFullCategoriesInOneArray(category.categories[i]);
          const c2 = childCategories.length;

          for (let j = 0; j < c2; j++) {
            categories.push(childCategories[j]);
          }
        }
      }
      return categories;
    }
  }

  createChildCategory(parentCategory: CategoryComponent, name: string) {
    const idParent = parentCategory.id;

    return this.httpClient.post<CategoryComponent>(this.host + '/add-child-category', {name, idParent})
      .toPromise<CategoryComponent>().then(
      newCategory => {
        this.addNewChildCategoryToArray([this.categoryStorage], newCategory, idParent);
      }
    );
  }

  createParentCategory(childCategory: CategoryComponent, name: string) {
    const idChild = childCategory.id;

    return this.httpClient.post<CategoryComponent>(this.host + '/add-parent-category', {name, idChild})
      .toPromise<CategoryComponent>().then(
        newCategory => {
          this.addNewParentCategoryToArray(this.categoryStorage.categories, newCategory, idChild);
        }
      );
  }

  renameCategory(category: CategoryComponent, name: string) {
    const id = category.id;

    return this.httpClient.patch(this.host + '/rename-category', {id, name})
      .toPromise().then(
        () => {
          this.renameCategoryInArray(this.categoryStorage.categories, name, id);
        }
      );
  }

  deleteCategory(category: CategoryComponent) {
    const id = String(category.id);

    const params = {id};
    return this.httpClient.delete(this.host + '/delete-category', {params}).toPromise().then(
      () => {
        this.deleteCategoryInArray(this.categoryStorage, category, true);
      }
    );
  }

  createItem(idCategory: bigint, name: string, description: string, reference: string, fileToUpload: File[]) {
    const data = {name, description, idCategory, reference};

    const formData: FormData = new FormData();
    if (fileToUpload) {
      const c = fileToUpload.length;
      for (let i = 0; i < c; i++) {
        formData.append('files', fileToUpload[i], fileToUpload[i].name);
      }
    }
    formData.append('data', JSON.stringify(data));

    return this.httpClient.post<ItemComponent>(this.host + '/add-item', formData)
        .toPromise<ItemComponent>().then(
            newItem => {
              this.addNewItemToArray(this.categoryStorage, newItem, idCategory);
            }
        );
  }

  moveCategory(categoryToMove: CategoryComponent, idCategoryDestination: bigint) {
    const id = categoryToMove.id;
    const idParent = idCategoryDestination;

    return this.httpClient.patch(this.host + '/move-category', {id, idParent})
        .toPromise().then(
        value => {

          this.deleteCategoryInArray(this.categoryStorage, categoryToMove, false);
          this.addNewChildCategoryToArray([this.categoryStorage], categoryToMove, idCategoryDestination);

        }
    );
  }

  getParentCategoryOf(idCategory: bigint): CategoryComponent {
    let parentCategory: CategoryComponent = null;

    const searchParentFrom = (category: CategoryComponent) => {
      if (category.categories != null) {
        const index = category.categories.findIndex(pCategory => {
              return idCategory === pCategory.id;
            }
        );

        if (index !== -1) {
          parentCategory = category;
        } else {
          const c = category.categories.length;
          for (let i = 0; i < c; i++) {
            searchParentFrom(category.categories[i]);
          }
        }
      }

    };
    searchParentFrom(this.categoryStorage);
    return parentCategory;

  }

  renameItem(item: ItemComponent, name: string) {
    const id = item.id;

    return this.httpClient.patch(this.host + '/rename-item', {id, name})
        .toPromise().then(
            () => {
              this.renameItemInArray(this.categoryStorage, name, id);
            }
        );
  }

  moveItem(item: ItemComponent, idCatDest: bigint) {
    const id = item.id;
    const idCategory = idCatDest;

    return this.httpClient.patch(this.host + '/move-item', {id, idCategory})
        .toPromise().then(
            () => {
              this.deleteItemInArray(this.categoryStorage, id);
              this.addNewItemToArray(this.categoryStorage, item, idCategory);

            }
        );
  }

  deleteItem(item: ItemComponent) {
    const id = String(item.id);
    const params = {id};

    return this.httpClient.delete(this.host + '/delete-item', {params})
        .toPromise().then(
            () => {
              this.deleteItemInArray(this.categoryStorage, item.id);
            }
        );
  }

  createSubItem(item: ItemComponent, reference: string, fileToUpload: File[]) {
    const idItem = item.id;
    const data = {reference, idItem };

    const formData: FormData = new FormData();
    if (fileToUpload) {
      const c = fileToUpload.length;
      for (let i = 0; i < c; i++) {
        formData.append('files', fileToUpload[i], fileToUpload[i].name);
      }
    }
    formData.append('data', JSON.stringify(data));

    return this.httpClient.post<SubItemComponent>(this.host + '/add-subitem', formData)
        .toPromise<SubItemComponent>().then(
            newSubItem => {
              this.addNewSubItemToArray(this.categoryStorage, newSubItem, idItem);
            }
        );
  }

  renameSubItem(subItem: SubItemComponent, reference: string) {
    const id = subItem.id;

    return this.httpClient.patch(this.host + '/rename-subitem', {id, reference})
        .toPromise().then(
            () => {
              this.renameSubItemInArray(this.categoryStorage, reference, id);
            }
        );
  }

  deleteSubItem(subItem: SubItemComponent) {
    const id = String(subItem.id);
    const params = {id};

    return this.httpClient.delete(this.host + '/delete-sub-item', {params})
        .toPromise().then(
            () => {
              this.deleteSubItemInArray(this.categoryStorage, subItem.id);
            }
        );
  }

  updateSubItem(subitem: SubItemComponent, reference: string, filesToUpload: File[]) {
    const formData: FormData = new FormData();
    const idSubItem = subitem.id;
    const filesToDelId: string[] = [];
    const filesToDelName: string[] = [];
    const newFileToUpload: File[] = [];

    if (filesToUpload) {
      const cs = subitem.urlImages.length;
      const cf = filesToUpload.length;

      // Add to filesToDel
      for (let i = 0; i < cs; i++) {
        let present = false;
        for (let j = 0; j < cf; j++) {
          if (subitem.urlImages[i].name === filesToUpload[j].name) {
            present = true;
          }
        }
        if (!present) {
          filesToDelId.push(String(subitem.urlImages[i].id));
          filesToDelName.push(subitem.urlImages[i].name);
        }
      }
      // Add to newFileToUpload
      for (let i = 0; i < cf; i++) {
        let present = false;
        for (let j = 0; j < cs; j++) {
          if (filesToUpload[i].name === subitem.urlImages[j].name) {
            present = true;
          }
        }
        if (!present && !filesToDelName.includes(filesToUpload[i].name)) {
          newFileToUpload.push((filesToUpload[i]));
        }
      }

      const c1 = newFileToUpload.length;
      for (let j = 0; j < c1; j++) {
        formData.append('files', newFileToUpload[j], newFileToUpload[j].name);
      }
    }

    const data = { reference, idSubItem, filesToDelId };
    formData.append('data', JSON.stringify(data));

    // return la requete sous forme de promise
    return this.httpClient.patch<SubItemComponent>(this.host + '/edit-subitem', formData)
        .toPromise<SubItemComponent>().then(
            updateSubItem => {
              this.replaceSubItemInArray(this.categoryStorage, updateSubItem);
            }
        );
  }

  createTrackingSheet(subitem: SubItemComponent, comment: string) {
    const idSubItem = subitem.id;

    return this.httpClient.post<SubItemComponent>(this.host + '/add-tracking-sheet', {idSubItem, comment})
        .toPromise<SubItemComponent>().then(
            updateSubitem => {
              this.replaceSubItemInArray(this.categoryStorage, updateSubitem);
            }
        );
  }

  deleteTrackingSheets(trackingSheets: { id: bigint; date: Date; comment: string }[]) {
    const ids: Array<string> = [];
    if ( trackingSheets ) {
      for (const trackingSheet of trackingSheets) {
        ids.push(String(trackingSheet.id));
      }
    }
    const params = {ids};

    return this.httpClient.delete<SubItemComponent>(this.host + '/delete-tracking-sheets', {params})
        .toPromise<SubItemComponent>().then(
            updateSubitem => {
              this.replaceSubItemInArray(this.categoryStorage, updateSubitem);
            }
        );
  }

  deleteTrackingSheetsByIdSubItem(idSubItem: bigint) {
    const params = {idSubItem: String(idSubItem)};

    return this.httpClient.delete<SubItemComponent>(this.host + '/delete-tracking-sheets-by-id-subitem', {params})
        .toPromise<SubItemComponent>().then(
            updateSubitem => {
              this.replaceSubItemInArray(this.categoryStorage, updateSubitem);
            }
        );
  }

  /*
   * Cherche à ajouter newCategory à l'array categories ou bien à une de ses sous catégorie (récurisivité) de façon a ne pas avoir à
   * recharcher tout l'array avec une interaction avec le back et éviter la transmission de donner inutile
   * L'array categories (ou une des sous catégories) doit contenir la catégorie parente de newCategory ayant pour id -> idParent
    */
  private addNewChildCategoryToArray(categories: CategoryComponent[], newCategory: CategoryComponent, idParent: bigint) {

    // Si ajout d'une propriété dans l'inventaire
    if (String(idParent) === 'null') {
      if (categories[0].categories === null) { categories[0].categories = []; }
      categories[0].categories.push(newCategory);
      this.emitCategoryStorage();
    } else {

      // Cherche la categorie parente de la nouvelle categorie crée dans l'array 'categories' passer en paramètre
      // Si la categorie parente est trouvé -> Index = l'index de la catégorie parente dans l'array
      // Sinon -> Index = -1
      const index = categories.findIndex(category => {
        return Number(idParent) === Number(category.id);
      });

      // Si index différent de -1 ->  catégorie parente trouvé -> Ajout de la nouvelle catégorie dans les enfants de la catégorie parente
      // Sinon on chercher la catégorie parente dans les enfants de l'array 'catégories' en paramètre et ainsi de suite de façon récurssive
      if (index !== -1) {
        if (categories[index].categories === null) {
          categories[index].categories = [];
        }
        categories[index].categories.push(newCategory);
        this.emitCategoryStorage();
      } else {
        const c = categories.length;
        for (let i = 0; i < c; i++) {
          // SI la catégorie[i] a des enfants, appliquer cette même méthode de façon récursive
          // pour trouver la catégorie parente et pouvoir insérer la nouvelle catégorie
          if (categories[i].categories !== null && categories[i].categories.length !== 0) {
            this.addNewChildCategoryToArray(categories[i].categories, newCategory, idParent);
          }
        }
      }
    }
  }

  /*
    Cherche à remplacer la catégorie enfant par la nouvelle catégorie dans l'array 'catégories'
    La nouvelle catégorie mise à jour renvoyé par le back contient la catégorie enfant (avec tous ses enfants)
    // Il ne reste donc plus qu'a la remplacer dans l'array en trouvant sa position
   */
  private addNewParentCategoryToArray(categories: CategoryComponent[], newCategory: CategoryComponent, idChild: bigint) {

    // Cherche la categorie enfant de la nouvelle categorie crée dans l'array 'categories' passer en paramètre
    // Si la categorie enant est trouvé -> Index = l'index de la catégorie enfant dans l'array
    // Sinon -> Index = -1
    const index = categories.findIndex(category => {
      return idChild === category.id;
    });

    // Si index différent de -1 -> donc catégorie enfant trouvé -> on la remplace dans l'array
    // Sinon on cherche la catégorie enfant dans les enfants de l'array 'catégories' en paramètre et ainsi de suite de façon récurssive
    if (index !== -1) {
      categories[index] = newCategory;
      this.emitCategoryStorage();

    } else {
      const c = categories.length;
      for (let i = 0; i < c; i++) {
        // SI la catégorie[i] a des enfants, appliquer cette même méthode de façon récursive
        // pour trouver la catégorie enfant et pouvoir la remplacer par la nouvelle catégorie
        if (categories[i].categories !== null && categories[i].categories.length !== 0) {
          this.addNewParentCategoryToArray(categories[i].categories, newCategory, idChild);
        }
      }
    }
  }

  /*
    Renommer la catégorie ayant pour id=idCategory dans l'array passer en paramètre où elle doit bien sur se trouver
   */
  private renameCategoryInArray(categories: CategoryComponent[], name: string, idCategory: bigint) {
    // Cherche la categorie à renommer dans l'array 'categories' passer en paramètre graàce à son id passer aussi en paramètre
    // Si la categorie est trouvé -> Index = l'index de la catégorie dans l'array
    // Sinon -> Index = -1
    const index = categories.findIndex(category => {
      return idCategory === category.id;
    });

    // Si index différent de -1 -> donc catégorie est trouvé -> catégorie renommée
    // Sinon on chercher la catégorie dans les enfants de l'array 'catégories' en paramètre et ainsi de suite de façon récurssive
    if (index !== -1) {
      categories[index].name = name;
      this.emitCategoryStorage();
    } else {
      const c = categories.length;
      for (let i = 0; i < c; i++) {
        // SI la catégorie[i] a des enfants, appliquer cette même méthode de façon récursive
        // pour trouver la catégorie et pouvoir la renommer
        if (categories[i].categories !== null && categories[i].categories.length !== 0) {
          this.renameCategoryInArray(categories[i].categories, name, idCategory);
        }
      }
    }
  }

  /*
    Supprime la catégorie 'category' des sous-catégorie de parentCategory
    Category doit donc être une sous-cat de parentCategory ou d'un de ses enfants (utilisation de la récursivité jusqu'a trouvé catégory)
    Category est ensuite supprimer et ses sous-categories & items sont transférés à sa catégorie parente
   */
  private deleteCategoryInArray(parentCategory: CategoryComponent, category: CategoryComponent, moveChildren: boolean) {
    // Cherche la categorie à supprimer 'category' dans les enfant de la categorie parent passer en paramètre
    // Si la categorie à supprimer est trouvé -> parentCategory est bien le parent de category -> Index = position de catégorie
    // Sinon -> category n'est pas un enfant direct de parentCategory ->  Index = -1
    const index = parentCategory.categories.findIndex(pCategory => {
      return category.id === pCategory.id;
    });

    // Si index différent de -1 -> donc catégorie enfant trouvé -> on peut maintenant supprimer la catégorie de l'array
    // Sinon on chercher la catégorie enfant dans les enfants et chaque enfant de la parentCategory et ainsi de suite de façon récussive
    if (index !== -1) {
      if (parentCategory.categories[index].items === null) { parentCategory.categories[index].items = []; }

      parentCategory.categories.splice(index, 1);

      if ( moveChildren ) {
        // On ajoute les sous-catégories de la categorie supprimer à sa categorie parente
        if (category.categories != null && category.categories.length > 0) {
          const c2 = category.categories.length;
          for (let j = 0; j < c2; j++) {
            parentCategory.categories.push(category.categories[j]);
          }
        }
        // On ajoute les items de la categorie supprimer à sa categorie parente
        if (category.items != null && category.items.length > 0) {
          const c2 = category.items.length;
          for (let j = 0; j < c2; j++) {
            parentCategory.items.push(category.items[j]);
          }
        }
      }
      this.emitCategoryStorage();

    } else {
      const c = parentCategory.categories.length;
      for (let i = 0; i < c; i++) {

        // Recherche de la categorie parent de category de façon récursive dans les enfants de parentCategory
        if (parentCategory.categories[i] !== null) {
          this.deleteCategoryInArray(parentCategory.categories[i], category, moveChildren);
        }
      }
    }
  }

  /*
    Ajoute l'item dans l'array mainCategory passer en paramètre ou dans un de ses enfants
    Cherche la categorie de l'item (idCategory) dans mainCategory de façon récussive jusqu'a la trouvé pour pouvoir y ajouter l'item
   */
  private addNewItemToArray(mainCategory: CategoryComponent, newItem: ItemComponent, idCategory: bigint) {
    // Si idCategory = null -> Ajout d'un item sans catégorie
    // Sinon on recherche la catégorie de l'item pour l'ajouter à sa liste d'item
    if ( String(idCategory) === 'null') {
      if ( mainCategory.items === null ) { mainCategory.items = []; }
      mainCategory.items.push(newItem);
      this.emitCategoryStorage();
    } else {

      const index = mainCategory.categories.findIndex(pCategory => {
        return Number(idCategory) === Number(pCategory.id);
      });

      // Si index différent de -1 -> donc catégorie parent trouvé -> on peut ajouter l'item
      // Sinon on cherche la catégorie parent dans les enfants de l'array 'catégories' en paramètre et ainsi de suite de façon récurssive
      if (index !== -1) {
        if ( mainCategory.categories[index].items === null ) { mainCategory.categories[index].items = []; }
        mainCategory.categories[index].items.push(newItem);
        this.emitCategoryStorage();
      } else {
        const c = mainCategory.categories.length;
        for (let i = 0; i < c; i++) {
          if ( mainCategory.categories[i].categories !== null ) {
            this.addNewItemToArray(mainCategory.categories[i], newItem, idCategory);
          }
        }
      }
    }

  }

  /*
    Renomme par 'name' l'item correspondant à 'idItem' dans les items de la catégorie passer en paramètre.
    Si l'item n'est pas trouvé, il est cherché dans les enfants de 'category' puis dans les enfants de ses enfants
    Et ainsi de suite de façon récurssive, c'est pourquoi l'item doit bien être présent (de façon direct ou non) dans category
   */
  private renameItemInArray(category: CategoryComponent, name: string, idItem: bigint) {
    if (category.items !== null && category.items.length > 0) {
      const index = category.items.findIndex(pItem => {
        return Number(idItem) === Number(pItem.id);
      });
      if (index !== -1) {
        category.items[index].name = name;
        this.emitCategoryStorage();
      } else {
        if (category.categories !== null && category.categories.length > 0) {
          for (const pCategory of category.categories) {
            this.renameItemInArray(pCategory, name, idItem);
          }
        }
      }
    } else {
      if (category.categories !== null && category.categories.length > 0) {
        for (const pCategory of category.categories) {
          this.renameItemInArray(pCategory, name, idItem);
        }
      }
    }
  }

  /*
    Supprime l'item correspondant à 'idItem' dans les items de la catégorie passer en paramètre.
    Si l'item n'est pas trouvé, il est cherché dans les enfants de 'category' puis dans les enfants de ses enfants
    Et ainsi de suite de façon récurssive, c'est pourquoi l'item doit bien être présent (de façon direct ou non) dans category
   */
  private deleteItemInArray(categoryStorage: CategoryComponent, id: bigint) {

    if (categoryStorage.items !== null && categoryStorage.items.length > 0) {
      const index = categoryStorage.items.findIndex(item => {
        return Number(id) === Number(item.id);
      });
      if ( index !== -1 ) {
        categoryStorage.items.splice(index, 1);
        this.emitCategoryStorage();
      } else {
        if (categoryStorage.categories != null && categoryStorage.categories.length > 0) {
          for (const category of categoryStorage.categories) {
            this.deleteItemInArray(category, id);
          }
        }
      }
    } else {
      if (categoryStorage.categories != null && categoryStorage.categories.length > 0) {
        for (const category of categoryStorage.categories) {
          this.deleteItemInArray(category, id);
        }
      }
    }
  }

  private addNewSubItemToArray(category: CategoryComponent, newSubItem: SubItemComponent, idItem: bigint) {

    if (category.items != null && category.items.length > 0) {
      const index = category.items.findIndex(item => {
        return Number(idItem) === Number(item.id);
      });
      if ( index !== -1 ) {
        if (category.items[index].subItems === null) { category.items[index].subItems = []; }
        category.items[index].subItems.push(newSubItem);
        this.emitCategoryStorage();
      } else {
        if (category.categories != null && category.categories.length > 0) {
          for (const pCategory of category.categories) {
            this.addNewSubItemToArray(pCategory, newSubItem, idItem);
          }
        }
      }
    } else {
      if (category.categories != null && category.categories.length > 0) {
        for (const pCategory of category.categories) {
          this.addNewSubItemToArray(pCategory, newSubItem, idItem);
        }
      }
    }
  }

  private renameSubItemInArray(category: CategoryComponent, reference: string, id: bigint) {

    if (category.items != null && category.items.length > 0) {
      const c = category.items.length;

      for (let i = 0; i < c; i++) {
        const index = category.items[i].subItems.findIndex(subItem => {
          return Number(id) === Number(subItem.id);
        });

        if (index !== -1) {
          category.items[i].subItems[index].reference = reference;
          this.emitCategoryStorage();
          break;
        } else {
          if (category.categories !== null && category.categories.length > 0) {
            for (const pCategory of category.categories) {
              this.renameSubItemInArray(pCategory, reference, id);
            }
          }
        }
      }
    } else {
      if (category.categories !== null && category.categories.length > 0) {
        for (const pCategory of category.categories) {
          this.renameSubItemInArray(pCategory, reference, id);
        }
      }
    }
  }

  private deleteSubItemInArray(category: CategoryComponent, id: bigint) {
    if (category.items != null && category.items.length > 0) {
      const c = category.items.length;

      for (let i = 0; i < c; i++) {
        const index = category.items[i].subItems.findIndex(subItem => {
          return Number(id) === Number(subItem.id);
        });

        if (index !== -1) {
          category.items[i].subItems.splice(index, 1);
          this.emitCategoryStorage();
          break;
        } else {
          if (category.categories !== null && category.categories.length > 0) {
            for (const pCategory of category.categories) {
              this.deleteSubItemInArray(pCategory, id);
            }
          }
        }
      }
    } else {
      if (category.categories !== null && category.categories.length > 0) {
        for (const pCategory of category.categories) {
          this.deleteSubItemInArray(pCategory, id);
        }
      }
    }
  }

  private replaceSubItemInArray(category: CategoryComponent, updateSubItem: SubItemComponent) {
    if (category.items != null && category.items.length > 0) {
      const c = category.items.length;

      for (let i = 0; i < c; i++) {
        const index = category.items[i].subItems.findIndex(subItem => {
          return Number(updateSubItem.id) === Number(subItem.id);
        });

        if (index !== -1) {
          category.items[i].subItems[index].id = updateSubItem.id;
          category.items[i].subItems[index].reference = updateSubItem.reference;
          category.items[i].subItems[index].urlImages = updateSubItem.urlImages;
          category.items[i].subItems[index].description = updateSubItem.description;
          category.items[i].subItems[index].trackingSheets = updateSubItem.trackingSheets;
          this.emitCategoryStorage();
          break;
        } else {
          if (category.categories !== null && category.categories.length > 0) {
            for (const pCategory of category.categories) {
              this.replaceSubItemInArray(pCategory, updateSubItem);
            }
          }
        }
      }
    } else {
      if (category.categories !== null && category.categories.length > 0) {
        for (const pCategory of category.categories) {
          this.replaceSubItemInArray(pCategory, updateSubItem);
        }
      }
    }
  }

  /*
    Méthode pour logger tous le contenu d'une catégorie (sous-catégories + items)
    Nécessaire seulement pour le débugage
   */
  private  iterate(categoryComponent: CategoryComponent) {
    const c = categoryComponent.categories.length;
    for (let i = 0; i < c; i++) {
      console.log(categoryComponent.categories[i].name);
      console.log(categoryComponent.categories[i].items);

      if (categoryComponent.categories[i].categories !== null
          && categoryComponent.categories[i].categories.length !== 0) {

        this.iterate(categoryComponent.categories[i]);
      }
    }
  }
}
