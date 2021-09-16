import {AbstractControl, FormGroup, ValidatorFn} from '@angular/forms';

export function CharacterRepetition(nbrAuthorized: number) {
  return (control: AbstractControl) => {
    if (control && control.value && control.value.length > 2 && nbrAuthorized > 2 && control.value.length >= nbrAuthorized) {
      const value = String(control.value).toLowerCase();

      // On passe de caractère en caractère
      const c = value.length;
      for (let i = 0; i < c; i++) {

        // Condition pour éviter les erreurs et éviter d'itéré sur une valeur non existante
        if ( c >= i + nbrAuthorized ) {

          // On récupère un chaine contenant le nombre de caractère autorisé à partir de la position i
          const extraction = value.substring(i, i + nbrAuthorized);

          // On test l'extraction pour savoir si tous les caractère la composant sont identiques au 1er
          // Si c'est différent
          let same = true;
          for (let j = 1; j < nbrAuthorized; j++) {
            if (extraction[0] !== extraction[j]) {
              same = false;
              break;
            }
          }
          if ( same ) { return {characterrepetition: true}; }
        }
      }
    }
    return null;
  };
}
