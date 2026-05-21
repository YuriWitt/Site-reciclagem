document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".carousel").forEach((carousel) => {
    const track = carousel.querySelector(":scope > .carousel-track");
    if (!track) return;

    const slides = Array.from(track.children);
    const controls = carousel.querySelector(":scope > .carousel-controls");
    const prevButton = controls ? controls.querySelector(".carousel-button.prev") : null;
    const nextButton = controls ? controls.querySelector(".carousel-button.next") : null;
    const indicators = controls ? Array.from(controls.querySelectorAll(".carousel-indicator")) : [];
    let currentIndex = 0;

    function updateCarousel(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      currentIndex = index;
      const offset = slides[0].getBoundingClientRect().width * index;
      track.style.transform = `translateX(-${offset}px)`;

      indicators.forEach((button, buttonIndex) => {
        button.classList.toggle("active", buttonIndex === index);
      });

      slides.forEach((slide, slideIndex) => {
        const video = slide.querySelector("video");
        if (video) {
          if (slideIndex === index) {
            video.play().catch(() => {});
          } else {
            video.pause();
            video.currentTime = 0;
          }
        }
      });
    }

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        updateCarousel(currentIndex - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        updateCarousel(currentIndex + 1);
      });
    }

    indicators.forEach((button, index) => {
      button.addEventListener("click", function () {
        updateCarousel(index);
      });
    });

    if (slides.length > 0) {
      updateCarousel(0);
    }
  });

  const videosOnPage = document.querySelectorAll(".vertical-videos video");
  if (videosOnPage.length > 0 && "IntersectionObserver" in window) {
    let activeVideo = null;

    const videoObserver = new IntersectionObserver((entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.intersectionRatio >= 0.55)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      const nextVideo = visibleEntries.length ? visibleEntries[0].target : null;

      videosOnPage.forEach((video) => {
        if (video === nextVideo) {
          if (activeVideo && activeVideo !== video) {
            activeVideo.pause();
          }
          activeVideo = video;
          video.muted = true;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });

      if (!nextVideo) {
        activeVideo = null;
      }
    }, {
      threshold: [0.55],
    });

    videosOnPage.forEach((video) => videoObserver.observe(video));
  }

  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      mainNav.classList.toggle("open");
      menuToggle.classList.toggle("open");
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        menuToggle.classList.remove("open");
      });
    });
  }
});
