import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import ProductCard from './ProductCard';
import CheckoutModal from './CheckoutModal';

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeProductForCheckout, setActiveProductForCheckout] = useState(null);

  // Fetch live inventory from Supabase
  const loadInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('category', { ascending: true })
        .order('price', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Failed to load products from Supabase:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  // Filter products by category
  const categories = ['All', 'Flagship', 'Local Healing Herbs', 'Dry Fruits & Nuts', 'Natural Oils & Sweets'];
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const handlePayNow = (product) => {
    setActiveProductForCheckout(product);
  };

  const handleWhatsAppOrder = (product) => {
    const unitPrice = Number(product.price).toLocaleString();
    const waMsg = `Salaam Shoaib! I want to order *${product.name}* (Rs. ${unitPrice}) directly from Savor of Baltistan.\n\nPlease guide me on stock availability and shipping to my city.`;
    window.open(`https://wa.me/923126583222?text=${encodeURIComponent(waMsg)}`, '_blank');
  };

  return (
    <section style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto', color: '#f7f4ef' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: '#c8922a', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
          Connected to Supabase Database
        </span>
        <h2 style={{ fontFamily: 'serif', fontSize: '2.5rem', margin: '0.5rem 0' }}>
          Live Karakoram Inventory
        </h2>
        <p style={{ color: '#a0aec0', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
          Real-time stock and prices fetched directly from your Supabase PostgreSQL cluster.
        </p>

        {/* Category Filters */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? '#c8922a' : '#131d2a',
                color: selectedCategory === cat ? '#0f172a' : '#cbd5e1',
                border: '1px solid rgba(200,146,42,0.3)',
                padding: '0.5rem 1rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#c8922a' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚡ Loading live inventory from Supabase...</div>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#fca5a5' }}>
          <p>Failed to connect to Supabase: {error}</p>
          <button
            onClick={loadInventory}
            style={{ marginTop: '0.75rem', background: '#c8922a', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onPayNow={handlePayNow}
              onWhatsAppOrder={handleWhatsAppOrder}
            />
          ))}
        </div>
      )}

      {/* Checkout Modal */}
      {activeProductForCheckout && (
        <CheckoutModal
          product={activeProductForCheckout}
          onClose={() => setActiveProductForCheckout(null)}
          onOrderSuccess={() => loadInventory()}
        />
      )}
    </section>
  );
}
