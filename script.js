let productList = null;

async function fetchProducts() {
  try {
    const response = await fetch(
      "https://fakestoreapi.com/products/category/women's%20clothing",
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    productList = await response.json();
    return productList;
  } catch (error) {
    console.error('Error fetching products:', error);
    return null;
  }
}

async function displayProducts() {
  try {
    // Načtení produktů, pokud ještě nejsou načteny
    if (!productList) {
      productList = await fetchProducts();
    }

    // ID produktů, které chceme zobrazit
    const productIds = [15, 16, 17];

    // Formátování měny
    const formatter = new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
    });

    // Načtení a zobrazení dat pro každé ID produktu
    productIds.forEach((productId, index) => {
      const product = productList.find((p) => p.id === productId);

      if (product) {
        const productNumber = index + 1;

        // Najdi elementy pro aktuální produkt
        const productContainer = document.querySelector(
          `.product-item ${productNumber}`,
        );
        if (productContainer) {
          // Nastavení obrázku
          const imageElement = productContainer.querySelector('.product-image');
          if (imageElement) {
            imageElement.src = product.image;
          }

          // Nastavení název
          const nameElement = productContainer.querySelector('.product-name');
          if (nameElement) {
            nameElement.textContent = product.title;
          }

          // Nastavení ceny
          const priceElement = productContainer.querySelector('.product-price');
          if (priceElement) {
            priceElement.textContent = formatter.format(product.price);
          }
        }
      }
    });
  } catch (error) {
    console.error('Chyba při zpracování produktů:', error);
  }
}

// Spuštění funkce pro zobrazení produktů
displayProducts();
