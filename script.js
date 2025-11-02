// ========================================
// EXISTING CODE - Services Scroll (tetap ada)
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  const cardContainer = document.getElementById("cardContainer");
  const scrollContainer = document.querySelector(".scroll-container");

  // Pastikan elemen ada sebelum melanjutkan
  if (!cardContainer || !scrollContainer) {
    console.warn("Card container atau scroll container tidak ditemukan");
    return;
  }

  // Duplikat isi card 4x untuk infinite scroll yang smooth
  const cards = cardContainer.innerHTML;
  cardContainer.innerHTML = cards + cards + cards + cards;

  // Variable untuk tracking
  let isDragging = false;
  let startX;
  let scrollLeft;
  let isTouching = false;

  // Hitung lebar satu section (1/4 dari total karena duplikat 4x)
  const getSectionWidth = () => {
    return cardContainer.scrollWidth / 4;
  };

  // ========================================
  // INFINITE LOOP HANDLER untuk manual scroll
  // ========================================
  
  function handleInfiniteScroll() {
    const sectionWidth = getSectionWidth();
    const currentScroll = scrollContainer.scrollLeft;
    
    // Jika scroll melewati section ke-3, reset ke section ke-2
    if (currentScroll >= sectionWidth * 2.8) {
      scrollContainer.scrollLeft = sectionWidth;
    }
    
    // Jika scroll mundur sebelum section pertama, jump ke section ke-2
    if (currentScroll < sectionWidth * 0.2) {
      scrollContainer.scrollLeft = sectionWidth;
    }
  }

  // Monitor scroll position untuk infinite loop
  let scrollCheckInterval = setInterval(handleInfiniteScroll, 100);

  // ========================================
  // MOUSE EVENTS - Untuk Desktop (Drag)
  // ========================================

  scrollContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    scrollContainer.style.cursor = "grabbing";
    scrollContainer.style.scrollBehavior = "auto";
    startX = e.pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
  });

  // Stop dragging ketika mouse leave
  scrollContainer.addEventListener("mouseleave", () => {
    if (isDragging) {
      isDragging = false;
      scrollContainer.style.cursor = "grab";
      scrollContainer.style.scrollBehavior = "smooth";
    }
  });

  // Stop dragging ketika mouse up
  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      scrollContainer.style.cursor = "grab";
      scrollContainer.style.scrollBehavior = "smooth";
    }
  });

  // Scroll saat dragging
  scrollContainer.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 2.5; // Kecepatan drag
    scrollContainer.scrollLeft = scrollLeft - walk;
  });

  // ========================================
  // TOUCH EVENTS - Untuk Mobile/Tablet (Swipe)
  // ========================================

  let touchStartX = 0;
  let touchScrollLeft = 0;
  let touchStartTime = 0;
  let lastTouchX = 0;
  let velocity = 0;

  scrollContainer.addEventListener("touchstart", (e) => {
    isTouching = true;
    scrollContainer.style.scrollBehavior = "auto";
    touchStartX = e.touches[0].pageX;
    lastTouchX = touchStartX;
    touchScrollLeft = scrollContainer.scrollLeft;
    touchStartTime = Date.now();
    velocity = 0;
  }, { passive: true });

  scrollContainer.addEventListener("touchmove", (e) => {
    if (!isTouching) return;
    
    const touchX = e.touches[0].pageX;
    const deltaX = touchStartX - touchX;
    scrollContainer.scrollLeft = touchScrollLeft + deltaX;
    
    // Hitung velocity untuk momentum
    const timeDiff = Date.now() - touchStartTime;
    if (timeDiff > 0) {
      velocity = (lastTouchX - touchX) / timeDiff;
    }
    lastTouchX = touchX;
  }, { passive: true });

  scrollContainer.addEventListener("touchend", () => {
    isTouching = false;
    scrollContainer.style.scrollBehavior = "smooth";
    
    // Apply momentum scrolling
    let momentum = velocity * 300; // Multiply untuk efek yang lebih terasa
    const deceleration = 0.92;
    let currentMomentum = momentum;
    
    function applyMomentum() {
      if (Math.abs(currentMomentum) > 0.5) {
        scrollContainer.scrollLeft += currentMomentum;
        currentMomentum *= deceleration;
        requestAnimationFrame(applyMomentum);
      }
    }
    
    if (Math.abs(momentum) > 1) {
      applyMomentum();
    }
    
    velocity = 0;
  });

  // Prevent default touch behavior untuk horizontal scroll yang lebih smooth
  scrollContainer.addEventListener("touchmove", (e) => {
    // Hanya prevent jika scroll horizontal
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.pageX - touchStartX);
    const deltaY = Math.abs(touch.pageY - (touchStartX || 0));
    
    if (deltaX > deltaY) {
      e.preventDefault();
    }
  }, { passive: false });

  // ========================================
  // WHEEL SCROLL - Untuk Mouse Wheel (Desktop)
  // ========================================

  scrollContainer.addEventListener("wheel", (e) => {
    e.preventDefault();
    scrollContainer.scrollLeft += e.deltaY;
  }, { passive: false });

  // ========================================
  // KEYBOARD NAVIGATION - Arrow Keys
  // ========================================

  scrollContainer.setAttribute("tabindex", "0");

  scrollContainer.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollContainer.scrollLeft -= 300;
    }
    
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollContainer.scrollLeft += 300;
    }
  });

  // ========================================
  // INITIALIZATION
  // ========================================

  // Set posisi awal di section ke-2 untuk infinite loop
  const sectionWidth = getSectionWidth();
  scrollContainer.scrollLeft = sectionWidth;
  scrollContainer.style.scrollBehavior = "smooth";
  
  // Log untuk debugging
  console.log("✅ Services scroll initialized - Manual Swipe Only");
  console.log("📱 Swipe left/right to navigate");
  console.log("🖱 Drag with mouse on desktop");
  console.log("🔄 Infinite loop enabled");
  
  // Cleanup
  window.addEventListener("beforeunload", () => {
    clearInterval(scrollCheckInterval);
  });
});

// ========================================
// NEW CODE - SCROLL TO TOP BUTTON
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  if (!scrollTopBtn) {
    console.warn("Scroll to top button tidak ditemukan");
    return;
  }

  // Show/Hide button berdasarkan scroll position
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  });

  // Smooth scroll to top ketika button diklik
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  console.log("✅ Scroll to top button initialized");
});