document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('cta-button');
    
    button.addEventListener('click', () => {
        // Simple interaction for now
        button.textContent = 'Welcome aboard!';
        button.style.backgroundColor = '#10b981'; // Emerald 500
        
        // Confetti could be added here in a future update
        console.log('User clicked the Learn More button');
    });

    console.log('Website initialized successfully');
});
