import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AppToast} from './toast.model';
import {ToastType} from '../../enum/toastType';

@Injectable({ providedIn: 'root' })
export class ToastStore {
  private readonly _toasts = new BehaviorSubject<AppToast[]>([]);
  readonly toasts$ = this._toasts.asObservable();

  private defaultTimeoutMs = 3500;

  success(title: string, message: string, timeoutMs = this.defaultTimeoutMs) {
    this.push({ type: ToastType.SUCCESS, title, message, timeoutMs });
  }

  error(title: string, message: string, timeoutMs = 6000) {
    this.push({ type: ToastType.ERROR, title, message, timeoutMs });
  }

  push(toast: Omit<AppToast, 'id'>) {
    const id = crypto.randomUUID();
    const full: AppToast = { id, ...toast };
    this._toasts.next([...this._toasts.value, full]);

    if (full.timeoutMs && full.timeoutMs > 0) {
      setTimeout(() => this.dismiss(id), full.timeoutMs);
    }
  }

  dismiss(id: string) {
    this._toasts.next(this._toasts.value.filter(t => t.id !== id));
  }

  clear() {
    this._toasts.next([]);
  }
}
