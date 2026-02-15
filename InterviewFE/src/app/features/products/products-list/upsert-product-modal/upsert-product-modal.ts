import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ReusableModal} from '../../../../shared/ui/modal/reusable-modal/reusable-modal';
import {Product} from '../../../../core/models/product';
import {ProductsService} from '../../../../core/api/products.service';
import {LoadingStore} from '../../../../core/ui/loading.store';
import {categories} from '../../../../core/data/productCategories';
import {ToastStore} from '../../../../core/ui/toast/toast.store';

@Component({
  selector: 'app-upsert-product-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReusableModal],
  templateUrl: './upsert-product-modal.html',
  styleUrl: './upsert-product-modal.css',
})
export class UpsertProductModal {
  @Input() visible = false;
  @Input() product: Product | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Product>();

  submittedOnce = false;

  form!: FormGroup;

  constructor(private fb: FormBuilder, private productsService: ProductsService, private loadingStore: LoadingStore, private toastStore: ToastStore) {
  }

  selectedImageBase64: string | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;

      this.selectedImageBase64 = result.split(',')[1];
    };

    reader.readAsDataURL(file);
  }


  get isEdit(): boolean {
    return !!this.product?.id;
  }

  get title(): string {
    return this.isEdit ? 'Edit Product' : 'Add Product';
  }

  ngOnInit(): void {
    this.selectedImageBase64 = null;
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      quantityInStock: [0, [Validators.required, Validators.min(0)]],
      category: null,
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedImageBase64 = null;
    this.submittedOnce = false;
    this.form?.reset({
      name: this.product?.name ?? '',
      description: this.product?.description ?? '',
      price: this.product?.price ?? 0,
      quantityInStock: this.product?.quantityInStock ?? 0,
      category: (this.product?.category as any) ?? null,
    });
  }

  close() {
    this.selectedImageBase64 = null;
    this.closed.emit();
  }

  isInvalid(controlName: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[controlName];
    return (c.touched || this.submittedOnce) && c.invalid;
  }

  save() {
    this.submittedOnce = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loadingStore.show();

    const payload: Product = {
      ...this.form.getRawValue(),
      imageBase64: this.selectedImageBase64
    } as Product;

    const request$ = this.isEdit
      ? this.productsService.update(this.product!.id!, payload)
      : this.productsService.create(payload);

    request$.subscribe({
      next: (saved) => {
        this.loadingStore.hide();
        this.saved.emit(saved);
        this.close();
        if (this.isEdit)
          this.toastStore.success('Product Updated', 'Changes have been saved successfully.');
        else
          this.toastStore.success('Product Created', 'The product has been successfully added.');
      },
      error: () => {
        this.loadingStore.hide();
        if (this.isEdit)
          this.toastStore.error('Update Failed', 'Unable to save changes. Please try again.')
        else
          this.toastStore.error('Create Failed', 'Unable to create the product. Please try again.')
      }
    });
  }

  protected readonly categories = categories;
}
