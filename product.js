// Global variables for product functionality
let products = [];
let filteredProducts = [];

// Initialize product functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set up product-specific event listeners
    setupProductEventListeners();
    
    // Check if we're on the product list page
    if (window.location.pathname.includes('product-list.html')) {
        // Load products
        loadProducts();
    }
    
    // Check if we're on product detail page
    if (window.location.pathname.includes('product-detail.html')) {
        // Load product details
        loadProductDetails();
    }

    // Check if we're on add product  page
    if (window.location.pathname.includes('add-product.html')) {
        const productForm = document.getElementById("add-product-form");
        if (productForm) {
            productForm.addEventListener("submit", submitProductForm);
        }
    }
});

// Set up product-specific event listeners
function setupProductEventListeners() {
    // Search form submission
    const searchForm = document.querySelector('form[action="/search"]');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input[type="text"]');
            if (searchInput.value.trim()) {
                window.location.href = `product-list.html?search=${encodeURIComponent(searchInput.value.trim())}`;
            }
        });
    }

    // Search buttons
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const searchInput = document.getElementById('search-input');
            if (searchInput.value.trim()) {
                window.location.href = `product-list.html?search=${encodeURIComponent(searchInput.value.trim())}`;
            }
        });
    }

    // Mobile search button
    const mobileSearchInput = document.getElementById('mobile-search-input');
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                window.location.href = `product-list.html?search=${encodeURIComponent(this.value.trim())}`;
            }
        });
    }

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Reset search button
    const resetSearchButton = document.getElementById('reset-search');
    if (resetSearchButton) {
        resetSearchButton.addEventListener('click', function() {
            window.location.href = 'product-list.html';
        });
    }
}

// Load products from API or fallback data
async function loadProducts() {
    try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        const search = urlParams.get('search');
        
        // Build the API URL with parameters
        let apiUrl = `${baseUrl}/api/products`;
        if (category) {
            apiUrl += `?category=${encodeURIComponent(category)}`;
        }
        
        // Try to fetch from API first
        const response = await fetch(apiUrl);
        
        // Check if the request was successful
        if (response.ok) {
            products = await response.json();
            filteredProducts = [...products];
            
            // Handle search parameter if present
            if (search) {
                handleSearchParam();
            } else {
                // Update the category title if it exists
                updateCategoryTitle(category);
                // Render all products
                renderProductList(filteredProducts);
            }
        } else {
            let noProduct = [];
            renderProductList(noProduct);
        }
    } catch (error) {
        console.error('Error loading products:', error);
        renderProductList([]);
    }
}

