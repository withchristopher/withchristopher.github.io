const sectionElements = document.querySelectorAll("section");
const revealElements = document.querySelectorAll(".reveal");
const heroVisual = document.querySelector(".hero-visual");
const heroSection = document.querySelector("[data-hero]");
const sideRail = document.querySelector(".side-rail");
const sideRailLinks = sideRail ? sideRail.querySelectorAll("a[data-section]") : [];
const contactTrigger = document.querySelector(".contact-trigger");
const contactDialog = document.getElementById("contact-dialog");
const contactForm = contactDialog ? contactDialog.querySelector(".contact-form") : null;
const contactStatus = contactDialog ? contactDialog.querySelector(".contact-status") : null;
const contactCancel = contactDialog ? contactDialog.querySelector("[data-contact-cancel]") : null;

const FORM_ENDPOINT = "https://formspree.io/f/xpqqwlnk";

const railSections = sideRailLinks.length
  ? Array.from(sideRailLinks)
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean)
  : [];

const updateRailActive = (id) => {
  sideRailLinks.forEach((link) => {
    const isActive = link.dataset.section === id;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const getRailActiveSection = () => {
  if (!railSections.length) return null;
  if (window.scrollY < 80) {
    return document.getElementById("hero");
  }
  let activeSection = null;
  let minDistance = Number.POSITIVE_INFINITY;
  const viewportHeight = window.innerHeight;
  const viewportMid = viewportHeight * 0.5;

  railSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= viewportHeight) {
      return;
    }
    const sectionCenter = rect.top + rect.height / 2;
    const distance = Math.abs(sectionCenter - viewportMid);
    if (distance < minDistance) {
      minDistance = distance;
      activeSection = section;
    }
  });

  return activeSection;
};

const syncRail = () => {
  const activeSection = getRailActiveSection();
  if (activeSection) {
    updateRailActive(activeSection.id);
  }
};
if ("IntersectionObserver" in window) {
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
}

if (sideRailLinks.length) {
  let railTicking = false;
  const onRailScroll = () => {
    if (railTicking) return;
    railTicking = true;
    window.requestAnimationFrame(() => {
      railTicking = false;
      syncRail();
    });
  };
  window.addEventListener("load", syncRail);
  window.addEventListener("scroll", onRailScroll);
  window.addEventListener("resize", onRailScroll);
  sideRailLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) return;
      event.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

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

if (contactCancel && contactDialog) {
  contactCancel.addEventListener("click", () => {
    contactDialog.close("cancel");
  });
}
