import { Routes } from '@angular/router';
import {ProductsList} from './features/products/products-list/products-list';
import {ProductDetails} from './features/products/product-details/product-details';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsList },
  { path: 'products/:id', component: ProductDetails }
];
