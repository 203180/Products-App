import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AgGridAngular} from 'ag-grid-angular';
import {Router, RouterModule} from '@angular/router';
import {Product} from '../../../core/models/product';
import {ColDef, themeQuartz} from 'ag-grid-community';
import {ProductsService} from '../../../core/api/products.service';
import {LoadingStore} from '../../../core/ui/loading.store';
import {UpsertProductModal} from './upsert-product-modal/upsert-product-modal';
import {ConfirmationModal} from '../../../shared/ui/modal/confirmation-modal/confirmation-modal';
import {getCategoryLabel} from '../../../shared/utils/getCategoryLabel';
import {ToastStore} from '../../../core/ui/toast/toast.store';

@Component({
  selector: 'app-products-list',
  imports: [CommonModule, AgGridAngular, RouterModule, UpsertProductModal, ConfirmationModal],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
  standalone: true
})
export class ProductsList {
  editingProduct: Product | null = null;
  upsertVisible = false;
  confirmationModalVisible = false;
  confirmationModalTitle = '';
  confirmationModalSubTitle = '';
  pendingDeleteId: number | null = null;

  textContainsOnly: ColDef = {
    filter: 'agTextColumnFilter',
    filterParams: {
      filterOptions: ['contains'],
      defaultOption: 'contains',
      maxNumConditions: 1
    },
  };

  numberGreaterLess: ColDef = {
    filter: 'agNumberColumnFilter',
    filterParams: {
      filterOptions: ['greaterThan', 'lessThan'],
      defaultOption: 'greaterThan',
      maxNumConditions: 1
    },
  };

  columns: ColDef[] = [
    {field: 'name', sortable: true, filter: true, flex: 2, ...this.textContainsOnly, cellRenderer: (params: any) => {
        if (!params.data) return '';
        return `<span data-action="redirect" class="w-100 h-100 c-pointer">${params.value}</span>`;
      }
    },
    {field: 'price', sortable: true, flex: 1, ...this.numberGreaterLess},
    {field: 'quantityInStock', headerName: 'Stock', sortable: true, flex: 1, ...this.numberGreaterLess},
    {field: 'category', sortable: true, filter: true, flex: 1, ...this.textContainsOnly,
      cellRenderer: (params: any) => {
        if (!params.data) return '';
        return `<span class="w-100 h-100 c-pointer">${getCategoryLabel(params.value)}</span>`;
      }
    },
    {headerName: 'Actions', flex: 2, sortable: false, cellRenderer: (params: any) => {
        if (!params.data) return '';
        return `
          <button class="btn btn-sm fw-bold btn-info me-2" data-action="redirect">
            <i class="fa-solid fa-info me-1"></i>
            Info
          </button>
          <button class="btn btn-sm fw-bold btn-primary me-2" data-action="edit">
            <i class="fa-solid fa-pen me-1"></i>
            Edit
          </button>
          <button class="btn btn-sm fw-bold btn-danger" data-action="delete">
            <i class="fa-solid fa-trash me-1"></i>
            Delete
          </button>
        `;
      }
    }
  ]

  constructor(private productsService: ProductsService, private loadingStore: LoadingStore, private router: Router, private toastStore: ToastStore) {
  }

  gridApi: any;

  onGridReady(params: any) {
    this.gridApi = params.api;

    const dataSource = {
      getRows: (rowParams: any) => {
        const startRow = rowParams.startRow;
        const endRow = rowParams.endRow;
        const pageSize = endRow - startRow;
        const page = Math.floor(startRow / pageSize);

        const sortModel = rowParams.sortModel;
        const filterModel = rowParams.filterModel;

        this.loadingStore.show();

        this.productsService.getPaged(page, pageSize, sortModel, filterModel)
          .subscribe({
            next: (res) => {
              rowParams.successCallback(res.content, res.totalElements);
              this.loadingStore.hide();
            },
            error: () => {
              rowParams.failCallback()
              this.loadingStore.hide();
              this.toastStore.error('Load Failed', 'Unable to load products. Please refresh the page.');
            }
          });
      }
    };

    this.gridApi.setGridOption('datasource', dataSource);
  }

  onGridParamsChanged() {
    this.gridApi.refreshInfiniteCache();
  }

  openAdd() {
    this.editingProduct = null;
    this.upsertVisible = true;
  }

  openEdit(product: Product) {
    this.editingProduct = product;
    this.upsertVisible = true;
  }

  closeUpsert() {
    this.upsertVisible = false;
  }

  onSaved() {
    this.editingProduct = null;
    this.gridApi.refreshInfiniteCache();
  }

  openDeleteConfirm(id: number, name: string) {
    this.confirmationModalVisible = true;
    this.pendingDeleteId = id;
    this.confirmationModalTitle = 'Delete Product';
    this.confirmationModalSubTitle = `Delete "${name}"? This cannot be undone.`;
  }

  closeDeleteConfirm() {
    this.confirmationModalVisible = false;
    this.pendingDeleteId = null;
  }

  confirmDelete() {
    if (!this.pendingDeleteId) return;

    this.loadingStore.show();
    this.productsService.delete(this.pendingDeleteId).subscribe({
      next: () => {
        this.closeDeleteConfirm();
        this.loadingStore.hide();
        this.gridApi.refreshInfiniteCache();
        this.toastStore.success('Product Deleted', 'The product has been permanently removed.')
      },
      error: () => {
        this.loadingStore.hide();
        this.toastStore.error('Delete Failed', 'Unable to delete the product. Please try again.');
      }
    });
  }

  onCellClicked(event: any) {
    const target = event.event?.target as HTMLElement;
    if (!target) return;

    const action = target.getAttribute('data-action');
    if (!action) return;

    const product: Product = event.data;

    if (action === 'redirect') {
      this.router.navigate(['/products', product.id]);
    }
    else if (action === 'edit') {
      this.openEdit(product);
    } else if (action === 'delete') {
      this.openDeleteConfirm(product.id!, product.name)
    }
  }

  productsGridTheme = themeQuartz
    .withParams({
      backgroundColor: '#ffffff00',
      foregroundColor: '#ffffff',
      accentColor: '#22c55e',

      chromeBackgroundColor: '#ffffff00',

      borderColor: '#ffffff14',

      headerTextColor: '#e5e7eb',
      cellTextColor: '#e5e7eb',

      oddRowBackgroundColor: '#ffffff00',
      rowHoverColor: '#DDDDDD1A',
      menuBackgroundColor: '#0f172a',
    });
}
