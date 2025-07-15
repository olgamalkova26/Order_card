let productList = null;
let exchangeRates = null;
let selectedCurrency = 'CZK'; // Výchozí měna

console.log("index.js loaded");

// Funkce pro načtení kurzů z ČNB API (txt formát)
async function fetchExchangeRates() {
  try {
    // Použití CORS proxy pro načtení dat z ČNB
    const corsProxy = 'https://api.allorigins.win/raw?url=';
    const cnbUrl = 'https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt';
    const response = await fetch(corsProxy + encodeURIComponent(cnbUrl));

    if (!response.ok) {
      throw new Error("Nelze získat kurzy ČNB");
    }
    
    const text = await response.text();
    const rates = {};
    
    // Zpracování textových dat z ČNB
    const lines = text.trim().split('\n');
    
    // První řádek obsahuje datum a číslo
    console.log("ČNB data ze dne:", lines[0]);
    
    // Nastavení CZK jako základní měny
    rates['CZK'] = 1;
    
    // Zpracování řádků s kurzy (od třetího řádku dále)
    for (let i = 2; i < lines.length; i++) {
      const columns = lines[i].split('|');
      if (columns.length >= 5) {
        const code = columns[3];         // Kód měny (např. EUR, USD)
        const amount = parseFloat(columns[2]);  // Množství (např. 1, 100)
        const rateValue = parseFloat(columns[4].replace(',', '.')); // Kurz s desetinnou čárkou převedenou na tečku
        
        // Výpočet kurzu: kolik cizí měny dostaneme za 1 CZK
        rates[code] = amount / rateValue;
      }
    }
    
    console.log("Načtené kurzy:", rates);
    return rates;
  } catch (error) {
    console.error("Chyba při načítání kurzů:", error);
    // Fallback kurzy v případě selhání načtení z ČNB txt souboru
    return {
      'CZK': 1,           // Česká koruna - základní měna
      'AUD': 0.072,       // Australský dolar, cca 13.9 CZK = 1 AUD
      'BGN': 0.079,       // Bulharský lev, cca 12.6 CZK = 1 BGN
      'BRL': 0.265,       // Brazilský real, cca 3.8 CZK = 1 BRL
      'CAD': 0.065,       // Kanadský dolar, cca 15.4 CZK = 1 CAD
      'CHF': 0.038,       // Švýcarský frank, cca 26.5 CZK = 1 CHF
      'CNY': 0.339,       // Čínský jüan, cca 2.9 CZK = 1 CNY
      'DKK': 0.303,       // Dánská koruna, cca 3.3 CZK = 1 DKK
      'EUR': 0.041,       // Euro, cca 24.7 CZK = 1 EUR
      'GBP': 0.035,       // Britská libra, cca 28.4 CZK = 1 GBP
      'HKD': 0.371,       // Hongkongský dolar, cca 2.7 CZK = 1 HKD
      'HUF': 16.234,      // Maďarský forint, cca 0.06 CZK = 1 HUF
      'IDR': 769.231,     // Indonéská rupie, cca 0.001 CZK = 1 IDR
      'ILS': 0.158,       // Izraelský šekel, cca 6.3 CZK = 1 ILS
      'INR': 4.061,       // Indická rupie, cca 0.25 CZK = 1 INR
      'ISK': 5.773,       // Islandská koruna, cca 0.17 CZK = 1 ISK
      'JPY': 6.998,       // Japonský jen, cca 0.14 CZK = 1 JPY
      'KRW': 65.317,      // Jihokorejský won, cca 0.015 CZK = 1 KRW
      'MXN': 0.885,       // Mexické peso, cca 1.1 CZK = 1 MXN
      'MYR': 0.201,       // Malajsijský ringgit, cca 5.0 CZK = 1 MYR
      'NOK': 0.481,       // Norská koruna, cca 2.1 CZK = 1 NOK
      'NZD': 0.079,       // Novozélandský dolar, cca 12.7 CZK = 1 NZD
      'PHP': 2.682,       // Filipínské peso, cca 0.37 CZK = 1 PHP
      'PLN': 0.172,       // Polský zlotý, cca 5.8 CZK = 1 PLN
      'RON': 0.206,       // Rumunský leu, cca 4.9 CZK = 1 RON
      'SEK': 0.457,       // Švédská koruna, cca 2.2 CZK = 1 SEK
      'SGD': 0.061,       // Singapurský dolar, cca 16.4 CZK = 1 SGD
      'THB': 1.536,       // Thajský baht, cca 0.65 CZK = 1 THB
      'TRY': 1.902,       // Turecká lira, cca 0.53 CZK = 1 TRY
      'USD': 0.047,       // Americký dolar, cca 21.1 CZK = 1 USD
      'XDR': 0.035,       // Zvláštní práva čerpání (MMF), cca 28.6 CZK = 1 XDR
      'ZAR': 0.842        // Jihoafrický rand, cca 1.2 CZK = 1 ZAR
    };
  }
}

