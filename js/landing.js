const sectionElements = document.querySelectorAll("section");
const revealElements = document.querySelectorAll(".reveal");
const railStops = document.querySelectorAll(".rail-stop");
const heroVisual = document.querySelector(".hero-visual");
const heroSection = document.querySelector("[data-hero]");
const railNav = document.querySelector(".rail-nav");

const activateStop = (id) => {
  railStops.forEach((stop) => {
    const isActive = stop.dataset.section === id;
    stop.classList.toggle("active", isActive);
    if (isActive) {
      stop.setAttribute("aria-current", "true");
    } else {
      stop.removeAttribute("aria-current");
    }
  });
};

const updateRailProgress = (id) => {
  if (!railNav) return;
  const stops = Array.from(railStops);
  const index = stops.findIndex((stop) => stop.dataset.section === id);
  if (index < 0) return;
  const percent = stops.length > 1 ? (index / (stops.length - 1)) * 100 : 0;
  railNav.style.setProperty("--rail-progress", `${percent}%`);
};

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activateStop(entry.target.id);
          updateRailProgress(entry.target.id);
        }
      });
    },
    { threshold: 0.5 }
  );

  sectionElements.forEach((section) => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));

  if (heroVisual && heroSection) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          heroVisual.classList.toggle("is-visible", entry.isIntersecting);
          document.body.classList.toggle("hero-out", !entry.isIntersecting);
        });
      },
      { threshold: 0.4 }
    );

    heroObserver.observe(heroSection);
  }
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
  if (heroVisual) {
    heroVisual.classList.add("is-visible");
  }
  if (sectionElements[0]) {
    activateStop(sectionElements[0].id);
    updateRailProgress(sectionElements[0].id);
  }
}
