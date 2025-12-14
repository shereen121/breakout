let selectedPayment = 'card';
let orderData = {};

// Drink image mapping
const drinkImages = {
  'Milkshakes': 'img/ميلك شيك.jpg',
  'Frappe': 'img/GoodFoodFrappe-8757348.jpg',
  'Iced Coffee': 'img/Caramel-Iced-Coffee-6.jpg',
  'Lemonade': 'img/healthy-lemonade.jpg',
  'Orange Juice': 'img/orange-juice-for-health.jpg',
  'Mango Juice': 'img/mango.jpg',
  'Strawberry Juice': 'img/st.jpg',
  'Banana Juice': 'img/banana.jpg',
  'Berry Juice': 'img/توت.jpg',
  'Pineapple Juice': 'img/انانس.jpg',
  'Sunshine': 'img/صن.jpg',
  'Cherry Cola': 'img/شيري.jpg',
  'Matcha': 'img/Photoroom-20241122_094451_5.png',
  'Soft Drink': 'img/سيفن.png',
  'Tea': 'img/tea.jpg',
  'Turkish Coffee': 'img/turky coffe.jpg',
  'French Coffee': 'img/french coffe.jpg',
  'Hazelnut Coffee': 'img/بندق.jpg',
  'Mint Tea': 'img/نعناع.png',
  'Anise Tea': 'img/ينسون.jpg',
  'Hibiscus': 'img/كركديه.jpg',
  'Espresso': 'img/اسبرسو.jpg',
  'Nescafe Gold': 'img/gold.jpg',
  'Bonjorno': 'img/bonjorno.jpg',
  'Nescafe 3x1': 'img/3x1',
  'Nescafe Black': 'img/نسكافيه.jpeg',
  'Hot Chocolate': 'img/hot choclet.jpg',
  'Sahlab': 'img/images.jpg',
  'Cinnamon Tea': 'img/قرفة.jpg',
  'Water': 'img/water.png'
};

// Function to update user account display (top left)
function updateUserAccountDisplay() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userDisplay = document.getElementById('user-account-display');
  
  if (currentUser && userDisplay) {
    userDisplay.style.display = 'block';
    document.getElementById('user-display-name').textContent = currentUser.username || 'User';
    document.getElementById('user-display-email').textContent = currentUser.email || '';
    document.getElementById('user-display-points').textContent = currentUser.points || 0;
    document.getElementById('user-display-wallet').textContent = (currentUser.wallet || 0) + ' EGY';
    
    // Set initial letter
    const initial = (currentUser.username || 'U').charAt(0).toUpperCase();
    document.getElementById('user-initial').textContent = initial;
  } else if (userDisplay) {
    userDisplay.style.display = 'none';
  }
}

// Function to logout
function logout() {
  localStorage.removeItem('currentUser');
  updateUserAccountDisplay();
  // Redirect to home
  window.location.href = '../home.html';
}

// Load order data from sessionStorage
window.addEventListener('DOMContentLoaded', function() {
  updateUserAccountDisplay();
  
  const data = sessionStorage.getItem('orderData');
  if (data) {
    orderData = JSON.parse(data);
    displayOrderDetails();
  } else {
    // Redirect back if no order data
    window.location.href = 'index.html';
  }
});

function displayOrderDetails() {
  // Set drink image based on drink name
  const imagePath = drinkImages[orderData.drink] || 'img/placeholder.jpg';
  const orderImage = document.getElementById('orderImage');
  orderImage.src = imagePath;

  // Fallback if image doesn't load
  orderImage.onerror = function() {
    this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23E8F5E9" width="200" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%232D5F3F" font-size="14" font-family="Arial" font-weight="bold"%3E' + orderData.drink + '%3C/text%3E%3C/svg%3E';
  };

  // Display order details
  document.getElementById('orderDrink').textContent = orderData.drink;
  document.getElementById('orderFlavor').textContent = orderData.flavor;
  document.getElementById('orderSize').textContent = orderData.size;
  document.getElementById('orderQuantity').textContent = orderData.quantity;
  document.getElementById('orderNotes').textContent = orderData.notes || 'None';

  // Display price information
  document.getElementById('unitPrice').textContent = orderData.price + ' EGY';
  document.getElementById('quantityPrice').textContent = 'x' + orderData.quantity;
  document.getElementById('totalPrice').textContent = orderData.total + ' EGY';
  document.getElementById('pointsEarned').textContent = (orderData.points * orderData.quantity);
}

