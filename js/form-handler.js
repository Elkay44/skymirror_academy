/**
 * Form Handler for Skymirror Academy Application
 * Handles form submission to Google Apps Script
 */

// Replace this with your actual Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz3ZSlFjqsNj96DJZSAN8qZGRb3pQktk3Hs4Bp874FciK7Jgxh6xqdHCL086gboscI-7Q/exec';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('application-form');
    const formContainer = form.parentElement;
    const successMessage = document.getElementById('form-success');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            country: formData.get('country'),
            program: formData.get('program'),
            background: formData.get('background'),
            whyInterested: formData.get('whyInterested'),
            VanguardCohortInterest: formData.get('VanguardCohortInterest') === 'on'
        };

        // Disable submit button and show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...';

        try {
            // Send data to Google Apps Script
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            // Since we're using no-cors mode, we can't read the response
            // but if no error is thrown, we assume success
            
            // Track conversion with Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'conversion', {
                    'send_to': 'G-72BT2KS8WV',
                    'event_category': 'Application',
                    'event_label': data.program,
                    'value': 1
                });
                
                gtag('event', 'generate_lead', {
                    'currency': 'EUR',
                    'value': 149,
                    'program': data.program,
                    'country': data.country
                });
            }
            
            // Track conversion with Meta Pixel
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead', {
                    content_name: data.program,
                    content_category: 'Application',
                    value: 149,
                    currency: 'EUR'
                });
                
                fbq('track', 'CompleteRegistration', {
                    content_name: 'Application Form',
                    status: 'completed'
                });
            }
            
            // Track with dataLayer for Google Tag Manager (if using GTM)
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'application_submitted',
                'program': data.program,
                'country': data.country,
                'email': data.email,
                'conversion_value': 149
            });
            
            // Hide form and show success message
            form.style.display = 'none';
            successMessage.classList.remove('hidden');
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        } catch (error) {
            console.error('Error submitting form:', error);
            
            // Show error message
            alert('There was an error submitting your application. Please try again or contact us directly at lukman.ibrahim@skymirror.eu');
            
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
});
