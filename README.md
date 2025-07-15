# Order Card Aplikace - Dokumentace

## 📋 Přehled aplikace

Order Card je webová aplikace zobrazující detail objednávky s možností přepočtu cen do různých měn. Aplikace načítá produkty z externího API a kurzy měn z České národní banky (ČNB).

## 🚀 Funkcionality

### Hlavní funkce
- **Zobrazení detailu objednávky** s informacemi o produktech
- **Dynamické načítání měn** z ČNB API (32 světových měn)
- **Přepočet cen** do vybrané měny v reálném čase
- **Fallback systém** pro případ nedostupnosti ČNB API
- **Responzivní design** s moderním uživatelským rozhraním

### Podporované měny
Aplikace podporuje 32 světových měn včetně:
- **Evropské**: EUR, GBP, CHF, DKK, NOK, SEK, PLN, HUF, BGN, RON
- **Americké**: USD, CAD, BRL, MXN
- **Asijské**: JPY, CNY, KRW, INR, IDR, MYR, THB, PHP, HKD, SGD
- **Ostatní**: AUD, NZD, ZAR, TRY, XDR a další

## 🏗️ Struktura aplikace

### Soubory
```
├── index.html          # Hlavní HTML struktura
├── styles.css          # CSS styly a layout
└── index.js           # JavaScript logika a API volání
```

## 📄 HTML Struktura

### Hlavní komponenty
- **Order Header**: ID objednávky a tlačítko Invoice
- **Currency Selector**: Rozbalovací menu pro výběr měny
- **Date Section**: Datum objednávky a odhadované doručení
- **Products Wrapper**: Kontejner pro dynamicky načtené produkty
- **Footer Info**: Informace o platbě a doručení

### Klíčové elementy
```html
<select id="currency-selector">
  <!-- Měny se načtou dynamicky z ČNB -->
</select>

<div class="products-wrapper"></div>
<!-- Produkty se načtou z FakeStore API -->
```

## 🎨 CSS Styly

### Design principy
- **Čistý minimalistický design** s bílým pozadím karty
- **Flexbox layout** pro responzivní rozvržení
- **Moderní UI elementy** s hover efekty a plynulými přechody
- **Typografie**: Arial font family pro čitelnost

### Klíčové třídy
- `.order-card`: Hlavní kontejner s box-shadow
- `.currency-selector-wrapper`: Umístění selectoru vpravo
- `.product-item`: Flexbox layout pro jednotlivé produkty
- `.price-container`: Sloupcové rozvržení ceny a množství

## 💻 JavaScript Funkcionalita

### Hlavní funkce

#### `fetchExchangeRates()`
```javascript
// Načítá kurzy měn z ČNB API
// Fallback: 32 statických kurzů při selhání
// Formát: textový soubor s oddělovači |
```

#### `populateCurrencySelector()`
```javascript
// Dynamicky naplňuje select element měnami
// Řazení: CZK první, pak alfabeticky
// Automatické nastavení CZK jako defaultní
```

#### `convertPrice(priceInUSD, targetCurrency)`
```javascript
// Převádí ceny z USD do vybrané měny
// Logika: USD → CZK → cílová měna
// Použití kurzů z ČNB API
```

#### `createProductCard(productData)`
```javascript
// Vytváří HTML kartu produktu
// Obsahuje: obrázek, název, velikost, cenu, rating
// Ukládá původní cenu pro přepočty
```

#### `updatePrices()`
```javascript
// Aktualizuje všechny ceny při změně měny
// Používá uložené původní ceny v USD
// Přepočítává pomocí convertPrice()
```

### API Integrace

#### ČNB Kurzy
- **URL**: `https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt`
- **CORS Proxy**: `https://api.allorigins.win/raw?url=`
- **Formát**: Textový soubor s oddělovači `|`
- **Struktura**: země|měna|množství|kód|kurz

#### FakeStore API
- **URL**: `https://fakestoreapi.com/products/category/women's%20clothing`
- **Formát**: JSON array s produkty
- **Data**: id, title, price, image, rating

### Fallback systém
```javascript
// 32 statických kurzů s komentáři
'EUR': 0.041,  // Euro, cca 24.7 CZK = 1 EUR
'USD': 0.047,  // Americký dolar, cca 21.1 CZK = 1 USD
// ... další měny
```

## 🔄 Tok aplikace

1. **Inicializace** při načtení DOM
2. **Načtení kurzů** z ČNB API (nebo fallback)
3. **Naplnění currency selectoru** dynamicky načtenými měnami
4. **Načtení produktů** z FakeStore API
5. **Zobrazení produktů** s cenami v CZK
6. **Event listener** pro změnu měny
7. **Přepočet cen** při změně selectoru

## 🛠️ Instalace a spuštění

### Požadavky
- Moderní webový prohlížeč
- Internetové připojení (pro API)
- Lokální webový server (kvůli CORS)

### Spuštění
1. Umístěte všechny soubory do jedné složky
2. Spusťte lokální server (např. Live Server)
3. Otevřete `index.html` v prohlížeči

## 🐛 Error Handling

### Implementované mechanismy
- **Try-catch bloky** pro všechna API volání
- **Fallback kurzy** při nedostupnosti ČNB
- **Console.error** pro debugování problémů
- **Kontrola existence** DOM elementů

### Možné problémy
- **CORS chyby**: Vyžaduje CORS proxy pro ČNB API
- **API nedostupnost**: Automatický fallback na statické kurzy
- **Síťové problémy**: Error handling s logováním

## 📱 Responzivní design

### Viewport
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

### CSS Media queries
- **Max-width: 600px** pro order-card
- **Flexbox layout** pro automatické přizpůsobení
- **Relativní jednotky** pro škálovatelnost



---

*Dokumentace vytvořena dne: Červenec 2025*  
*Verze aplikace: 1.0*
