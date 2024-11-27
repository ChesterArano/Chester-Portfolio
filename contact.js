document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitButton = form.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('.button-text');
    const spinner = submitButton.querySelector('.spinner-border');
    const successMessage = document.getElementById('successMessage');

    // Replace with your Formspree endpoint
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORMSPREE_ID';

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Verify reCAPTCHA
        const recaptchaResponse = grecaptcha.getResponse();
        if (!recaptchaResponse) {
            alert('Please complete the reCAPTCHA verification');
            return;
        }

        // Show loading state
        buttonText.textContent = 'Sending...';
        spinner.classList.remove('d-none');
        submitButton.disabled = true;

        // Prepare form data
        const formData = new FormData(form);
        formData.append('g-recaptcha-response', recaptchaResponse);

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Show success message
                form.reset();
                form.classList.add('d-none');
                successMessage.classList.remove('d-none');
                
                // Reset reCAPTCHA
                grecaptcha.reset();
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            alert('Oops! There was a problem sending your message. Please try again or contact me directly via email.');
        } finally {
            // Reset button state
            buttonText.textContent = 'Send Message';
            spinner.classList.add('d-none');
            submitButton.disabled = false;
        }
    });

    // Optional: Add form validation
    function validateForm() {
        const name = form.querySelector('[name="name"]').value;
        const email = form.querySelector('[name="_replyto"]').value;
        const message = form.querySelector('[name="message"]').value;

        if (!name || !email || !message) {
            alert('Please fill in all required fields');
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return false;
        }

        return true;
    }
}); 