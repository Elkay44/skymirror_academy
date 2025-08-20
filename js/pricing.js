// Monthly Pricing Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize pricing toggles
    initializePricingToggles();
});

function initializePricingToggles() {
    const toggleButtons = document.querySelectorAll('.pricing-toggle-btn');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            const container = this.closest('.bg-glass');
            
            // Update toggle buttons
            const siblingButtons = container.querySelectorAll('.pricing-toggle-btn');
            siblingButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide pricing displays
            const monthlyDisplay = container.querySelector('.monthly-pricing');
            const fullDisplay = container.querySelector('.full-pricing');
            
            if (type === 'monthly') {
                monthlyDisplay.classList.remove('hidden');
                fullDisplay.classList.add('hidden');
            } else {
                monthlyDisplay.classList.add('hidden');
                fullDisplay.classList.remove('hidden');
            }
        });
    });
}

// Pricing data for different programs
const pricingData = {
    fullstack: {
        total: 2990,
        earlyBird: 2590,
        duration: 20,
        monthly: 149,
        earlyBirdMonthly: 129
    },
    ai: {
        total: 2990,
        earlyBird: 2590,
        duration: 20,
        monthly: 149,
        earlyBirdMonthly: 129
    },
    dataScience: {
        total: 2990,
        earlyBird: 2590,
        duration: 24,
        monthly: 124,
        earlyBirdMonthly: 108
    },
    dataEngineering: {
        total: 2990,
        earlyBird: 2590,
        duration: 24,
        monthly: 124,
        earlyBirdMonthly: 108
    },
    frontend: {
        total: 1290,
        earlyBird: 1090,
        duration: 10,
        monthly: 129,
        earlyBirdMonthly: 109
    },
    backend: {
        total: 1490,
        earlyBird: 1290,
        duration: 10,
        monthly: 149,
        earlyBirdMonthly: 129
    },
    greentech: {
        total: 2990,
        earlyBird: 2590,
        duration: 24,
        monthly: 124,
        earlyBirdMonthly: 108
    }
};
