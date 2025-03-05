const productContainer = document.getElementById("productContainer");
const cartItems = document.getElementById("cartItems");
const totalPriceElement = document.getElementById("totalPrice");

let total = 0;
let allProducts = [];

document.body.innerHTML = "";

const loader = document.createElement("div");
loader.classList.add("loader");
loader.style.width = "50px";
loader.style.height = "50px";
loader.style.border = "5px solid #f3f3f3";
loader.style.borderTop = "5px solid #3498db";
loader.style.borderRadius = "50%";
loader.style.animation = "spin 1s linear infinite";
loader.style.position = "absolute";
loader.style.top = "50%";
loader.style.left = "50%";
loader.style.transform = "translate(-50%, -50%)";
document.body.appendChild(loader);

const style = document.createElement("style");
style.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(data => {
        allProducts = data;
        setTimeout(() => {
            document.body.innerHTML = `
                <input type="text" id="searchInput" placeholder="Search products...">
                <select id="categoryFilter">
                    <option value="all">All Categories</option>
                </select>
                <select id="priceSort">
                    <option value="default">Sort by Price</option>
                    <option value="low">Low to High</option>
                    <option value="high">High to Low</option>
                </select>
                <div id="productContainer"></div>
                <ul id="cartItems"></ul>
                <p id="totalPrice">Total: 0</p>
            `;
            loader.remove();
            populateCategories();
            displayProducts(allProducts);
            document.getElementById("priceSort").addEventListener("change", sortByPrice);
            document.getElementById("searchInput").addEventListener("input", searchProducts);
        }, 1000);
    });

    function populateCategories() {
        const categoryFilter = document.getElementById("categoryFilter");
        const categories = Array.from(new Set(allProducts.map(product => product.category)));
        
        const fragment = document.createDocumentFragment();
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            fragment.appendChild(option);
        });
        
        categoryFilter.appendChild(fragment);
        categoryFilter.addEventListener("change", filterByCategory);
    }
    
function filterByCategory() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    let filteredProducts;
    if (selectedCategory === "all") {
        filteredProducts = allProducts;
    } else {
        filteredProducts = allProducts.filter(product => product.category === selectedCategory);
    }
    displayProducts(filteredProducts);
}

function sortByPrice() {
    const sortValue = document.getElementById("priceSort").value;
    let sortedProducts = [...allProducts];
    if (sortValue === "low") {
        sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === "high") {
        sortedProducts.sort((a, b) => b.price - a.price);
    }
    displayProducts(sortedProducts);
}

function searchProducts() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    let filteredProducts = [];
    if (query) {
        filteredProducts = allProducts.filter(product => product.title.toLowerCase().includes(query));
    } else {
        filteredProducts = allProducts;
    }
    displayProducts(filteredProducts);
}

function displayProducts(products) {
    const productContainer = document.getElementById("productContainer");
    productContainer.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <h3>${product.title}</h3>
            <p>${product.description.slice(0, 100)}...</p>
            <p><strong>${product.price}</strong></p>
            <button onclick="addToCart(${product.id}, '${product.title}', ${product.price})">Add to Cart</button>
        `;
        card.style.opacity = 0;
        card.style.transform = "translateY(20px)";
        setTimeout(() => {
            card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
            card.style.opacity = 1;
            card.style.transform = "translateY(0)";
        }, 100);
        productContainer.appendChild(card);
    });
}

function addToCart(id, title, price) {
    const cartItem = document.createElement("li");
    cartItem.textContent = `${title} - ${price}`;
    document.getElementById("cartItems").appendChild(cartItem);
    total += price;
    document.getElementById("totalPrice").textContent = `Total: ${total.toFixed(2)}`;
}
