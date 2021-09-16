import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MemoService} from '../memo.service';
import {Router} from '@angular/router';
import {CheckNoWiteSpace} from '../../shared/form-validators/sync/no-whitespace.validator';
import {CharacterRepetition} from '../../shared/form-validators/sync/character-repetition.validator';
import {MemoModel} from '../model/memo.model';

@Component({
  selector: 'app-add-memo-modal',
  templateUrl: './add-memo-modal.component.html',
  styleUrls: ['./add-memo-modal.component.scss']
})
export class AddMemoModalComponent implements OnInit {

  @Input() whoMemoUpdate: MemoModel;
  id: number | bigint;

  private memoForm: FormGroup;
  private disabledButton: boolean;
  private minlengthContent = '15';
  private minlengthTitle = '5';
  private maxlengthContent = '250';
  private maxlengthTitle = '35';
  private maxReminderByDate = 5;
  private radioDefaultValue = 'reminderLess';
  private radioReminderByDateValue = 'reminderDate';
  private radioReminderByDayValue = 'reminderDay';
  private minDate = Date.now() + (1000 * 60 * 60 * 24);


  constructor(private formBuilder: FormBuilder,
              private memoService: MemoService,
              private router: Router) { }

  ngOnInit() {
    this.initMemoForm();
  }

  private initMemoForm() {
    this.disabledButton = false;
    this.memoForm = this.formBuilder.group({
      title: [this.whoMemoUpdate ? this.whoMemoUpdate.title : '', [Validators.required, CheckNoWiteSpace(),
        Validators.minLength(Number(this.minlengthTitle)), CharacterRepetition(4)]],
      content: [this.whoMemoUpdate ? this.whoMemoUpdate.content : '', [Validators.required, CheckNoWiteSpace(),
        Validators.minLength(Number(this.minlengthContent)), CharacterRepetition(4)]],
      radio: [this.whoMemoUpdate && this.whoMemoUpdate.reminderByDate && this.whoMemoUpdate.reminderByDate.length > 0
                ? this.radioReminderByDateValue : this.whoMemoUpdate && this.whoMemoUpdate.reminderByDay ? this.radioReminderByDayValue
                  : this.radioDefaultValue],
      nbrRemindersByDate: [this.whoMemoUpdate && this.whoMemoUpdate.reminderByDate && this.whoMemoUpdate.reminderByDate.length > 0
                            ? this.whoMemoUpdate.reminderByDate.length : ''],
      remindersByDate: this.formBuilder.array(this.whoMemoUpdate && this.whoMemoUpdate.reminderByDate
                && this.whoMemoUpdate.reminderByDate.length > 0 ? this.getReminderByDateInStrDate(this.whoMemoUpdate.reminderByDate) : []),
      remindersByDay: this.formBuilder.group({
        monday: [this.whoMemoUpdate && this.whoMemoUpdate.reminderByDay ? this.whoMemoUpdate.reminderByDay.monday : false],
        tuesday: [this.whoMemoUpdate && this.whoMemoUpdate.reminderByDay ? this.whoMemoUpdate.reminderByDay.tuesday : false],
        wednesday: [this.whoMemoUpdate && this.whoMemoUpdate.reminderByDay ? this.whoMemoUpdate.reminderByDay.wednesday : false],
        thursday: [this.whoMemoUpdate && this.whoMemoUpdate.reminderByDay ? this.whoMemoUpdate.reminderByDay.thursday : false],
        friday: [this.whoMemoUpdate && this.whoMemoUpdate.reminderByDay ? this.whoMemoUpdate.reminderByDay.friday : false],
        saturday: [this.whoMemoUpdate && this.whoMemoUpdate.reminderByDay ? this.whoMemoUpdate.reminderByDay.saturday : false],
        sunday: [this.whoMemoUpdate && this.whoMemoUpdate.reminderByDay ? this.whoMemoUpdate.reminderByDay.sunday : false]
      }),
    });
    if (this.whoMemoUpdate) {
      this.memoForm.addControl('checkbox', new FormControl(false, Validators.pattern('true')));
    }
  }

  onSubmitMemoForm() {
    if (!this.disabledButton) {
      this.disabledButton = true;
      const memo = new MemoModel(null, new Date(), this.memoForm.controls.title.value,
          this.memoForm.controls.content.value, null, null);

      if (this.memoForm.controls.radio.value === this.radioReminderByDateValue) {
        memo.reminderByDate = this.doSubmitWithReminderByDate();
      } else if (this.memoForm.controls.radio.value === this.radioReminderByDayValue) {
        memo.reminderByDay = this.doSubmitWithReminderByDay();
      }

      if (this.whoMemoUpdate) {
        this.doUpdateMemo(memo);
      } else {
        this.doCreateMemo(memo);
      }
    }
  }

