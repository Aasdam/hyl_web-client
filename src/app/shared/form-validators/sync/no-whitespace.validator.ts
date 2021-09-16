import {AbstractControl, FormControl} from '@angular/forms';

export function CheckNoWiteSpace() {
  return (control: AbstractControl) => {
    if (control && control.value) {
      if (control.value.length !== control.value.trimLeft().length) { return {leftwhitespace: true}; }
      if (control.value.length !== control.value.trimRight().length) { return {rightwhitespace: true}; }

      const c = control.value.length;
      for (let i = 0; i < c; i++) {
        if ( i + 1 <= c ) {
          if (control.value.toString().substring(i, i + 1) === ' ' && control.value.substring(i + 1, i + 2) === ' ') {
            return {witespacerepetition: true};
          }
        }
      }
    }
    return null;
  };
}
