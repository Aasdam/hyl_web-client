import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {isBoolean} from 'util';
import {ItemService} from '../../../item/item.service';

export function CheckAtomicCategoryName(itemService: ItemService): AsyncValidatorFn {
    return (nameControl: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> | null => {

        if ( nameControl && nameControl.value && nameControl.value.length > 2 ) {
            return itemService.checkCategoryName(nameControl.value).pipe(
                map(
                    next => {
                        if ( isBoolean(Boolean(next)) ) {
                            if ( Boolean(next) ) {
                                return {checkatomiccategoryname: true};
                            } else {
                                return null;
                            }
                        }
                    }
                )
            ).toPromise().catch(reason => {
                return {failatomiccategoryname: true};
            });
        } else {
            return new Promise((resolve) => {
                resolve(null);
            });
        }
    };
}
