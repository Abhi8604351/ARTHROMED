import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError, map, tap } from 'rxjs';
import { Product } from '../models/product.model';

export const LOCAL_MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-breg-001',
    name: 'Breg Genesis Mid-Calf Full Shell Walker',
    category: 'Foot & Ankle',
    sku: 'BREG-GEN-MC40',
    price: 'Request Quote',
    imageUrl: '/Breg/Breg Genesis Mid-Calf Full Shell Walker.png',
    shortDescription: 'Pneumatic mid-calf walking boot featuring dual air chambers, dynamic air heel shock absorption, and trimmable full-shell stability.',
    fullDescription: 'The Breg Genesis Mid-Calf Full Shell Walker delivers superior pneumatic immobilization in a lightweight, maneuverable mid-calf design. Engineered with a built-in air pump and dual chambers for custom compression around the ankle and foot, a dynamic air heel cushion to absorb strike impact, and a low-profile rocker sole mimicking natural gait.',
    keyFeatures: [
      'Built-in integrated air pump with dual pneumatic chambers for custom compression',
      'Dynamic air heel chamber absorbs shock loading upon heel strike',
      'Mid-calf low profile reduces weight and bulk while maintaining robust immobilization',
      'Rocker bottom sole promotes smooth, natural gait progression',
      'Trimmable semi-rigid shell accommodates varied calf circumferences',
      'Scalloped no-slip tread for dependable traction and stability'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    hcpcsCode: 'L4360 / L4361',
    fittingGuideUrl: 'https://www.breg.com/products/foot-ankle-bracing/walkers/genesis-full-shell-walker/',
    specs: [
      { label: 'Brace Type', value: 'Pneumatic Full-Shell Mid-Calf Walker' },
      { label: 'Height Profile', value: 'Mid-Calf (Low Profile)' },
      { label: 'Indications', value: 'Ankle sprains, stable foot/ankle fractures, distal tibial fractures' },
      { label: 'Shell Material', value: 'Engineered Polymer with Trimmable Flanges' },
      { label: 'Cushioning', value: 'Dual Air Bladder with Dynamic Air Heel' }
    ],
    isPublished: true,
    createdAt: '2025-04-01T08:00:00.000Z'
  },
  {
    id: 'prod-breg-002',
    name: 'Breg Crossover Knee Brace',
    category: 'Knee',
    sku: 'BREG-XOVER-102',
    price: 'Request Quote',
    imageUrl: '/Breg/Crossover Knee Brace.png',
    shortDescription: 'Versatile hybrid knee brace featuring polycentric hinges, breathable TriTech material, and removable patellar buttress for ligament and patellofemoral stability.',
    fullDescription: 'The Breg Crossover Knee Brace is an adaptable orthopedic support designed for mild to moderate ACL, PCL, MCL, and LCL ligament sprains, meniscus tears, and patellar tracking disorders. Built with Breg\'s breathable TriTech fabric and featuring polycentric hinges and a customizable patellar buttress, it offers superior joint containment without compromising active flexibility.',
    keyFeatures: [
      'Polycentric hinges provide anatomical range-of-motion guidance and collateral ligament support',
      'Removable, trimmable circular patellar buttress stabilizes patellar tracking',
      'Breathable TriTech fabric delivers targeted compression with high airflow',
      'Mesh popliteal panel prevents bunching and skin irritation behind the knee',
      'Front-closure / pull-on options facilitate easy donning and doffing'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    hcpcsCode: 'L1820 / L1832',
    fittingGuideUrl: 'https://www.breg.com/products/knee-bracing/ligament/crossover-knee-brace/',
    specs: [
      { label: 'Brace Type', value: 'Functional Ligament & Patellar Knee Brace' },
      { label: 'Hinge Type', value: 'Dual Polycentric Stainless Steel Hinges' },
      { label: 'Material', value: 'Breathable TriTech Fabric & Mesh Popliteal' },
      { label: 'Indications', value: 'Mild/moderate ligament sprains (ACL/PCL/MCL/LCL), patellar subluxation, meniscus support' }
    ],
    isPublished: true,
    createdAt: '2025-04-02T08:00:00.000Z'
  },
  {
    id: 'prod-breg-003',
    name: 'Breg OA Impulse Pull Knee Brace',
    category: 'Knee',
    sku: 'BREG-IMPULSE-05',
    price: 'Request Quote',
    imageUrl: '/Breg/OA Impulse Pull Knee Brace.png',
    shortDescription: 'Ultralight pull-on knee brace with adjustable dynamic unloading hinge for mild to moderate unicompartmental osteoarthritis.',
    fullDescription: 'The Breg OA Impulse is designed for active patients experiencing mild to moderate unicompartmental osteoarthritis and meniscal degradation. Weighing under 14 ounces, this low-profile brace combines breathable TriTech soft-sleeve construction with an adjustable dynamic unloading hinge that gently offloads joint pressure from affected compartments.',
    keyFeatures: [
      'Adjustable loading hinge allows personalized off-loading of the medial or lateral compartment',
      'Featherweight construction under 14 oz ensures seamless everyday comfort',
      'TriTech compression sleeve ensures moisture-wicking breathability',
      'Pull-on sleeve design delivers uniform, non-slip compression throughout active movement',
      'Low-profile profile fits easily beneath everyday clothing'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    hcpcsCode: 'L1843 / L1851',
    fittingGuideUrl: 'https://www.breg.com/products/knee-bracing/oa/oa-impulse-knee-brace/',
    specs: [
      { label: 'Brace Type', value: 'Unicompartmental OA Off-Loading Brace' },
      { label: 'Weight', value: '13.8 oz (390 g)' },
      { label: 'Material', value: 'TriTech Moisture-Wicking Knit with Semi-Rigid Cuffs' },
      { label: 'Indications', value: 'Medial/Lateral unicompartmental OA, articular cartilage defect repair, meniscal instability' }
    ],
    isPublished: true,
    createdAt: '2025-04-03T08:00:00.000Z'
  },
  {
    id: 'prod-breg-004',
    name: 'Breg Premier Post-Op Knee Brace',
    category: 'Knee',
    sku: 'BREG-PREM-POP01',
    price: 'Request Quote',
    imageUrl: '/Breg/Premier Post-Op Knee Brace.png',
    shortDescription: 'World-standard telescoping post-operative knee brace featuring easy-adjust range-of-motion controls, quick drop-lock latch, and BridgeTech incision pads.',
    fullDescription: 'The Breg Premier Post-Op Knee Brace (T Scope Premier) provides clinical post-surgical stabilization and controlled range-of-motion management following ACL/PCL reconstructions, osteotomies, and meniscal repairs. Features telescoping hinge bars extending from 17" to 27", quick-drop lock controls, and cushioned BridgeTech incision pads that prevent pressure on healing incisions.',
    keyFeatures: [
      'Telescoping hinge bars extend from 17" to 27" with push-button adjusters',
      'Extension stops from -10° to 90°; Flexion stops from -10° to 120°',
      'One-touch drop-lock mechanism locks instantly at -10°, 0°, 10°, 20°, and 30°',
      'BridgeTech incision pads offload pressure from delicate surgical repair sites',
      'Quick-release buckle closures allow rapid application and adjustment'
    ],
    sizes: ['Universal (Left/Right)'],
    hcpcsCode: 'L1832 / L1833',
    fittingGuideUrl: 'https://www.breg.com/products/knee-bracing/post-op/t-scope-premier-post-op-knee-brace/',
    specs: [
      { label: 'Brace Type', value: 'Post-Operative Telescoping ROM Knee Brace' },
      { label: 'Length Adjustability', value: '17 in to 27 in (43 cm to 68.5 cm)' },
      { label: 'Extension Control', value: '-10° to 90°' },
      { label: 'Flexion Control', value: '-10° to 120°' },
      { label: 'Weight', value: '2.4 lbs (1.09 kg)' }
    ],
    isPublished: true,
    createdAt: '2025-04-04T08:00:00.000Z'
  },
  {
    id: 'prod-breg-005',
    name: 'Breg Freestyle OA Knee Brace',
    category: 'Knee',
    sku: 'BREG-FREE-OA10',
    price: 'Request Quote',
    imageUrl: '/Breg/OA Knee Brace.png',
    shortDescription: 'Discreet wraparound osteoarthritis brace with tool-free thumbwheel unloading hinge for mild to moderate knee OA pain relief.',
    fullDescription: 'The Breg Freestyle OA provides comfortable, targeted off-loading for patients suffering from mild to moderate unicompartmental osteoarthritis. Its innovative thumbwheel hinge allows patients to dial in precise unloading without tools, shifting mechanical stress away from damaged cartilage. The breathable wraparound design makes daily application effortless.',
    keyFeatures: [
      'Tool-free thumbwheel dial enables precise patient-directed joint unloading',
      'Single-sided low-profile hinge promotes high compliance and fits under trousers',
      'Front-closure wraparound design allows easy donning without bending or removing shoes',
      'Breathable compression sleeve stabilizes joint capsule and reduces swelling',
      'Conforms dynamically during walking and stair climbing'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    hcpcsCode: 'L1843 / L1851',
    fittingGuideUrl: 'https://www.breg.com/products/knee-bracing/oa/freestyle-oa-knee-brace/',
    specs: [
      { label: 'Brace Type', value: 'Low-Profile Wraparound Unloading OA Brace' },
      { label: 'Hinge Mechanism', value: 'Thumbwheel Precision Load Dial' },
      { label: 'Indication', value: 'Mild to moderate medial or lateral unicompartmental osteoarthritis' },
      { label: 'Closure Type', value: 'Anterior Wrap with Secure Hook-and-Loop Fasteners' }
    ],
    isPublished: true,
    createdAt: '2025-04-05T08:00:00.000Z'
  },
  {
    id: 'prod-breg-006',
    name: 'Breg Fusion OA Plus Osteoarthritis Knee Brace',
    category: 'Knee',
    sku: 'BREG-FUS-OAPLUS',
    price: 'Request Quote',
    imageUrl: '/Breg/OA Plus Osteoarthritis Knee Brace.png',
    shortDescription: 'Rigid-frame osteoarthritis brace engineered with ProForm technology and adjustable thumbwheel dial for moderate to severe OA off-loading.',
    fullDescription: 'The Breg Fusion OA Plus provides powerful unicompartmental off-loading and rigid ligament stabilization for patients with moderate to severe osteoarthritis. Built on Breg\'s renowned Fusion frame with ProForm contouring polymer, it maintains intimate anatomical contact to prevent migration. The integrated thumbwheel hinge provides measurable, adjustable corrective loading.',
    keyFeatures: [
      'ProForm contoured polymer technology conforms intimate to thigh and calf contours',
      'Adjustable unloading hinge with thumbwheel dial provides precise corrective torque',
      'Rigid aircraft-grade aluminum frame offers unmatched structural integrity',
      'AirTech moisture-wicking frame pads keep skin cool and dry',
      'Swiveling strap D-rings accommodate dynamic quad and hamstring expansion'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    hcpcsCode: 'L1845 / L1852',
    fittingGuideUrl: 'https://www.breg.com/products/knee-bracing/oa/fusion-oa-plus-knee-brace/',
    specs: [
      { label: 'Brace Type', value: 'Rigid Frame Unicompartmental Off-Loading OA Brace' },
      { label: 'Frame Material', value: 'Aircraft-Grade Aluminum & ProForm Dynamic Polymer' },
      { label: 'Hinge Type', value: 'Breg Adjustable Off-Loading Hinge' },
      { label: 'Indication', value: 'Moderate to severe medial or lateral osteoarthritis with combined ligament instability' }
    ],
    isPublished: true,
    createdAt: '2025-04-06T08:00:00.000Z'
  },
  {
    id: 'prod-breg-007',
    name: 'Breg Atlas Universal Shoulder Brace',
    category: 'Shoulder',
    sku: 'BREG-ATLAS-SH01',
    price: 'Request Quote',
    imageUrl: '/Breg/Atlast-universal-shoulder-brace.png',
    shortDescription: 'Ergonomic universal shoulder sling and 15° abduction pillow with patented offloading harness and breathable Airmesh fabric.',
    fullDescription: 'The Breg Atlas Universal Shoulder Brace delivers comfortable, stable immobilization following rotator cuff repairs, Bankart lesions, Glenohumeral dislocations, and shoulder arthroplasty. Featuring a patented offloading shoulder harness (U.S. Patent 8,414,512) that directs weight away from the neck, breathable Airmesh fabric, quick-release buckles, and a contoured 15° abduction pillow.',
    keyFeatures: [
      'Patented offloading harness transfers arm weight away from the sensitive neck and cervical spine',
      '15° abduction pillow maintains proper anatomical humeral positioning for tendon healing',
      'Breathable moisture-wicking Airmesh material maximizes patient comfort during all-day wear',
      'Quick-release buckle strap connectors allow easy single-handed donning and doffing',
      'Universal sling configuration fits right or left shoulder and adapts across patient sizes'
    ],
    sizes: ['Universal (Left/Right)'],
    hcpcsCode: 'L3960 / L3670',
    fittingGuideUrl: 'https://www.breg.com/products/shoulder-bracing/slings/atlas-universal-shoulder-brace/',
    specs: [
      { label: 'Brace Type', value: 'Universal Shoulder Sling with Abduction Pillow' },
      { label: 'Abduction Angle', value: '15° Neutral Abduction' },
      { label: 'Material', value: 'Breathable Airmesh with High-Density Foam Pillow' },
      { label: 'Indications', value: 'Rotator cuff repair, Bankart reconstruction, glenohumeral dislocation/subluxation, soft tissue repairs' },
      { label: 'Patent', value: 'U.S. Patent No. 8,414,512 B2' }
    ],
    isPublished: true,
    createdAt: '2025-04-07T08:00:00.000Z'
  }
];

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly apiUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://arthromed.onrender.com/api'
    : 'http://localhost:3000/api';
  private localStore: Product[] = [...LOCAL_MOCK_PRODUCTS];

  // Angular Signals for reactive UI state
  public readonly products = signal<Product[]>([...this.localStore]);
  public readonly isLoading = signal<boolean>(false);
  public readonly activeCategory = signal<string>('All');
  public readonly searchQuery = signal<string>('');
  public readonly activeSort = signal<string>('newest');

  // WhatsApp contact number (international format: +91 8604351930)
  public readonly whatsappNumber = '918604351930';

  constructor(private http: HttpClient) {}

  /**
   * Generates a pre-filled WhatsApp click-to-chat URL for inquiries & doctor quotes
   */
  getWhatsAppInquiryUrl(productName?: string, sku?: string): string {
    const base = `https://wa.me/${this.whatsappNumber}`;
    let text = 'Hello ArthroMed! I would like to inquire about your clinical orthopedic equipment.';
    if (productName) {
      text = `Hello ArthroMed! I would like to request doctor / clinic pricing for ${productName}${sku ? ` (SKU: ${sku})` : ''}. Could you please provide our practice with quote details?`;
    }
    return `${base}?text=${encodeURIComponent(text)}`;
  }

  /**
   * Fetches products with optional category, search, and sort parameters
   * Resilient fallback to local storage if API backend is not running
   */
  getProducts(params?: { category?: string; search?: string; sort?: string }): Observable<Product[]> {
    this.isLoading.set(true);
    let httpParams = new HttpParams();

    if (params?.category && params.category !== 'All') {
      httpParams = httpParams.set('category', params.category);
    }
    if (params?.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params?.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }

    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params: httpParams }).pipe(
      tap((data) => {
        this.products.set(data);
        this.isLoading.set(false);
      }),
      catchError((error) => {
        console.warn('Backend unavailable, falling back to local mock data:', error.message);
        let filtered = [...this.localStore];

        if (params?.category && params.category !== 'All') {
          filtered = filtered.filter(p => p.category.toLowerCase() === params.category?.toLowerCase());
        }

        if (params?.search && params.search.trim()) {
          const q = params.search.toLowerCase().trim();
          filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.shortDescription.toLowerCase().includes(q)
          );
        }

        if (params?.sort === 'az') {
          filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (params?.sort === 'za') {
          filtered.sort((a, b) => b.name.localeCompare(a.name));
        } else if (params?.sort === 'newest') {
          filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        this.products.set(filtered);
        this.isLoading.set(false);
        return of(filtered);
      })
    );
  }

  /**
   * Fetches single product by ID
   */
  getProductById(id: string): Observable<Product | undefined> {
    this.isLoading.set(true);
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
      tap(() => this.isLoading.set(false)),
      catchError((err) => {
        console.warn(`Backend error on getProductById(${id}), using mock:`, err.message);
        const match = this.localStore.find(p => p.id === id);
        this.isLoading.set(false);
        return of(match);
      })
    );
  }

  private getAuthHeaders(): { [header: string]: string } {
    const token = localStorage.getItem('arthromed_auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Creates a new product
   */
  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, product, { headers: this.getAuthHeaders() }).pipe(
      tap((created) => {
        this.localStore.unshift(created);
        this.products.update(list => [created, ...list]);
      }),
      catchError((err) => {
        console.warn('Backend unavailable for createProduct, storing locally:', err.message);
        const mockCreated: Product = {
          id: `prod-${Date.now()}`,
          name: product.name || 'New Product',
          category: product.category || 'General Orthopedics',
          sku: product.sku || `SKU-${Date.now().toString().slice(-4)}`,
          price: product.price || 'Request Quote',
          imageUrl: product.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
          shortDescription: product.shortDescription || '',
          fullDescription: product.fullDescription || '',
          keyFeatures: product.keyFeatures || [],
          sizes: product.sizes || ['Universal'],
          hcpcsCode: product.hcpcsCode || 'A9999',
          fittingGuideUrl: product.fittingGuideUrl || '',
          specs: product.specs || [],
          isPublished: product.isPublished !== undefined ? product.isPublished : true,
          createdAt: new Date().toISOString()
        };
        this.localStore.unshift(mockCreated);
        this.products.update(list => [mockCreated, ...list]);
        return of(mockCreated);
      })
    );
  }

  /**
   * Updates an existing product
   */
  updateProduct(id: string, updates: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, updates, { headers: this.getAuthHeaders() }).pipe(
      tap((updated) => {
        const idx = this.localStore.findIndex(p => p.id === id);
        if (idx !== -1) this.localStore[idx] = updated;
        this.products.update(list => list.map(p => p.id === id ? updated : p));
      }),
      catchError((err) => {
        console.warn('Backend unavailable for updateProduct, modifying locally:', err.message);
        const idx = this.localStore.findIndex(p => p.id === id);
        if (idx !== -1) {
          this.localStore[idx] = { ...this.localStore[idx], ...updates };
          const updated = this.localStore[idx];
          this.products.update(list => list.map(p => p.id === id ? updated : p));
          return of(updated);
        }
        throw new Error('Product not found in local store');
      })
    );
  }

  /**
   * Deletes a product by ID
   */
  deleteProduct(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/products/${id}`, { headers: this.getAuthHeaders() }).pipe(
      tap(() => {
        this.localStore = this.localStore.filter(p => p.id !== id);
        this.products.update(list => list.filter(p => p.id !== id));
      }),
      map(() => ({ success: true })),
      catchError((err) => {
        console.warn('Backend unavailable for deleteProduct, removing locally:', err.message);
        this.localStore = this.localStore.filter(p => p.id !== id);
        this.products.update(list => list.filter(p => p.id !== id));
        return of({ success: true });
      })
    );
  }

  /**
   * Uploads an image to backend (/api/upload)
   */
  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<{ url: string }>(`${this.apiUrl}/upload`, formData, { headers: this.getAuthHeaders() }).pipe(
      catchError((err) => {
        console.warn('Upload API unavailable, generating local base64/object URL:', err.message);
        // Resilient fallback preview
        return new Observable<{ url: string }>(observer => {
          const reader = new FileReader();
          reader.onload = () => {
            observer.next({ url: reader.result as string });
            observer.complete();
          };
          reader.onerror = () => {
            observer.next({ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80' });
            observer.complete();
          };
          reader.readAsDataURL(file);
        });
      })
    );
  }
}
