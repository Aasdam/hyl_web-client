import {AbstractControl, FormGroup, ValidatorFn} from '@angular/forms';

export function CheckCellPhoneControle() {
  return (cellphoneControl: AbstractControl) => {
    if (cellphoneControl && cellphoneControl.value && cellphoneControl.value.length > 0) {
      if (cellphoneControl.value.length === 1 && cellphoneControl.value[0] !== '0') {
        return {localFormat: true};
      }
      if (cellphoneControl.value.length >= 2 && ( String(cellphoneControl.value[0] + cellphoneControl.value[1]) !== '06'
                                                        && String(cellphoneControl.value[0] + cellphoneControl.value[1]) !== '07' ) ) {
        return {localFormat: true};
      }
      if ( cellphoneControl.value.length < 10 || isNaN(Number(cellphoneControl.value)) || cellphoneControl.value.includes(' ') ) {
        return {numberFormat: true};
      }
    }
    return null;
  };
}