// Funkce pro naplnění selectu měnami z ČNB
function populateCurrencySelector() {
  const currencySelector = document.getElementById('currency-selector');
  
  if (!currencySelector || !exchangeRates) {
    console.error("Currency selector nebo exchange rates nejsou dostupné");
    return false;
  }
  console.log("Naplnění currency selectoru měnami z ČNB");

  // Vyčištění původního obsahu
  currencySelector.innerHTML = '';
  
  // Pole měn seřazené podle priority (CZK první, pak alfabeticky)
  const currencies = Object.keys(exchangeRates).sort((a, b) => {
    if (a === 'CZK') return -1;
    if (b === 'CZK') return 1;
    return a.localeCompare(b);
  });
  
  // Přidání option elementu pro každou měnu
  currencies.forEach(currency => {
    const option = document.createElement('option');
    option.value = currency;
    option.textContent = currency;
    
    // Nastavení CZK jako defaultní měny
    if (currency === selectedCurrency) {
      option.selected = true;
    }
    
    currencySelector.appendChild(option);
  });
  
  console.log("Currency selector naplněn měnami:", currencies.length);
  return true;
}

// Funkce pro formátování měny
function formatCurrency(amount, currency) {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

// Funkce pro konverzi ceny z USD (původní měna API) do vybrané měny
function convertPrice(priceInUSD, targetCurrency) {
  if (!exchangeRates) return priceInUSD;
  
  // Předpokládáme, že ceny z API jsou v USD
  const priceInCZK = priceInUSD * (1/exchangeRates['USD']); // Konverze do CZK
  const priceInTargetCurrency = priceInCZK * exchangeRates[targetCurrency];
  
  return priceInTargetCurrency;
}

const createProductCard = (productData) => {
  const productCardElement = document.createElement("div");
  productCardElement.className = "product-item";
  productCardElement.innerHTML = `
        <img class="product-image" alt="product-name" />
        <div class="product-details">
          <div class="product-name"></div>
          <div class="product-size">L</div>
        </div>
        <div class="price-container">
          <div class="product-price"></div>
          <div class="quantity">Qty:1</div>
          <div class="rating"></div>
        </div>
      `;

  if (productCardElement) {
    // Nastavení obrázku
    const imageElement = productCardElement.querySelector(".product-image");
    if (imageElement) {
      imageElement.src = productData.image;
    }

    // Nastavení názvu
    const nameElement = productCardElement.querySelector(".product-name");
    if (nameElement) {
      nameElement.textContent = productData.title;
    }

    // Nastavení ceny
    const priceElement = productCardElement.querySelector(".product-price");
    if (priceElement) {
      const convertedPrice = convertPrice(productData.price, selectedCurrency);
      priceElement.textContent = formatCurrency(convertedPrice, selectedCurrency);
      // Uložíme původní cenu jako data atribut pro budoucí přepočty
      priceElement.dataset.originalPrice = productData.price;
  }

    // Hodnocení produktu
    const ratingElement = productCardElement.querySelector(".rating");
    if (ratingElement) {
      ratingElement.textContent = productData.rating.rate;
    }
  }

  return productCardElement;
};

async function fetchProducts() {
  try {
    const response = await fetch(
      "https://fakestoreapi.com/products/category/women's%20clothing"
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    productList = await response.json();
    return productList;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
}

// Funkce pro aktualizaci cen při změně měny
function updatePrices() {
  const priceElements = document.querySelectorAll('.product-price');
  
  priceElements.forEach(element => {
    console.log(element)
    const originalPrice = parseFloat(element.dataset.originalPrice);
    const convertedPrice = convertPrice(originalPrice, selectedCurrency);
    element.textContent = formatCurrency(convertedPrice, selectedCurrency);
  });
}

async function displayProducts() {
  try {
    // Načtení kurzů měn
    if (!exchangeRates) {
      exchangeRates = await fetchExchangeRates();
    }
    
    // Načtení produktů, pokud ještě nejsou načteny
    if (!productList) {
      productList = await fetchProducts();
    }

    const productsWrapper = document.querySelector(".products-wrapper");
    productsWrapper.innerHTML = ''; // Vyčištění obsahu před přidáním produktů

    const singleProductItem = createProductCard(productList[0]);
    productsWrapper.appendChild(singleProductItem);

    productList.forEach((productItem) => {
      const productElm = createProductCard(productItem);
      productsWrapper.appendChild(productElm);
    });
  } catch (error) {
    console.error("Chyba při zpracování produktů:", error);
  }
}

// Inicializace aplikace
async function init() {
  try {
    // Načtení kurzů měn
    exchangeRates = await fetchExchangeRates();
    
    // Naplnění currency selectoru měnami z ČNB
    populateCurrencySelector();
    
    // Přidání event listeneru na selektor měn
    const currencySelector = document.getElementById('currency-selector');
    if (currencySelector) {
      currencySelector.addEventListener('change', (event) => {
        selectedCurrency = event.target.value;
        updatePrices();
        console.log("Změna měny na:", selectedCurrency);
      });
    }
    
    // Zobrazení produktů
    await displayProducts();
    
    console.log("Aplikace úspěšně inicializována");
  } catch (error) {
    console.error("Chyba během inicializace:", error);
  }
}

// Spuštění inicializace při načtení DOMu
document.addEventListener('DOMContentLoaded', init);