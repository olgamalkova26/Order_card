let productList = null;
let exchangeRates = null;
let selectedCurrency = 'CZK'; // Výchozí měna

console.log("index.js loaded");

// Funkce pro načtení kurzů z ČNB API
async function fetchExchangeRates() {
  try {
    const response = await fetch('https://api.cnb.cz/cnbapi/exrates/daily?lang=en');
    
    if (!response.ok) {
      throw new Error("Nelze získat kurzy ČNB");
    }
    
    const data = await response.json();
    const rates = {};
    
    // Zpracování kurzů z API ČNB
    rates['CZK'] = 1; // Koruna česká jako základ
    
    data.rates.forEach(rate => {
      // ČNB poskytuje kurzy jako množství cizí měny za CZK
      // Proto musíme vypočítat převrácený kurz pro konverzi
      rates[rate.code] = rate.amount / rate.rate;
    });
    
    // Přidáme EUR, pokud není v API (ČNB někdy neobsahuje EUR)
    if (!rates['EUR']) {
      rates['EUR'] = 0.04; // přibližně 25 CZK = 1 EUR
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
      'SAR': 0.12,   // cca 8.33 CZK = 1 SAR
      'RUB': 0.4     // cca 2.5 CZK = 1 RUB
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
    selectedCurrency = event.target.value;
    updatePrices();
  });
  
  // Zobrazení produktů
  await displayProducts();
}

// Spuštění inicializace při načtení DOMu
document.addEventListener('DOMContentLoaded', init);
