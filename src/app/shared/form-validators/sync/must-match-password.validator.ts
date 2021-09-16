import {AbstractControl, FormGroup, ValidatorFn} from '@angular/forms';

export function MustMatchPassword() {
  return (anchorControl: AbstractControl) => {

    if (anchorControl) {
      const password = anchorControl.parent ? anchorControl.parent.get('password') : null;
      const password2 = anchorControl.parent ? anchorControl.parent.get('password2') : null;

      if (anchorControl.value || (password && password2)) {
        if (password.value !== password2.value) {
          if (anchorControl === password) {
            if (password2.errors === null) {
              password2.setErrors({mustmatchpassword: true});
              return null;
            }
          } else if (anchorControl === password2) {
            return {mustmatchpassword: true};
          }
        } else {
          if (anchorControl === password) {
            password2.setErrors(null);
            return null;

          } else if (anchorControl === password2) {
            return null;
          }
        }
      }
    }
    return null;
  };
}
