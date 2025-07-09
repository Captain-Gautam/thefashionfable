document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const course = params.get('course');
  if (!course) {
    document.getElementById('course-title').textContent = "Course Not Found";
    return;
  }

  document.getElementById('course-title').textContent = course.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  let images = [];
  let currentIdx = 0;

  fetch(`assets/courses/${course}/manifest.json`)
    .then(res => res.json())
    .then(data => {
      images = data.images || [];
      const gallery = document.getElementById('course-gallery');
      images.forEach((img, idx) => {
        const imgElem = document.createElement('img');
        imgElem.src = `assets/courses/${course}/${img.src}`;
        imgElem.alt = img.title || `Design ${idx+1}`;
        imgElem.className = 'gallery-img';
        imgElem.addEventListener('click', () => openFullscreen(idx));
        gallery.appendChild(imgElem);
      });
    });

  // Fullscreen viewer logic
  const fullscreenViewer = document.getElementById('fullscreen-viewer');
  const fullscreenImg = document.getElementById('fullscreen-img');
  const fullscreenTitle = document.getElementById('fullscreen-title');
  const closeBtn = document.getElementById('close-fullscreen');
  const prevBtn = document.getElementById('prev-img');
  const nextBtn = document.getElementById('next-img');

  function openFullscreen(idx) {
    currentIdx = idx;
    updateFullscreen();
    fullscreenViewer.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function updateFullscreen() {
    if (!images[currentIdx]) return;
    fullscreenImg.src = `assets/courses/${course}/${images[currentIdx].src}`;
    fullscreenTitle.textContent = images[currentIdx].title || `Design ${currentIdx + 1}`;
  }

  function closeFullscreen() {
    fullscreenViewer.style.display = 'none';
    document.body.style.overflow = '';
  }

  function showPrev() {
    if (images.length === 0) return;
    currentIdx = (currentIdx - 1 + images.length) % images.length;
    updateFullscreen();
  }

  function showNext() {
    if (images.length === 0) return;
    currentIdx = (currentIdx + 1) % images.length;
    updateFullscreen();
  }

  closeBtn.onclick = closeFullscreen;
  prevBtn.onclick = showPrev;
  nextBtn.onclick = showNext;

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (fullscreenViewer.style.display === 'flex') {
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'Escape') closeFullscreen();
    }
  });

  // Close button for modal
  document.getElementById('close-course').onclick = () => {
    window.location.href = 'courses.html';
  };

  // Touch swipe navigation for fullscreen viewer
  let touchStartX = 0;
  let touchEndX = 0;

  fullscreenViewer.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
    }
  });

  fullscreenViewer.addEventListener('touchmove', function(e) {
    if (e.touches.length === 1) {
      touchEndX = e.touches[0].clientX;
    }
  });

  fullscreenViewer.addEventListener('touchend', function() {
    if (fullscreenViewer.style.display === 'flex') {
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff < 0) {
          showNext();
        } else {
          showPrev();
        }
      }
    }
    touchStartX = 0;
    touchEndX = 0;
  });
});