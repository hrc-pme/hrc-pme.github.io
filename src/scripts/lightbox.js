/**
 * Lightbox functionality for HRC Lab website
 * Allows clicking on images to view them in full size with semi-transparent background
 */

// Initialize lightbox when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLightbox();
});

function initializeLightbox() {
    // Create lightbox HTML structure
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <div class="lightbox-content">
            <img class="lightbox-image" src="" alt="Enlarged image">
        </div>
    `;
    document.body.appendChild(lightbox);

    // Get all images that should be clickable
    const clickableImages = document.querySelectorAll('img[src*="assets/images"]');
    
    // Add click event to each image
    clickableImages.forEach(function(img) {
        // Add clickable class for styling
        img.classList.add('clickable-image');
        
        // Add click event listener
        img.addEventListener('click', function(e) {
            e.preventDefault();
            openLightbox(this.src, this.alt);
        });
    });

    // Add click event to close lightbox
    lightbox.addEventListener('click', function(e) {
        closeLightbox();
    });

    // Add escape key listener
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            closeLightbox();
        }
    });
}

function openLightbox(imageSrc, imageAlt) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    
    lightboxImage.src = imageSrc;
    lightboxImage.alt = imageAlt || 'Enlarged image';
    
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}
