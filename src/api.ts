import axios from 'axios';
import dotenv from 'dotenv';
import { 
  SearchResponse, 
  SearchByIdentityRequest, 
  SearchRequest,
  Product,
  ProductDepotInfo,
  ProductComparisonResult
} from './types.js';

// .env dosyasından yapılandırmayı yükle
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.marketfiyati.org.tr/api/v2';
const LOCATION_LATITUDE = process.env.LOCATION_LATITUDE || "50.075539";
const LOCATION_LONGITUDE = process.env.LOCATION_LONGITUDE || "50";

// Depots listesini .env'den al veya varsayılan listeyi kullan
// Market kodları
const DEFAULT_DEPOTS = [
  "a101-H166",
  "bim-O867",
  "sok-C875",
  "tarim_kredi-5022",
];

const DEPOTS = process.env.DEPOTS ? process.env.DEPOTS.split(',') : DEFAULT_DEPOTS;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export async function searchProducts(query: string): Promise<SearchResponse> {
  try {
    const requestData: SearchRequest = {
        depots: process.env.DEPOTS ? DEPOTS : undefined,
        distance: 1,
        keywords: query,
        latitude: LOCATION_LATITUDE,
        longitude: LOCATION_LONGITUDE,
      
    };
    
    const response = await apiClient.post<SearchResponse>('/search', requestData);
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error(`Failed to search products: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const requestData: SearchByIdentityRequest = {
        depots: process.env.DEPOTS ? DEPOTS : undefined,
        distance: 1,
        identity: productId,
        identityType: "id",
        latitude: LOCATION_LATITUDE,
        longitude: LOCATION_LONGITUDE,
      
    };
    
    const response = await apiClient.post<SearchResponse>('/searchByIdentity', requestData);
    
    if (response.data.content && response.data.content.length > 0) {
      return response.data.content[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error getting product by ID:', error);
    throw new Error(`Failed to get product by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function compareProductPrices(productId: string, market?: string): Promise<ProductComparisonResult> {
  try {
    const product = await getProductById(productId);
    
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }
    
    let priceList = product.productDepotInfoList;
    
    // Belirli bir market için filtreleme yap
    if (market) {
      priceList = priceList.filter(item => 
        item.marketAdi.toLowerCase() === market.toLowerCase()
      );
    }
    
    // Fiyata göre sırala
    priceList.sort((a, b) => a.price - b.price);
    
    // En ucuz, en pahalı ve ortalama fiyatları hesapla
    const cheapest = priceList.length > 0 ? priceList[0] : null;
    const mostExpensive = priceList.length > 0 ? priceList[priceList.length - 1] : null;
    const averagePrice = priceList.length > 0
      ? priceList.reduce((sum, item) => sum + item.price, 0) / priceList.length
      : 0;
    
    return {
      product,
      priceComparison: {
        cheapest,
        mostExpensive,
        averagePrice,
        priceRange: mostExpensive && cheapest 
          ? mostExpensive.price - cheapest.price 
          : 0,
        priceDifferencePercentage: cheapest && mostExpensive 
          ? ((mostExpensive.price - cheapest.price) / cheapest.price) * 100 
          : 0
      }
    };
  } catch (error) {
    console.error('Error comparing product prices:', error);
    throw new Error(`Failed to compare product prices: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 