// Update category title
function updateCategoryTitle(category) {
    const categoryTitle = document.getElementById('category-title');
    if (categoryTitle) {
        if (category) {
            categoryTitle.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} Products`;
        } else {
            categoryTitle.textContent = 'All Products';
        }
    }
}

// Handle search parameter
function handleSearchParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    
    // Apply search filter if present
    if (searchParam) {
        document.getElementById('search-input').value = searchParam;
        
        // Update the search result title if it exists
        const searchTitle = document.getElementById('search-title');
        if (searchTitle) {
            searchTitle.textContent = `Search Results for "${searchParam}"`;
        }
        
        // Filter products by search term
        applySearch(searchParam);
    }
}

// Apply search filter
function applySearch(searchTerm) {
    if (!searchTerm) {
        filteredProducts = [...products];
    } else {
        searchTerm = searchTerm.toLowerCase();
        filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Render the filtered products
    renderProductList(filteredProducts);
}

// Render product list on product-list.html
function renderProductList(products) {
    const productsContainer = document.getElementById('products-container');
    const noResultsElement = document.getElementById('no-results');
    
    if (!productsContainer) return;
    
    // Clear any existing content
    productsContainer.innerHTML = '';
    
    // Check if we have any products
    if (products.length === 0) {
        noResultsElement.classList.remove('hidden');
        productsContainer.classList.add('hidden');
        return;
    }
    
    // Hide no results message if we have products
    noResultsElement.classList.add('hidden');
    productsContainer.classList.remove('hidden');
    
    // Add each product
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'card p-6 group';
        
        productElement.innerHTML = `
            <div class="relative overflow-hidden rounded-lg mb-4">
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300">
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">${product.name}</h3>
            <p class="text-gray-600 mb-4 line-clamp-2">${product.description}</p>
            <div class="flex justify-between items-center">
                <span class="text-2xl font-bold text-indigo-600">$${product.price.toFixed(2)}</span>
                <div class="flex space-x-2">
                    <a href="product-detail.html?id=${product._id}" 
                       class="btn-secondary">
                        <i class="fas fa-info-circle mr-2"></i>Details
                    </a>
                    <button class="btn-primary" 
                            onclick="addToCart('${product._id}')">
                        <i class="fas fa-shopping-cart mr-2"></i>Add to Cart
                    </button>
                </div>
            </div>
        `;
        productsContainer.appendChild(productElement);
    });
    
    // Update the product count in the header if it exists
    const productCountElement = document.getElementById('product-count');
    if (productCountElement) {
        productCountElement.textContent = `${products.length} products`;
    }
}

// Load product details for the product detail page
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    console.log("urlParams: ", urlParams);
    const productId = urlParams.get('id');
    console.log("productId: ", productId);
    
    if (!productId) {
        window.location.href = 'product-list.html';
        return;
    }
    
    // If we haven't loaded products yet, load them
    if (products.length === 0) {
        // Try to fetch product details directly
        fetchProductDetails(productId);
        return;
    }
    
    // Try to find the product in our loaded products
    const product = products.find(p => p.id === productId);
    
    // If product wasn't found
    if (!product) {
        // Try to fetch it directly
        console.error("Product not found in loaded products");
        return;
    }
    
    // Display product details
    renderProductDetails(product);
}

// Fetch a single product's details from API
async function fetchProductDetails(productId) {
    console.log("product ID: ", productId);
    try {
        const response = await fetch(`${baseUrl}/api/products/${productId}`);
        
        if (response.ok) {
            const product = await response.json();
            renderProductDetails(product);
        } else {
            const product = products.find(p => p.id === productId);
            
            if (product) {
                renderProductDetails(product);
            } else {
                document.getElementById('product-not-found').classList.remove('hidden');
                document.getElementById('product-details').classList.add('hidden');
            }
        }
    } catch (error) {
        console.error('Error fetching product details:', error);
        
        const product = products.find(p => p.id === productId);
        
        if (product) {
            renderProductDetails(product);
        } else {
            document.getElementById('product-not-found').classList.remove('hidden');
            document.getElementById('product-details').classList.add('hidden');
        }
    }
}

// Render product details on the product detail page
function renderProductDetails(product) {
    const productDetailsElement = document.getElementById('product-details');
    if (!productDetailsElement) return;
    
    // Show the product details section
    productDetailsElement.classList.remove('hidden');
    
    // Hide the not found message
    const notFoundElement = document.getElementById('product-not-found');
    if (notFoundElement) {
        notFoundElement.classList.add('hidden');
    }
    
    // Update page elements with product details
    document.title = `${product.name} - TechFlow`;
    
    document.getElementById('product-image').src = product.image;
    document.getElementById('product-image').alt = product.name;
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-breadcrumb').textContent = product.name;
    
    // Set up the add to cart button
    const addToCartButton = document.getElementById('add-to-cart-button');
    if (addToCartButton) {
        addToCartButton.onclick = function() {
            addToCart(product._id);
        };
    }
}


// Show a toast notification
function showToast(message) {
    // Check if a toast container already exists
    let toastContainer = document.getElementById('toast-container');
    
    // If not, create one
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed bottom-4 right-4 z-50';
        document.body.appendChild(toastContainer);
    }
    
    // Create the toast element
    const toast = document.createElement('div');
    toast.className = 'bg-green-500 text-white px-4 py-2 rounded shadow-lg mb-2 transition-opacity duration-500 opacity-0';
    toast.innerText = message;
    
    // Add it to the container
    toastContainer.appendChild(toast);
    
    // Trigger animation to fade in
    setTimeout(() => {
        toast.classList.remove('opacity-0');
    }, 10);
    
    // Fade out and remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('opacity-0');
        
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 500);
    }, 3000);
}



// Function to handle product form submission
async function submitProductForm(event) {
    event.preventDefault(); // Prevent default form submission

    // Capture form inputs
    const name = document.getElementById("product-name").value.trim();
    const description = document.getElementById("description").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const stock = parseInt(document.getElementById("stock-quantity").value);
    const category = document.getElementById("product-category").value;
    const image = `https://placehold.co/600x400?text=${name}`
    const featured = document.getElementById("product-featured") 
        ? document.getElementById("product-featured").checked 
        : false;

    // Validate required fields
    if (!name || !description || isNaN(price) || isNaN(stock) || !category) {
        showNotification("Please fill in all required fields.");
        return;
    }

    // Construct product object
    const productData = {
        name,
        description,
        price,
        stock,
        image,
        category,
        featured
    };

    try {
        // Send data to API
        const response = await fetch(`${baseUrl}/api/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            showNotification("Product added successfully!");
            document.getElementById("add-product-form").reset(); // Reset the form
        } else {
            showNotification("Failed to add product.");
        }
    } catch (error) {
        console.error("Error submitting product:", error);
        showNotification("An error occurred. Please try again.");
    }
}