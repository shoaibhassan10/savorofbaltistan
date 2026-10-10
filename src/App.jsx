import React from 'react';
import ProductCatalog from './components/ProductCatalog';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0f18', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{
        padding: '1.5rem 2rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontFamily: 'serif', color: '#f7f4ef' }}>
            Savor of Baltistan
          </h1>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#c8922a' }}>
            100% Pure Karakoram Harvest · Connected to Supabase
          </p>
        </div>
        <a
          href="https://wa.me/923126583222"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#25d366',
            color: '#fff',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
        >
          💬 WhatsApp Support
        </a>
      </header>

      <main>
        <ProductCatalog />
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        color: '#64748b',
        fontSize: '0.8rem'
      }}>
        © 2024 Savor of Baltistan · Founded by Shoaib Hassan (Ghanche, Gilgit-Baltistan)
      </footer>
    </div>
  );
}
