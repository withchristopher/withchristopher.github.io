const sectionElements = document.querySelectorAll("section");
const revealElements = document.querySelectorAll(".reveal");
const railStops = document.querySelectorAll(".rail-stop");
const heroVisual = document.querySelector(".hero-visual");
const heroSection = document.querySelector("[data-hero]");
const railNav = document.querySelector(".rail-nav");
const topStop = document.querySelector('.rail-stop[data-section="hero"]');
const contactTrigger = document.querySelector(".contact-trigger");
const contactDialog = document.getElementById("contact-dialog");
const contactForm = contactDialog ? contactDialog.querySelector(".contact-form") : null;
const contactStatus = contactDialog ? contactDialog.querySelector(".contact-status") : null;

const FORM_ENDPOINT = "https://formspree.io/f/xpqqwlnk";

const getActiveSection = () => {
  let activeSection = null;
  let minDistance = Number.POSITIVE_INFINITY;
  const viewportMid = window.innerHeight * 0.5;

  sectionElements.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      return;
    }
    const distance = Math.abs(rect.top - viewportMid);
    if (distance < minDistance) {
      minDistance = distance;
      activeSection = section;
    }
  });

  return activeSection;
};

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
    () => {
      const activeSection = getActiveSection();
      if (!activeSection) return;
      activateStop(activeSection.id);
      updateRailProgress(activeSection.id);
    },
    {
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: "-40% 0px -40% 0px",
    }
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

if (topStop) {
  topStop.addEventListener("click", (event) => {
    if (topStop.getAttribute("href") !== "#top") return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const scrollToTarget = (target) => {
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
};

railStops.forEach((stop) => {
  stop.addEventListener("click", (event) => {
    const href = stop.getAttribute("href") || "";
    if (!href.startsWith("#")) return;
    event.preventDefault();
    if (href === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const target = document.querySelector(href);
    scrollToTarget(target);
  });
});

const sendContactEmail = async (message, email) => {
  if (!FORM_ENDPOINT || FORM_ENDPOINT.includes("your-form-id")) {
    throw new Error("Missing form endpoint");
  }
  const payload = {
    message: message.trim(),
    email: email ? email.trim() : "",
    subject: "Website inquiry",
  };
  const response = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Request failed");
  }
  return response.json();
};

if (contactTrigger) {
  contactTrigger.addEventListener("click", () => {
    if (contactDialog && typeof contactDialog.showModal === "function") {
      contactDialog.showModal();
      return;
    }
    const message = window.prompt("What would you like to do?");
    if (!message) return;
    window.location.href = `mailto:chris.reviresco@gmail.com?subject=${encodeURIComponent("Website inquiry")}&body=${encodeURIComponent(message)}`;
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const messageField = contactForm.querySelector("#contact-message");
    const emailField = contactForm.querySelector("#contact-email");
    const sendButton = contactForm.querySelector("#contact-send");
    const message = messageField ? messageField.value : "";
    const email = emailField ? emailField.value : "";
    if (!message || !message.trim()) {
      if (messageField) messageField.focus();
      return;
    }
    if (contactStatus) {
      contactStatus.textContent = "Sending...";
    }
    if (sendButton) {
      sendButton.disabled = true;
    }
    sendContactEmail(message, email)
      .then(() => {
        if (contactStatus) {
          contactStatus.textContent = "Message sent. Thank you!";
        }
        if (contactDialog) {
          contactDialog.close("send");
        }
        contactForm.reset();
      })
      .catch(() => {
        if (contactStatus) {
          contactStatus.textContent = "Unable to send. Please try again.";
        }
      })
      .finally(() => {
        if (sendButton) {
          sendButton.disabled = false;
        }
      });
  });
}
