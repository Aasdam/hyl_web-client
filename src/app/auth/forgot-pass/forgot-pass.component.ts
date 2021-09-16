import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {interval} from 'rxjs';
import {CharacterRepetition} from '../../shared/form-validators/sync/character-repetition.validator';


@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent implements OnInit {

  private forgotPassForm: FormGroup;
  private disabledForm = false;
  private forgotPassSuccesMsg = false;
  private forgotPassErrorMsg = false;
  private num = 5;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.initForgotPassForm();
  }

  initForgotPassForm() {
    this.forgotPassForm = this.formBuilder.group({
      email: [(this.forgotPassForm  && this.forgotPassForm.controls.email ? this.forgotPassForm.controls.email.value  : ''),
          [Validators.required, Validators.pattern('^[a-z0-9._-]{3,99}@[a-z0-9._-]{3,99}\.[a-z]{2,}$'), CharacterRepetition(3)]],
      checkbox: [false, [Validators.pattern('true')]]
    });
  }

  onSubmitForgotPassForm() {
    this.disabledForm = true;
    this.authService.forgotPassword(this.forgotPassForm.controls.email.value).then(
        () => {
          this.forgotPassErrorMsg = false;
          this.forgotPassSuccesMsg = true;
          const observable = interval(1000).subscribe(() => {
            this.num += -1;
          });
          const interval0 = setInterval(() => {
            this.router.navigate(['/connexion']).finally(
                () => {
                  observable.unsubscribe();
                  clearInterval(interval0);
                }
            );
          }, 5000);
        },
        reason => {
          if (reason.status === 404) {
            this.forgotPassErrorMsg = true;
            this.initForgotPassForm();
            const interval0 = setInterval( () => {
              this.disabledForm = false;
              clearInterval(interval0);
            }, 5000);
          } else {
            this.router.navigate(['/erreur']);
          }
        }
    );
  }

  disabled() {
    return !this.forgotPassForm.valid || this.disabledForm;
  }
}
