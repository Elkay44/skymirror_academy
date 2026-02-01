/**
 * Form Handler for Skymirror Academy Application
 * Handles form submission to Google Apps Script
 */

// Replace this with your actual Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

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
