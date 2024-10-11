(function() {
  const karaokeTexts = document.querySelectorAll(".karaoke-text");

  // If no .karaoke-text elements are found, exit early
  if (karaokeTexts.length === 0) return;

  karaokeTexts.forEach((karaokeText) => {
    const section = karaokeText.closest('section');
    const contentWrapper = section.querySelector(".content-wrapper");
    let sectionInView = false;

    // Get the data-speed attribute from .karaoke-text and default to 2 if empty or missing
    let dataSpeed = Math.floor(parseFloat(karaokeText.getAttribute("data-speed"))) || 2;

    // Ensure dataSpeed is at least 2
    if (dataSpeed < 2) {
      dataSpeed = 2;
    }

    // Set the custom properties --sectionheight and --contentheight on the section
    if (!isNaN(dataSpeed)) {
      const sectionHeight = dataSpeed * 100;
      section.style.setProperty("--sectionheight", `${sectionHeight}`);
    }

    // Check if fade is disabled via the data-fade attribute
    const shouldFade = karaokeText.getAttribute("data-fade") !== "false";

    // Function to update progress and opacity based on scroll
    function updateProgressOnScroll() {
      if (!sectionInView) return; // Only update if section is in view

      const sectionRect = section.getBoundingClientRect();
      const contentRect = contentWrapper.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const sectionBottom = sectionRect.bottom;
      const contentBottom = contentRect.bottom;

      // Calculate how far the bottom of the contentWrapper is from the bottom of the section
      const distanceToBottom = sectionBottom - contentBottom;

      // Total scrollable distance (section height minus content wrapper height)
      const totalScrollable = sectionRect.height - contentRect.height;

      // Scroll progress should be 0 at the start and 1 at the end
      const scrollProgress = 1 - Math.min(Math.max(distanceToBottom / totalScrollable, 0), 1);

      // Update --karaoke-progress based on scroll position
      const progress = (scrollProgress * 100).toFixed(15);
      karaokeText.style.setProperty("--karaoke-progress", `${progress}%`);

      // Only apply fade effect if data-fade is not set to "false"
      if (shouldFade) {
        const elementTop = karaokeText.getBoundingClientRect().top;
        const elementCenterDistance = Math.abs(windowHeight / 2 - (elementTop + karaokeText.offsetHeight / 2));
        const maxDistance = windowHeight / 2;

        // Calculate opacity based on how close the element is to the center of the viewport
        let opacity = 1 - Math.min(elementCenterDistance / maxDistance, 1);
        karaokeText.style.opacity = opacity.toFixed(2); // Set opacity between 0 and 1
      } else {
        // If fade is disabled, ensure opacity is fully visible (1)
        karaokeText.style.opacity = 1;
      }
    }

    // IntersectionObserver to detect when section is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            sectionInView = true;  // Section is in view, start tracking scroll
            updateProgressOnScroll();
          } else {
            sectionInView = false; // Section is out of view, stop tracking
          }
        });
      },
      { threshold: 0.1 } // Trigger when at least 10% of the section is in view
    );

    // Observe the section
    observer.observe(section);

    // Listen to scroll event and update progress and opacity accordingly
    window.addEventListener("scroll", updateProgressOnScroll);
  });
})();
