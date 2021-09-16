import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {isBoolean} from 'util';
import {ItemService} from '../../../item/item.service';

export function CheckAtomicItemName(itemService: ItemService): AsyncValidatorFn {
    return (nameControl: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> | null => {

        if ( nameControl && nameControl.value && nameControl.value.length > 2 ) {
            return itemService.checkItemName(nameControl.value).pipe(
                map(
                    next => {
                        if ( isBoolean(Boolean(next)) ) {
                            if ( Boolean(next) ) {
                                return {checkatomicitemname: true};
                            } else {
                                return null;
                            }
                        }
                    }
                )
            ).toPromise().catch(reason => {
                return {failatomicitemname: true};
            });
        } else {
            return new Promise((resolve) => {
                resolve(null);
            });
        }
    };
}
