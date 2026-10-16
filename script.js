document.addEventListener('DOMContentLoaded', () => {
    // ============ انتخاب المان‌ها ============
    const artworks = document.querySelectorAll('.artwork');
    const filterButtons = document.querySelectorAll('.filter-nav button');

    const lightbox = document.getElementById('lightbox');
    const lbImg = lightbox.querySelector('.lb-img');
    const lbTitle = lightbox.querySelector('.lb-title');
    const lbMeta = lightbox.querySelector('.lb-meta');
    const lbNo = lightbox.querySelector('.lb-no');
    const lbClose = lightbox.querySelector('.lb-close');
    const lbPrev = lightbox.querySelector('.lb-prev');
    const lbNext = lightbox.querySelector('.lb-next');

    let visibleItems = [...artworks];
    let currentIndex = 0;

    // ============ شماره‌گذاری آثار ============
    artworks.forEach((art, i) => {
        art.dataset.no = String(i + 1).padStart(2, '0');
    });

    // ============ فیلتر کردن ============
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            artworks.forEach((art, i) => {
                const match = filter === 'all' || art.dataset.category === filter;

                if (match) {
                    art.style.display = 'block';
                    // انیمیشن مجدد
                    art.style.animation = 'none';
                    void art.offsetHeight;
                    art.style.animation = `fadeInUp 0.8s ease ${i * 0.08}s forwards`;
                    art.style.opacity = '0';
                } else {
                    art.style.display = 'none';
                }
            });

            // به‌روزرسانی لیست آیتم‌های قابل مشاهده
            visibleItems = [...artworks].filter(a => a.style.display !== 'none');
        });
    });

    // ============ باز کردن لایت‌باکس ============
    artworks.forEach(art => {
        art.addEventListener('click', () => {
            currentIndex = visibleItems.indexOf(art);
            if (currentIndex === -1) currentIndex = 0;
            updateLightbox();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // ============ بستن لایت‌باکس ============
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    lbClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });

    // ============ ناوبری ============
    const showNext = () => {
        currentIndex = (currentIndex + 1) % visibleItems.length;
        updateLightbox();
    };

    const showPrev = () => {
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        updateLightbox();
    };

    lbNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    lbPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

    // ============ به‌روزرسانی لایت‌باکس ============
    function updateLightbox() {
        const art = visibleItems[currentIndex];
        const img = art.querySelector('img');
        const title = art.querySelector('figcaption h3').textContent;
        const meta = art.querySelector('figcaption p').textContent;
        const no = art.dataset.no;

        // افکت محو شدن نرم هنگام تغییر
        const stage = lightbox.querySelector('.lb-stage');
        stage.style.opacity = '0';
        stage.style.transform = 'scale(0.97)';

        setTimeout(() => {
            lbImg.src = img.src;
            lbImg.alt = img.alt;
            lbTitle.textContent = title;
            lbMeta.textContent = meta;
            lbNo.textContent = `— No. ${no}`;
            
            stage.style.opacity = '1';
            stage.style.transform = 'scale(1)';
        }, 250);
    }
});