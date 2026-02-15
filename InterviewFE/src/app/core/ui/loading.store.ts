import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({providedIn: "root"})
export class LoadingStore {
  private readonly _loading = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading.asObservable();

  show() { this._loading.next(true); }
  hide() { this._loading.next(false); }
  set(value: boolean) { this._loading.next(value); }
}
