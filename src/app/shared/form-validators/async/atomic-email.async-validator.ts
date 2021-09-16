import {AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn} from '@angular/forms';
import {AuthService} from '../../../auth/auth.service';
import {Injectable} from '@angular/core';
import {error, isBoolean} from 'util';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

export function CheckAtomicEmail(authService: AuthService, exception?: string): AsyncValidatorFn {
  return (emailControl: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> | null => {

    if ( emailControl && emailControl.value && emailControl.value.length > 9  && (!exception || exception === '' || exception !== emailControl.value)) {
      return authService.checkEmail(emailControl.value).pipe(
        map(
          next => {
            if ( isBoolean(Boolean(next)) ) {
              if ( Boolean(next) ) {
                return {checkatomicemail: true};
              } else {
                return null;
              }
            }
          }
      )
    ).toPromise().catch(reason => {
        return {failatomicemail: true};
      });
    } else {
        return new Promise((resolve) => {
            resolve(null);
        });
    }
  };
}
