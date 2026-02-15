import {Component} from '@angular/core';
import {Product} from '../../../core/models/product';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ProductsService} from '../../../core/api/products.service';
import {LoadingStore} from '../../../core/ui/loading.store';
import {ConfirmationModal} from '../../../shared/ui/modal/confirmation-modal/confirmation-modal';
import {UpsertProductModal} from '../products-list/upsert-product-modal/upsert-product-modal';
import {getCategoryLabel} from '../../../shared/utils/getCategoryLabel';

@Component({
  selector: 'app-product-details',
  imports: [
    ConfirmationModal,
    UpsertProductModal,
    UpsertProductModal,
    ConfirmationModal,
    RouterLink
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
  standalone: true
})
export class ProductDetails {
  product: Product | null = null;
  upsertVisible = false;
  confirmationModalVisible = false;
  confirmationModalTitle = '';
  confirmationModalSubTitle = '';
  isLoading: boolean = false;

  constructor(private route: ActivatedRoute, private productsService: ProductsService, private loadingStore: LoadingStore) {}

  get categoryLabel(): string {
    return getCategoryLabel(this.product?.category ?? null) || '—';
  }

  openEdit() {
    this.upsertVisible = true;
  }

  closeEdit() {
    this.upsertVisible = false;
  }

  onSaved() {
    if (this.product)
      this.loadProduct(Number(this.product.id));
  }

  openDeleteConfirm() {
    this.confirmationModalVisible = true;
    this.confirmationModalTitle = 'Delete Product';
    this.confirmationModalSubTitle = `Delete "${this.product?.name}"? This cannot be undone.`;
  }

  closeDeleteConfirm() {
    this.confirmationModalVisible = false;
  }

  confirmDelete() {
    if (!this.product) return;

    this.loadingStore.show();
    this.productsService.delete(Number(this.product.id)).subscribe({
      next: () => {
        this.loadingStore.hide();
        this.closeDeleteConfirm();
        this.loadProduct(Number(this.product?.id));
      },
      error: () => {
        this.loadingStore.hide();
      }
    });
  }

  loadProduct = (id: number) => {
    this.isLoading = true;
    this.loadingStore.show();
    this.productsService.getById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loadingStore.hide();
        this.isLoading = false;
      },
      error: () => {
        this.loadingStore.hide();
        this.isLoading = false;
        this.product = null;
      }
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;

    this.loadProduct(id);
  }

  protected readonly getCategoryLabel = getCategoryLabel;
}
