import { Request, Response } from 'express';
import { Product } from '../models/product.model';
import { supabase, BUCKET_NAME } from '../config/supabase';

// 6 realistic orthopedic & Breg medical seed products
export const INITIAL_PRODUCTS: Product[] = [
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
    createdAt: new Date('2025-04-01T08:00:00Z').toISOString()
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
    createdAt: new Date('2025-04-02T08:00:00Z').toISOString()
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
    createdAt: new Date('2025-04-03T08:00:00Z').toISOString()
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
    createdAt: new Date('2025-04-04T08:00:00Z').toISOString()
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
    createdAt: new Date('2025-04-05T08:00:00Z').toISOString()
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
    createdAt: new Date('2025-04-06T08:00:00Z').toISOString()
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
    createdAt: new Date('2025-04-07T08:00:00Z').toISOString()
  }
];

// In-memory products store for instant zero-dependency execution
let productsStore: Product[] = [...INITIAL_PRODUCTS];

/**
 * GET /api/products
 * Supports ?category=, ?search=, and ?sort=
 */
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, sort } = req.query;

    if (supabase) {
      try {
        let query = supabase.from('products').select('*');

        if (category && typeof category === 'string' && category !== 'All') {
          query = query.eq('category', category);
        }

        if (search && typeof search === 'string') {
          query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%,shortDescription.ilike.%${search}%`);
        }

        if (sort === 'az') {
          query = query.order('name', { ascending: true });
        } else if (sort === 'za') {
          query = query.order('name', { ascending: false });
        } else if (sort === 'newest') {
          query = query.order('createdAt', { ascending: false });
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          res.json(data);
          return;
        }
      } catch (dbErr) {
        console.warn('Database query fallback to in-memory store:', dbErr);
      }
    }

    // In-memory query logic
    let result = [...productsStore];

    if (category && typeof category === 'string' && category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.fullDescription.toLowerCase().includes(q)
      );
    }

    if (sort === 'az') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'za') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching products' });
  }
};

/**
 * GET /api/products/:id
 */
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          res.json(data);
          return;
        }
      } catch (dbErr) {
        console.warn('Supabase getById fallback:', dbErr);
      }
    }

    const product = productsStore.find(p => p.id === id);
    if (!product) {
      res.status(404).json({ error: `Product with ID '${id}' not found` });
      return;
    }

    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error retrieving product' });
  }
};

/**
 * POST /api/products
 */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body;
    const newProduct: Product = {
      ...payload,
      id: payload.id || `prod-${Date.now()}`,
      createdAt: payload.createdAt || new Date().toISOString(),
      isPublished: payload.isPublished !== undefined ? payload.isPublished : true,
      specs: Array.isArray(payload.specs) ? payload.specs : [],
      keyFeatures: Array.isArray(payload.keyFeatures) ? payload.keyFeatures : [],
      sizes: Array.isArray(payload.sizes) ? payload.sizes : ['Universal'],
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('products').insert([newProduct]).select().single();
        if (!error && data) {
          productsStore.unshift(data);
          res.status(201).json(data);
          return;
        }
      } catch (dbErr) {
        console.warn('Supabase insert fallback:', dbErr);
      }
    }

    productsStore.unshift(newProduct);
    res.status(201).json(newProduct);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error creating product' });
  }
};

/**
 * PUT /api/products/:id
 */
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          const index = productsStore.findIndex(p => p.id === id);
          if (index !== -1) productsStore[index] = data;
          res.json(data);
          return;
        }
      } catch (dbErr) {
        console.warn('Supabase update fallback:', dbErr);
      }
    }

    const index = productsStore.findIndex(p => p.id === id);
    if (index === -1) {
      res.status(404).json({ error: `Product with ID '${id}' not found` });
      return;
    }

    productsStore[index] = {
      ...productsStore[index],
      ...updates,
      id // preserve original ID
    };

    res.json(productsStore[index]);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error updating product' });
  }
};

/**
 * DELETE /api/products/:id
 * Also deletes the image from Supabase Storage if applicable
 */
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = productsStore.find(p => p.id === id);

    if (supabase && product) {
      try {
        // Attempt to clean up image from Supabase Storage bucket
        if (product.imageUrl && product.imageUrl.includes(BUCKET_NAME)) {
          const pathParts = product.imageUrl.split(`${BUCKET_NAME}/`);
          if (pathParts.length > 1) {
            const storagePath = pathParts[1].split('?')[0];
            await supabase.storage.from(BUCKET_NAME).remove([storagePath]);
          }
        }
        await supabase.from('products').delete().eq('id', id);
      } catch (dbErr) {
        console.warn('Supabase delete cleanup fallback:', dbErr);
      }
    }

    const index = productsStore.findIndex(p => p.id === id);
    if (index === -1) {
      res.status(404).json({ error: `Product with ID '${id}' not found` });
      return;
    }

    const deleted = productsStore.splice(index, 1)[0];
    res.json({ message: 'Product deleted successfully', product: deleted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error deleting product' });
  }
};
