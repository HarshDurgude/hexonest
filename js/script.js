document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const PHONE_NUMBER = '9657201665';
    // Add folder names here whenever you add a new product folder to assets/images/
    const PRODUCT_DIRS = [
        'earphone-winder',
        'feather-bookmark',
        'paw-bookmark',
        'pen-holder',
        'phone-hook',
        'phone-stand',
        'shelf-clamp',
        'couple-keychain',
        'name-keychain'
    ];

    let allProductsData = {};

    // --- Theme Toggle Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('hexonest-theme') || 'dark-theme';
    body.className = savedTheme;

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = body.classList.contains('light-theme') ? 'dark-theme' : 'light-theme';
            body.className = newTheme;
            localStorage.setItem('hexonest-theme', newTheme);
        });
    }

    // --- Mobile Menu Logic ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    // --- WhatsApp Helper ---
    function openWhatsApp(productName) {
        const message = `Hi Hexonest, I want to inquire about:\nProduct: ${productName}\nBudget:\nRequirements: `;
        const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    // --- Core Product Loading Engine ---
    async function init() {
        await loadAllProducts();
        renderGrids();
        setupContactForm();
    }

    async function loadAllProducts() {
        const fetchPromises = PRODUCT_DIRS.map(async (dir) => {
            try {
                const response = await fetch(`assets/images/${dir}/${dir}.json`);
                if (!response.ok) throw new Error(`Failed to load ${dir}`);
                const data = await response.json();
                // Store path to image and directory key
                data.image_path = `assets/images/${dir}/${dir}.webp`;
                data.dir_key = dir;
                allProductsData[dir] = data;
            } catch (err) {
                console.error("Error loading product:", dir, err);
            }
        });
        await Promise.all(fetchPromises);
    }

    function renderGrids() {
        const homeGrid = document.getElementById('home-featured-grid');
        const shopGrid = document.getElementById('shop-all-grid');

        const productArray = Object.values(allProductsData);

        if (homeGrid) {
            // Show first 3 for featured on home
            const featured = productArray.slice(0, 3);
            homeGrid.innerHTML = featured.map((p, index) => createProductCard(p, index)).join('');
        }

        if (shopGrid) {
            shopGrid.innerHTML = productArray.map((p, index) => createProductCard(p, index)).join('');
        }

        // Initialize animations for newly created cards
        observeNewElements();
    }

    function createProductCard(p, index) {
        return `
            <div class="product-card" data-reveal style="transition-delay: ${index * 0.1}s" data-product-key="${p.dir_key}">
                <div class="product-img-wrapper">
                    <img src="${p.image_path}" alt="${p.product_name}" loading="lazy">
                </div>
                <div class="product-info">
                    <span class="category">Premium 3D Print</span>
                    <h3>${p.product_name}</h3>
                    <div class="product-price">₹${p.price}</div>
                    ${window.location.pathname.includes('shop.html') ? 
                        `<button class="btn btn-outline whatsapp-btn" onclick="event.stopPropagation();" data-product="${p.product_name}" style="width: 100%; margin-top: 15px;">Order on WhatsApp</button>` : ''}
                </div>
            </div>
        `;
    }

    // Use event delegation for dynamic elements
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        const waBtn = e.target.closest('.whatsapp-btn');

        if (waBtn) {
            openWhatsApp(waBtn.getAttribute('data-product'));
            return;
        }

        if (card) {
            const key = card.getAttribute('data-product-key');
            openProductModal(key);
        }
    });

    // --- Modal Logic ---
    function openProductModal(key) {
        const p = allProductsData[key];
        if (!p) return;

        // Ensure modal exists in DOM
        let modal = document.getElementById('product-modal');
        if (!modal) {
            createModalMarkup();
            modal = document.getElementById('product-modal');
        }

        const modalImg = document.getElementById('modal-img');
        modalImg.src = p.image_path;
        document.getElementById('modal-title').textContent = p.product_name;
        document.getElementById('modal-price').textContent = `₹${p.price}`;
        document.getElementById('modal-desc').textContent = p.description;
        document.getElementById('modal-wa-btn').setAttribute('data-product', p.product_name);
        
        const specsList = document.getElementById('modal-specs-list');
        specsList.innerHTML = "";
        if (p.specifications) {
            for (const [s, v] of Object.entries(p.specifications)) {
                specsList.innerHTML += `<li><span>${s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}</span>${v}</li>`;
            }
        }

        modal.classList.add('active');
        body.style.overflow = 'hidden';
    }

    function createModalMarkup() {
        const markup = `
            <div id="product-modal" class="modal">
                <div class="modal-content">
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                    <div class="modal-img-side">
                        <img id="modal-img" src="" alt="">
                    </div>
                    <div class="modal-info-side">
                        <span class="category">Product Details</span>
                        <h2 id="modal-title"></h2>
                        <div class="modal-price" id="modal-price"></div>
                        <p id="modal-desc" style="color: var(--text-muted); margin-bottom: 30px;"></p>
                        <div class="modal-specs">
                            <h4>Specifications</h4>
                            <ul id="modal-specs-list"></ul>
                        </div>
                        <button class="btn btn-primary whatsapp-btn" id="modal-wa-btn">Order on WhatsApp</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', markup);

        // Close event for backdrop
        const modal = document.getElementById('product-modal');
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };
    }

    window.closeModal = function() {
        const modal = document.getElementById('product-modal');
        if (modal) {
            modal.classList.remove('active');
            body.style.overflow = '';
        }
    };

    // --- Contact Form ---
    function setupContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const first = document.getElementById('first-name').value;
            const last = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;
            const msg = document.getElementById('message').value;

            const text = `New Message from Hexonest Website:\n\nName: ${first} ${last}\nEmail: ${email}\nMessage: ${msg}`;
            const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
        });
    }

    // --- Scroll Animations ---
    function observeNewElements() {
        const revealElements = document.querySelectorAll('[data-reveal]');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    init();
});