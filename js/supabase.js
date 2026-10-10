// ============================================================
// SAVOR OF BALTISTAN — Supabase Live Inventory & Order Client
// ============================================================

const SUPABASE_CONFIG = {
  url: 'https://dpyyhyfreqpohrlnnzms.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRweXloeWZyZXFwb2hybG5uem1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1Njc5MjgsImV4cCI6MjEwNzE0MzkyOH0.IJz_L1swV2u1qOMzOKef03fskmgogeG1MPOQ7-L2TkY'
};

const supabaseHeaders = {
  'apikey': SUPABASE_CONFIG.anonKey,
  'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

// Fetch all live products from Supabase
async function fetchSupabaseProducts() {
  try {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/products?select=*&order=category.asc,price.asc`, {
      method: 'GET',
      headers: supabaseHeaders
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Could not fetch products from Supabase directly:', err);
    return null;
  }
}

// Record an order in Supabase
async function recordSupabaseOrder({ customerName, customerContact, checkoutMethod, totalPrice, paymentStatus, orderStatus, items = [] }) {
  try {
    const orderPayload = {
      customer_name: customerName,
      customer_contact: customerContact,
      checkout_method: checkoutMethod, // 'pay_now' or 'whatsapp_redirect'
      total_price: totalPrice,
      payment_status: paymentStatus || (checkoutMethod === 'pay_now' ? 'paid' : 'pending'),
      order_status: orderStatus || 'processing'
    };

    const orderRes = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/orders`, {
      method: 'POST',
      headers: supabaseHeaders,
      body: JSON.stringify(orderPayload)
    });

    if (!orderRes.ok) {
      console.warn('Failed to insert order into Supabase:', await orderRes.text());
      return null;
    }

    const insertedOrders = await orderRes.json();
    const createdOrder = insertedOrders[0];

    // If order items were provided, insert them into order_items
    if (createdOrder && items.length > 0) {
      const orderItemsPayload = items.map(it => ({
        order_id: createdOrder.id,
        product_id: it.productId || null,
        quantity: it.quantity,
        price_at_purchase: it.price
      }));

      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/order_items`, {
        method: 'POST',
        headers: supabaseHeaders,
        body: JSON.stringify(orderItemsPayload)
      });
    }

    return createdOrder;
  } catch (err) {
    console.warn('Error recording order in Supabase:', err);
    return null;
  }
}

// Export to window for global access
window.SavorSupabase = {
  config: SUPABASE_CONFIG,
  fetchProducts: fetchSupabaseProducts,
  recordOrder: recordSupabaseOrder
};
