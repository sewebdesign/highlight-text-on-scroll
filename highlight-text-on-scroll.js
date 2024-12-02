(function () {
  const karaokeTexts = document.querySelectorAll(".karaoke-text");

  if (karaokeTexts.length === 0) return;

  const viewportStartOffset = 0.2; // Start progress when the top is 20% above the bottom of the viewport
  const viewportEndOffset = 0.2; // End progress when the bottom is 20% from the top of the viewport

  karaokeTexts.forEach((karaokeText) => {
    const section = karaokeText.closest("section");
    const contentWrapper = section.querySelector(".content-wrapper");
    const isLargeSection = section.classList.contains("section-height--large");
    let sectionInView = false;

    if (isLargeSection) {
       section.classList.add("karaoke-section-large");
      let dataSpeed = Math.floor(parseFloat(karaokeText.getAttribute("data-speed"))) || 2;
      if (dataSpeed < 2) dataSpeed = 2;
  
      if (!isNaN(dataSpeed)) {
        const sectionHeight = dataSpeed * 100;
        section.style.setProperty("--sectionheight", `${sectionHeight}`);
      }
    }

    const shouldFade = karaokeText.getAttribute("data-fade") !== "false";

    function calculateProgressForLargeSection() {
      const sectionRect = section.getBoundingClientRect();
      const contentRect = contentWrapper.getBoundingClientRect();

      const sectionBottom = sectionRect.bottom;
      const contentBottom = contentRect.bottom;

      const distanceToBottom = sectionBottom - contentBottom;
      const totalScrollable = sectionRect.height - contentRect.height;
      const scrollProgress = 1 - Math.min(Math.max(distanceToBottom / totalScrollable, 0), 1);

      return scrollProgress;
    }

    function calculateProgressForSmallSection() {
      const elementRect = karaokeText.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const startThreshold = windowHeight * (1 - viewportStartOffset); // 20% above bottom of viewport
      const endThreshold = windowHeight * viewportEndOffset; // 20% from top of viewport

      // Start when the element's top is above the start threshold
      if (elementRect.top >= startThreshold) {
        return 0; // Before progress starts
      }

      // End when the element's bottom is within the end threshold
      if (elementRect.bottom <= endThreshold) {
        return 1; // After progress ends
      }

      // Linear interpolation for progress between thresholds
      const progress = (startThreshold - elementRect.top) / (startThreshold - elementRect.top + elementRect.bottom - endThreshold);
      return Math.min(Math.max(progress, 0), 1);
    }

    function updateProgressOnScroll() {
      if (!sectionInView) return;

      const scrollProgress = isLargeSection
        ? calculateProgressForLargeSection()
        : calculateProgressForSmallSection();

      const progress = (scrollProgress * 100).toFixed(15);
      karaokeText.style.setProperty("--karaoke-progress", `${progress}%`);

      if (shouldFade) {
        const windowHeight = window.innerHeight;
        const elementTop = karaokeText.getBoundingClientRect().top;
        const elementCenterDistance = Math.abs(
          windowHeight / 2 - (elementTop + karaokeText.offsetHeight / 2)
        );
        const maxDistance = windowHeight / 2;

        let opacity = 1 - Math.min(elementCenterDistance / maxDistance, 1);
        opacity = (Math.round(opacity * 100) / 100).toFixed(2);

        karaokeText.style.opacity = opacity;
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