  private doSubmitWithReminderByDate() {
    this.doDeleteEmptyRemindersByDay();
    this.doDeleteIdenticalRemindersByDay();

    if (this.getRemindersByDate().length > 0) {
      const reminderByDate = [];
      for (let i = 0; i < this.getRemindersByDate().length; i++) {
        reminderByDate.push({
          id: null,
          reminderDate: this.getRemindersByDate().get('' + i).value
        });
      }
      return reminderByDate as [{id: bigint | number, reminderDate: Date}];
    } else {
      return null;
    }
  }
  private doDeleteEmptyRemindersByDay() {
    if (this.getRemindersByDate().controls && this.getRemindersByDate().controls.length > 1) {
      const valueToDel = [];
      this.getRemindersByDate().controls.forEach((dateControl, index) => {
        if (!dateControl.value) {
          valueToDel.push(index);
        }
      });
      valueToDel.reverse();
      valueToDel.forEach(index => {
        this.getRemindersByDate().removeAt(index);
      });
    }
  }
  private doDeleteIdenticalRemindersByDay() {

    if (this.getRemindersByDate().controls && this.getRemindersByDate().controls.length > 1) {
      this.getRemindersByDate().controls.sort((a, b) => {
        return a.value < b.value ? -1 : a.value > b.value ? 1 : 0;
      });
    }

    const valueToDel = [];
    valueToDel.splice(0, valueToDel.length);
    for (let i = 0; i < this.getRemindersByDate().controls.length; i++ ) {
      for (let j = i + 1; j < this.getRemindersByDate().controls.length; j++) {
        if (this.getRemindersByDate().get('' + i).value === this.getRemindersByDate().get('' + j).value) {
          valueToDel.push(j);
          i++;
        }
      }
    }
    valueToDel.reverse();
    valueToDel.forEach(index => {
      this.getRemindersByDate().removeAt(index);
    });
  }

  private doSubmitWithReminderByDay() {

    if (this.getRemindersByDay().controls.monday.value  || this.getRemindersByDay().controls.tuesday.value
        || this.getRemindersByDay().controls.wednesday.value || this.getRemindersByDay().controls.thursday.value
        || this.getRemindersByDay().controls.friday.value || this.getRemindersByDay().controls.saturday.value
        || this.getRemindersByDay().controls.sunday.value) {

      return {
        id: null,
        monday: this.getRemindersByDay().controls.monday.value,
        tuesday: this.getRemindersByDay().controls.tuesday.value,
        wednesday: this.getRemindersByDay().controls.wednesday.value,
        thursday: this.getRemindersByDay().controls.thursday.value,
        friday: this.getRemindersByDay().controls.friday.value,
        saturday: this.getRemindersByDay().controls.saturday.value,
        sunday: this.getRemindersByDay().controls.sunday.value,
      };

    } else {
      return null;
    }
  }

  private doCreateMemo(memo: MemoModel) {
    this.memoService.createMemo(memo).then(
        () => {
          this.initMemoForm();
        },
        reason => {
          console.log(reason);
          this.router.navigate(['/erreur']);
        }
    );
  }

  private doUpdateMemo(memo: MemoModel) {
    memo.id = this.whoMemoUpdate.id;
    this.memoService.updateMemo(memo).then(
        memoReturn => {
          this.whoMemoUpdate = memoReturn;
          this.initMemoForm();
        },
        reason => {
          console.log(reason);
          this.router.navigate(['/erreur']);
        }
    );
  }

  onAdjustReminderByDate() {
    let nbrRemindersByDatePresent = this.getRemindersByDate().controls.length;
    const nbrRemindersByDateWanted = this.memoForm.controls.nbrRemindersByDate.value as number;
    // tslint:disable-next-line:triple-equals
    while (nbrRemindersByDatePresent != nbrRemindersByDateWanted) {
     if (nbrRemindersByDatePresent < nbrRemindersByDateWanted) {
       const newReminderByDateControl = this.formBuilder.control(null);
       this.getRemindersByDate().push(newReminderByDateControl);
       nbrRemindersByDatePresent++;
     } else if (nbrRemindersByDatePresent > nbrRemindersByDateWanted) {
       this.getRemindersByDate().removeAt(this.getRemindersByDate().length - 1);
       nbrRemindersByDatePresent--;
     }
   }
  }

  onDay(day: string) {
    if (day === 'M') {
      this.getRemindersByDay().controls.monday.setValue(!this.getRemindersByDay().controls.monday.value);
    } else if (day === 'TU') {
      this.getRemindersByDay().controls.tuesday.setValue(!this.getRemindersByDay().controls.tuesday.value);
    } else if (day === 'W') {
      this.getRemindersByDay().controls.wednesday.setValue(!this.getRemindersByDay().controls.wednesday.value);
    } else if (day === 'TH') {
      this.getRemindersByDay().controls.thursday.setValue(!this.getRemindersByDay().controls.thursday.value);
    } else if (day === 'F') {
      this.getRemindersByDay().controls.friday.setValue(!this.getRemindersByDay().controls.friday.value);
    } else if (day === 'SA') {
      this.getRemindersByDay().controls.saturday.setValue(!this.getRemindersByDay().controls.saturday.value);
    } else if (day === 'SU') {
      this.getRemindersByDay().controls.sunday.setValue(!this.getRemindersByDay().controls.sunday.value);
    }
  }

  getReminderByDateInStrDate(remindersByDate: [{id: number|bigint, reminderDate: Date}]) {
    const array: string[] = [];
    remindersByDate.forEach(value => {
      array.push(value.reminderDate.toString().substring(0, 10));
    });
    return array;
  }

  getArray(nbr: number) {
    return new Array(nbr);
  }

  getRemindersByDate(): FormArray {
    return this.memoForm.get('remindersByDate') as FormArray;
  }

  getRemindersByDay(): FormGroup {
    return this.memoForm.get('remindersByDay') as FormGroup;
  }

  resetModal(resetButton: boolean) {
    if (resetButton) {
      this.initMemoForm();
    } else {
      if (!this.id) {
        this.id = this.whoMemoUpdate.id;
      } else if (this.id !== this.whoMemoUpdate.id) {
        this.id = this.whoMemoUpdate.id;
        this.initMemoForm();
      }
    }
  }
}
