document.addEventListener('DOMContentLoaded', () => {

    // --- FAQ Accordion Functionality ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Toggle the 'active' class on the clicked FAQ item
            item.classList.toggle('active');

            // Optional: Close other open FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });

    // --- Location Dropdown Functionality ---
    const locationSection = document.querySelector('.navbar-location');
    const locationDropdown = document.querySelector('.location-dropdown');

    locationSection.addEventListener('click', (event) => {
        // Prevent the click inside the dropdown from closing it
        if (!locationDropdown.contains(event.target)) {
             locationSection.classList.toggle('active');
        }
    });

     // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!locationSection.contains(event.target)) {
            locationSection.classList.remove('active');
        }
    });

    // Prevent click inside dropdown from propagating to document and closing it
    locationDropdown.addEventListener('click', (event) => {
        event.stopPropagation();
    });


    // --- Search Bar Click Functionality (Redirect) ---
    const searchButton = document.querySelector('.search-button');
    const searchInput = document.querySelector('.search-input');

    searchButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default button behavior

        const searchTerm = searchInput.value.trim();
        // Redirect to shopping.html with search query as a URL parameter
        // This is a basic redirect; a real search page would process this parameter
        if (searchTerm) {
             window.location.href = `shopping.html?search=${encodeURIComponent(searchTerm)}`;
        } else {
            // Optional: Handle empty search input
            alert("Please enter a medicine name to search.");
        }
    });

     // Allow searching by pressing Enter key in the input field
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission
            searchButton.click(); // Trigger the search button click event
        }
    });

    // --- Theme Toggle Functionality ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Set default theme to light unless saved preference is dark
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> <span class="btn-text">Light Theme</span>';
    } else {
        // Default is light theme
        body.classList.remove('dark-theme');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> <span class="btn-text">Dark Theme</span>';
        // Save light theme as default if no preference was found
        if (!savedTheme) {
             localStorage.setItem('theme', 'light');
        }
    }


    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-theme');

        // Update button icon and text based on current theme
        if (body.classList.contains('dark-theme')) {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> <span class="btn-text">Light Theme</span>';
            localStorage.setItem('theme', 'dark'); // Save preference
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> <span class="btn-text">Dark Theme</span>';
            localStorage.setItem('theme', 'light'); // Save preference
        }
    });


    // --- Carousel Functionality ---

    // Function to initialize a single carousel
    function initializeCarousel(containerSelector, autoSlideInterval = 7000) { // Increased interval for slower auto-slide
        const carouselContainer = document.querySelector(containerSelector);
        if (!carouselContainer) return; // Exit if container not found

        const track = carouselContainer.querySelector('.carousel-track');
        const items = track.querySelectorAll('.product-card');
        const leftArrow = carouselContainer.querySelector('.carousel-arrow.left');
        const rightArrow = carouselContainer.querySelector('.carousel-arrow.right');
        const dotsContainer = carouselContainer.querySelector('.carousel-dots');

        if (items.length === 0) {
            // Hide carousel elements if no items
            carouselContainer.style.display = 'none';
            return;
        }

        let currentIndex = 0;
        let itemsPerView = 4; // Default for desktop
        let slideInterval;

        // Function to update itemsPerView based on screen width
        function updateItemsPerView() {
            if (window.innerWidth <= 768) {
                itemsPerView = 1; // Mobile
            } else if (window.innerWidth <= 1024) {
                itemsPerView = 2; // Tablet
            } else {
                itemsPerView = 4; // Desktop
            }
             // Recalculate dots and reset position on resize
            generateDots();
            moveToSlide(0, false); // Reset to first slide on resize, without smooth transition
        }

        // Function to generate pagination dots
        function generateDots() {
            dotsContainer.innerHTML = ''; // Clear existing dots
            const numDots = Math.ceil(items.length / itemsPerView);
            for (let i = 0; i < numDots; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                 // Calculate the start index for this dot's slide
                const slideStartIndex = i * itemsPerView;
                 // Check if the current index is within the range of items shown by this dot
                 // This handles cases where the last slide might show fewer items
                if (currentIndex >= slideStartIndex && currentIndex < slideStartIndex + itemsPerView) {
                     dot.classList.add('active');
                }
                dot.addEventListener('click', () => {
                    moveToSlide(i * itemsPerView);
                    resetAutoSlide();
                });
                dotsContainer.appendChild(dot);
            }
             updateActiveDot(); // Ensure correct dot is active after generation
        }

        // Function to update active dot
        function updateActiveDot() {
            const dots = dotsContainer.querySelectorAll('.dot');
            const currentDotIndex = Math.floor(currentIndex / itemsPerView);
            dots.forEach((dot, index) => {
                dot.classList.remove('active');
                if (index === currentDotIndex) {
                    dot.classList.add('active');
                }
            });
        }

        // Function to move the carousel to a specific index
        function moveToSlide(index, smooth = true) {
            // Ensure the index is within bounds
            const maxIndex = items.length > itemsPerView ? items.length - itemsPerView : 0;
            currentIndex = Math.max(0, Math.min(index, maxIndex));

            // Calculate the translation amount
            // Need to account for the margin between items
            const item = items[0]; // Use the first item to get dimensions
            const itemWidth = item.offsetWidth; // Get the calculated width including padding/border
            const itemMarginRight = parseInt(window.getComputedStyle(item).marginRight);
            const totalItemWidth = itemWidth + itemMarginRight; // Total space taken by one item including its right margin

             let translation = -currentIndex * totalItemWidth;

             // Adjust translation for the last slide to prevent extra empty space
             // This is a more robust way to handle the end of the carousel
             const trackWidth = track.scrollWidth; // Total width of the track
             const containerWidth = carouselContainer.offsetWidth - parseInt(window.getComputedStyle(carouselContainer).paddingLeft) - parseInt(window.getComputedStyle(carouselContainer).paddingRight); // Width of the visible container area

             const maxTranslation = trackWidth - containerWidth;

             // Ensure translation does not exceed the point where the last item is visible
             translation = Math.max(translation, -maxTranslation);


            if (smooth) {
                 track.style.transition = 'transform 0.5s ease-in-out'; // Apply smooth transition
            } else {
                 track.style.transition = 'none'; // No transition for instant jump
            }

            track.style.transform = `translateX(${translation}px)`;

            updateActiveDot();
        }

        // Event listeners for arrows
        leftArrow.addEventListener('click', () => {
            moveToSlide(currentIndex - itemsPerView);
            resetAutoSlide();
        });

        rightArrow.addEventListener('click', () => {
            moveToSlide(currentIndex + itemsPerView);
            resetAutoSlide();
        });

        // Automatic sliding
        function startAutoSlide() {
            slideInterval = setInterval(() => {
                const nextIndex = currentIndex + itemsPerView;
                 // Check if we are at the last possible slide position
                 const maxIndex = items.length > itemsPerView ? items.length - itemsPerView : 0;
                if (currentIndex >= maxIndex) {
                    moveToSlide(0); // Loop back to the beginning
                } else {
                    moveToSlide(nextIndex);
                }
            }, autoSlideInterval);
        }

        function resetAutoSlide() {
            clearInterval(slideInterval);
            startAutoSlide();
        }

        // Initialize carousel on load
        updateItemsPerView(); // Set initial items per view and generate dots
        startAutoSlide(); // Start automatic sliding

        // Update carousel on window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateItemsPerView, 200); // Debounce resize
        });
    }

    // Initialize carousels for both sections
    initializeCarousel('.featured-section .carousel-container', 8000); // Offers section carousel (Increased interval)
    initializeCarousel('.most-selling-section .carousel-container', 9000); // Most Popular section carousel (Increased interval)


    // --- Mobile Navbar Toggle (Optional) ---
    // This requires CSS to hide/show the menu based on a class
    // const navbarToggler = document.querySelector('.navbar-toggler');
    // const navbarNav = document.querySelector('.navbar-nav');

    // navbarToggler.addEventListener('click', () => {
    //     navbarNav.classList.toggle('active'); // Add/remove 'active' class for styling
    // });

});
