import {map} from 'rxjs/operators';
import {isBoolean} from 'util';
import {ItemService} from '../../../item/item.service';

export function CheckMaxSubItem(itemService: ItemService) {
        return itemService.checkMaxSubItem().pipe(
            map(
                next => {
                    if ( isBoolean(Boolean(next)) ) {
                        return !Boolean(next);
                    } else {
                        return false;
                    }
                }
            )
        ).toPromise().catch(reason => {
            return false;
        });
    }
