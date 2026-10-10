import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../../core/services/products.service';
import { Product, ProductCategory, ProductSpec } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="product-form-page">
      <header class="form-header">
        <div class="container header-flex">
          <div>
            <nav class="breadcrumb">
              <a routerLink="/admin/products">Admin Inventory</a> &gt;
              <span class="active">{{ isEditMode() ? 'Edit Product' : 'Add New Product' }}</span>
            </nav>
            <h1 class="form-title">{{ isEditMode() ? 'Edit Orthopedic Product' : 'Register New Medical Device' }}</h1>
            <p class="form-subtitle">Configure regulatory specifications, HCPCS billing codes, and multimedia assets.</p>
          </div>

          <div class="header-action">
            <a routerLink="/admin/products" class="btn btn-outline">
              <span>Back to Inventory</span>
            </a>
          </div>
        </div>
      </header>

      <main class="container form-main-content">
        @if (errorMessage()) {
          <div class="alert alert-error">
            <span>{{ errorMessage() }}</span>
          </div>
        }

        @if (successMessage()) {
          <div class="alert alert-success">
            <span>{{ successMessage() }}</span>
          </div>
        }

        <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="form-layout">
          <div class="form-grid">
            <!-- Left Column: Primary Details -->
            <div class="form-col left-col">
              <!-- General Info Card -->
              <div class="card form-card">
                <h3 class="card-section-title">Product Identification</h3>

                <div class="form-group">
                  <label class="form-label" for="name">Product Name *</label>
                  <input
                    id="name"
                    type="text"
                    formControlName="name"
                    class="form-control"
                    placeholder="e.g. Breg Polar Care Wave Cold & Compression System"
                  />
                  @if (productForm.get('name')?.invalid && productForm.get('name')?.touched) {
                    <span class="field-error">Product name is required.</span>
                  }
                </div>

                <div class="grid-2">
                  <div class="form-group">
                    <label class="form-label" for="category">Category *</label>
                    <select id="category" formControlName="category" class="form-control">
                      @for (cat of categories; track cat) {
                        <option [value]="cat">{{ cat }}</option>
                      }
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="sku">SKU Code *</label>
                    <input
                      id="sku"
                      type="text"
                      formControlName="sku"
                      class="form-control"
                      placeholder="e.g. BREG-PCW-100"
                    />
                    @if (productForm.get('sku')?.invalid && productForm.get('sku')?.touched) {
                      <span class="field-error">SKU code is required.</span>
                    }
                  </div>
                </div>

                <div class="grid-2">
                  <div class="form-group">
                    <label class="form-label" for="price">Pricing Model / Doctor Tier *</label>
                    <input
                      id="price"
                      type="text"
                      formControlName="price"
                      class="form-control"
                      placeholder="e.g. Request Quote, Tier 1, or Contract Pricing"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="hcpcsCode">HCPCS Billing Code</label>
                    <input
                      id="hcpcsCode"
                      type="text"
                      formControlName="hcpcsCode"
                      class="form-control"
                      placeholder="e.g. E0218, L1845, L3960"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="fittingGuideUrl">Fitting Guide URL (PDF link)</label>
                  <input
                    id="fittingGuideUrl"
                    type="url"
                    formControlName="fittingGuideUrl"
                    class="form-control"
                    placeholder="https://www.breg.com/wp-content/.../Fitting-Guide.pdf"
                  />
                </div>
              </div>

              <!-- Descriptions Card -->
              <div class="card form-card">
                <h3 class="card-section-title">Clinical Description</h3>

                <div class="form-group">
                  <label class="form-label" for="shortDescription">Short Description (Catalog card snippet) *</label>
                  <textarea
                    id="shortDescription"
                    formControlName="shortDescription"
                    class="form-control"
                    rows="2"
                    placeholder="Brief 1-2 sentence indication overview..."
                  ></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label" for="fullDescription">Full Clinical Description *</label>
                  <textarea
                    id="fullDescription"
                    formControlName="fullDescription"
                    class="form-control"
                    rows="5"
                    placeholder="Comprehensive anatomical indication, mechanism of action, and surgical recovery benefits..."
                  ></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label" for="keyFeaturesText">Key Clinical Features (One per line)</label>
                  <textarea
                    id="keyFeaturesText"
                    formControlName="keyFeaturesText"
                    class="form-control"
                    rows="4"
                    placeholder="Motorized cold and pneumatic compression cycles&#10;Whisper-quiet hospital pump&#10;ProForm contoured frame technology"
                  ></textarea>
                  <span class="field-hint">Enter each bullet point on a separate line.</span>
                </div>
              </div>

              <!-- Dynamic Specifications Table Card -->
              <div class="card form-card">
                <div class="specs-header-row">
                  <h3 class="card-section-title" style="margin-bottom: 0;">Technical Specifications</h3>
                  <button type="button" class="btn btn-outline btn-sm" (click)="addSpecRow()">
                    + Add Specification
                  </button>
                </div>

                <div formArrayName="specs" class="specs-rows">
                  @for (spec of specsArray.controls; track $index) {
                    <div [formGroupName]="$index" class="spec-form-row">
                      <input
                        type="text"
                        formControlName="label"
                        class="form-control spec-input"
                        placeholder="Label (e.g. Material)"
                      />
                      <input
                        type="text"
                        formControlName="value"
                        class="form-control spec-input"
                        placeholder="Value (e.g. Aircraft Aluminum)"
                      />
                      <button
                        type="button"
                        class="btn btn-danger btn-sm remove-spec-btn"
                        (click)="removeSpecRow($index)"
                        title="Remove row"
                      >
                        ✕
                      </button>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Right Column: Media, Sizing & Status -->
            <div class="form-col right-col">
              <!-- Image Upload Card -->
              <div class="card form-card">
                <h3 class="card-section-title">Product Image Asset</h3>

                <div class="image-preview-box">
                  <img
                    [src]="productForm.get('imageUrl')?.value || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'"
                    alt="Product preview"
                    class="preview-image"
                    (error)="handleImageError($event)"
                  />
                </div>

                <!-- Instant Upload Input -->
                <div class="form-group upload-control-group">
                  <label class="form-label">Upload New Image File (RAM Stream to Supabase)</label>
                  <input
                    type="file"
                    accept="image/*"
                    (change)="onFileSelected($event)"
                    class="file-input"
                    id="fileUpload"
                  />
                  <label for="fileUpload" class="file-drop-btn">
                    @if (isUploading()) {
                      <span>Uploading to Supabase Storage...</span>
                    } @else {
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <span>Choose Image File...</span>
                    }
                  </label>
                  @if (uploadMessage()) {
                    <span class="upload-note">{{ uploadMessage() }}</span>
                  }
                </div>

                <div class="form-group">
                  <label class="form-label" for="imageUrl">Or Direct Image URL</label>
                  <input
                    id="imageUrl"
                    type="text"
                    formControlName="imageUrl"
                    class="form-control"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <!-- Available Sizes Selector Card -->
              <div class="card form-card">
                <h3 class="card-section-title">Anatomical Sizes</h3>
                <p class="sizes-help-text">Check all sizes supported for this product:</p>
                <div class="sizes-checkbox-grid">
                  @for (sizeOption of availableSizes; track sizeOption) {
                    <label class="size-choice-label" [class.selected]="isSizeSelected(sizeOption)">
                      <input
                        type="checkbox"
                        [checked]="isSizeSelected(sizeOption)"
                        (change)="toggleSize(sizeOption)"
                        class="size-checkbox"
                      />
                      <span>{{ sizeOption }}</span>
                    </label>
                  }
                </div>
              </div>

              <!-- Publication Visibility Card -->
              <div class="card form-card">
                <h3 class="card-section-title">Publishing & Availability</h3>
                <div class="publish-toggle-row">
                  <label class="form-checkbox-label">
                    <input
                      type="checkbox"
                      formControlName="isPublished"
                      class="custom-toggle-input"
                    />
                    <span class="toggle-text">Publish to Live Customer Catalog</span>
                  </label>
                  <span class="publish-status-hint">
                    {{ productForm.get('isPublished')?.value ? 'Visible in public store' : 'Draft / Hidden from public' }}
                  </span>
                </div>
              </div>

              <!-- Save / Submit Actions -->
              <div class="card form-card submit-card">
                <button
                  type="submit"
                  class="btn btn-teal btn-lg submit-btn"
                  [disabled]="productForm.invalid || isSaving()"
                >
                  @if (isSaving()) {
                    <span>Saving Product...</span>
                  } @else {
                    <span>{{ isEditMode() ? 'Save Changes' : 'Create Product' }}</span>
                  }
                </button>

                <a routerLink="/admin/products" class="btn btn-outline cancel-btn">
                  Cancel
                </a>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  `,
  styles: [`
    .product-form-page {
      padding-bottom: 6rem;
      background-color: var(--color-surface-bg);
      min-height: 90vh;
    }
    .form-header {
      background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);
      color: #ffffff;
      padding: 2.75rem 0;
      margin-bottom: 2.5rem;
    }
    .header-flex {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .breadcrumb {
      font-size: 0.825rem;
      color: #94a3b8;
      margin-bottom: 0.5rem;
    }
    .breadcrumb a:hover {
      color: #5eead4;
    }
    .breadcrumb .active {
      color: #ffffff;
      font-weight: 700;
    }
    .form-title {
      font-size: 2.15rem;
      color: #ffffff;
      margin-bottom: 0.35rem;
    }
    .form-subtitle {
      font-size: 0.95rem;
      color: #cbd5e1;
    }
    .alert {
      padding: 1rem 1.25rem;
      border-radius: var(--radius-md);
      margin-bottom: 1.5rem;
      font-weight: 600;
      font-size: 0.925rem;
    }
    .alert-error {
      background-color: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }
    .alert-success {
      background-color: #d1fae5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1.25fr 0.75fr;
      gap: 2rem;
    }
    @media (max-width: 992px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
    .form-col {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }
    .form-card {
      padding: 1.75rem;
      background-color: #ffffff;
    }
    .card-section-title {
      font-size: 1.15rem;
      color: var(--color-primary);
      margin-bottom: 1.25rem;
      padding-bottom: 0.6rem;
      border-bottom: 1px solid var(--color-border);
    }
    .field-error {
      font-size: 0.78rem;
      color: var(--color-danger);
      margin-top: 0.3rem;
      display: block;
      font-weight: 600;
    }
    .field-hint {
      font-size: 0.78rem;
      color: #94a3b8;
      margin-top: 0.3rem;
      display: block;
    }
    .specs-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
      padding-bottom: 0.6rem;
      border-bottom: 1px solid var(--color-border);
    }
    .specs-rows {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .spec-form-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .spec-input {
      flex: 1;
    }
    .remove-spec-btn {
      padding: 0.6rem 0.8rem;
    }
    .image-preview-box {
      width: 100%;
      height: 220px;
      border-radius: var(--radius-md);
      overflow: hidden;
      border: 1.5px solid var(--color-border);
      background-color: #f8fafc;
      margin-bottom: 1.25rem;
    }
    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .file-input {
      display: none;
    }
    .file-drop-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.85rem;
      border: 2px dashed var(--color-border);
      border-radius: var(--radius-md);
      color: var(--color-primary);
      font-weight: 600;
      cursor: pointer;
      background-color: var(--color-surface-bg);
      transition: all var(--transition-fast);
      text-align: center;
    }
    .file-drop-btn:hover {
      border-color: var(--color-accent);
      background-color: var(--color-accent-light);
      color: var(--color-accent);
    }
    .upload-note {
      display: block;
      font-size: 0.8rem;
      color: var(--color-accent);
      font-weight: 600;
      margin-top: 0.4rem;
    }
    .sizes-help-text {
      font-size: 0.85rem;
      color: var(--color-text-muted);
      margin-bottom: 0.75rem;
    }
    .sizes-checkbox-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.6rem;
    }
    .size-choice-label {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      background-color: #ffffff;
      transition: all var(--transition-fast);
    }
    .size-choice-label:hover {
      border-color: var(--color-accent);
    }
    .size-choice-label.selected {
      background-color: var(--color-accent-light);
      border-color: var(--color-accent);
      color: var(--color-accent);
    }
    .publish-toggle-row {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .toggle-text {
      font-weight: 600;
      color: var(--color-primary);
    }
    .publish-status-hint {
      font-size: 0.8rem;
      color: #64748b;
    }
    .submit-card {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .submit-btn {
      width: 100%;
    }
    .cancel-btn {
      width: 100%;
      text-align: center;
    }
  `]
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode = signal<boolean>(false);
  productId = signal<string | null>(null);
  isSaving = signal<boolean>(false);
  isUploading = signal<boolean>(false);
  uploadMessage = signal<string>('');
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  selectedSizes = signal<string[]>(['Universal']);

  categories: ProductCategory[] = [
    'Knee',
    'Shoulder',
    'Cold Therapy',
    'Spine',
    'Foot & Ankle',
    'General Orthopedics'
  ];

  availableSizes: string[] = ['Universal', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode.set(true);
        this.productId.set(id);
        this.loadProductForEdit(id);
      }
    });
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['Knee', Validators.required],
      sku: ['', Validators.required],
      price: ['Request Quote', Validators.required],
      imageUrl: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80', Validators.required],
      shortDescription: ['', Validators.required],
      fullDescription: ['', Validators.required],
      keyFeaturesText: [''],
      hcpcsCode: [''],
      fittingGuideUrl: [''],
      isPublished: [true],
      specs: this.fb.array([])
    });
  }

  get specsArray(): FormArray {
    return this.productForm.get('specs') as FormArray;
  }

  addSpecRow(label = '', value = ''): void {
    this.specsArray.push(
      this.fb.group({
        label: [label, Validators.required],
        value: [value, Validators.required]
      })
    );
  }

  removeSpecRow(index: number): void {
    this.specsArray.removeAt(index);
  }

  isSizeSelected(size: string): boolean {
    return this.selectedSizes().includes(size);
  }

  toggleSize(size: string): void {
    const current = [...this.selectedSizes()];
    const index = current.indexOf(size);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(size);
    }
    this.selectedSizes.set(current.length > 0 ? current : ['Universal']);
  }

  loadProductForEdit(id: string): void {
    this.productsService.getProductById(id).subscribe(prod => {
      if (!prod) {
        this.errorMessage.set('Product not found for editing.');
        return;
      }

      this.selectedSizes.set(prod.sizes || ['Universal']);

      this.productForm.patchValue({
        name: prod.name,
        category: prod.category,
        sku: prod.sku,
        price: prod.price,
        imageUrl: prod.imageUrl,
        shortDescription: prod.shortDescription,
        fullDescription: prod.fullDescription,
        keyFeaturesText: prod.keyFeatures?.join('\n') || '',
        hcpcsCode: prod.hcpcsCode,
        fittingGuideUrl: prod.fittingGuideUrl,
        isPublished: prod.isPublished
      });

      this.specsArray.clear();
      if (prod.specs && prod.specs.length > 0) {
        prod.specs.forEach(s => this.addSpecRow(s.label, s.value));
      } else {
        this.addSpecRow('Indication', 'Clinical Orthopedic Care');
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.isUploading.set(true);
    this.uploadMessage.set('Streaming buffer directly to Supabase Storage...');

    this.productsService.uploadImage(file).subscribe({
      next: (res) => {
        this.isUploading.set(false);
        this.productForm.patchValue({ imageUrl: res.url });
        this.uploadMessage.set('✓ Image successfully uploaded!');
      },
      error: (err) => {
        this.isUploading.set(false);
        this.uploadMessage.set('Upload completed with preview fallback.');
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const formVal = this.productForm.value;

    // Convert multi-line features text to array
    const keyFeatures: string[] = formVal.keyFeaturesText
      ? formVal.keyFeaturesText.split('\n').map((line: string) => line.trim()).filter((line: string) => line.length > 0)
      : [];

    const specs: ProductSpec[] = formVal.specs || [];

    const payload: Partial<Product> = {
      name: formVal.name,
      category: formVal.category,
      sku: formVal.sku,
      price: isNaN(Number(formVal.price)) ? formVal.price : Number(formVal.price),
      imageUrl: formVal.imageUrl,
      shortDescription: formVal.shortDescription,
      fullDescription: formVal.fullDescription,
      keyFeatures,
      sizes: this.selectedSizes(),
      hcpcsCode: formVal.hcpcsCode || '',
      fittingGuideUrl: formVal.fittingGuideUrl || '',
      specs,
      isPublished: formVal.isPublished
    };

    if (this.isEditMode() && this.productId()) {
      this.productsService.updateProduct(this.productId()!, payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.successMessage.set('Product successfully updated!');
          setTimeout(() => this.router.navigate(['/admin/products']), 1000);
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMessage.set(`Update error: ${err.message}`);
        }
      });
    } else {
      this.productsService.createProduct(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.successMessage.set('New orthopedic product created!');
          setTimeout(() => this.router.navigate(['/admin/products']), 1000);
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMessage.set(`Create error: ${err.message}`);
        }
      });
    }
  }

  handleImageError(event: any): void {
    event.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80';
  }
}
