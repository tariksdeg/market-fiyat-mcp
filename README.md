# Market Fiyat MCP

Bu proje, Model Context Protocol (MCP) kullanarak market fiyatlarını izlemek için geliştirilmiş bir uygulamadır.

## Gereksinimler

- Node.js 22.x sürümü
- npm 10.x veya üzeri

## Kurulum

```bash
# Bağımlılıkları yükleyin
npm install

# Projeyi derleyin
npm run build
```

## Kullanım

```bash
# Uygulamayı başlatmak için
npm start

# Geliştirme modunda çalıştırmak için
npm run dev
```

## Konum Bilgisi

Bu uygulama, yakındaki marketlerin fiyatlarını göstermek için konum bilgisine ihtiyaç duyar. API çağrılarında aşağıdaki konum parametreleri kullanılır:

- `latitude`: Enlem değeri
- `longitude`: Boylam değeri

Konum bilgilerini güncellemek için `.env` dosyasını düzenleyebilir veya API çağrılarında direkt olarak değiştirebilirsiniz.

## MCP Kaynakları

Bu uygulama, aşağıdaki MCP kaynaklarını sağlar:

- `greeting`: Dinamik olarak kişiselleştirilmiş karşılama mesajları oluşturur.

## MCP Araçları

Bu uygulama, aşağıdaki MCP araçlarını sağlar:

- `searchProducts`: Ürün adına göre arama yapar
- `getProductDetails`: Ürün ID'sine göre detaylı bilgi sağlar
- `compareProductPrices`: Bir ürünün farklı marketlerdeki fiyatlarını karşılaştırır

## Node.js 22 Özellikleri

Bu proje Node.js 22 sürümünün aşağıdaki özelliklerinden yararlanmaktadır:

- Gelişmiş ES modül desteği
- Daha hızlı başlangıç süresi ve performans iyileştirmeleri
- Gelişmiş fetch API desteği

Not: Node.js 22 kullanırken, modern JavaScript özelliklerinin tümü desteklenmektedir, ancak bazı eski paketlerle uyumluluk sorunları yaşanabilir.

## MCP Yapılandırması

Bu uygulamayı MCP sunucusu olarak yapılandırmak için `.cursor/mcp.json` dosyasını aşağıdaki gibi düzenleyebilirsiniz:

{
"mcpServers": {
"market-fiyat-mcp": {
"command": "node",
"args": ["TAMYOL\\market-fiyat-mcp\\dist\\index.js"]
}
}
}

## Yapılandırma Ayarları

Uygulama, aşağıdaki yapılandırma ayarlarını `.env` dosyasından okur:

- `API_BASE_URL`: API'nin temel URL'i (varsayılan: "https://api.marketfiyati.org.tr/api/v2")
- `LOCATION_LATITUDE`: Konum enlem değeri
- `LOCATION_LONGITUDE`: Konum boylam değeri
- `DEPOTS`: Sorgulanacak market kodları listesi (virgülle ayrılmış)

Örnek `.env` dosyası:
