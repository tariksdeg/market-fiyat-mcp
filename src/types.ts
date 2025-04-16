// API istekleri için türler
export interface SearchRequest {
  keywords: string;
  depots?: string[];
  distance?: number;
  latitude?: string;
  longitude?: string;
}

export interface SearchByIdentityRequest {
  identity: string;
  identityType: 'id' | 'barcode' | 'name';
  depots?: string[];
  distance?: number;
  latitude?: string;
  longitude?: string;
}

// API yanıtları için türler
export interface SearchResponse {
  content: Product[];
  totalCount?: number;
  pageCount?: number;
  currentPage?: number;
}

// Ürün ve fiyat bilgileri için türler
export interface Product {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  barcode?: string;
  productDepotInfoList: ProductDepotInfo[];
}

export interface ProductDepotInfo {
  id: string;
  marketAdi: string;
  marketLogo?: string;
  price: number;
  currency: string;
  lastUpdated: string;
  inStock?: boolean;
}

// Fiyat karşılaştırması için türler
export interface ProductComparisonResult {
  product: Product;
  priceComparison: {
    cheapest: ProductDepotInfo | null;
    mostExpensive: ProductDepotInfo | null;
    averagePrice: number;
    priceRange: number;
    priceDifferencePercentage: number;
  };
} 