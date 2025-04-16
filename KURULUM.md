# Market Fiyat MCP - Kurulum Kılavuzu

Bu belge, Market Fiyat MCP (Model Context Protocol) uygulamasını kurmak, yapılandırmak ve çalıştırmak için gerekli adımları içerir.

## Gereksinimler

- Node.js (v16 veya üzeri)
- npm (v7 veya üzeri)

## Kurulum Adımları

1. Depoyu klonlayın veya indirin:

```bash
git clone https://github.com/kullanici_adiniz/market-fiyat-mcp.git
cd market-fiyat-mcp
```

2. Bağımlılıkları yükleyin:

```bash
npm install
```

3. `.env` dosyasını yapılandırın:

`.env` dosyasında API URL'lerini ve diğer yapılandırma seçeneklerini ayarlayabilirsiniz:

```
API_BASE_URL=https://api.marketfiyati.org.tr/api/v2
# API_KEY=your_api_key_here_if_needed
```

4. Uygulamayı derleyin:

```bash
npm run build
```

## Çalıştırma

Uygulamayı başlatmak için:

```bash
npm start
```

Geliştirme modunda çalıştırmak için:

```bash
npm run dev
```

## Model Context Protocol (MCP) Özellikleri

Bu uygulama, aşağıdaki MCP araçlarını sağlar:

1. **searchProducts**: Ürün adına göre arama yapar

   - Parametre: `query` - Aranacak ürün adı (en az 2 karakter)

2. **getProductDetails**: Belirli bir ürünün detaylarını getirir

   - Parametre: `productId` - Ürün ID'si

3. **compareProductPrices**: Ürün fiyatlarını karşılaştırır
   - Parametreler:
     - `productId` - Ürün ID'si
     - `market` (opsiyonel) - Belirli bir market için filtreleme

Bu uygulama ayrıca aşağıdaki MCP kaynaklarını sağlar:

1. **product**: Ürün bilgilerini gösterir
   - URI formatı: `product://{productId}`

## API Kullanımı

Kendi kodunuzda API'yi şu şekilde kullanabilirsiniz:

```typescript
import {
  searchProducts,
  getProductById,
  compareProductPrices,
} from "./src/api.js";

// Ürün arama
const results = await searchProducts("süt");
console.log(results);

// Ürün detayı getirme
const product = await getProductById("12345");
console.log(product);

// Fiyat karşılaştırma
const comparison = await compareProductPrices("12345", "A101");
console.log(comparison);
```
