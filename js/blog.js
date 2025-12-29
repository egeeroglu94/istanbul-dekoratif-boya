document.addEventListener('DOMContentLoaded', () => {
    const blogContainer = document.getElementById('blogGrid');
    const modal = document.getElementById('blogModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const modalImage = document.getElementById('modalImage');
    const modalBody = document.getElementById('modalBody');
    const closeModal = document.querySelector('.close-modal');

    // 1. Render Blog Posts
    if (blogContainer && typeof blogPosts !== 'undefined') {
        blogContainer.innerHTML = ''; // Clear "Coming Soon" or loading text

        blogPosts.forEach(post => {
            const article = document.createElement('article');
            article.className = 'blog-card';

            // Fallback image if file doesn't exist (using a generic texture path from usage context)
            // Ideally should be specific blog images
            const displayImage = post.image;

            article.innerHTML = `
                <div class="blog-card-image">
                    <img src="${displayImage}" alt="${post.title}" onerror="this.src='images/textures/travertino_classico.png'">
                    <div class="blog-date">${post.date}</div>
                </div>
                <div class="blog-card-content">
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <button class="read-more-btn" data-id="${post.id}">DEVAMINI OKU</button>
                </div>
            `;

            blogContainer.appendChild(article);
        });
    }

    // 2. Open Modal Logic
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('read-more-btn')) {
            const postId = parseInt(e.target.getAttribute('data-id'));
            const post = blogPosts.find(p => p.id === postId);

            if (post) {
                modalTitle.textContent = post.title;
                modalDate.textContent = post.date;
                modalImage.src = post.image;
                // Handle basic image error in modal too
                modalImage.onerror = function () { this.src = 'images/textures/travertino_classico.png'; };

                modalBody.innerHTML = post.content;

                modal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        }
    });

    // 3. Close Modal Logic
    function closeModalFunc() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    if (closeModal) {
        closeModal.addEventListener('click', closeModalFunc);
    }

    // Close on clicking outside content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalFunc();
        }
    });

    // Close on Esc key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModalFunc();
        }
    });
});
