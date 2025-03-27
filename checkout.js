let taxRate = 0.05;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the checkout page
    if (window.location.pathname.includes('checkout.html')) {
        renderOrderSummary();

        // Add a submit event listener to the form
        const checkoutForm = document.querySelector('form');
        checkoutForm.addEventListener('submit', handleFormSubmit);
    }
});

// Get cart data from localStorage
function getCartItems() {
    return JSON.parse(localStorage.getItem('techmart-cart')) || [];
}

// Render the order summary
function renderOrderSummary() {
    const orderSummaryElement = document.getElementById('order-summary');
    if (!orderSummaryElement) return;
    
    // Clear existing content
    orderSummaryElement.innerHTML = '';
    
    // Calculate totals
    let subtotal = 0;
    const cartItems = getCartItems();
    cartItems.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    const shipping = 0;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;
    
    // Create summary items
    const summaryItems = document.createElement('div');
    summaryItems.className = 'space-y-4 mb-6';
    
    // Add each item
    cartItems.forEach(item => {
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
        summaryItems.appendChild(itemElement);
    });
    
    orderSummaryElement.appendChild(summaryItems);
    
    // Create totals section
    const totalsSection = document.createElement('div');
    totalsSection.className = 'space-y-3 border-t border-gray-100 pt-4';
    totalsSection.innerHTML = `
        <div class="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>$${shipping.toFixed(2)}</span>
        </div>
        <div class="flex justify-between text-gray-600">
            <span>Tax (10%)</span>
            <span>$${tax.toFixed(2)}</span>
        </div>
        <div class="flex justify-between items-center pt-3 border-t border-gray-100">
            <span class="text-lg font-semibold text-gray-900">Total</span>
            <span class="text-2xl font-bold text-indigo-600">$${total.toFixed(2)}</span>
        </div>
    `;
    
    orderSummaryElement.appendChild(totalsSection);
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    // Show loading animation
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Processing...";

    try {
        // Get form data
        const fullName = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const zip = document.getElementById('zip').value;

        // Get order summary details
        const cartItems = getCartItems();
        let subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let tax = subtotal * taxRate;
        let total = subtotal + tax;

        // Create the JSON object for submission
        const orderDetails = {
            customer: {
                fullName,
                email,
                address,
                city,
                zip
            },
            items: cartItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price.toFixed(2),
                total: (item.price * item.quantity).toFixed(2),
                image: item.image
            })),
            summary: {
                subtotal: subtotal.toFixed(2),
                tax: tax.toFixed(2),
                total: total.toFixed(2)
            }
        };

        // Submit order to the server using POST
        const response = await fetch(`${baseUrl}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderDetails)
        });

        if (!response.ok) {
            throw new Error('Failed to place the order. Please try again.');
        }

        // Show success notification
        showNotification("Order placed successfully!", "success");
        
        // Clear the cart
        localStorage.removeItem('techmart-cart');
        
        // Redirect to orders page after a short delay
        setTimeout(() => {
            window.location.href = 'orders.html';
        }, 1500);

    } catch (error) {
        showNotification(error.message, "error");
        console.error("Order submission error:", error);
    } finally {
        // Hide loading animation
        submitButton.disabled = false;
        submitButton.textContent = "Complete Purchase";
    }
}
