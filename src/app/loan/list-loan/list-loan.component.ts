import {Component, OnInit} from '@angular/core';
import {LoanModel} from '../model/loan.model';
import {Subscription} from 'rxjs';
import {LoanService} from '../loan.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-list-loan',
  templateUrl: './list-loan.component.html',
  styleUrls: ['./list-loan.component.scss']
})
export class ListLoanComponent implements OnInit {

  private loans: LoanModel[];
  loansSubscription: Subscription;

  private etat: string;

  constructor(private loanService: LoanService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.setEtat(this.route.snapshot.data.etat);
    this.initLoansSubscription();
    this.getLoans();
  }

  setEtat(etat: string) {
    if (etat === 'en cours' || etat === 'terminés') {
      this.etat = etat;
    } else {
      this.router.navigate(['/erreur']);
    }
  }

  initLoansSubscription() {
    if (this.etat === 'en cours') {
      this.loansSubscription = this.loanService.loansInProgressSubject.subscribe(
          (value) => {
            this.loans = null;
            const interval = setInterval(() => {
                this.loans = value;
                clearInterval(interval);
            }, 100);

          }
      );
    } else if ( this.etat === 'terminés') {
      this.loansSubscription = this.loanService.loansTerminatedSubject.subscribe(
          (value) => {
              this.loans = null;
              const interval = setInterval(() => {
                  this.loans = value;
                  clearInterval(interval);
              }, 100);
          }
      );
    }
  }

  private getLoans() {
    if (this.etat === 'en cours') {
      this.loanService.getLoansInProgress().catch(
          reason => {
            console.log(reason);
            this.router.navigate(['/erreur']);
          }
      );
    } else if (this.etat === 'terminés') {
      this.loanService.getLoansTerminated().catch(
          reason => {
            console.log(reason);
            this.router.navigate(['/erreur']);
          }
      );
    }
  }
}
