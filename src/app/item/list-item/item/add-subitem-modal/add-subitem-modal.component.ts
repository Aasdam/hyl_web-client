import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CheckAtomicSubItemRef} from '../../../../shared/form-validators/async/atomic-subitem-ref.async-validator';
import {Subscription} from 'rxjs';
import {ItemService} from '../../../item.service';
import {ImgOperationService} from '../../../../shared/services/img-operation/img-operation.service';
import {Router} from '@angular/router';
import {ItemComponent} from '../item.component';
import {SubItemComponent} from '../sub-item/sub-item.component';
import {CheckMaxSubItem} from '../../../../shared/form-validators/async/check-max-subitem.async-validator';
import {CheckNoWiteSpace} from '../../../../shared/form-validators/sync/no-whitespace.validator';
import {CharacterRepetition} from '../../../../shared/form-validators/sync/character-repetition.validator';

@Component({
  selector: 'app-add-subitem-modal',
  templateUrl: './add-subitem-modal.component.html',
  styleUrls: ['./add-subitem-modal.component.scss'],
  providers: [ImgOperationService]
})
export class AddSubitemModalComponent implements OnInit {

  @Input() object: ItemComponent | SubItemComponent;
  private firstLoadEditSubItem = true;
  private disabledButton;

  private createSubItemForm: FormGroup;
  private maxlengthSubItemReference = '15';
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
              private imgOperationService: ImgOperationService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.checkClass();
    this.initSubscriptions();
    this.checkMaxSubItemIsValid();
    this.initCreateSubItemForm();
  }

  checkClass() {
    if ( !(this.object instanceof ItemComponent) && !(this.object instanceof SubItemComponent) ) {
      this.router.navigate(['/erreur']);
    }
  }

  checkMaxSubItemIsValid() {
    CheckMaxSubItem(this.itemService).then(value => {
      this.maxSubItemIsValid = value;
    });
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

  initCreateSubItemForm() {
    this.disabledButton = false;
    const validators = [Validators.required, Validators.minLength(Number(this.minlengthSubItemReference)),
                        CheckNoWiteSpace(), CharacterRepetition(3)];
    const asyncValidators = [];
    if (this.object instanceof ItemComponent) {
      asyncValidators.push(CheckAtomicSubItemRef(this.itemService));
      this.createSubItemForm = this.formBuilder.group({
        reference: ['', validators, asyncValidators],
        checkbox: [false, [Validators.pattern('true')]],
        files: ['']
      });
    } else if (this.object instanceof SubItemComponent) {
      asyncValidators.push(CheckAtomicSubItemRef(this.itemService, this.object.reference));
      this.createSubItemForm = this.formBuilder.group({
        reference: [this.object.reference, validators, asyncValidators],
        checkbox: [false, [Validators.pattern('true')]],
        files: ['']
      });
    }
  }

  onSubmitCreateSubItemForm() {
    if (!this.disabledButton) {
      this.disabledButton = true;
      const reference = this.createSubItemForm.controls.reference.value;
      if (this.object instanceof ItemComponent) {
        this.itemService.createSubItem(this.object, reference, this.filesToUpload).then(
            value => {
              this.initCreateSubItemForm();
              this.imgOperationService.reset();
            },
            reason => {
              console.log(reason);
              this.router.navigate(['/erreur']);
            }
        );
      } else if (this.object instanceof SubItemComponent) {
        this.itemService.updateSubItem(this.object, reference, this.filesToUpload).then(
            value => {
              this.imgOperationService.reset();
              if (this.object instanceof SubItemComponent) { this.object.reference = reference; }
              this.initCreateSubItemForm();
              this.firstLoadEditSubItem = true;
            },
            reason => {
              console.log(reason);
              this.router.navigate(['/erreur']);
            }
        );
      }
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
    if ( this.firstLoadEditSubItem && this.object instanceof SubItemComponent ) {
      this.loadFilesFromUrl(this.object);
    } else {
      this.imgOperationService.checkIfServiceHaveAlreadyUsed();
    }
  }

  // Renvoi la taille (en octect) de l'array contenant les fichiers (images) 'this.filesToUpload'
  getFilesSize(): number {
    return this.imgOperationService.getFilesSize();
  }

  loadFilesFromUrl(subitem: SubItemComponent) {
      this.imgOperationService.loadFilesFromUrl(subitem.urlImages);
      this.firstLoadEditSubItem = false;

  }
}
