import {Component} from '@angular/core';
import {ToastStore} from './toast.store';
import {AppToast} from './toast.model';
import {ToastType} from '../../enum/toastType';
import {AsyncPipe, NgClass} from '@angular/common';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass
  ],
  templateUrl: './toast.html'
})
export class ToastHostComponent {
  constructor(public toastStore: ToastStore) {}

  toastClass(t: AppToast) {
    return t.type === ToastType.SUCCESS
      ? 'text-bg-success'
      : 'text-bg-danger';
  }

  headerClass(t: AppToast) {
    return t.type === ToastType.SUCCESS
      ? 'text-bg-success'
      : 'text-bg-danger';
  }

  iconClass(t: AppToast) {
    return t.type === ToastType.SUCCESS
      ? 'fa-solid fa-circle-check'
      : 'fa-solid fa-triangle-exclamation';
  }
}
