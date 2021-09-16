import {Component, Input, OnInit} from '@angular/core';
import {MemoModel} from '../model/memo.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MemoService} from '../memo.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-delete-memo-modal',
  templateUrl: './delete-memo-modal.component.html',
  styleUrls: ['./delete-memo-modal.component.scss']
})
export class DeleteMemoModalComponent implements OnInit {

  @Input() private whoMemoToDelete: MemoModel;
  private id;

  private memoForm: FormGroup;
  private disabledButton: boolean;

  constructor(private formBuilder: FormBuilder,
              private memoService: MemoService,
              private router: Router) { }

  ngOnInit() {
    this.initMemoForm();
  }

  private initMemoForm() {
    this.disabledButton = false;
    this.memoForm = this.formBuilder.group({
      checkbox: [false, Validators.pattern('true')]
    });
  }

  private onSubmitMemoForm() {
    if (!this.disabledButton) {
      this.disabledButton = true;
      this.memoService.deleteMemo(this.whoMemoToDelete.id).then(
          () => {
            this.initMemoForm();
          },
          reason => {
            console.log(reason);
            this.router.navigate(['/erreur']);
          });
    }
  }

  private resetModal() {
      if (!this.id) {
        this.id = this.whoMemoToDelete.id;
      } else if (this.id !== this.whoMemoToDelete.id) {
        this.id = this.whoMemoToDelete.id;
        this.initMemoForm();
    }
  }
}
