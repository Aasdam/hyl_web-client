import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {isBoolean} from 'util';
import {ItemService} from '../../../item/item.service';
import {LoanService} from '../../../loan/loan.service';

export function CheckSubItemAvailable(loanService: LoanService): AsyncValidatorFn {
    return (refControl: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> | null => {

        if ( refControl && refControl.value) {
            return loanService.checkSubItemAvailable(refControl.value).pipe(
                map(
                    next => {
                        if ( isBoolean(Boolean(next)) ) {
                            if ( Boolean(next) ) {
                                return {checksubitemavailable: true};
                            } else {
                                return null;
                            }
                        }
                    }
                )
            ).toPromise().catch(reason => {
                return {failsubitemavailable: true};
            });
        } else {
            return new Promise((resolve) => {
                resolve(null);
            });
        }
    };
}
