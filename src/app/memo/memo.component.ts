import {Component, OnInit} from '@angular/core';
import {MemoModel} from './model/memo.model';
import {MemoService} from './memo.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-memo',
  templateUrl: './memo.component.html',
  styleUrls: ['./memo.component.scss']
})
export class MemoComponent implements OnInit {

  private memos: MemoModel[];
  private memosSubscription: Subscription;

  private memoToUpdate: MemoModel = null;
  private memoToDelete: MemoModel = null;

  private todayDate: number = Date.parse(new Date().toString());

  constructor(private memoService: MemoService, private router: Router) { }

  ngOnInit() {
   this.initMemosSubscription();
   this.getMemos();
  }

  private initMemosSubscription() {
    this.memosSubscription = this.memoService.memosSubject.subscribe(
        (memos: MemoModel[]) => {
          this.memos = memos;
        });
  }

  private getMemos() {
    this.memoService.getMemos().catch(
        reason => {
          console.log(reason);
          this.router.navigate(['/erreur']);
        }
    );
  }

  onUpdateMemoClick(memoToUpdate: MemoModel) {
    this.memoToUpdate = memoToUpdate;
  }

  onDeleteMemoClick(memoToDelete: MemoModel) {
    this.memoToDelete = memoToDelete;
  }

  getDateNbr(date: string) {
      return Date.parse(date);
  }
}
