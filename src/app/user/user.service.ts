import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SignupForm} from '../auth/signup/signup-form';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private host = environment.gatewayUrl + environment.userUrl;

  constructor(private httpClient: HttpClient) { }

  getLocalUser() {
    return this.httpClient.get<SignupForm>(this.host + '/get-user').toPromise();
  }

  updateUser(signupForm: SignupForm) {
    return this.httpClient.patch(this.host + '/patch-user',
        {email: signupForm.email, pseudo: signupForm.pseudo,
          cellphone: signupForm.cellphone, civility: signupForm.civility,
          name: signupForm.name, surname: signupForm.surname,
          password: signupForm.password }).toPromise();
    }
}