function selectPayment(method) {
  selectedPayment = method;
  document.querySelectorAll('.payment-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.closest('.payment-btn').classList.add('active');

  // Show payment form based on method
  showPaymentForm(method);
}

function showPaymentForm(method) {
  const formContainer = document.getElementById('paymentFormContainer');

  let formHTML = '';

  switch(method) {
    case 'card':
      formHTML = `
        <h3 style="color: #2D5F3F; margin-bottom: 20px; font-family: 'Playfair Display', serif;">💳 Credit/Debit Card Payment</h3>
        <div style="display: flex; flex-direction: column; gap: 15px;">
          <div>
            <label style="color: #2D5F3F; font-weight: 600; display: block; margin-bottom: 8px;">Card Holder Name</label>
            <input type="text" placeholder="John Doe" style="width: 100%; padding: 12px; border: 2px solid #E8F5E9; border-radius: 8px; font-family: 'Roboto', sans-serif;">
          </div>
          <div>
            <label style="color: #2D5F3F; font-weight: 600; display: block; margin-bottom: 8px;">Card Number</label>
            <input type="text" placeholder="1234 5678 9012 3456" maxlength="19" style="width: 100%; padding: 12px; border: 2px solid #E8F5E9; border-radius: 8px; font-family: 'Roboto', sans-serif;">
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
              <label style="color: #2D5F3F; font-weight: 600; display: block; margin-bottom: 8px;">Expiry Date</label>
              <input type="text" placeholder="MM/YY" maxlength="5" style="width: 100%; padding: 12px; border: 2px solid #E8F5E9; border-radius: 8px; font-family: 'Roboto', sans-serif;">
            </div>
            <div>
              <label style="color: #2D5F3F; font-weight: 600; display: block; margin-bottom: 8px;">CVV</label>
              <input type="text" placeholder="123" maxlength="3" style="width: 100%; padding: 12px; border: 2px solid #E8F5E9; border-radius: 8px; font-family: 'Roboto', sans-serif;">
            </div>
          </div>
          <div>
            <label style="color: #2D5F3F; font-weight: 600; display: block; margin-bottom: 8px;">Card Type</label>
            <select style="width: 100%; padding: 12px; border: 2px solid #E8F5E9; border-radius: 8px; font-family: 'Roboto', sans-serif;">
              <option>Visa</option>
              <option>Mastercard</option>
              <option>American Express</option>
              <option>Discover</option>
            </select>
          </div>
        </div>
      `;
      break;

    case 'wallet':
      formHTML = `
        <h3 style="color: #2D5F3F; margin-bottom: 20px; font-family: 'Playfair Display', serif;">💰 Wallet Payment</h3>
        <div style="background: #F5F5F0; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <p style="color: #2D5F3F; font-weight: 600; margin-bottom: 10px;">Current Wallet Balance:</p>
          <p style="color: #2D5F3F; font-size: 1.5rem; font-weight: 700;">500 EGY</p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 15px;">
          <div>
            <label style="color: #2D5F3F; font-weight: 600; display: block; margin-bottom: 8px;">Wallet PIN</label>
            <input type="password" placeholder="Enter your 4-digit PIN" maxlength="4" style="width: 100%; padding: 12px; border: 2px solid #E8F5E9; border-radius: 8px; font-family: 'Roboto', sans-serif;">
          </div>
          <div style="background: #E8F5E9; padding: 15px; border-radius: 8px; border-left: 4px solid #2D5F3F;">
            <p style="color: #2D5F3F; font-size: 0.9rem;"><strong>Amount to Pay:</strong> ${orderData.total} EGY</p>
            <p style="color: #2D5F3F; font-size: 0.9rem;"><strong>Remaining Balance:</strong> ${500 - orderData.total} EGY</p>
          </div>
        </div>
      `;
      break;

    case 'cash':
      formHTML = `
        <h3 style="color: #2D5F3F; margin-bottom: 20px; font-family: 'Playfair Display', serif;">💵 Cash Payment</h3>
        <div style="background: #FFF3CD; padding: 20px; border-radius: 12px; border-left: 4px solid #FF9800; margin-bottom: 20px;">
          <p style="color: #856404; font-weight: 600; margin-bottom: 10px;">⚠️ Important Information</p>
          <p style="color: #856404; font-size: 0.95rem; line-height: 1.6;">
            Please pay the exact amount or bring change. Our staff will confirm the payment and provide a receipt.
            Your order will be prepared after payment confirmation.
          </p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 15px;">
          <div style="background: #F5F5F0; padding: 20px; border-radius: 12px;">
            <p style="color: #2D5F3F; font-weight: 600; margin-bottom: 10px;">Order Total:</p>
            <p style="color: #2D5F3F; font-size: 1.8rem; font-weight: 700;">${orderData.total} EGY</p>
          </div>
          <div>
            <label style="color: #2D5F3F; font-weight: 600; display: block; margin-bottom: 8px;">Amount Tendered</label>
            <input type="number" placeholder="Enter amount" style="width: 100%; padding: 12px; border: 2px solid #E8F5E9; border-radius: 8px; font-family: 'Roboto', sans-serif;">
          </div>
          <p style="color: #666; font-size: 0.9rem;">💡 Tip: You can pay at the counter when you pick up your order</p>
        </div>
      `;
      break;

    case 'paypal':
      formHTML = `
        <h3 style="color: #2D5F3F; margin-bottom: 20px; font-family: 'Playfair Display', serif;">🌐 PayPal Payment</h3>
        <div style="background: #F5F5F0; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <p style="color: #2D5F3F; font-weight: 600; margin-bottom: 10px;">You will be redirected to PayPal to complete your payment securely.</p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 15px;">
          <div>
            <label style="color: #2D5F3F; font-weight: 600; display: block; margin-bottom: 8px;">PayPal Email</label>
            <input type="email" placeholder="your.email@example.com" style="width: 100%; padding: 12px; border: 2px solid #E8F5E9; border-radius: 8px; font-family: 'Roboto', sans-serif;">
          </div>
          <div style="background: #E8F5E9; padding: 15px; border-radius: 8px; border-left: 4px solid #2D5F3F;">
            <p style="color: #2D5F3F; font-size: 0.9rem;"><strong>Amount to Pay:</strong> ${orderData.total} EGY</p>
            <p style="color: #2D5F3F; font-size: 0.85rem; margin-top: 10px;">🔒 Your payment is secure and encrypted</p>
          </div>
        </div>
      `;
      break;

    case 'apple':
      formHTML = `
        <h3 style="color: #2D5F3F; margin-bottom: 20px; font-family: 'Playfair Display', serif;">🍎 Apple Pay</h3>
        <div style="background: #F5F5F0; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <p style="color: #2D5F3F; font-weight: 600; margin-bottom: 10px;">Fast and secure payment with Apple Pay</p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 15px;">
          <div style="background: #000; color: #FFF; padding: 20px; border-radius: 12px; text-align: center;">
            <p style="font-size: 1.2rem; font-weight: 700; margin-bottom: 10px;">Apple Pay</p>
            <p style="font-size: 0.9rem;">Ready to pay with your Apple device</p>
          </div>
          <div style="background: #E8F5E9; padding: 15px; border-radius: 8px; border-left: 4px solid #2D5F3F;">
            <p style="color: #2D5F3F; font-size: 0.9rem;"><strong>Amount:</strong> ${orderData.total} EGY</p>
            <p style="color: #2D5F3F; font-size: 0.85rem; margin-top: 10px;">✓ Biometric authentication enabled</p>
          </div>
          <p style="color: #666; font-size: 0.9rem; text-align: center;">Click "Confirm & Pay" to authenticate with Face ID or Touch ID</p>
        </div>
      `;
      break;

    case 'google':
      formHTML = `
        <h3 style="color: #2D5F3F; margin-bottom: 20px; font-family: 'Playfair Display', serif;">🔵 Google Pay</h3>
        <div style="background: #F5F5F0; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <p style="color: #2D5F3F; font-weight: 600; margin-bottom: 10px;">Fast and secure payment with Google Pay</p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 15px;">
          <div style="background: #4285F4; color: #FFF; padding: 20px; border-radius: 12px; text-align: center;">
            <p style="font-size: 1.2rem; font-weight: 700; margin-bottom: 10px;">Google Pay</p>
            <p style="font-size: 0.9rem;">Ready to pay with your Google account</p>
          </div>
          <div style="background: #E8F5E9; padding: 15px; border-radius: 8px; border-left: 4px solid #2D5F3F;">
            <p style="color: #2D5F3F; font-size: 0.9rem;"><strong>Amount:</strong> ${orderData.total} EGY</p>
            <p style="color: #2D5F3F; font-size: 0.85rem; margin-top: 10px;">✓ Secure payment method</p>
          </div>
          <p style="color: #666; font-size: 0.9rem; text-align: center;">Click "Confirm & Pay" to complete payment with Google Pay</p>
        </div>
      `;
      break;
  }

  formContainer.innerHTML = formHTML;
  formContainer.style.display = 'block';
}

function confirmOrder() {
  const paymentMethods = {
    'card': 'Credit Card',
    'wallet': 'Wallet',
    'cash': 'Cash',
    'paypal': 'PayPal',
    'apple': 'Apple Pay',
    'google': 'Google Pay'
  };

  if (!selectedPayment) {
    alert('Please select a payment method');
    return;
  }

  const message = `Order confirmed!\n\nDrink: ${orderData.drink}\nFlavor: ${orderData.flavor}\nSize: ${orderData.size}\nQuantity: ${orderData.quantity}\nTotal: ${orderData.total} EGY\nPayment Method: ${paymentMethods[selectedPayment]}\n\nThank you for your order!`;

  alert(message);

  // Here you would typically send the order to your backend
  console.log({
    ...orderData,
    paymentMethod: selectedPayment
  });

  // Redirect back to menu
  window.location.href = 'index.html';
}

function goBack() {
  if (confirm('Are you sure you want to cancel this order?')) {
    window.location.href = 'index.html';
  }
}

