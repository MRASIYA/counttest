document.addEventListener('DOMContentLoaded', function() {
    // Function to open the Google Apps Script web app
    window.openApp = function() {
        const appUrl = 'https://script.google.com/macros/s/AKfycbzxiyxIKbjYbv2XI1Q4CoiFs2A4v6hMkiO_qxJKu6Qmi9bZTVeL8IDRxGoh8XEzAXrv/exec';
        const appFrame = document.getElementById('appFrame');
        const previewPlaceholder = document.getElementById('previewPlaceholder');

        if (appFrame && previewPlaceholder) {
            previewPlaceholder.style.display = 'none';
            appFrame.src = appUrl;
            appFrame.style.display = 'block';
        }
    };
});
