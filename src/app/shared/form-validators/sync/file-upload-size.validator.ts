import {AbstractControl} from '@angular/forms';

export function CheckFilesUploadSize(filesAlreadyInArray: Array<File>, newFile: File, sizeMax: number) {
    if (newFile && sizeMax) {
        let sizeOfArray = 0;
        if (filesAlreadyInArray != null && filesAlreadyInArray.length > 0) {
            for (const file of filesAlreadyInArray) {
                sizeOfArray += file.size;
            }
        }
        if ( (newFile.size + sizeOfArray) > sizeMax ) { return {sizeexceeded : true}; } else { return null; }
    } else { return null; }

}
