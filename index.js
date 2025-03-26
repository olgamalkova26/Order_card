let productList = null;

console.log("index.js loaded");

// Formátování měny
const formatter = new Intl.NumberFormat("cs-CZ", {
  style: "currency",
  currency: "CZK",
});

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
      priceElement.textContent = formatter.format(productData.price);
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

async function displayProducts() {
  try {
    // Načtení produktů, pokud ještě nejsou načteny
    if (!productList) {
      productList = await fetchProducts();
    }

    const productsWrapper = document.querySelector(".products-wrapper");

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

// Spuštění funkce pro zobrazení produktů
displayProducts();
