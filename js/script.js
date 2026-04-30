document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('hexanest-theme');
    if (savedTheme) {
        body.className = savedTheme;
    } else {
        body.className = 'dark-theme';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('light-theme')) {
                body.classList.replace('light-theme', 'dark-theme');
                localStorage.setItem('hexanest-theme', 'dark-theme');
            } else {
                body.classList.replace('dark-theme', 'light-theme');
                localStorage.setItem('hexanest-theme', 'light-theme');
            }
        });
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // WhatsApp Integration
    const phoneNumber = '9657201665';

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('whatsapp-btn')) {
            const button = e.target;
            const productName = button.getAttribute('data-product');
            const message = `Hi Hexanest, I want to inquire about:\nProduct: ${productName}\nBudget:\nRequirements: `;
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
        }
    });

    // --- Product Data ---
    const products = {
        "earphone_winder": {
            name: "Minimal Earphone Winder",
            price: "₹199",
            image: "assets/images/earphone_winder.jpg",
            specs: { Material: "Premium PLA", Weight: "15g", Compatibility: "All Wired Earbuds", Warranty: "6 Months" },
            desc: "Keep your cables organized and tangle-free with this compact, elegant winder. Designed for daily durability."
        },
        "phone-stand": {
            name: "Wave Phone Stand",
            price: "₹249",
            image: "assets/images/phone-stand.jpg",
            specs: { Material: "Reinforced PETG", Stability: "Anti-tip design", Viewing: "60-degree angle", Warranty: "1 Year" },
            desc: "Modern ergonomic design for hands-free viewing. Sturdy enough for large smartphones and small tablets."
        },
        "feather-bookmark": {
            name: "Feather Bookmark",
            price: "₹99",
            image: "assets/images/feather-bookmark.jpg",
            specs: { Thickness: "0.8mm", Material: "Flexible PLA", Length: "150mm", Colors: "Multiple" },
            desc: "An ultra-thin, flexible bookmark that won't damage your book's spine. Beautiful feather-inspired geometry."
        },
        "paw-bookmark": {
            name: "Paw Print Bookmark",
            price: "₹99",
            image: "assets/images/paw-bookmark.jpg",
            specs: { Material: "PLA+", Design: "Cute Paw", Clip: "Secure fit", Weight: "5g" },
            desc: "The perfect gift for book lovers and pet owners. Securely clips onto any page to keep your spot safe."
        },
        "shelf-clamp": {
            name: "Desk Edge Clamp",
            price: "₹299",
            image: "assets/images/shelf-clamp.jpg",
            specs: { Max_Gap: "40mm", Material: "High-Strength ABS", Load: "Up to 1kg", Screw: "M6 Custom" },
            desc: "A heavy-duty screw-on clamp for your desk or shelf edge. Perfect for mounting accessories or cables."
        },
        "pen-holder": {
            name: "Clamp-on Pen Holder",
            price: "₹149",
            image: "assets/images/pen-holder.jpg",
            specs: { Capacity: "3-5 Pens", Attachment: "Screw Clamp", Design: "Hexagonal", Material: "PLA" },
            desc: "Clear up your desk space with this clamp-on pen holder. Attaches to any surface up to 30mm thick."
        },
        "phone-hook": {
            name: "Headphone/Phone Hook",
            price: "₹249",
            image: "assets/images/phone-hook.jpg",
            specs: { Material: "Tough Resin/PETG", Type: "Dual Purpose", Mount: "Screw Clamp", Surface: "Non-slip" },
            desc: "A versatile hook that holds both your headphones and smartphone. Save space and stay organized."
        }
    };

    // --- Product Modal Logic ---
    if (!document.getElementById('product-modal')) {
        const modalHtml = `
            <div id="product-modal" class="modal">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <div class="modal-img-side">
                        <img id="modal-img" src="" alt="">
                    </div>
                    <div class="modal-info-side">
                        <span class="category" id="modal-category">Premium Design</span>
                        <h2 id="modal-title">Product Name</h2>
                        <div class="modal-price" id="modal-price">₹0</div>
                        <p id="modal-desc" style="color: var(--text-muted); margin-bottom: 30px;"></p>
                        <div class="modal-specs">
                            <h4>Specifications</h4>
                            <ul id="modal-specs-list"></ul>
                        </div>
                        <button class="btn btn-primary whatsapp-btn" id="modal-wa-btn" data-product="">Order on WhatsApp</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    const modal = document.getElementById('product-modal');
    const modalImg = document.getElementById('modal-img');

    function openProductModal(key) {
        const p = products[key];
        if (!p) return;

        modalImg.src = p.image;
        document.getElementById('modal-title').textContent = p.name;
        document.getElementById('modal-price').textContent = p.price;
        document.getElementById('modal-desc').textContent = p.desc;
        document.getElementById('modal-wa-btn').setAttribute('data-product', p.name);
        
        const specsList = document.getElementById('modal-specs-list');
        specsList.innerHTML = "";
        for (const [s, v] of Object.entries(p.specs)) {
            specsList.innerHTML += `<li><span>${s.replace('_', ' ')}</span>${v}</li>`;
        }

        modal.classList.add('active');
        body.style.overflow = 'hidden';
    }

    // Modal Close
    document.querySelector('.modal-close')?.addEventListener('click', () => {
        modal.classList.remove('active');
        body.style.overflow = '';
    });

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Card Interaction Setup
    document.querySelectorAll('.product-card').forEach(card => {
        const key = card.getAttribute('data-product-key');
        if (!key || !products[key]) return;

        const imgWrapper = card.querySelector('.product-img-wrapper');
        const title = card.querySelector('h3');

        if (imgWrapper) {
            imgWrapper.onclick = () => openProductModal(key);
        }
        if (title) {
            title.style.cursor = 'pointer';
            title.onclick = () => openProductModal(key);
        }
    });

    // Reveal on Scroll
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
});