document.addEventListener('DOMContentLoaded', function() {
  // Get category from URL
  function getCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('category');
  }

  // Map for display titles
  const titleMap = {
    blouse: "Blouse Design",
    dress: "Dress Design",
    chanyacholi: "Chanyacholi Design",
    partywear: "Partywear",
    bridal: "Bridal Wear",
    kutchi_art: "Kutchi Art"
  };

  const category = getCategoryFromURL();
  const categoryTitle = titleMap[category] || "Category";
  document.getElementById('category-title').textContent = categoryTitle;

  // Close button: back to collections
  document.getElementById('close-category').onclick = () => {
    window.location.href = 'collections.html';
  };

  // DOM elements
  const gallery = document.getElementById('category-gallery');
  const fullscreen = document.getElementById('fullscreen-viewer');
  const fullscreenImg = document.getElementById('fullscreen-img');
  const fullscreenTitle = document.getElementById('fullscreen-title');
  const closeFullscreenBtn = document.getElementById('close-fullscreen');
  const prevImgBtn = document.getElementById('prev-img');
  const nextImgBtn = document.getElementById('next-img');

  // State
  let images = []; // This will be an array of filenames (from manifest)
  let currentIndex = 0;

  // Fullscreen logic
  function openFullscreen(idx) {
    currentIndex = idx;
    updateFullscreen();
    fullscreen.classList.add('active');
    document.getElementById('category-modal').style.display = 'none';
  }

  function updateFullscreen() {
    if (images.length === 0) return;
    fullscreenImg.src = `assets/collections/${category}/${images[currentIndex]}`;
    fullscreenTitle.textContent = `${categoryTitle} (${currentIndex+1}/${images.length})`;
  }

  function closeFullscreen() {
    fullscreen.classList.remove('active');
    document.getElementById('category-modal').style.display = 'block';
  }

  function showPrevImg() {
    if (images.length === 0) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateFullscreen();
  }

  function showNextImg() {
    if (images.length === 0) return;
    currentIndex = (currentIndex + 1) % images.length;
    updateFullscreen();
  }

  // Attach event listeners ONCE
  closeFullscreenBtn.onclick = closeFullscreen;
  prevImgBtn.onclick = showPrevImg;
  nextImgBtn.onclick = showNextImg;

  // Keyboard navigation for fullscreen
  document.addEventListener('keydown', (e) => {
    if (fullscreen.classList.contains('active')) {
      if (e.key === 'Escape') closeFullscreen();
      if (e.key === 'ArrowLeft') showPrevImg();
      if (e.key === 'ArrowRight') showNextImg();
    }
  });

  // Optional: Close fullscreen when clicking outside the image
  fullscreen.addEventListener('click', (e) => {
    if (e.target === fullscreen) closeFullscreen();
  });

  // Fetch images and render
  if (category) {
    fetch(`assets/collections/${category}/manifest.json`)
      .then(res => res.json())
      .then(list => {
        gallery.innerHTML = '';
        images = list; // Store filenames, not DOM elements
        list.forEach((img, idx) => {
          const imgEl = document.createElement('img');
          imgEl.src = `assets/collections/${category}/${img}`;
          imgEl.alt = `${categoryTitle} ${idx+1}`;
          imgEl.className = 'category-img';
          imgEl.tabIndex = 0;
          imgEl.addEventListener('click', () => openFullscreen(idx));
          gallery.appendChild(imgEl);
        });
      });
  }

  // Touch swipe navigation for fullscreen viewer
  let touchStartX = 0;
  let touchEndX = 0;

  fullscreen.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
    }
  });

  fullscreen.addEventListener('touchmove', function(e) {
    if (e.touches.length === 1) {
      touchEndX = e.touches[0].clientX;
    }
  });

  fullscreen.addEventListener('touchend', function() {
    if (fullscreen.classList.contains('active')) {
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff < 0) {
          showNextImg();
        } else {
          showPrevImg();
        }
      }
    }
    touchStartX = 0;
    touchEndX = 0;
  });
});