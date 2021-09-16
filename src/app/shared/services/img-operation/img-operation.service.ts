import {Injectable} from '@angular/core';
import {CheckFilesUploadFormat} from '../../form-validators/sync/file-upload-format.validator';
import {CheckFilesUploadSize} from '../../form-validators/sync/file-upload-size.validator';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImgOperationService {

  private path = environment.gatewayUrl + environment.itemUrl + '/';

  private filesToUpload: File[] = null;
  private imgPreview: (string|ArrayBuffer)[] = null;
  private formatUnsuppErrFile: File;
  private sizeMaxErrFile: File;
  filesToUploadSubject = new Subject<File[]>();
  imgPreviewSubject = new Subject<(string|ArrayBuffer)[]>();
  formatUnsuppErrFileSubject = new Subject<File>();
  sizeMaxErrFileSubject = new Subject<File>();

  filesSizeMax = environment.subitemImgSizeMax;
  formatSupportedStr = 'jpg, jpeg, png';
  private formatSupported = [
    {format: 'jpg', mime: 'image/jpeg'},
    {format: 'jpeg', mime: 'image/jpeg'},
    {format: 'png', mime: 'image/png'}
  ];

  constructor(private httpClient: HttpClient) { }

  emitImageServiceSubjects() {
    if ( this.filesToUpload ) { this.filesToUploadSubject.next(this.filesToUpload.slice()); }
    if ( this.imgPreview ) { this.imgPreviewSubject.next(this.imgPreview.slice()); }
  }

  emitFormatUnsuppErrFileSubject() {
    this.formatUnsuppErrFileSubject.next([this.formatUnsuppErrFile].slice()[0]);
  }

  emitSizeMaxErrFileSubject() {
    this.sizeMaxErrFileSubject.next([this.sizeMaxErrFile].slice()[0]);
  }

  // Appel lorsqu'un fichier à été choisi par grâce à la balise 'input' de type 'file'
  handleFileInput(files: (FileList)) {
    if (this.filesToUpload === null) { this.filesToUpload = []; }
    this.formatUnsuppErrFile = null;
    this.sizeMaxErrFile = null;

    const c = files.length;
    for (let i = 0; i < c; i++) {
      // Erreur -> Format non pris en charge
      // -> Ajout du fichier erreur à la variable 'this.formatUnsuppErrFile' pour afficher l'erreur dans la vue html
      if ( CheckFilesUploadFormat(files[i], this.formatSupported) !== null ) {
        this.formatUnsuppErrFile = files[i];

        // Erreur -> Taille max dépassé
        // -> Ajout du fichier erreur à la variable 'this.sizeMaxErrFile' pour afficher l'erreur dans la vue html
      } else if ( CheckFilesUploadSize(this.filesToUpload, files[i], this.filesSizeMax) !== null ) {
        this.sizeMaxErrFile = files[i];
        break;
        // Aucune erreur -> Ajout du fichier à l'array des 'fichiers à upload' et utilisation de la méthode
        // 'addToImgPreview' pour convertir le fichier et l'ajouter à l'array des 'images à prévisualiser'
      } else {
        this.filesToUpload.push(files[i]);
        this.addToImgPreview(files[i]);
        this.emitImageServiceSubjects();
      }
    }
    this.emitFormatUnsuppErrFileSubject();
    this.emitSizeMaxErrFileSubject();
  }

  /*  Converti le fichier passé en paramètre et l'ajoute sous format String à l'array des images à prévisualiser 'imgPreview'
      Les données extraite permette la prévisualisation de l'image dans le paramètre 'src' d'une balsie 'img'
   */
  addToImgPreview(file: File, rebuildFilesToUpload: boolean = false) {
    if (this.imgPreview === null) { this.imgPreview = []; }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener('load', (event => {
      this.imgPreview.push(fileReader.result);
      if (rebuildFilesToUpload) { this.filesToUpload.push(file); }
      this.emitImageServiceSubjects();
    }));
  }

  // Méthode étant appélé par les balises <img> sur l'évenement 'load'
  onLoadImg(htmlImageElement: HTMLImageElement, imgData: string) {
    this.setMaxSizeOfImage(htmlImageElement, 220, 200);
    this.removeDisplayNone(htmlImageElement);
    this.addClosingIconOnImage(htmlImageElement, imgData);
  }

  /* Défini les propriété de longueur et de largeur de l'image passé en paramètre, cette image possède la classe 'm-auto' qui attribut des
    marges automatiquement. Donc en ne définissant qu'un seul coté (height ou width), l'autre sera automatiquement défini.
    --> Cela permet, quel que soit l'orientation de l'image (portrait ou paysage) qu'elle soit toujours  contenu dans un carré
    qui ici a pour dimension 220x220 et sans être déformé -> Sorte de miniature.
   */
  setMaxSizeOfImage(htmlImageElement: HTMLImageElement, height: number, width: number) {
    if ( htmlImageElement.naturalHeight >= htmlImageElement.naturalWidth ) {
      htmlImageElement.height = height;
    } else {
      htmlImageElement.width = width;
    }
  }

  // Permet d'afficher l'image (Image caché -> Evite qu'elle soit brièvement affiché en taille réelle lors de son chargement)
  // Une fois chargé et que la taille a été défini (this.setMaxSizeOfImage), l'image peut être affiché
  removeDisplayNone(htmlImageElement: HTMLImageElement) {
    const classStr = htmlImageElement.className;
    const classToRemove = 'd-none';
    if ( classStr.includes( classToRemove ) ) {
      htmlImageElement.className = classStr.replace(classToRemove, '');
    }
  }

  // Ajoute une croix rouge en haut à droite de l'image en paramètre et ajoute à cette croix l'èvement permettant de supprimer l'image
  addClosingIconOnImage(htmlImageElement: HTMLImageElement, imgData: string) {
    const a = document.createElement('a');
    const i = document.createElement('i');
    a.className = 'position-relative text-decoration-none';
    i.className = 'position-absolute text-danger fas fa-window-close';
    i.style.right = '1px';
    i.style.fontSize = '20px';
    a.appendChild(i);

    a.addEventListener('click', () => {
      this.removeFileToUpload(imgData);
    });

    htmlImageElement.parentElement.insertBefore(a, htmlImageElement.nextElementSibling);
  }

  // Supprime l'image en paramètre de l'array 'imgPreview' et de l'array 'filesToUpload'
  removeFileToUpload(img: string | ArrayBuffer) {
    this.formatUnsuppErrFile = null;
    this.sizeMaxErrFile = null;
    this.emitFormatUnsuppErrFileSubject();
    this.emitSizeMaxErrFileSubject();

    const index = this.imgPreview.findIndex(value => {
      return img === value;
    });

    if (index !== -1) {
      if (this.imgPreview) { this.imgPreview.splice(index, 1); }
      if ( this.filesToUpload) { this.filesToUpload.splice(index, 1); }
      this.emitImageServiceSubjects();
    }
    // Désactive le lien <a> (la croix rouge)
  //  return false;
  }

  // Déclenchement -> Si le modal d'ajout d'exemplaire est fermé -> Vidage des images chargées
  onCancelCreateSubItemForm() {
    this.imgPreview = [];
    this.formatUnsuppErrFile = null;
    this.sizeMaxErrFile = null;
    this.emitImageServiceSubjects();
    this.emitFormatUnsuppErrFileSubject();
    this.emitSizeMaxErrFileSubject();
  }

  /* Déclenchement -> Lors de l'ouverture du modal -> Lors du déclanchement de l'évènement 'focus'
     Si des images avait été choisi avant une fermeture du modal (donc présente dans 'this.filesToUpload') ->
      Reconstruction des array 'this.imgPreview' (vider lors de la fermeture initial du modal) et de this.filesToUpload (tjrs pleins)
      Reconstruction de this.filesToUpload :
      Evite un décale entre les index de 'this.imgPreview et 'this.filesToUpload' car si l'objet FileReader utilisé dans la métohde
      'addToImgPreview' pour remplir this.imgPreview charge plus une image que la suivante une décalge sera crée
      -> l'objet fonctionne par évènement et avec une boucle For, plusieurs évènements font être crée d'un seul coup
     -> Asynchrone donc une image de 25ko chargera plus vite qu'une de 500ko quel que soit sa position -> Décalage entre les deux arrays
   */
  checkIfServiceHaveAlreadyUsed() {
    if (this.filesToUpload !== null && this.filesToUpload.length > 0 && this.imgPreview.length === 0) {
      const c = this.filesToUpload.length;
      const filesToUpload = this.filesToUpload;
      this.filesToUpload = [];

      for (let i = 0; i < c; i++) {
        this.addToImgPreview(filesToUpload[i], true);
      }
      this.emitImageServiceSubjects();
    }
  }

  // Renvoi la taille (en octect) de l'array contenant les fichiers (images) 'this.filesToUpload'
  getFilesSize(): number {
    let size = 0;
    if (this.filesToUpload && this.filesToUpload.length > 0) {
      for (const file of this.filesToUpload) {
        size += file.size;
      }
    }
    return size;
  }

  // Remet tout à zéro
  reset() {
    this.filesToUpload = [];
     // Reset le reset
    this.onCancelCreateSubItemForm();
  }

  loadFilesFromUrl(urlImages: {url: string, name: string}[]) {
    if (this.imgPreview === null) { this.imgPreview = []; }
    for (const url of urlImages) {
      // @ts-ignore
      this.httpClient.get<Blob>(this.path + url.url, {responseType: 'blob'}).toPromise().then(
          value => {
            value.lastModifiedDate = new Date();
            value.name = url.name;

            if ( !this.filesToUpload ) { this.filesToUpload = []; }
            if ( !this.imgPreview ) { this.imgPreview = []; }

            this.filesToUpload.push( value as File);
            this.addToImgPreview(value as File);
            this.emitImageServiceSubjects();
          },
          reason => {
            console.log(reason);
          }
      );
    }
  }
}
