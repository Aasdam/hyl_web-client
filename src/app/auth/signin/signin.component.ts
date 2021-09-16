import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {SigninForm} from './signin-form';
import {CharacterRepetition} from '../../shared/form-validators/sync/character-repetition.validator';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  private signinForm: FormGroup;
  private signinError: string;
  private disabledForm = false;

  constructor(private router: Router,
              private authService: AuthService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._-]{3,99}@[a-z0-9._-]{3,99}\.[a-z]{2,}$'), CharacterRepetition(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  protected onSubmitForm() {
    this.disabledForm = true;
    const formValue = this.signinForm.value;
    const newSignin = new SigninForm(formValue.email, formValue.password);

    this.authService.signin(newSignin).then(
      value => {
        this.router.navigate(['/inventaire']);
      },
      error => {
        if (error && String(error.status)[0] === '4') {
          const interval = setInterval( () => {
            this.disabledForm = false;
            clearInterval(interval);
          }, 5000);
          if (error.status === 401 || error.status === 404) {
            this.signinError = 'Identifiant ou mot de passe invalide...';
          } else {
            this.signinError = 'Une erreur s\'est produite...';
          }
        } else {
          console.log(error);
          this.router.navigate(['/erreur']);
        }
      });
  }

  disabled() {
    return !this.signinForm.valid || this.disabledForm;
  }
}
