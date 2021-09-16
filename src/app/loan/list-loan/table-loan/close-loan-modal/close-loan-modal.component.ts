import {Component, Input, OnInit} from '@angular/core';
import {LoanModel} from '../../../model/loan.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoanService} from '../../../loan.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-close-loan-modal',
  templateUrl: './close-loan-modal.component.html',
  styleUrls: ['./close-loan-modal.component.scss']
})
export class CloseLoanModalComponent implements OnInit {

  @Input() loans: LoanModel[];
  @Input() singleLoan: boolean;
  @Input() goal: string;
  @Input() etat: string;

  private loanForm: FormGroup;
  private disabledButton;
  private minlengthComment = '15';
  private maxlengthComment = '150';

  constructor(private loanService: LoanService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.initLoanForm();
  }

  initLoanForm() {
    this.disabledButton = false;
    this.loanForm = this.formBuilder.group({
      checkbox: [false, [Validators.pattern('true')]]
    });
    if (this.goal === 'close') {
      this.loanForm.addControl
      ('comment', this.formBuilder.control('', [Validators.minLength(Number(this.minlengthComment))]));
    }
  }

  onSubmitLoanForm() {
    if (!this.disabledButton) {
      this.disabledButton = true;
      if (this.goal === 'close') {
        for (const loan of this.loans) {
          loan.comment = this.loanForm.controls.comment.value;
          loan.endDate = new Date();
        }
        this.loanService.closeLoans(this.loans).catch(
            reason => {
              console.log(reason);
              this.router.navigate(['/erreur']);
            }
        );
      } else if (this.goal === 'delete') {
        this.loanService.deleteLoans(this.loans).catch(
            reason => {
              console.log(reason);
              this.router.navigate(['/erreur']);
            }
        );
      }
    }
  }

}
