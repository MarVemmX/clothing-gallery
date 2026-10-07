export type CategoryId = 'all' | 'suits' | 'casual' | 'denim' | 'senators';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  tagline: string;
  badge?: string;
}

export interface ColorVariant {
  id: string;
  name: string;
  hex: string;
  dotColor: string;
  frontImg: string;
  backImg: string;
  modelImg: string; // Editorial real-life model photo in the corner!
  modelCaption?: string;
  status?: string;
  stockSlots?: number;
  filter?: string; // Optional authentic CSS fabric tint filter for distinct colorways
}

export interface SizeOption {
  key: string;
  label: string;
  scale: number;
  chest: string;
  length: string;
}

export interface GarmentDesign {
  id: string;
  code: string;
  category: CategoryId;
  categoryLabel: string;
  title: string;
  subtitle: string;
  series: string;
  cut: string;
  lapelOrCollar: string;
  fabric: string;
  priceNaira: string;
  priceRaw: number;
  description: string;
  leadTime: string;
  colorVariants: ColorVariant[];
  defaultColorId: string;
}

export interface CartItem {
  cartItemId: string;
  garmentId: string;
  title: string;
  category: CategoryId;
  color: {
    id: string;
    name: string;
    hex: string;
    thumbImg: string;
    filter?: string;
  };
  size: SizeOption;
  priceNaira: string;
  priceRaw: number;
  quantity: number;
}
