


        const announcementBar = document.getElementById('target-announcement-bar');
        
        window.addEventListener('scroll', () => {

            if (window.scrollY > 20) {
                announcementBar.classList.add('hidden-scrolled');
            } else {

                announcementBar.classList.remove('hidden-scrolled');
            }
        });

        const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
        const menuPool = document.getElementById('menu-pool');

        mobileToggleBtn.addEventListener('click', () => {
            menuPool.classList.toggle('active');
        });


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
    