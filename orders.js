document.addEventListener('DOMContentLoaded', function () {
    fetchOrders();
});

// Fetch orders from the API
async function fetchOrders() {
    try {
        const response = await fetch(`${baseUrl}/api/orders`);
        if (!response.ok) {
            throw new Error("Failed to fetch orders. Please try again.");
        }

        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        showNotification("Error fetching orders. Please try again.", "error");
    }
}

// Display orders in the orders list
function displayOrders(orders) {
    const ordersList = document.getElementById('orders-list');
    const noOrdersMessage = document.getElementById('no-orders');
    
    if (!ordersList || !noOrdersMessage) return;
    
    // Clear any existing orders
    ordersList.innerHTML = '';

    if (orders.length === 0) {
        ordersList.classList.add('hidden');
        noOrdersMessage.classList.remove('hidden');
        return;
    }

    // Show orders list and hide no orders message
    ordersList.classList.remove('hidden');
    noOrdersMessage.classList.add('hidden');

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
                <h3 class="text-lg font-semibold text-gray-900">Order #${order._id}</h3>
                <p class="text-sm text-gray-500">${new Date(order.createdAt).toLocaleDateString()}</p>
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
        
        ordersList.appendChild(orderElement);
    });
}

// Helper function to get status class based on the order status
function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case 'delivered':
            return 'text-green-600';
        case 'shipped':
            return 'text-yellow-500';
        case 'processing':
            return 'text-blue-600';
        case 'pending':
            return 'text-gray-500';
        default:
            return 'text-gray-500';
    }
}
