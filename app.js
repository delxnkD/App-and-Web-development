// Global variables
let cart = [];
let baseUrl = 'http://localhost:5000';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the cart from localStorage
    initCart();
    
    // Set up event listeners for shared elements
    setupSharedEventListeners();
    
    // Check if we're on the cart page
    if (window.location.pathname.includes('cart.html')) {
        // Render cart items
        renderCartPage();
    }
    
    // Check if we're on the orders page
    if (window.location.pathname.includes('orders.html')) {
        // Load order history
        loadOrderHistory();
    }
});

// Initialize cart from localStorage
function initCart() {
    const savedCart = localStorage.getItem('techmart-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('techmart-cart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count in the UI
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        let totalItems = 0;
        cart.forEach(item => {
            totalItems += item.quantity;
        });
        cartCountElement.innerText = totalItems;
    }
}

// Set up event listeners for shared elements
function setupSharedEventListeners() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            const mobileMenu = document.getElementById('mobile-menu');
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Newsletter subscription
    const newsletterForm = document.querySelector('form[class*="newsletter"]');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput.value.trim()) {
                // This would normally send to an API
                alert('Thanks for subscribing!');
                emailInput.value = '';
            }
        });
    }
}

// Add product to cart
function addToCart(productId) {
    // Find the product
    fetch(`${baseUrl}/api/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            if (!product) {
                console.error(`Product with ID ${productId} not found.`);
                return;
            }
            
            // Check if product is already in cart
            const existingItemIndex = cart.findIndex(item => item.id === productId);
            
            if (existingItemIndex >= 0) {
                // Update quantity if already in cart
                cart[existingItemIndex].quantity += 1;
            } else {
                // Add new item to cart
                cart.push({
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }
            
            // Save cart to localStorage
            saveCart();
            
            // Show notification
            showNotification(`${product.name} added to cart!`);
        })
        .catch(error => {
            console.error('Error fetching product:', error);
            showNotification('Error adding product to cart.');
        });
}

// Show notification
function showNotification(message) {
    // Check if a notification container already exists
    let notificationContainer = document.getElementById('notification-container');
    
    // Create one if it doesn't exist
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.className = 'fixed bottom-4 right-4 z-50';
        document.body.appendChild(notificationContainer);
    }
    
    // Create the notification element
    const notification = document.createElement('div');
    notification.className = 'bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg mb-2 transform transition-all duration-300 translate-y-full opacity-0';
    notification.textContent = message;
    
    // Add it to the container
    notificationContainer.appendChild(notification);
    
    // Trigger animation to show the notification
    setTimeout(() => {
        notification.classList.remove('translate-y-full', 'opacity-0');
    }, 10);
    
    // Remove the notification after a delay
    setTimeout(() => {
        notification.classList.add('translate-y-full', 'opacity-0');
        
        // Remove the element from the DOM after animation completes
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Render cart page
function renderCartPage() {
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartEmptyMessage = document.getElementById('cart-empty');
    const checkoutButton = document.getElementById('checkout-button');
    
    if (!cartItemsElement || !cartTotalElement) return;
    
    // Check if cart is empty
    if (cart.length === 0) {
        if (cartEmptyMessage) cartEmptyMessage.classList.remove('hidden');
        if (cartItemsElement) cartItemsElement.classList.add('hidden');
        if (checkoutButton) checkoutButton.classList.add('hidden');
        if (cartTotalElement) cartTotalElement.textContent = '$0.00';
        return;
    }
    
    // Cart has items
    if (cartEmptyMessage) cartEmptyMessage.classList.add('hidden');
    if (cartItemsElement) cartItemsElement.classList.remove('hidden');
    if (checkoutButton) checkoutButton.classList.remove('hidden');
    
    // Clear current items
    cartItemsElement.innerHTML = '';
    
    // Calculate total
    let subtotal = 0;
    
    // Add each item to the cart
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'card p-6 mb-4';
        cartItemElement.innerHTML = `
            <div class="flex items-center">
                <div class="relative w-24 h-24 mr-6">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover rounded-lg">
                </div>
                <div class="flex-grow">
                    <h3 class="text-lg font-semibold text-gray-900 mb-1">${item.name}</h3>
                    <p class="text-gray-600 mb-2">$${item.price.toFixed(2)} x ${item.quantity}</p>
                    <div class="flex items-center space-x-3">
                        <button class="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors" 
                                onclick="updateCartItem('${item.id}', ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="font-medium">${item.quantity}</span>
                        <button class="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors" 
                                onclick="updateCartItem('${item.id}', ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="text-right ml-6">
                    <div class="text-xl font-bold text-indigo-600 mb-2">$${itemTotal.toFixed(2)}</div>
                    <button class="text-red-500 hover:text-red-600 transition-colors" onclick="removeCartItem('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartItemsElement.appendChild(cartItemElement);
    });
    
    // Calculate tax (10%)
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    // Update all summary elements
    const subtotalElement = document.getElementById('cart-subtotal');
    const taxElement = document.getElementById('cart-tax');
    const totalElement = document.getElementById('cart-total');
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

