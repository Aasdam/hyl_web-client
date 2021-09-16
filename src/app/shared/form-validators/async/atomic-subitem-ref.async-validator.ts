import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {isBoolean} from 'util';
import {ItemService} from '../../../item/item.service';

export function CheckAtomicSubItemRef(itemService: ItemService, exception?: string): AsyncValidatorFn {
    return (refControl: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> | null => {

        if ( refControl && refControl.value && refControl.value.length > 5 && (!exception || exception !== refControl.value)) {
            return itemService.checkSubItemRef(refControl.value).pipe(
                map(
                    next => {
                        if ( isBoolean(Boolean(next)) ) {
                            if ( Boolean(next) ) {
                                return {checkatomicref: true};
                            } else {
                                return null;
                            }
                        }
                    }
                )
            ).toPromise().catch(reason => {
                return {failatomicref: true};
            });
        } else {
            return new Promise((resolve) => {
                resolve(null);
            });
        }
    };
}
