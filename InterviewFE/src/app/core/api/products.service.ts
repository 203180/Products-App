import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'http://localhost:8080/products';

  constructor(private http: HttpClient) {}

  getPaged(page: number, size: number, sortModel: any[], filterModel: any) {
    let params: any = { page, size };

    if (sortModel?.length) {
      params.sort = sortModel.map(s => `${s.colId},${s.sort}`);
    } else {
      params.sort = ['id,asc'];
    }

    const nameFilter = filterModel?.name?.filter;
    if (nameFilter) params.q = nameFilter;

    const categoryFilter = filterModel?.category?.filter;
    if (categoryFilter) params.category = categoryFilter;

    const priceFilter = filterModel?.price;
    if (priceFilter?.type === 'greaterThan') params.minPrice = priceFilter.filter;
    if (priceFilter?.type === 'lessThan') params.maxPrice = priceFilter.filter;
    if (priceFilter?.type === 'inRange') {
      params.minPrice = priceFilter.filter;
      params.maxPrice = priceFilter.filterTo;
    }

    return this.http.get<any>(this.apiUrl, { params });
  }


  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  update(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
