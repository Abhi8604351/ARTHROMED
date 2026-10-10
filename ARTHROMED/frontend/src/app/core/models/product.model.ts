export type ProductCategory =
  | 'Knee'
  | 'Shoulder'
  | 'Cold Therapy'
  | 'Spine'
  | 'Foot & Ankle'
  | 'General Orthopedics';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  sku: string;
  price: string | number;
  imageUrl: string;
  shortDescription: string;
  fullDescription: string;
  keyFeatures: string[];
  sizes: string[];
  hcpcsCode: string;
  fittingGuideUrl: string;
  specs: ProductSpec[];
  isPublished: boolean;
  createdAt: string;
}
