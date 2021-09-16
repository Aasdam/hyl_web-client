import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoanModel} from './model/loan.model';
import {Subject} from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private host = environment.gatewayUrl + environment.loanUrl;

  private loansInProgress: LoanModel[] = [];
  private loansTerminated: LoanModel[] = [];
  loansInProgressSubject = new Subject<LoanModel[]>();
  loansTerminatedSubject = new Subject<LoanModel[]>();


  constructor(private httpClient: HttpClient) { }

  emitLoansInProgress() {
    this.loansInProgressSubject.next(this.loansInProgress.slice());
  }

  emitLoansTerminated() {
    this.loansTerminatedSubject.next(this.loansTerminated.slice());
  }

  checkSubItemAvailable(reference: string) {
    const params = {reference};
    return this.httpClient.get(this.host + '/check-sub-available', {params});
  }

  getLoansInProgress() {
    return this.httpClient.get<LoanModel[]>(this.host + '/in-progress').toPromise().then(
        loans => {
          this.loansInProgress = loans;
          this.emitLoansInProgress();
        }
    );
  }

  getLoansTerminated() {
    return this.httpClient.get<LoanModel[]>(this.host + '/terminated').toPromise().then(
        loans => {
          this.loansTerminated = loans;
          this.emitLoansTerminated();
        }
    );
  }

  closeLoans(loans: LoanModel[]) {
    const body: Array<{id: string, endDate: Date, comment: string}> = [];
    for (const loan of loans) {
      body.push({id: String(loan.id), endDate: loan.endDate, comment: loan.comment});
    }

    return this.httpClient.post(this.host + '/close-loans', body)
        .toPromise().then(
            () => {
              this.removeToLoansInProgressArray(loans);
              this.addToLoansTerminatedArray(loans);
            }
        );
  }

  deleteLoans(loans: LoanModel[]) {
    const ids: Array<string> = [];
    for (const loan of loans) {
      ids.push(String(loan.id));
    }
    const params = {ids};

    return this.httpClient.delete(this.host + '/delete-loans', {params}).toPromise().then(
        () => {
          this.removeToLoansInProgressArray(loans);
          this.removeToLoansTerminatedArray(loans);
        }
    );
  }

  createLoan(loan: LoanModel) {
    return this.httpClient.post<LoanModel>(this.host + '/add-loan', {startDate: loan.startDate, reference: loan.reference,
                                            beneficiary: loan.beneficiary, information: loan.information, reminder: loan.reminder})
        .toPromise().then(
            (newLoan) => {
              this.addToLoansInProgressArray([newLoan]);
            }
        );

  }

  private removeToLoansInProgressArray(loans: LoanModel[]) {
    if ( this.loansInProgress ) {
      const c = loans.length;
      for (let i = 0; i < c; i++) {
        const index = this.loansInProgress.findIndex(loanInProgress => {
          return loans[i].id === loanInProgress.id;
        });
        if (index !== -1) {
          this.loansInProgress.splice(index, 1);
        }
      }
      this.emitLoansInProgress();
    }
  }

  private removeToLoansTerminatedArray(loans: LoanModel[]) {
    if ( this.loansTerminated ) {
      const c = loans.length;
      for (let i = 0; i < c; i++) {
        const index = this.loansTerminated.findIndex(loanTerminated => {
          return loans[i].id === loanTerminated.id;
        });
        if (index !== -1) {
          this.loansTerminated.splice(index, 1);
        }
      }
      this.emitLoansTerminated();
    }
  }

  private addToLoansTerminatedArray(loans: LoanModel[]) {
    for (const loan of loans) {
      this.loansTerminated.unshift(loan);
    }
    this.emitLoansTerminated();
  }

  private addToLoansInProgressArray(loans: LoanModel[]) {
    for (const loan of loans) {
      this.loansInProgress.unshift(loan);
    }
    this.emitLoansInProgress();
  }
}
