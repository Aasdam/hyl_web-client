import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {isBoolean} from 'util';
import {ItemService} from '../../../item/item.service';

export function CheckCategoryDepth(itemService: ItemService, idCategory: bigint, type: string): AsyncValidatorFn {
    return (field: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> | null => {

        if ( field && field.value) {
            if (field.value === 'C') {
                type = 'ADD_CHILD';
            } else if (field.value === 'P') {
                type = 'ADD_PARENT';
            }

            if (type === 'MOVE') {
                console.log('MOVE');
                return itemService.checkCategoryDepth(field.value, idCategory, type).pipe(
                    map(
                        next => {
                            if (isBoolean(Boolean(next))) {
                                if (Boolean(next)) {
                                    return {checkcategorydepth: true};
                                } else {
                                    return null;
                                }
                            }
                        }
                    )
                ).toPromise().catch(reason => {
                    return {failcategorydepth: true};
                });
            } else if (type === 'ADD_CHILD' || type === 'ADD_PARENT') {
                return itemService.checkCategoryDepth(idCategory, null, type).pipe(
                    map(
                        next => {
                            if (isBoolean(Boolean(next))) {
                                if (Boolean(next)) {
                                    return {checkcategorydepth: true};
                                } else {
                                    return null;
                                }
                            }
                        }
                    )
                ).toPromise().catch(reason => {
                    return {failcategorydepth: true};
                });
            } else {
                return new Promise((resolve) => {
                    resolve(null);
                });
            }
        } else {
            return new Promise((resolve) => {
                resolve(null);
            });
        }
    };
}