// Update cart item quantity
function updateCartItem(productId, newQuantity) {
    console.log("Clicked updateCartItem: ", productId, newQuantity);
    // Find the item in the cart
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex === -1) return;
    
    // If quantity is 0 or less, remove the item
    if (newQuantity <= 0) {
        removeCartItem(productId);
        return;
    }
    
    // Update the quantity
    cart[itemIndex].quantity = newQuantity;
    
    // Save cart to localStorage
    saveCart();
    
    // Re-render the cart page if we're on it
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
    }
}

// Remove item from cart
function removeCartItem(productId) {
    // Filter out the item with the given ID
    cart = cart.filter(item => item.id !== productId);
    
    // Save cart to localStorage
    saveCart();
    
    // Re-render the cart page if we're on it
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
    }
}

// Clear entire cart
function clearCart() {
    cart = [];
    saveCart();
    
    // Re-render the cart page if we're on it
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
    }
}

// Load order history
function loadOrderHistory() {
    // This would normally fetch from an API, but for demo we'll use localStorage
    const orders = JSON.parse(localStorage.getItem('techmart-orders') || '[]');
    
    const orderHistoryElement = document.getElementById('order-history');
    const emptyOrdersMessage = document.getElementById('empty-orders');
    
    if (!orderHistoryElement) return;
    
    // Check if there are no orders
    if (orders.length === 0) {
        if (emptyOrdersMessage) emptyOrdersMessage.classList.remove('hidden');
        orderHistoryElement.classList.add('hidden');
        return;
    }
    
    // Orders exist
    if (emptyOrdersMessage) emptyOrdersMessage.classList.add('hidden');
    orderHistoryElement.classList.remove('hidden');
    
    // Clear existing content
    orderHistoryElement.innerHTML = '';
    
    // Add each order
    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'card p-6 mb-6';
        
        // Calculate order total
        let orderTotal = 0;
        order.items.forEach(item => {
            orderTotal += item.price * item.quantity;
        });
        
        // Create order header
        const orderHeader = document.createElement('div');
        orderHeader.className = 'flex justify-between items-center border-b border-gray-100 pb-4 mb-4';
        orderHeader.innerHTML = `
            <div>
                <h3 class="text-lg font-semibold text-gray-900">Order #${order.id}</h3>
                <p class="text-sm text-gray-500">${new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div>
                <span class="px-3 py-1 rounded-full text-sm ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                    order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                    'bg-yellow-100 text-yellow-800'
                }">${order.status}</span>
            </div>
        `;
        orderElement.appendChild(orderHeader);
        
        // Create order items
        const orderItems = document.createElement('div');
        orderItems.className = 'space-y-4 mb-4';
        
        order.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'flex items-center justify-between py-2';
            itemElement.innerHTML = `
                <div class="flex items-center">
                    <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded-lg mr-4">
                    <div>
                        <h4 class="font-medium text-gray-900">${item.name}</h4>
                        <p class="text-sm text-gray-500">Quantity: ${item.quantity}</p>
                    </div>
                </div>
                <span class="font-semibold text-indigo-600">$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            orderItems.appendChild(itemElement);
        });
        
        orderElement.appendChild(orderItems);
        
        // Create order footer
        const orderFooter = document.createElement('div');
        orderFooter.className = 'flex justify-between items-center border-t border-gray-100 pt-4';
        orderFooter.innerHTML = `
            <span class="text-lg font-semibold text-gray-900">Total</span>
            <span class="text-2xl font-bold text-indigo-600">$${orderTotal.toFixed(2)}</span>
        `;
        orderElement.appendChild(orderFooter);
        
        orderHistoryElement.appendChild(orderElement);
    });
}

// Process checkout (for the checkout page)
function processCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    // TODO:
    // send the order to an API
    // For demo purposes, we'll just save it to localStorage
    
    const orders = JSON.parse(localStorage.getItem('techmart-orders') || '[]');
    
    const newOrder = {
        id: Date.now(),
        date: new Date().toISOString(),
        status: 'Processing',
        items: [...cart]
    };
    
    orders.push(newOrder);
    localStorage.setItem('techmart-orders', JSON.stringify(orders));
    
    // Clear the cart
    clearCart();
    
    // Show success message
    showNotification('Order placed successfully!');
    
    // Redirect to orders page
    setTimeout(() => {
        window.location.href = 'orders.html';
    }, 2000);
}

// Expose public functions for HTML
window.addToCart = addToCart;
window.updateCartItem = updateCartItem;
window.removeCartItem = removeCartItem;
window.clearCart = clearCart;
window.processCheckout = processCheckout;