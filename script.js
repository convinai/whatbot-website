// Configuration
const BACKEND_URL = 'https://backend-five-alpha-21.vercel.app';
const CHROME_STORE_URL = 'https://chromewebstore.google.com/detail/whatbot/YOUR_EXTENSION_ID';

// Navigation scroll effect
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const navHeight = nav.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Update Chrome Web Store links
function updateChromeStoreLinks(url) {
    const links = ['nav-cta', 'hero-cta', 'footer-cta'];
    links.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.href = url;
        }
    });

    // Also update the free trial button in pricing
    const freeTrialBtn = document.querySelector('.pricing-card:first-child .btn');
    if (freeTrialBtn) {
        freeTrialBtn.href = url;
    }
}

// Detect user region
async function detectRegion() {
    // First try IP-based detection
    try {
        const response = await fetch('https://ipapi.co/json/', {
            timeout: 3000
        });
        if (response.ok) {
            const data = await response.json();
            if (data.country_code) {
                return data.country_code;
            }
        }
    } catch (e) {
        console.log('IP detection failed, using timezone fallback');
    }

    // Fallback to timezone detection
    try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timezone && timezone.startsWith('Asia/Kolkata') || timezone.startsWith('Asia/Calcutta')) {
            return 'IN';
        }
    } catch (e) {
        console.log('Timezone detection failed');
    }

    return 'default';
}

// Fetch pricing configuration
async function fetchPricing() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/pricing/config`);
        if (!response.ok) {
            throw new Error('Failed to fetch pricing');
        }
        const data = await response.json();
        if (data.success && data.data) {
            return data.data;
        }
    } catch (e) {
        console.error('Error fetching pricing:', e);
    }

    // Return default pricing if API fails
    return {
        regions: {
            default: {
                currency: 'USD',
                symbol: '$',
                monthly: 2,
                annual: 15,
                checkoutUrls: {
                    monthly: '#',
                    annual: '#'
                }
            },
            IN: {
                currency: 'INR',
                symbol: '₹',
                monthly: 99,
                annual: 799,
                checkoutUrls: {
                    monthly: '#',
                    annual: '#'
                }
            }
        }
    };
}

// Update pricing display
function updatePricingDisplay(pricing, region) {
    const regionPricing = pricing.regions[region] || pricing.regions.default;
    const defaultPricing = pricing.regions.default;

    const symbol = regionPricing.symbol;
    const monthly = regionPricing.monthly;
    const annual = regionPricing.annual;
    const checkoutUrls = regionPricing.checkoutUrls || {};

    // Update price displays
    const monthlyEl = document.getElementById('monthly-price');
    const annualEl = document.getElementById('annual-price');

    if (monthlyEl) {
        monthlyEl.textContent = `${symbol}${monthly}`;
    }

    if (annualEl) {
        annualEl.textContent = `${symbol}${annual}`;
    }

    // Update checkout URLs
    const monthlyCta = document.getElementById('monthly-cta');
    const annualCta = document.getElementById('annual-cta');

    if (monthlyCta && checkoutUrls.monthly) {
        monthlyCta.href = checkoutUrls.monthly;
    }

    if (annualCta && checkoutUrls.annual) {
        annualCta.href = checkoutUrls.annual;
    }

    // Update savings badge
    const savingsPercent = Math.round((1 - (annual / (monthly * 12))) * 100);
    const saveBadge = document.getElementById('save-badge');
    if (saveBadge) {
        saveBadge.textContent = `Save ${savingsPercent}%`;
    }

    // Update months free text
    const monthsFree = Math.round((monthly * 12 - annual) / monthly);
    const saveMonths = document.getElementById('save-months');
    if (saveMonths) {
        saveMonths.textContent = `${monthsFree} month${monthsFree > 1 ? 's' : ''} free`;
    }

    // Update CTA note
    const ctaNote = document.getElementById('cta-note');
    if (ctaNote) {
        ctaNote.textContent = `7-day free trial, then just ${symbol}${monthly}/month`;
    }

    // Update pricing note
    const pricingNote = document.getElementById('pricing-note');
    if (pricingNote) {
        if (region === 'IN') {
            pricingNote.textContent = 'Prices shown in INR for India.';
        } else {
            pricingNote.textContent = 'Prices shown in USD. Local pricing available for India (₹99/mo, ₹799/yr).';
        }
    }
}

// Initialize
async function init() {
    // Update Chrome Store links (replace YOUR_EXTENSION_ID with actual ID when available)
    updateChromeStoreLinks(CHROME_STORE_URL);

    // Detect region and fetch pricing in parallel
    const [region, pricing] = await Promise.all([
        detectRegion(),
        fetchPricing()
    ]);

    // Update pricing display
    updatePricingDisplay(pricing, region);
}

// Run initialization
init();
