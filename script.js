

        // --- Smart Scroll Listener: Hide Announcement Bar on Scroll Down ---
        const announcementBar = document.getElementById('target-announcement-bar');
        
        window.addEventListener('scroll', () => {
            // If scrolled more than 20 pixels down, hide the announcement bar
            if (window.scrollY > 20) {
                announcementBar.classList.add('hidden-scrolled');
            } else {
                // Return to view when scrolled back up to the top
                announcementBar.classList.remove('hidden-scrolled');
            }
        });

        // --- Mobile Menu Toggle ---
        const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
        const menuPool = document.getElementById('menu-pool');

        mobileToggleBtn.addEventListener('click', () => {
            menuPool.classList.toggle('active');
        });

        // --- Live Numeric Up-Counter Script ---
        document.addEventListener("DOMContentLoaded", () => {
            const counters = document.querySelectorAll('.counter');
            const speed = 120; 

            counters.forEach(counter => {
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const increment = Math.ceil(target / speed);

                    if (count < target) {
                        counter.innerText = Math.min(count + increment, target);
                        setTimeout(updateCount, 20); 
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
        });
    