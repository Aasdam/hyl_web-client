import {Component, Input, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ItemService} from '../../../item.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ImgOperationService} from '../../../../shared/services/img-operation/img-operation.service';
import {CheckAtomicItemName} from '../../../../shared/form-validators/async/atomic-item-name.async-validator';
import {CheckAtomicSubItemRef} from '../../../../shared/form-validators/async/atomic-subitem-ref.async-validator';
import {CategoryComponent} from '../../category/category.component';
import {CheckMaxSubItem} from '../../../../shared/form-validators/async/check-max-subitem.async-validator';
import {CheckNoWiteSpace} from '../../../../shared/form-validators/sync/no-whitespace.validator';
import {CharacterRepetition} from '../../../../shared/form-validators/sync/character-repetition.validator';

@Component({
  selector: 'app-add-item-modal',
  templateUrl: './add-item-modal.component.html',
  styleUrls: ['./add-item-modal.component.scss'],
  providers: [ImgOperationService]
})
export class AddItemModalComponent implements OnInit {

  @Input() id: bigint;
  @Input() nameTitle: string;
  @Input() formWithCategory = false;

  private createItemForm: FormGroup;
  private disabledButton;

  private maxlengthItemName = '15';
  private maxlengthItemDescription = '50';
  private maxlengthSubItemReference = '15';
  private minlengthItemName = '3';
  private minlengthSubItemReference = '6';

  private filesToUpload: File[] = null;
  private imgPreview: (string|ArrayBuffer)[] = null;
  private formatUnsuppErrFile: File;
  private sizeMaxErrFile: File;

  private filesToUploadSubscription: Subscription;
  private imgPreviewSubscription: Subscription;
  private formatUnsuppErrFileSubscription: Subscription;
  private sizeMaxErrFileSubscription: Subscription;

  private filesSizeMax = this.imgOperationService.filesSizeMax; // 1 mo
  private formatSupportedStr = this.imgOperationService.formatSupportedStr;

  private maxSubItemIsValid = true;

  constructor(private itemService: ItemService,
              private formBuilder: FormBuilder,
              private router: Router,
              private imgOperationService: ImgOperationService) { }

  ngOnInit() {
    this.initSubscriptions();
    this.checkMaxSubItemIsValid();
    this.initCreateItemForm();
  }

  checkMaxSubItemIsValid() {
    CheckMaxSubItem(this.itemService).then(value => {
      this.maxSubItemIsValid = value;
    });
  }

  initCreateItemForm() {
    this.disabledButton = false;
    this.createItemForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(Number(this.minlengthItemName)),
            CheckNoWiteSpace(), CharacterRepetition(3)], [CheckAtomicItemName(this.itemService)]],
      description: [''],
      reference: ['', [Validators.required, Validators.minLength(Number(this.minlengthSubItemReference)),
                      CheckNoWiteSpace(), CharacterRepetition(3)], [CheckAtomicSubItemRef(this.itemService)]],
      files: ['']
    });
    if ( this.formWithCategory ) {
      this.createItemForm.addControl('category', this.formBuilder.control('null', [Validators.required]));
    }
  }

  initSubscriptions() {
    this.initFilesToUploadSubscription();
    this.initImgPreviewSubscription();
    this.initFormatUnsuppErrFileSubscription();
    this.initSizeMaxErrFileSubscription();
  }
  initFilesToUploadSubscription() {
    this.filesToUploadSubscription = this.imgOperationService.filesToUploadSubject.subscribe(
        (files: File[]) => {
          this.filesToUpload = files;
        }
    );
  }
  initImgPreviewSubscription() {
    this.imgPreviewSubscription = this.imgOperationService.imgPreviewSubject.subscribe(
        (imgsExtract: (string|ArrayBuffer)[]) => {
          this.imgPreview = imgsExtract;
        }
    );
  }
  initFormatUnsuppErrFileSubscription() {
    this.formatUnsuppErrFileSubscription = this.imgOperationService.formatUnsuppErrFileSubject.subscribe(
        (file: File) => {
          this.formatUnsuppErrFile = file;
        }
    );
  }
  initSizeMaxErrFileSubscription() {
    this.sizeMaxErrFileSubscription = this.imgOperationService.sizeMaxErrFileSubject.subscribe(
        (file: File) => {
          this.sizeMaxErrFile = file;
        }
    );
  }

  onSubmitCreateItemForm() {
    if (!this.disabledButton) {
      this.disabledButton = true;
      const name: string = this.createItemForm.controls.name.value;
      const description: string = this.createItemForm.controls.description.value;
      const reference: string = this.createItemForm.controls.reference.value;
      let idCategory: bigint;
      if (this.formWithCategory) {
        idCategory = this.createItemForm.controls.category.value;
      } else {
        idCategory = this.id;
      }

      this.itemService.createItem(idCategory, name, description, reference, this.filesToUpload).then(
          value => {
            this.initCreateItemForm();
            this.imgOperationService.reset();
          },
          reason => {
            console.log(reason);
            this.router.navigate(['/erreur']);
          }
      );
    }
  }

  // Appel lorsqu'un fichier ?? ??t?? choisi par gr??ce ?? la balise 'input' de type 'file'
  handleFileInput(files: FileList) {
    this.imgOperationService.handleFileInput(files);
  }

  // M??thode ??tant app??l?? par les balises <img> sur l'??venement 'load'
  onLoadImg(htmlImageElement: HTMLImageElement, imgData: string) {
    this.imgOperationService.onLoadImg(htmlImageElement, imgData);
  }

  // D??clenchement -> Si le modal d'ajout d'exemplaire est ferm?? -> Vidage des images charg??es
  onCancelCreateSubItemForm() {
    this.imgOperationService.onCancelCreateSubItemForm();
  }

  /* D??clenchement -> Lors de l'ouverture du modal -> Lors du d??clanchement de l'??v??nement 'focus'
     Si des images avait ??t?? choisi avant une fermeture du modal (donc pr??sente dans 'this.filesToUpload') ->
      Reconstruction des array 'this.imgPreview' (vider lors de la fermeture initial du modal) et de this.filesToUpload (tjrs pleins)
      Reconstruction de this.filesToUpload :
      Evite un d??cale entre les index de 'this.imgPreview et 'this.filesToUpload' car si l'objet FileReader utilis?? dans la m??tohde
      'addToImgPreview' pour remplir this.imgPreview charge plus une image que la suivante une d??calge sera cr??e
      -> l'objet fonctionne par ??v??nement et avec une boucle For, plusieurs ??v??nements font ??tre cr??e d'un seul coup
     -> Asynchrone donc une image de 25ko chargera plus vite qu'une de 500ko quel que soit sa position -> D??calage entre les deux arrays
   */
  checkIfModalCreateSubItemAlreadyUsed() {
    this.imgOperationService.checkIfServiceHaveAlreadyUsed();
  }

  // Renvoi la taille (en octect) de l'array contenant les fichiers (images) 'this.filesToUpload'
  getFilesSize(): number {
    return this.imgOperationService.getFilesSize();
  }
  // Renvoi la liste de toutes les sous-categories (de fa??on r??cursives) de 'null' (donc itemService prendra l'inventaire) sans hierarchie
  getFullCategoriesInOneArray(): CategoryComponent[] {
    return this.itemService.getFullCategoriesInOneArray(null);
  }
}
