document.addEventListener('DOMContentLoaded', function() {
    const APP_URL = 'https://script.google.com/macros/s/AKfycbyMdBe-KbcMmC7Cxhd-brEH19L-lp-tSUsHnmTowon55cXeEwfpfkTbhIeGyGVdjo7I/exec';
    const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1uVKj3fmeIu0ExCLEeEQ6_7X3Hqi9DEA65ophongr56Y/edit';

    // Initialize the website
    init();

    function init() {
        addEventListeners();
        animateFeatureCards();
        preloadApp();
    }

    function addEventListeners() {
        // Launch app button
        const launchBtn = document.querySelector('.launch-btn');
        if (launchBtn) {
            launchBtn.addEventListener('click', openApp);
        }

        // Add smooth scrolling for internal links
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

        // Add loading states to external links
        document.querySelectorAll('a[target="_blank"]').forEach(link => {
            link.addEventListener('click', function() {
                showNotification('Opening in new tab...', 'info');
            });
        });
    }

    function openApp() {
        // Google Apps Script doesn't allow iframe embedding due to X-Frame-Options
        // Open directly in new tab for best user experience
        window.open(APP_URL, '_blank');
        showNotification('Opening Material Management Application in new tab...', 'success');
        
        // Update the UI to show that the app opened in a new tab
        const previewPlaceholder = document.getElementById('previewPlaceholder');
        if (previewPlaceholder) {
            previewPlaceholder.innerHTML = `
                <div class="placeholder-content">
                    <div class="placeholder-icon">🚀</div>
                    <h3>Application Opened in New Tab</h3>
                    <p>The Material Management System has been opened in a new browser tab for the best experience.</p>
                    <div class="action-buttons" style="margin-top: 1.5rem;">
                        <button onclick="openApp()" class="launch-btn" style="margin: 0.5rem;">
                            <span class="btn-icon">🔗</span>
                            Open Again
                        </button>
                        <button onclick="openSheet()" class="launch-btn" style="margin: 0.5rem; background: #28a745;">
                            <span class="btn-icon">📊</span>
                            View Google Sheet
                        </button>
                    </div>
                    <div style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
                        <p><strong>Features available in the application:</strong></p>
                        <ul class="feature-list" style="margin-top: 0.5rem;">
                            <li>✅ Select materials from dropdown</li>
                            <li>✅ View current stock levels</li>
                            <li>✅ Enter transactions (Received/Issued/Return)</li>
                            <li>✅ Automatic stock calculations</li>
                            <li>✅ Real-time Google Sheets updates</li>
                        </ul>
                    </div>
                </div>
            `;
        }
    }

    function showLoadingState(button) {
        if (button) {
            button.disabled = true;
            button.innerHTML = '<span class="btn-icon">⏳</span> Loading Application...';
            button.classList.add('loading');
        }
    }

    function hideLoadingState(button) {
        if (button) {
            button.disabled = false;
            button.innerHTML = '<span class="btn-icon">🚀</span> Launch Application';
            button.classList.remove('loading');
        }
    }

    function showAppError() {
        const previewPlaceholder = document.getElementById('previewPlaceholder');
        const appFrame = document.getElementById('appFrame');
        
        if (previewPlaceholder && appFrame) {
            appFrame.style.display = 'none';
            previewPlaceholder.style.display = 'flex';
            previewPlaceholder.innerHTML = `
                <div class="placeholder-content">
                    <div class="placeholder-icon">⚠️</div>
                    <h3>Unable to Load Application</h3>
                    <p>The application couldn't be loaded in the frame. Click below to open in a new tab.</p>
                    <button onclick="window.open('${APP_URL}', '_blank')" class="launch-btn" style="margin-top: 1rem;">
                        <span class="btn-icon">🔗</span>
                        Open in New Tab
                    </button>
                </div>
            `;
        }
        
        showNotification('Unable to load app in frame. Try opening in a new tab.', 'error');
    }

    function preloadApp() {
        // Preload the app URL to improve loading speed
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = APP_URL;
        link.as = 'document';
        document.head.appendChild(link);
    }

    function animateFeatureCards() {
        // Animate feature cards on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe feature cards
        document.querySelectorAll('.feature-card, .info-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    function showNotification(message, type = 'info') {
        // Create or update notification
        let notification = document.getElementById('notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(notification);
        }

        // Set notification style based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };

        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;

        // Show notification
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Hide notification after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
        }, 4000);
    }

    // Utility functions
    window.openSheet = function() {
        window.open(SHEET_URL, '_blank');
        showNotification('Opening Google Sheet...', 'info');
    };

    window.refreshApp = function() {
        const appFrame = document.getElementById('appFrame');
        if (appFrame && appFrame.src) {
            appFrame.src = appFrame.src;
            showNotification('Refreshing application...', 'info');
        }
    };

    window.resetApp = function() {
        const appFrame = document.getElementById('appFrame');
        const previewPlaceholder = document.getElementById('previewPlaceholder');
        
        if (appFrame && previewPlaceholder) {
            appFrame.style.display = 'none';
            appFrame.src = '';
            previewPlaceholder.style.display = 'flex';
            showNotification('Application reset', 'info');
        }
    };

    // Make functions globally accessible
    window.openApp = openApp;
    window.showNotification = showNotification;
});
