document.addEventListener('DOMContentLoaded', () => {
  // Smooth Scroll (for anchor-based navigation, if needed)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth"
      });
    });
  });

  const categoryButtons = document.querySelectorAll('.category-btn');
  const imageDisplay = document.getElementById('image-display');
  const fullscreenViewer = document.getElementById('fullscreen-viewer');
  const fullscreenImg = document.getElementById('fullscreen-img');
  const closeBtn = document.getElementById('close-fullscreen');

  let images = [];
  let currentImgIndex = 0;

  // Load manifest and display images for a category
  function displayCategoryImages(category, categoryName) {
    imageDisplay.innerHTML = '';
    images = [];
    fetch(`assets/collections/${category}/manifest.json`)
      .then(res => res.json())
      .then(fileNames => {
        fileNames.forEach((fileName, idx) => {
          const imgPath = `assets/collections/${category}/${fileName}`;
          images.push(imgPath);
          const img = document.createElement('img');
          img.src = imgPath;
          img.alt = `${categoryName} design ${idx + 1}`;
          img.className = 'category-img';
          img.addEventListener('click', () => openFullscreenIndex(idx, categoryName));
          imageDisplay.appendChild(img);
        });
      });
  }

  function openFullscreenIndex(idx, categoryName) {
    currentImgIndex = idx;
    fullscreenImg.src = images[currentImgIndex];
    fullscreenViewer.classList.add('active'); // Show viewer
    addFullscreenNavigation(); // Ensure navigation is present and listeners attached
    // Set the title in fullscreen
    document.getElementById('fullscreen-title').textContent = categoryName;
  }

  function closeFullscreen() {
    fullscreenViewer.classList.remove('active');
    fullscreenImg.src = '';
    // Remove arrows
    const oldLeft = document.getElementById('prev-img');
    const oldRight = document.getElementById('next-img');
    if (oldLeft) oldLeft.remove();
    if (oldRight) oldRight.remove();
  }

  function showPrevImg() {
    currentImgIndex = (currentImgIndex - 1 + images.length) % images.length;
    fullscreenImg.src = images[currentImgIndex];
  }
  function showNextImg() {
    currentImgIndex = (currentImgIndex + 1) % images.length;
    fullscreenImg.src = images[currentImgIndex];
  }

  // Call this function on DOMContentLoaded
  addFullscreenNavigation();

  closeBtn.addEventListener('click', closeFullscreen);
  fullscreenViewer.addEventListener('click', (e) => {
    if (e.target === fullscreenViewer) closeFullscreen();
  });
  document.addEventListener('keydown', (e) => {
    if (fullscreenViewer.style.display === 'flex') {
      if (e.key === "Escape") closeFullscreen();
      if (e.key === "ArrowLeft") showPrevImg();
      if (e.key === "ArrowRight") showNextImg();
    }
  });

  // Button click logic
  const titleMap = {
    blouse: "Blouse Design",
    dress: "Dress Design",
    chanyacholi: "Chanyacholi Design",
    partywear: "Partywear",
    bridal: "Bridal Wear"
  };
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-category');
      displayCategoryImages(category, titleMap[category] || category);
    });
  });

  // Add click event to homepage featured collection images
  document.querySelectorAll('.gallery-img').forEach((img, idx, arr) => {
    img.addEventListener('click', () => {
      images = Array.from(arr).map(i => i.src);
      currentImgIndex = idx;
      fullscreenImg.src = images[currentImgIndex];
      fullscreenViewer.classList.add('active');
      addFullscreenNavigation();
    });
  });

  // Add navigation arrows and swipe support for fullscreen viewer
  function addFullscreenNavigation() {
    // Remove old arrows if they exist to avoid duplicates
    const oldLeft = document.getElementById('prev-img');
    const oldRight = document.getElementById('next-img');
    if (oldLeft) oldLeft.remove();
    if (oldRight) oldRight.remove();

    // Add left arrow
    const left = document.createElement('span');
    left.className = 'arrow left-arrow';
    left.id = 'prev-img';
    left.innerHTML = '&#8592;';
    left.onclick = showPrevImg;
    fullscreenViewer.appendChild(left);

    // Add right arrow
    const right = document.createElement('span');
    right.className = 'arrow right-arrow';
    right.id = 'next-img';
    right.innerHTML = '&#8594;';
    right.onclick = showNextImg;
    fullscreenViewer.appendChild(right);

    // Move close button to the end (if not already)
    if (fullscreenViewer.lastElementChild !== closeBtn) {
      fullscreenViewer.appendChild(closeBtn);
    }
  }

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
    if (fullscreenViewer.classList.contains('active')) {
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
