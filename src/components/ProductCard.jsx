import React from 'react';

export default function ProductCard({ product, onPayNow, onWhatsAppOrder }) {
  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <div className="product-card" data-category={product.category}>
      <div className="product-card__body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', color: '#c8922a', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            {product.category}
          </span>
          <span style={{
            fontSize: '0.72rem',
            padding: '0.2rem 0.5rem',
            borderRadius: '999px',
            fontWeight: 600,
            background: isOutOfStock ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 161, 105, 0.15)',
            color: isOutOfStock ? '#ef4444' : '#38a169'
          }}>
            {isOutOfStock ? 'Out of Stock' : `⚡ In Stock: ${product.stock_quantity}`}
          </span>
        </div>

        <h3 style={{ fontSize: '1.25rem', color: '#f7f4ef', marginBottom: '0.5rem', fontFamily: 'serif' }}>
          {product.name}
        </h3>

        <p style={{ fontSize: '0.85rem', color: '#a0aec0', lineHeight: 1.5, flexGrow: 1, marginBottom: '1.25rem' }}>
          {product.description}
        </p>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#e8b86d', marginBottom: '0.85rem' }}>
            Rs. {Number(product.price).toLocaleString()}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              onClick={() => onPayNow(product)}
              disabled={isOutOfStock}
              style={{
                background: isOutOfStock ? '#4a5568' : '#c8922a',
                color: '#0f172a',
                border: 'none',
                borderRadius: '6px',
                padding: '0.65rem 0.5rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem'
              }}
            >
              💳 Pay Now
            </button>

            <button
              onClick={() => onWhatsAppOrder(product)}
              style={{
                background: '#25d366',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.65rem 0.5rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem'
              }}
            >
              💬 WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
