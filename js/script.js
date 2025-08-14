// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Handle form submission with iframe method for proper autoresponse
    const form = document.getElementById('application-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const submitButton = form.querySelector('button[type="submit"]');
            
            // Show loading state
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            // Show success message after a short delay to allow form submission
            setTimeout(() => {
                showSuccessMessage();
            }, 1000);
            
            // Form will submit to iframe, so page won't redirect
        });
    }
    
    function showSuccessMessage() {
        const form = document.getElementById('application-form');
        const successMessage = document.getElementById('form-success');
        const formTitle = document.querySelector('h2');
        
        if (form && successMessage) {
            // Hide the form and title
            form.style.display = 'none';
            if (formTitle && formTitle.textContent.includes('Start Your Application')) {
                formTitle.style.display = 'none';
            }
            
            // Show success message
            successMessage.classList.remove('hidden');
            successMessage.style.display = 'block';
            
            // Scroll to success message
            setTimeout(() => {
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }
    
    // Show success message on redirect (backup)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('submission') === 'success') {
        showSuccessMessage();
        
        // Clear URL parameter
        setTimeout(() => {
            const url = new URL(window.location);
            url.searchParams.delete('submission');
            window.history.replaceState({}, document.title, url.pathname);
        }, 1000);
    }

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
    
});
