import {Injectable} from '@angular/core';
import {SigninForm} from './signin/signin-form';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {SignupForm} from './signup/signup-form';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private host = environment.gatewayUrl;

  public idUser =  localStorage.getItem('idUser') ? JSON.parse(localStorage.getItem('idUser')) : null;
  public auth = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) : null;
  authSubject = new Subject<string>();

  constructor(private httpClient: HttpClient) { }

  emitAuthSubject() {
    this.authSubject.next(this.auth ? [this.auth].slice()[0] : null);
  }

  signin(signinForm: SigninForm) {
      // @ts-ignore
      // tslint:disable-next-line:max-line-length
      return this.httpClient.post<{token: string, idUser: string}>(this.host + '/signin', {email: signinForm.email, password: signinForm.password})
        .toPromise().then(
           value => {
               this.setAuthState(value.token, value.idUser);
           }
    );
  }

  signup(signupForm: SignupForm) {
    return this.httpClient.post<{token: string, idUser: string}>(this.host + '/signup', {email: signupForm.email, pseudo: signupForm.pseudo,
                                                                  cellphone: signupForm.cellphone, civility: signupForm.civility,
                                                                  name: signupForm.name, surname: signupForm.surname,
                                                                  password: signupForm.password })
        .toPromise().then(
            value => {
                this.setAuthState(value.token, value.idUser);
            }
        );
  }

  signout() {
    return this.httpClient.post(this.host + environment.userUrl + '/signout', {}).toPromise().then(
        () => {
          this.setAuthState(null, null);
        }
    );
  }

  forgotPassword(email: string) {
      return this.httpClient.post(this.host + environment.userUrl + '/forgot-password', {email}).toPromise();
  }

  checkEmail(email: string) {
      const params = {email};
      return this.httpClient.get(this.host + environment.userUrl + '/check-email', {params});
  }

    checkCellphone(cellphone: string) {
        const params = {cellphone};
        return this.httpClient.get(this.host + environment.userUrl + '/check-cellphone', {params});
    }

  public setAuthState(token: string, idUser: string) {
    this.auth = token;
    this.idUser = idUser;
    localStorage.setItem('auth', JSON.stringify(token));
    localStorage.setItem('idUser', JSON.stringify(idUser));
    this.emitAuthSubject();
  }
}
