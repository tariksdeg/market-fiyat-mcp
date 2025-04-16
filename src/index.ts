import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { searchProducts, getProductById, compareProductPrices } from "./api.js";
import { Product } from "./types.js";

// Create an MCP server
const server = new McpServer({
  name: "MarketFiyat",
  version: "1.0.0"
});

// Ürün arama aracı
server.tool("searchProducts",
  { query: z.string().min(2).describe("Aramak istediğiniz ürün adı") },
  async ({ query }) => {
    try {
      const results = await searchProducts(query);
      const formattedResults = results.content.map((product: Product) => ({
        id: product.id,
        name: product.name,
        lowestPrice: product.productDepotInfoList.length > 0 
          ? Math.min(...product.productDepotInfoList.map((p) => p.price))
          : "Fiyat bulunamadı",
        marketCount: product.productDepotInfoList.length
      }));

      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify(formattedResults, null, 2) 
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: `Ürün arama hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}` 
        }]
      };
    }
  }
);

// Ürün detaylarını getirme aracı
server.tool("getProductDetails",
  { productId: z.string().describe("Ürün ID'si") },
  async ({ productId }) => {
    try {
      const product = await getProductById(productId as string);
      if (!product) {
        return {
          content: [{ type: "text", text: `${productId} ID'li ürün bulunamadı` }]
        };
      }

      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify(product, null, 2) 
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: `Ürün detayları getirme hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}` 
        }]
      };
    }
  }
);

// Ürün fiyatlarını karşılaştırma aracı
server.tool("compareProductPrices",
  { 
    productId: z.string().describe("Ürün ID'si"),
    market: z.string().optional().describe("Market adı (opsiyonel)")
  },
  async ({ productId, market }) => {
    try {
      const comparison = await compareProductPrices(productId as string, market);
      
      const response = {
        ürün: comparison.product.name,
        enUcuz: comparison.priceComparison.cheapest 
          ? `${comparison.priceComparison.cheapest.price} ${comparison.priceComparison.cheapest.currency} (${comparison.priceComparison.cheapest.marketAdi})` 
          : "Bulunamadı",
        enPahalı: comparison.priceComparison.mostExpensive 
          ? `${comparison.priceComparison.mostExpensive.price} ${comparison.priceComparison.mostExpensive.currency} (${comparison.priceComparison.mostExpensive.marketAdi})` 
          : "Bulunamadı",
        ortalama: `${comparison.priceComparison.averagePrice.toFixed(2)} ${comparison.priceComparison.cheapest?.currency || "TL"}`,
        fiyatFarkı: `${comparison.priceComparison.priceRange.toFixed(2)} ${comparison.priceComparison.cheapest?.currency || "TL"} (%${comparison.priceComparison.priceDifferencePercentage.toFixed(2)})`
      };

      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify(response, null, 2) 
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: `Fiyat karşılaştırma hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}` 
        }]
      };
    }
  }
);

// Ürün kaynağı
server.resource(
  "product",
  new ResourceTemplate("product://{productId}", { list: undefined }),
  async (uri, { productId }) => {
    try {
      const product = await getProductById(productId as string);
      
      if (!product) {
        return {
          contents: [{
            uri: uri.href,
            text: `Ürün bulunamadı: ${productId}`
          }]
        };
      }
      
      // Fiyat bilgilerini string olarak oluştur
      let priceInfoText = "";
      
      if (product.productDepotInfoList && product.productDepotInfoList.length > 0) {
        for (const item of product.productDepotInfoList) {
          priceInfoText += `${item.marketAdi}: ${item.price} ${item.currency}\n`;
        }
      } else {
        priceInfoText = "Fiyat bilgisi bulunamadı";
      }
      
      return {
        contents: [{
          uri: uri.href,
          text: `# ${product.name}\n\n${product.description || ''}\n\n## Fiyatlar\n\n${priceInfoText}`
        }]
      };
    } catch (error) {
      return {
        contents: [{
          uri: uri.href,
          text: `Ürün bilgisi alınırken hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`
        }]
      };
    }
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
