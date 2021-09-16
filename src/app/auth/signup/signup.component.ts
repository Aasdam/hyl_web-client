import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {MustMatchPassword} from '../../shared/form-validators/sync/must-match-password.validator';
import {CheckCellPhoneControle} from '../../shared/form-validators/sync/cellphone-format.validator';
import {CharacterRepetition} from '../../shared/form-validators/sync/character-repetition.validator';
import {SignupForm} from './signup-form';
import {CheckAtomicEmail} from '../../shared/form-validators/async/atomic-email.async-validator';
import {CheckNoWiteSpace} from '../../shared/form-validators/sync/no-whitespace.validator';
import {UserService} from '../../user/user.service';
import {CheckAtomicCellphone} from '../../shared/form-validators/async/atomic-cellphone.async-validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  private disabledForm = false;
  private userSignupForm: SignupForm;
  private editUserSuccesMsg: string;

  public signupForm: FormGroup = null;
  private readonlyEmail: boolean;

  constructor(private router: Router,
              private authService: AuthService,
              private userService: UserService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initDesignateParent();
  }

  initDesignateParent() {

    if (this.router.url === '/inscription') {
      this.initForm(null);

    } else if (this.router.url === '/profil') {
      this.userSignupForm = new SignupForm('', '', '', '', '', '', '');
      this.initForm(this.userSignupForm);

      this.userService.getLocalUser().then(
          (userSignupForm) => {
            if (userSignupForm.cellphone) {
              userSignupForm.cellphone = '0' + userSignupForm.cellphone.substring(3);
            }
            this.userSignupForm = userSignupForm;
            this.initForm(this.userSignupForm);
          },
          reason => {
            console.log(reason);
          }
      );
    }
  }

  initForm(userSignupForm: SignupForm) {
    let email = '';
    let pseudo = '';
    let surname = '';
    let name = '';
    let civility = '';
    let cellphone = '';
    const passValidators = [Validators.minLength(8), MustMatchPassword()];
    if ( userSignupForm ) {
      email = userSignupForm.email;
      pseudo = userSignupForm.pseudo;
      surname = userSignupForm.surname;
      name = userSignupForm.name;
      civility = userSignupForm.civility ? userSignupForm.civility : '';
      cellphone = userSignupForm.cellphone;
    } else {
      passValidators.push(Validators.required);
    }

    this.readonlyEmail = email !== '';

    this.signupForm = this.formBuilder.group({

      email: [email, [ Validators.required, CharacterRepetition(3),
                    Validators.pattern('^[a-z0-9._-]{3,99}@[a-z0-9._-]{3,99}\.[a-z]{2,}$')], [CheckAtomicEmail(this.authService, email)]],

      pseudo: [pseudo, [Validators.required, CheckNoWiteSpace(), Validators.minLength(3), CharacterRepetition(3)]],

      surname: [surname, [Validators.required, CheckNoWiteSpace(), CharacterRepetition(3),
                      Validators.pattern('[a-zA-Z -]*'), Validators.minLength(3)]],

      name: [name, [Validators.required, CheckNoWiteSpace(), CharacterRepetition(3),
                  Validators.pattern('[a-zA-Z-]*'), Validators.minLength(3)]],

      civility: [civility, []],

      cellphone: [cellphone, [CheckCellPhoneControle()], [CheckAtomicCellphone(this.authService, cellphone)]],

      password: ['', passValidators],

      password2: ['', [MustMatchPassword()]],
    });

    if ( userSignupForm ) {
      this.signupForm.addControl('checkbox',
          this.formBuilder.control(false, [Validators.pattern('true')]));
    }


  }

  onSubmitForm() {
    this.disabledForm = true;
    const formValue = this.signupForm.value;
    const signupForm = new SignupForm(formValue.email, formValue.pseudo, formValue.surname,
                                      formValue.name, formValue.civility, formValue.cellphone, formValue.password);
    if ( this.userSignupForm ) {
      this.userService.updateUser(signupForm).then(
          () => {
            this.initForm(signupForm);
            this.editUserSuccesMsg = 'Les modifications ont bien été prises en compte';
            this.disabledForm = false;
          },
          reason => {
            console.log(reason);
            this.router.navigate(['/erreur']);
          }
      );
    } else {
      this.authService.signup(signupForm).then(
          () => {
            this.router.navigate(['/inventaire']);
          },
          reason => {
            console.log(reason);
            this.router.navigate(['/erreur']);
          }
      );
    }
  }

  disabled() {
    return !this.signupForm.valid || this.disabledForm;
  }
}
