let productList = null;
let exchangeRates = null;
let selectedCurrency = 'CZK'; // Výchozí měna

console.log("index.js loaded");

// Funkce pro načtení kurzů z ČNB API (textový formát)
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
    // Fallback kurzy v případě selhání API
    return {
      'CZK': 1,
      'EUR': 0.04,   // cca 25 CZK = 1 EUR
      'USD': 0.045,  // cca 22 CZK = 1 USD
      'GBP': 0.035,  // cca 28.5 CZK = 1 GBP
      'PLN': 0.19,   // cca 5.3 CZK = 1 PLN
      'CHF': 0.039   // cca 25.6 CZK = 1 CHF
    };
  }
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

    // Nastavení název
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

    // Hodnocení
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
    productsWrapper.innerHTML = ''; // Vyčistíme obsah před přidáním produktů

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
  // Načtení kurzů měn
  exchangeRates = await fetchExchangeRates();
  
  // Přidání event listeneru na selektor měn
  const currencySelector = document.getElementById('currency-selector');
  currencySelector.addEventListener('change', (event) => {
    console.log(event)
    selectedCurrency = event.target.value;
    updatePrices();
  });
  
  // Zobrazení produktů
  await displayProducts();
}

// Spuštění inicializace při načtení DOMu
document.addEventListener('DOMContentLoaded', init);
