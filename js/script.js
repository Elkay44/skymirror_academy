// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            // Toggle the mobile menu visibility
            if (mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.remove('hidden');
                // Change the icon to 'X'
                mobileMenuButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                `;
            } else {
                mobileMenu.classList.add('hidden');
                // Change back to hamburger icon
                mobileMenuButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                `;
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Load the footer component if the footer-container exists
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        fetch('./components/footer.html')
            .then(response => response.text())
            .then(data => {
                footerContainer.innerHTML = data;
                
                // Re-initialize any scripts that might be needed for the footer
                // (if needed in the future)
            })
            .catch(error => {
                console.error('Error loading footer:', error);
                footerContainer.innerHTML = '<p class="text-center text-gray-400 py-8">© 2025 Skymirror Academy</p>';
            });
    }
    
    // Enhanced form validation and loading states
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...';
            submitButton.disabled = true;
            
            // Collect form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Submit to Google Apps Script
            fetch('https://script.google.com/macros/s/AKfycbzYourScriptId/exec', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.status === 'success') {
                    // Show success message
                    document.getElementById('applicationForm').style.display = 'none';
                    document.getElementById('successMessage').style.display = 'block';
                } else {
                    throw new Error(result.message || 'Submission failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error submitting your application. Please try again.');
            })
            .finally(() => {
                // Reset button state
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            });
        });
    }

    // For FAQ accordion on the apply page
    const faqButtons = document.querySelectorAll('.bg-glass button');
    faqButtons.forEach(button => {
        button.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('svg');
            
            // Toggle the content visibility
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                icon.classList.remove('transform', 'rotate-180');
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                icon.classList.add('transform', 'rotate-180');
            }
        });
    });
    
    // Animate elements on scroll
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animateOnScrollElements.length > 0) {
        const checkIfInView = () => {
            animateOnScrollElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('animate-in');
                }
            });
        };
        
        // Check elements on initial load
        checkIfInView();
        
        // Check elements on scroll
        window.addEventListener('scroll', checkIfInView);
    }
    
    // Initialize particles.js if available
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 50,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#ffffff'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    },
                    polygon: {
                        nb_sides: 5
                    }
                },
                opacity: {
                    value: 0.1,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#ffffff',
                    opacity: 0.1,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 0.3
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }
    
    // Application form submission functionality
    const form = document.getElementById('application-form');
    const formSuccess = document.getElementById('form-success');
    const submitButton = form ? form.querySelector('button[type="submit"]') : null;
    
    if (form && formSuccess && submitButton) {
        // Configuration
        const ADMIN_EMAIL = 'admissions@skymirror.eu';
        // Google Apps Script Web App URL
        const webAppUrl = 'https://script.google.com/macros/s/AKfycbynvl9QmrlMapcH6m5tefjCFpM9GG55RdsZSzlcLO5zXWrZA2_xF3G-AYpvLRqAfVXKBQ/exec';
        
        // Fallback: Check if we have a valid URL
        const hasValidUrl = webAppUrl && !webAppUrl.includes('YOUR_GOOGLE_APPS_SCRIPT');
        
        console.log('Form submission script loaded');
        console.log('Form element:', form);
        console.log('Success element:', formSuccess);
        console.log('Submit button:', submitButton);
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Form submission started...');
            
            try {
                // Disable form and show loading state
                form.classList.add('opacity-50');
                form.classList.add('pointer-events-none');
                submitButton.innerHTML = '<span class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> Submitting...';
                
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                // Handle checkbox value
                data.VanguardCohortInterest = formData.has('VanguardCohortInterest');
                
                console.log('Form data collected:', data);
                
                // Validate required fields
                const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'program', 'background', 'whyInterested'];
                for (const field of requiredFields) {
                    if (!data[field] || data[field].trim() === '') {
                        throw new Error(`Please fill in the ${field} field.`);
                    }
                }
                
                console.log('Validation passed, sending to server...');
                
                if (hasValidUrl) {
                    // Try Google Apps Script submission
                    const response = await fetch(webAppUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    });
                    
                    console.log('Response status:', response.status);
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const result = await response.json();
                    console.log('Response data:', result);
                    
                    if (result.status === 'success') {
                        // Show success message
                        formSuccess.classList.remove('hidden');
                        form.classList.add('hidden');
                        
                        // Log success
                        console.log('Application submitted successfully');
                    } else {
                        throw new Error(result.message || 'Failed to submit application');
                    }
                } else {
                    // Fallback: Create email with form data
                    const emailBody = `
Application Details:
- Name: ${data.firstName} ${data.lastName}
- Email: ${data.email}
- Phone: ${data.phone}
- Program: ${data.program}
- Background: ${data.background}
- Why Interested: ${data.whyInterested}
- Vanguard Cohort Interest: ${data.VanguardCohortInterest ? 'Yes' : 'No'}
                    `.trim();
                    
                    const emailSubject = 'New Application - Skymirror Academy';
                    const mailtoLink = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
                    
                    // Open email client
                    window.open(mailtoLink, '_blank');
                    
                    // Show success message
                    formSuccess.classList.remove('hidden');
                    form.classList.add('hidden');
                    
                    console.log('Application submitted via email fallback');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                
                // Get detailed error information
                const errorMessage = error.message || 'Failed to submit application';
                
                // Show detailed error message
                alert(`Error: ${errorMessage}\n\nIf the error persists, please contact us at ${ADMIN_EMAIL}`);
            } finally {
                // Reset form state only if there was an error
                if (formSuccess.classList.contains('hidden')) {
                    // Reset form state
                    form.classList.remove('opacity-50');
                    form.classList.remove('pointer-events-none');
                    submitButton.innerHTML = 'Submit Application';
                }
            }
        });
    }
});
