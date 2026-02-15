import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CommonModule} from '@angular/common';
import { LoadingStore } from './core/ui/loading.store';
import {Observable} from 'rxjs';
import {Loader} from './shared/ui/loader/loader';
import {ToastHostComponent} from './core/ui/toast/toast';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Loader, ToastHostComponent],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App {

  loading$!: Observable<boolean>;

  constructor(public loadingStore: LoadingStore) {
    this.loading$ = this.loadingStore.loading$;
  }
}
