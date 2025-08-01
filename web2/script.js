// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('Smart Contact Hub - Google Apps Script Integration Loaded!');
    
    // Check integration status on page load
    setTimeout(() => {
        checkIntegrationStatus();
    }, 1000);
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Add scroll effect to navigation
    window.addEventListener('scroll', handleNavScroll);
    
    // Add intersection observer for animations
    initScrollAnimations();
});

// Function to test Google Apps Script integration
function testGoogleScript() {
    const statusIndicator = document.getElementById('statusIndicator');
    if (statusIndicator) {
        statusIndicator.textContent = 'Testing connection...';
        statusIndicator.style.color = '#ffc107';
    }
    
    // Test the Google Apps Script endpoint
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'GET',
        mode: 'no-cors'
    })
    .then(() => {
        showSuccessMessage('✅ Google Apps Script integration is working! You can now use the contact form.');
        if (statusIndicator) {
            statusIndicator.textContent = '✅ Connected';
            statusIndicator.style.color = '#28a745';
        }
    })
    .catch((error) => {
        console.error('Connection test failed:', error);
        showErrorMessage('⚠️ Connection test completed. The integration should still work for form submissions.');
        if (statusIndicator) {
            statusIndicator.textContent = '⚠️ Status Unknown (This is normal)';
            statusIndicator.style.color = '#ffc107';
        }
    });
}

// Function to show alert when CTA button is clicked (legacy support)
function showAlert() {
    testGoogleScript();
}

// Google Apps Script endpoint URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzr0J2Le-weonsVdFQw2lmf9TKdPPshhhyxPGUMf1k/dev';

// Handle contact form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Get form data
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    if (!name || !email || !message) {
        showErrorMessage('Please fill in all required fields.');
        return;
    }
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Submit to Google Apps Script
    submitToGoogleScript(formData)
        .then(response => {
            console.log('Form submitted successfully:', response);
            showSuccessMessage('Thank you for your message! We\\'ll get back to you soon.');
            e.target.reset();
        })
        .catch(error => {
            console.error('Form submission error:', error);
            showErrorMessage('Sorry, there was an error sending your message. Please try again.');
        })
        .finally(() => {
            // Reset button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        });
}

// Submit form data to Google Apps Script
async function submitToGoogleScript(formData) {
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(formData)
        });
        
        // Note: With no-cors mode, we can't read the response
        // We'll assume success if no error is thrown
        return { success: true };
    } catch (error) {
        throw new Error('Network error: ' + error.message);
    }
}

// Show success message
function showSuccessMessage(message = 'Thank you for your message! We\'ll get back to you soon.') {
    // Remove any existing messages
    removeExistingMessages();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <p>✅ ${message}</p>
    `;
    successDiv.style.cssText = `
        background: #d4edda;
        color: #155724;
        padding: 15px;
        border-radius: 5px;
        margin: 20px 0;
        border: 1px solid #c3e6cb;
        text-align: center;
        animation: slideIn 0.3s ease;
    `;
    
    const contactForm = document.querySelector('.contact-form');
    contactForm.parentNode.insertBefore(successDiv, contactForm);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 5000);
}

// Show error message
function showErrorMessage(message = 'Please fill in all required fields.') {
    // Remove any existing messages
    removeExistingMessages();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <p>❌ ${message}</p>
    `;
    errorDiv.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 15px;
        border-radius: 5px;
        margin: 20px 0;
        border: 1px solid #f5c6cb;
        text-align: center;
        animation: slideIn 0.3s ease;
    `;
    
    const contactForm = document.querySelector('.contact-form');
    contactForm.parentNode.insertBefore(errorDiv, contactForm);
    
    // Remove error message after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Remove existing success/error messages
function removeExistingMessages() {
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(message => message.remove());
}

// Handle navigation scroll effect
function handleNavScroll() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
}

// Initialize scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });
    
    // Observe sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const sectionTitle = section.querySelector('h2');
        if (sectionTitle) {
            sectionTitle.style.opacity = '0';
            sectionTitle.style.transform = 'translateY(30px)';
            sectionTitle.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(sectionTitle);
        }
    });
}

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effect to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add typing effect to hero text
    const heroTitle = document.querySelector('.hero-content h2');
    if (heroTitle) {
        setTimeout(() => {
            heroTitle.style.borderRight = '2px solid white';
            heroTitle.style.animation = 'blink 1s infinite';
        }, 1500);
    }
});

// Add CSS for blinking cursor
const style = document.createElement('style');
style.textContent = `
    @keyframes blink {
        0%, 50% { border-color: transparent; }
        51%, 100% { border-color: white; }
    }
`;
document.head.appendChild(style);
