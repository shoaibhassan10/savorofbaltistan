import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function CheckoutModal({ product, onClose, onOrderSuccess }) {
  const [qty, setQty] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pay_now'); // 'pay_now', 'cod', 'easypaisa'
  
  // Card sandbox fields
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [receipt, setReceipt] = useState(null);

  if (!product) return null;

  const unitPrice = Number(product.price);
  const totalPrice = unitPrice * qty;

  const handleAutofillCard = () => {
    setCardHolder('Shoaib Hassan Test');
    setCardNumber('4242 4242 4242 4242');
    setExpiry('12/28');
    setCvc('123');
    if (!customerName) setCustomerName('Tariq Mehmood');
    if (!phone) setPhone('0312 6583222');
    if (!address) setAddress('Sector F-7/2, Street 14');
    if (!city) setCity('Islamabad');
  };

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) raw = raw.slice(0, 2) + '/' + raw.slice(2);
    setExpiry(raw);
  };

  const handlePayNowSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !phone || !address || !city) {
      alert('Please fill out all contact and delivery details.');
      return;
    }

    if (paymentMethod === 'pay_now') {
      if (!cardHolder || cardNumber.replace(/\s/g, '').length < 15 || !expiry || !cvc) {
        alert('Please enter complete card details or click Autofill Test Card.');
        return;
      }
    }

    setLoading(true);
    setLoadingText('Authorizing with Sandbox Payment Gateway...');

    try {
      await new Promise(r => setTimeout(r, 800));
      setLoadingText('Verifying 3D-Secure Testnet Response...');
      await new Promise(r => setTimeout(r, 800));

      const isCard = paymentMethod === 'pay_now';
      const txnId = `TXN-SOB-${Math.floor(100000 + Math.random() * 900000)}`;

      // 1. Insert order into Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: customerName,
            customer_contact: `${phone} | ${address}, ${city}`,
            checkout_method: 'pay_now',
            total_price: totalPrice,
            payment_status: isCard ? 'paid' : 'pending',
            order_status: 'processing'
          }
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert order items into Supabase
      if (orderData) {
        await supabase
          .from('order_items')
          .insert([
            {
              order_id: orderData.id,
              product_id: product.id,
              quantity: qty,
              price_at_purchase: unitPrice
            }
          ]);
      }

      setReceipt({
        txnId,
        orderId: orderData?.id ? orderData.id.slice(0, 8).toUpperCase() : 'SOB-9842',
        productName: product.name,
        qty,
        total: totalPrice,
        customerName,
        phone,
        address: `${address}, ${city}`,
        method: isCard ? 'Card Sandbox (Safepay / Stripe)' : paymentMethod.toUpperCase()
      });

      if (onOrderSuccess) onOrderSuccess();
    } catch (err) {
      console.error('Error submitting order to Supabase:', err);
      alert('Failed to record order: ' + err.message);
    } finally {
      setLoading(false);
      setLoadingText('');
    }
  };

  const handleWhatsAppRedirect = async () => {
    const waMsg = `Salaam Shoaib! I would like to order directly via WhatsApp:\n\n` +
      `📦 *Product:* ${product.name}\n` +
      `🔢 *Quantity:* ${qty}\n` +
      `💰 *Total Amount:* Rs. ${totalPrice.toLocaleString()}\n` +
      `👤 *Name:* ${customerName || 'Pending'}\n` +
      `📞 *Phone:* ${phone || 'Pending'}\n` +
      `📍 *Delivery City / Address:* ${address || 'Pending'}, ${city || 'Pending'}\n\n` +
      `Please confirm availability and dispatch schedule from Ghanche!`;

    // Optionally log WhatsApp order to Supabase
    try {
      await supabase
        .from('orders')
        .insert([
          {
            customer_name: customerName || 'WhatsApp Customer',
            customer_contact: phone ? `${phone} | ${address}, ${city}` : 'WhatsApp Chat',
            checkout_method: 'whatsapp_redirect',
            total_price: totalPrice,
            payment_status: 'pending',
            order_status: 'processing'
          }
        ]);
    } catch (err) {
      console.warn('Could not log WhatsApp order in Supabase:', err);
    }

    window.open(`https://wa.me/923126583222?text=${encodeURIComponent(waMsg)}`, '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 10, 20, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: '#131d2a',
        border: '1px solid rgba(200, 146, 42, 0.25)',
        borderRadius: '16px',
        maxWidth: '520px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '2rem',
        position: 'relative',
        color: '#f7f4ef'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: '#a0aec0',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          &times;
        </button>

        {!receipt ? (
          <div>
            <span style={{ fontSize: '0.75rem', color: '#c8922a', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
              Checkout &amp; Booking
            </span>
            <h2 style={{ fontFamily: 'serif', fontSize: '1.75rem', marginTop: '0.25rem', marginBottom: '1.25rem' }}>
              Confirm Your Order
            </h2>

            {/* Selected Product Summary */}
            <div style={{
              background: '#0d1520',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>{product.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#38a169' }}>
                    Live Inventory Stock: {product.stock_quantity} units
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#e8b86d' }}>
                    Rs. {totalPrice.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.8rem', color: '#a0aec0' }}>Quantity:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    style={{ width: '28px', height: '28px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >-</button>
                  <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 600 }}>{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(Math.min(product.stock_quantity || 99, qty + 1))}
                    style={{ width: '28px', height: '28px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >+</button>
                </div>
              </div>
            </div>

            <form onSubmit={handlePayNowSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#a0aec0', display: 'block', marginBottom: '0.25rem' }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Tariq Mehmood"
                    style={{ width: '100%', padding: '0.6rem', background: '#0d1520', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#a0aec0', display: 'block', marginBottom: '0.25rem' }}>Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300 1234567"
                    style={{ width: '100%', padding: '0.6rem', background: '#0d1520', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#a0aec0', display: 'block', marginBottom: '0.25rem' }}>Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street / House, Sector"
                    style={{ width: '100%', padding: '0.6rem', background: '#0d1520', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#a0aec0', display: 'block', marginBottom: '0.25rem' }}>City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Islamabad"
                    style={{ width: '100%', padding: '0.6rem', background: '#0d1520', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <label style={{ fontSize: '0.75rem', color: '#a0aec0', display: 'block', marginBottom: '0.4rem' }}>Payment Method *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pay_now')}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: paymentMethod === 'pay_now' ? '1px solid #c8922a' : '1px solid rgba(255,255,255,0.1)',
                    background: paymentMethod === 'pay_now' ? 'rgba(200,146,42,0.15)' : '#0d1520',
                    color: '#fff',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  💳 Card Sandbox
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: paymentMethod === 'cod' ? '1px solid #c8922a' : '1px solid rgba(255,255,255,0.1)',
                    background: paymentMethod === 'cod' ? 'rgba(200,146,42,0.15)' : '#0d1520',
                    color: '#fff',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  💵 Cash on Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('easypaisa')}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: paymentMethod === 'easypaisa' ? '1px solid #c8922a' : '1px solid rgba(255,255,255,0.1)',
                    background: paymentMethod === 'easypaisa' ? 'rgba(200,146,42,0.15)' : '#0d1520',
                    color: '#fff',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  📱 EasyPaisa
                </button>
              </div>

              {/* Card Sandbox Fields */}
              {paymentMethod === 'pay_now' && (
                <div style={{ background: '#0a1017', border: '1px solid rgba(200,146,42,0.2)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#c8922a' }}>⚡ Safepay / Stripe Sandbox</span>
                    <button
                      type="button"
                      onClick={handleAutofillCard}
                      style={{ background: 'rgba(200,146,42,0.2)', border: 'none', color: '#e8b86d', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}
                    >
                      Autofill Test Card
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', background: '#131d2a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', marginBottom: '0.5rem', fontSize: '0.8rem' }}
                  />

                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    style={{ width: '100%', padding: '0.55rem', background: '#131d2a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', fontFamily: 'monospace', marginBottom: '0.5rem', fontSize: '0.85rem' }}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={handleExpiryChange}
                      style={{ width: '100%', padding: '0.55rem', background: '#131d2a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', fontFamily: 'monospace', fontSize: '0.8rem' }}
                    />
                    <input
                      type="password"
                      placeholder="CVC"
                      maxLength={4}
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem', background: '#131d2a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', fontFamily: 'monospace', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? '#4a5568' : '#c8922a',
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.85rem',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: loading ? 'wait' : 'pointer',
                  marginBottom: '0.75rem'
                }}
              >
                {loading ? loadingText : '💳 Pay Now & Book Order (Sandbox)'}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppRedirect}
                style={{
                  width: '100%',
                  background: 'transparent',
                  color: '#25d366',
                  border: '1px solid #25d366',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                💬 Order via WhatsApp Instead (+92 312 6583222)
              </button>
            </form>
          </div>
        ) : (
          /* Receipt Screen */
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(56,161,105,0.2)',
              border: '2px solid #38a169',
              color: '#38a169',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              margin: '0 auto 1rem'
            }}>✓</div>

            <h2 style={{ fontFamily: 'serif', fontSize: '1.6rem', marginBottom: '0.25rem' }}>
              Payment Successful!
            </h2>
            <p style={{ color: '#38a169', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
              Order Registered &amp; Saved in Supabase
            </p>

            <div style={{ background: '#0d1520', borderRadius: '8px', padding: '1.25rem', textAlign: 'left', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#a0aec0' }}>Transaction ID:</span>
                <span style={{ fontFamily: 'monospace' }}>{receipt.txnId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#a0aec0' }}>Order Ref:</span>
                <span style={{ fontFamily: 'monospace' }}>{receipt.orderId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#a0aec0' }}>Item:</span>
                <span>{receipt.productName} (Qty: {receipt.qty})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#a0aec0' }}>Customer:</span>
                <span>{receipt.customerName} ({receipt.phone})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#a0aec0' }}>Destination:</span>
                <span>{receipt.address}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #c8922a', fontWeight: 700 }}>
                <span>Total Amount:</span>
                <span style={{ color: '#e8b86d', fontSize: '1.1rem' }}>Rs. {receipt.total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => {
                const msg = `Salaam Shoaib! I have completed payment for my order on Savor of Baltistan:\n\n*Transaction ID:* ${receipt.txnId}\n*Order ID:* ${receipt.orderId}\n*Item:* ${receipt.productName} (Qty: ${receipt.qty})\n*Total Paid:* Rs. ${receipt.total.toLocaleString()}\n*Customer:* ${receipt.customerName}\n*Phone:* ${receipt.phone}\n*Address:* ${receipt.address}`;
                window.open(`https://wa.me/923126583222?text=${encodeURIComponent(msg)}`, '_blank');
              }}
              style={{
                width: '100%',
                background: '#25d366',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.8rem',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                marginBottom: '0.5rem'
              }}
            >
              💬 Send Receipt to Shoaib on WhatsApp
            </button>

            <button
              onClick={onClose}
              style={{
                width: '100%',
                background: 'transparent',
                color: '#a0aec0',
                border: 'none',
                padding: '0.5rem',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Close &amp; Return to Shop
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
