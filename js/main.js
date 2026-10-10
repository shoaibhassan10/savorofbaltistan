// ============================================================
// SAVOR OF BALTISTAN — Main JavaScript
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Navbar Scroll Effect ──────────────────────────────
  const nav = document.querySelector('.nav');
  if (nav) {
    const handleScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // ── 2. Mobile Menu ───────────────────────────────────────
  const hamburger  = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile-menu');
  const mobileClose = document.querySelector('.nav__mobile-close');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    const close = () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    };
    if (mobileClose) mobileClose.addEventListener('click', close);
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }

  // ── 3. Hero Parallax ─────────────────────────────────────
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    heroBg.classList.add('loaded');
    window.addEventListener('scroll', () => {
      const offset = window.scrollY;
      heroBg.style.transform = `scale(1) translateY(${offset * 0.3}px)`;
    }, { passive: true });
  }

  // ── 4. Scroll Reveal ─────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  }

  // ── 5. Active Nav Link ───────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── 6. Product Tabs (Product Page) ───────────────────────
  const tabBtns   = document.querySelectorAll('.tabs__btn');
  const tabPanels = document.querySelectorAll('.tabs__panel');

  if (tabBtns.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.querySelector(`.tabs__panel[data-tab="${target}"]`)?.classList.add('active');
      });
    });
  }

  // ── 7. Shop Filters ──────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card[data-category]');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        productCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = '';
            card.style.animation = 'fadeIn 0.4s ease';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ── 8. Contact Form (Direct WhatsApp Bridge) ──────────────
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.querySelector('#contact-name')?.value || 'Guest';
      const subject = document.querySelector('#contact-subject')?.value || 'Inquiry';
      const msg = document.querySelector('#contact-message')?.value || '';
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Connecting...';
      btn.disabled = true;

      const waText = encodeURIComponent(`Salaam Savor of Baltistan!\nName: ${name}\nTopic: ${subject}\nMessage: ${msg}`);
      const waUrl = `https://wa.me/923126583222?text=${waText}`;

      setTimeout(() => {
        btn.textContent = '✓ Opening WhatsApp Direct...';
        btn.style.background = 'linear-gradient(135deg, #2d7a46, #38a169)';
        window.open(waUrl, '_blank');
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          btn.disabled = false;
          contactForm.reset();
        }, 3000);
      }, 700);
    });
  }

  // ── 9. Smooth counter animation on trust numbers ─────────
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = +el.dataset.target;
          const duration = 1800;
          const step = target / (duration / 16);
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = Math.floor(current).toLocaleString();
          }, 16);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  // ── 10. Direct Checkout Modal Logic (Option 1 & Option 2) ──────────
  const modalBackdrop = document.querySelector('#checkout-modal-backdrop');
  const modalCloseBtn = document.querySelector('#modal-close-btn');
  const openCheckoutBtns = document.querySelectorAll('#btn-open-checkout, [data-open-checkout]');
  const qtyMinus = document.querySelector('#qty-minus');
  const qtyPlus = document.querySelector('#qty-plus');
  const qtyVal = document.querySelector('#qty-val');
  const modalPrice = document.querySelector('#modal-item-price');
  const modalName = document.querySelector('#modal-item-name');
  const directForm = document.querySelector('#direct-checkout-form');
  const formView = document.querySelector('#checkout-form-view');
  const receiptView = document.querySelector('#checkout-receipt-view');

  // Payment Tabs
  const paymentTabs = document.querySelectorAll('.payment-tab-btn');
  const panelCard = document.querySelector('#payment-panel-card');
  const panelCod = document.querySelector('#payment-panel-cod');
  const panelEasypaisa = document.querySelector('#payment-panel-easypaisa');
  const submitBtn = document.querySelector('#co-submit-btn');
  const btnAutofill = document.querySelector('#btn-autofill-card');
  const modalWaBtn = document.querySelector('#modal-wa-btn');

  // Card Inputs
  const cardHolderInput = document.querySelector('#card-holder');
  const cardNumberInput = document.querySelector('#card-number');
  const cardExpiryInput = document.querySelector('#card-expiry');
  const cardCvcInput = document.querySelector('#card-cvc');

  // Receipt Elements
  const recTxnId = document.querySelector('#rec-txn-id');
  const recOrderId = document.querySelector('#rec-order-id');
  const recItemName = document.querySelector('#rec-item-name');
  const recQty = document.querySelector('#rec-qty');
  const recCustomer = document.querySelector('#rec-customer');
  const recDestination = document.querySelector('#rec-destination');
  const recMethod = document.querySelector('#rec-method');
  const recTotal = document.querySelector('#rec-total');
  const recWaShareBtn = document.querySelector('#rec-wa-share-btn');
  const recPrintBtn = document.querySelector('#rec-print-btn');
  const recCloseBtn = document.querySelector('#rec-close-btn');

  let currentQty = 1;
  let basePrice = 3500;
  let currentProductId = null;
  let currentSelectedMethod = 'card';

  // Synchronize Live Inventory from Supabase
  if (window.SavorSupabase && window.SavorSupabase.fetchProducts) {
    window.SavorSupabase.fetchProducts().then(products => {
      if (!products || !products.length) return;
      
      document.querySelectorAll('.product-card').forEach(card => {
        const nameEl = card.querySelector('.product-card__name');
        if (!nameEl) return;
        const rawName = nameEl.textContent.trim().toLowerCase();
        
        // Match by exact or partial substring
        const matched = products.find(p => {
          const pLower = p.name.toLowerCase();
          return rawName.includes(pLower) || pLower.includes(rawName.split('(')[0].trim());
        });

        if (matched) {
          card.dataset.productId = matched.id;
          const priceEl = card.querySelector('.product-card__price');
          if (priceEl) {
            priceEl.innerHTML = `Rs. ${parseInt(matched.price).toLocaleString()} <span style="display:inline-block; font-size:0.7rem; color:#38a169; background:rgba(56,161,105,0.12); padding:0.15rem 0.45rem; border-radius:12px; margin-left:0.4rem; font-weight:600;">⚡ In Stock (${matched.stock_quantity})</span>`;
          }

          const payBtn = card.querySelector('.btn-card-pay');
          if (payBtn) {
            payBtn.dataset.price = matched.price;
            payBtn.dataset.productId = matched.id;
          }
          const waBtn = card.querySelector('.btn-card-wa');
          if (waBtn) {
            waBtn.dataset.price = matched.price;
            waBtn.dataset.productId = matched.id;
          }
        }
      });
    });
  }

  const updateModalTotal = () => {
    if (qtyVal) qtyVal.textContent = currentQty;
    if (modalPrice) {
      const total = basePrice * currentQty;
      modalPrice.textContent = `Rs. ${total.toLocaleString()}`;
    }
  };

  const updateSubmitBtnText = () => {
    if (!submitBtn) return;
    if (currentSelectedMethod === 'card') {
      submitBtn.innerHTML = '💳 Pay Now &amp; Book Order (Sandbox)';
    } else if (currentSelectedMethod === 'cod') {
      submitBtn.innerHTML = '💵 Confirm Cash on Delivery Order';
    } else {
      submitBtn.innerHTML = '📱 Confirm EasyPaisa / Bank Order';
    }
  };

  const resetModalViews = () => {
    if (formView) formView.style.display = 'block';
    if (receiptView) receiptView.style.display = 'none';
    if (submitBtn) {
      submitBtn.disabled = false;
      updateSubmitBtnText();
    }
  };

  // Switch Payment Method Tabs
  if (paymentTabs.length) {
    paymentTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        paymentTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentSelectedMethod = tab.dataset.method || 'card';

        if (panelCard) panelCard.style.display = currentSelectedMethod === 'card' ? 'block' : 'none';
        if (panelCod) panelCod.style.display = currentSelectedMethod === 'cod' ? 'block' : 'none';
        if (panelEasypaisa) panelEasypaisa.style.display = currentSelectedMethod === 'easypaisa' ? 'block' : 'none';

        updateSubmitBtnText();
      });
    });
  }

  // Autofill Test Card Button
  if (btnAutofill) {
    btnAutofill.addEventListener('click', () => {
      if (cardHolderInput) cardHolderInput.value = 'Shoaib Hassan Test';
      if (cardNumberInput) cardNumberInput.value = '4242 4242 4242 4242';
      if (cardExpiryInput) cardExpiryInput.value = '12/28';
      if (cardCvcInput) cardCvcInput.value = '123';

      // Also fill sample customer details if empty for fast verification
      const nameInp = document.querySelector('#co-name');
      const phoneInp = document.querySelector('#co-phone');
      const addrInp = document.querySelector('#co-address');
      const cityInp = document.querySelector('#co-city');

      if (nameInp && !nameInp.value) nameInp.value = 'Customer Test';
      if (phoneInp && !phoneInp.value) phoneInp.value = '0312 6583222';
      if (addrInp && !addrInp.value) addrInp.value = 'Street 4, Sector F-7/2';
      if (cityInp && !cityInp.value) cityInp.value = 'Islamabad';

      btnAutofill.textContent = '✓ Test Card Loaded';
      setTimeout(() => {
        btnAutofill.textContent = '⚡ Autofill Test Card';
      }, 1500);
    });
  }

  // Card input masking & formatting
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 16);
      let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
      e.target.value = formatted;
    });
  }

  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 2) {
        val = val.substring(0, 2) + '/' + val.substring(2);
      }
      e.target.value = val;
    });
  }

  if (cardCvcInput) {
    cardCvcInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
    });
  }

  // Open Checkout Buttons (from any product card)
  if (openCheckoutBtns.length && modalBackdrop) {
    openCheckoutBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const pName = btn.dataset.name || 'Raw Karakoram Shilajit (20g)';
        const pPrice = parseInt(btn.dataset.price, 10) || 3500;
        basePrice = pPrice;
        currentProductId = btn.dataset.productId || null;
        currentQty = 1;
        if (modalName) modalName.textContent = pName;
        updateModalTotal();
        resetModalViews();
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  // Modal Close Handlers
  if (modalCloseBtn && modalBackdrop) {
    modalCloseBtn.addEventListener('click', () => {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    });

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  if (recCloseBtn && modalBackdrop) {
    recCloseBtn.addEventListener('click', () => {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
      resetModalViews();
    });
  }

  if (recPrintBtn) {
    recPrintBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Quantity +/-
  if (qtyMinus && qtyPlus) {
    qtyMinus.addEventListener('click', () => {
      if (currentQty > 1) {
        currentQty--;
        updateModalTotal();
      }
    });
    qtyPlus.addEventListener('click', () => {
      currentQty++;
      updateModalTotal();
    });
  }

  // Option 2 from inside Modal: Direct WhatsApp Button
  if (modalWaBtn) {
    modalWaBtn.addEventListener('click', () => {
      const pName = modalName?.textContent || 'Karakoram Product';
      const total = basePrice * currentQty;
      const name = document.querySelector('#co-name')?.value || 'Guest Customer';
      const phone = document.querySelector('#co-phone')?.value || 'Not provided';
      const city = document.querySelector('#co-city')?.value || 'Not specified';
      const addr = document.querySelector('#co-address')?.value || 'Not specified';

      const waMsg = `Salaam Shoaib! I would like to order directly via WhatsApp:\n\n` +
        `📦 *Product:* ${pName}\n` +
        `🔢 *Quantity:* ${currentQty}\n` +
        `💰 *Total Amount:* Rs. ${total.toLocaleString()}\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Phone:* ${phone}\n` +
        `📍 *Delivery City / Address:* ${addr}, ${city}\n\n` +
        `Please confirm availability and dispatch schedule from Ghanche!`;

      // Record WhatsApp order in Supabase
      if (window.SavorSupabase && window.SavorSupabase.recordOrder) {
        window.SavorSupabase.recordOrder({
          customerName: name,
          customerContact: `${phone} | ${addr}, ${city}`,
          checkoutMethod: 'whatsapp_redirect',
          totalPrice: total,
          paymentStatus: 'pending',
          orderStatus: 'processing',
          items: [{ productId: currentProductId, quantity: currentQty, price: basePrice }]
        });
      }

      const waUrl = `https://wa.me/923126583222?text=${encodeURIComponent(waMsg)}`;
      window.open(waUrl, '_blank');
    });
  }

  // Option 2 on Product Cards across the site: [data-wa-order]
  document.querySelectorAll('[data-wa-order]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const pName = this.dataset.name || this.closest('.product-card')?.querySelector('.product-card__name')?.textContent || 'Baltistan Specialty';
      const priceVal = this.dataset.price || '3500';
      const prodId = this.dataset.productId || null;
      const formattedPrice = parseInt(priceVal, 10).toLocaleString();

      const waMsg = `Salaam Shoaib! I want to order *${pName}* (Rs. ${formattedPrice}) directly from Savor of Baltistan.\n\nPlease guide me on current availability and delivery to my city.`;
      
      // Record WhatsApp inquiry in Supabase
      if (window.SavorSupabase && window.SavorSupabase.recordOrder) {
        window.SavorSupabase.recordOrder({
          customerName: 'WhatsApp Visitor',
          customerContact: 'Direct Chat',
          checkoutMethod: 'whatsapp_redirect',
          totalPrice: parseInt(priceVal, 10) || 0,
          paymentStatus: 'pending',
          orderStatus: 'inquiry',
          items: [{ productId: prodId, quantity: 1, price: parseInt(priceVal, 10) || 0 }]
        });
      }

      const waUrl = `https://wa.me/923126583222?text=${encodeURIComponent(waMsg)}`;
      window.open(waUrl, '_blank');
    });
  });

  // Direct Checkout Form Submission (Option 1)
  if (directForm) {
    directForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.querySelector('#co-name')?.value.trim();
      const phone = document.querySelector('#co-phone')?.value.trim();
      const addr = document.querySelector('#co-address')?.value.trim();
      const city = document.querySelector('#co-city')?.value.trim();

      if (!name || !phone || !addr || !city) {
        alert('Please fill in your name, phone number, and delivery address to proceed.');
        return;
      }

      const total = basePrice * currentQty;
      const pName = modalName?.textContent || 'Raw Karakoram Shilajit (20g)';

      if (currentSelectedMethod === 'card') {
        const cHolder = cardHolderInput?.value.trim();
        const cNum = cardNumberInput?.value.replace(/\s/g, '');
        const cExp = cardExpiryInput?.value.trim();
        const cCvc = cardCvcInput?.value.trim();

        if (!cHolder) {
          alert('Please enter the cardholder name.');
          cardHolderInput?.focus();
          return;
        }
        if (!cNum || cNum.length < 15) {
          alert('Please enter a valid 16-digit card number (or click "Autofill Test Card").');
          cardNumberInput?.focus();
          return;
        }
        if (!cExp || !cExp.includes('/')) {
          alert('Please enter card expiry in MM/YY format.');
          cardExpiryInput?.focus();
          return;
        }
        if (!cCvc || cCvc.length < 3) {
          alert('Please enter a valid 3 or 4-digit CVC.');
          cardCvcInput?.focus();
          return;
        }

        // Simulate Gateway Authorization Sequence
        submitBtn.disabled = true;
        submitBtn.innerHTML = '🔄 Contacting Sandbox Gateway (Safepay/Stripe)...';

        setTimeout(() => {
          submitBtn.innerHTML = '🔒 Verifying 3D-Secure Test Authorization...';

          setTimeout(() => {
            const randomTxn = `TXN-SOB-${Math.floor(100000 + Math.random() * 900000)}`;
            const randomOrder = `SOB-${Math.floor(1000 + Math.random() * 9000)}`;

            if (recTxnId) recTxnId.textContent = randomTxn;
            if (recOrderId) recOrderId.textContent = randomOrder;
            if (recItemName) recItemName.textContent = pName;
            if (recQty) recQty.textContent = currentQty;
            if (recCustomer) recCustomer.textContent = `${name} (${phone})`;
            if (recDestination) recDestination.textContent = `${addr}, ${city}`;
            if (recMethod) recMethod.textContent = 'Card Sandbox (Safepay / Stripe)';
            if (recTotal) recTotal.textContent = `Rs. ${total.toLocaleString()}`;

            const waReceiptMsg = `Salaam Shoaib! I have completed payment for my order on Savor of Baltistan:\n\n` +
              `💳 *Payment Status:* AUTHORIZED (Sandbox)\n` +
              `🧾 *Transaction ID:* ${randomTxn}\n` +
              `📦 *Order ID:* ${randomOrder}\n` +
              `🌿 *Product:* ${pName} (Qty: ${currentQty})\n` +
              `💰 *Total Paid:* Rs. ${total.toLocaleString()}\n` +
              `👤 *Customer:* ${name}\n` +
              `📞 *Phone:* ${phone}\n` +
              `📍 *Delivery Address:* ${addr}, ${city}\n\n` +
              `Please prepare my parcel for dispatch from Ghanche!`;

            if (recWaShareBtn) {
              recWaShareBtn.href = `https://wa.me/923126583222?text=${encodeURIComponent(waReceiptMsg)}`;
            }

            // Record into live Supabase database
            if (window.SavorSupabase && window.SavorSupabase.recordOrder) {
              window.SavorSupabase.recordOrder({
                customerName: name,
                customerContact: `${phone} | ${addr}, ${city}`,
                checkoutMethod: 'pay_now',
                totalPrice: total,
                paymentStatus: 'paid',
                orderStatus: 'processing',
                items: [{ productId: currentProductId, quantity: currentQty, price: basePrice }]
              });
            }

            if (formView) formView.style.display = 'none';
            if (receiptView) receiptView.style.display = 'block';

            directForm.reset();
          }, 900);
        }, 800);

      } else {
        // COD or Easypaisa flow
        submitBtn.disabled = true;
        submitBtn.innerHTML = '🔄 Registering Order...';

        setTimeout(() => {
          const randomTxn = `COD-SOB-${Math.floor(100000 + Math.random() * 900000)}`;
          const randomOrder = `SOB-${Math.floor(1000 + Math.random() * 9000)}`;
          const methodTitle = currentSelectedMethod === 'cod' ? 'Cash on Delivery (Pay on Arrival)' : 'EasyPaisa / JazzCash / Bank Alfalah';

          if (recTxnId) recTxnId.textContent = randomTxn;
          if (recOrderId) recOrderId.textContent = randomOrder;
          if (recItemName) recItemName.textContent = pName;
          if (recQty) recQty.textContent = currentQty;
          if (recCustomer) recCustomer.textContent = `${name} (${phone})`;
          if (recDestination) recDestination.textContent = `${addr}, ${city}`;
          if (recMethod) recMethod.textContent = methodTitle;
          if (recTotal) recTotal.textContent = `Rs. ${total.toLocaleString()}`;

          const waReceiptMsg = `Salaam Shoaib! I have placed an order on Savor of Baltistan:\n\n` +
            `📦 *Order ID:* ${randomOrder}\n` +
            `💳 *Payment Method:* ${methodTitle}\n` +
            `🌿 *Product:* ${pName} (Qty: ${currentQty})\n` +
            `💰 *Amount Due:* Rs. ${total.toLocaleString()}\n` +
            `👤 *Customer:* ${name}\n` +
            `📞 *Phone:* ${phone}\n` +
            `📍 *Delivery Address:* ${addr}, ${city}\n\n` +
            `Please confirm dispatch!`;

          if (recWaShareBtn) {
            recWaShareBtn.href = `https://wa.me/923126583222?text=${encodeURIComponent(waReceiptMsg)}`;
          }

          // Record into live Supabase database
          if (window.SavorSupabase && window.SavorSupabase.recordOrder) {
            window.SavorSupabase.recordOrder({
              customerName: name,
              customerContact: `${phone} | ${addr}, ${city}`,
              checkoutMethod: 'pay_now',
              totalPrice: total,
              paymentStatus: 'pending',
              orderStatus: 'processing',
              items: [{ productId: currentProductId, quantity: currentQty, price: basePrice }]
            });
          }

          if (formView) formView.style.display = 'none';
          if (receiptView) receiptView.style.display = 'block';

          directForm.reset();
        }, 700);
      }
    });
  }

  // ── 11. Add to cart feedback ──────────────────────────────
  document.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (modalBackdrop) {
        e.preventDefault();
        const card = this.closest('.product-card');
        const pName = card?.querySelector('.product-card__name')?.textContent || 'Baltistan Product';
        const priceText = card?.querySelector('.product-card__price')?.textContent || '2000';
        const priceNum = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 2000;
        
        basePrice = priceNum;
        currentQty = 1;
        if (modalName) modalName.textContent = pName;
        updateModalTotal();
        resetModalViews();
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

});
