export function CheckFilesUploadFormat(file: File, array: Array<{format: string, mime: string}>) {
    if (file && array && array.length > 0) {
        let formatSupported = false;
        for (const object of array) {
            if ( file.name.endsWith(object.format) && file.type === object.mime ) {
                formatSupported = true;
                break;
            }
        }
        if ( !formatSupported ) { return {unsupportedformat : true}; } else  { return null; }
    } else { return null; }

}
