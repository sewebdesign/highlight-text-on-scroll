(function() {
  const karaokeTexts = document.querySelectorAll(".karaoke-text");

  if (karaokeTexts.length === 0) return;

  karaokeTexts.forEach((karaokeText) => {
    const section = karaokeText.closest('section');
    section.classList.add('karaoke-section');
    const contentWrapper = section.querySelector(".content-wrapper");
    let sectionInView = false;

    let dataSpeed = Math.floor(parseFloat(karaokeText.getAttribute("data-speed"))) || 2;
    if (dataSpeed < 2) dataSpeed = 2;

    if (!isNaN(dataSpeed)) {
      const sectionHeight = dataSpeed * 100;
      section.style.setProperty("--sectionheight", `${sectionHeight}`);
    }

    const shouldFade = karaokeText.getAttribute("data-fade") !== "false";

    function updateProgressOnScroll() {
      if (!sectionInView) return;

      const sectionRect = section.getBoundingClientRect();
      const contentRect = contentWrapper.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const sectionBottom = sectionRect.bottom;
      const contentBottom = contentRect.bottom;

      const distanceToBottom = sectionBottom - contentBottom;
      const totalScrollable = sectionRect.height - contentRect.height;
      const scrollProgress = 1 - Math.min(Math.max(distanceToBottom / totalScrollable, 0), 1);

      const progress = (scrollProgress * 100).toFixed(15);
      karaokeText.style.setProperty("--karaoke-progress", `${progress}%`);

      if (shouldFade) {
        const elementTop = karaokeText.getBoundingClientRect().top;
        const elementCenterDistance = Math.abs(windowHeight / 2 - (elementTop + karaokeText.offsetHeight / 2));
        const maxDistance = windowHeight / 2;

        let opacity = 1 - Math.min(elementCenterDistance / maxDistance, 1);

        // Ensure opacity is adjusted with more precision
        opacity = (Math.round(opacity * 100) / 100).toFixed(2);

        karaokeText.style.opacity = opacity; // Set opacity with finer increments
      } else {
        karaokeText.style.opacity = 1;
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            sectionInView = true;
            updateProgressOnScroll();
          } else {
            sectionInView = false;
          }
        });
      },
      { rootMargin: "0px 0px 0px 0px" }
    );

    observer.observe(section);
    window.addEventListener("scroll", updateProgressOnScroll);
  });
})();
