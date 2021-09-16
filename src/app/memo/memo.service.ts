import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {MemoModel} from './model/memo.model';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemoService {

  private host = environment.gatewayUrl + environment.memoUrl;

  private memos: MemoModel[] = [];
  memosSubject = new Subject<MemoModel[]>();

  constructor(private httpClient: HttpClient) { }

  emitMemos() {
      this.memos.forEach(memo => {
          if (memo.reminderByDate && memo.reminderByDate.length > 1) {
              memo.reminderByDate.sort((a, b) => {
                  return a.reminderDate < b.reminderDate ? -1 : a.reminderDate > b.reminderDate ? 1 : 0;
              });
          }
      });
      this.memosSubject.next(this.memos.slice());
  }

  getMemos() {
    return this.httpClient.get<MemoModel[]>(this.host + '/memos-by-id_user').toPromise().then(
        memos => {
          this.memos = memos;
          this.emitMemos();
        }
    );
  }

    createMemo(memo: MemoModel) {
      return this.httpClient.post<MemoModel>(this.host + '/add-memo', memo)
          .toPromise<MemoModel>().then(
              newMemo => {
                this.memos.push(newMemo);
                this.emitMemos();
              }
          );
    }

    updateMemo(memo: MemoModel) {
        return this.httpClient.patch<MemoModel>(this.host + '/update-memo', memo)
            .toPromise<MemoModel>().then(
                memoUpdated => {
                    let index: number;
                    for (let i = 0; i < this.memos.length; i++) {
                        if (this.memos[i].id === memoUpdated.id) {
                            index = i;
                            break;
                        }
                    }
                    this.memos[index] = memoUpdated;
                    this.emitMemos();
                    return memoUpdated;
                }
            );
    }

    deleteMemo(id: number|bigint) {
      const params = {id: String(id)};
      return this.httpClient.delete(this.host + '/delete-memo', {params})
          .toPromise().then( () => {

              let indexMemo: number;
              this.memos.forEach((memo, index) => {
                  if (memo.id === id) {
                      indexMemo = index;
                      return;
                   }
              });
              this.memos.splice(indexMemo, 1);
              this.emitMemos();
          });
    }
}
