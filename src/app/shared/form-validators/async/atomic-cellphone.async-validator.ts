import {AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn} from '@angular/forms';
import {AuthService} from '../../../auth/auth.service';
import {Injectable} from '@angular/core';
import {error, isBoolean} from 'util';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

export function CheckAtomicCellphone(authService: AuthService, exception?: string): AsyncValidatorFn {
  return (cellphoneControl: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> | null => {

    if ( cellphoneControl && cellphoneControl.value && cellphoneControl.value.length === 10  && (!exception || exception === '' || exception !== cellphoneControl.value)) {
      return authService.checkCellphone(cellphoneControl.value).pipe(
        map(
          next => {
            if ( isBoolean(Boolean(next)) ) {
              if ( Boolean(next) ) {
                return {checkatomiccellphone: true};
              } else {
                return null;
              }
            }
          }
      )
    ).toPromise().catch(reason => {
        console.log(reason);
        return {failatomiccellphone: true};
      });
    } else {
        return new Promise((resolve) => {
            resolve(null);
        });
    }
  };
}
