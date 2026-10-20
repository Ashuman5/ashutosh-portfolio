/* Ashutosh Tiwari Portfolio interactions
   Vanilla JavaScript: no frameworks or libraries required. */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector("#menuToggle");
  const primaryNav = document.querySelector("#primaryNav");
  const navLinks = document.querySelectorAll(".nav-link");
  const themeToggle = document.querySelector("#themeToggle");
  const currentYear = document.querySelector("#currentYear");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const filterStatus = document.querySelector("#filterStatus");
  const contactForm = document.querySelector("#contactForm");
  const formFeedback = document.querySelector("#formFeedback");

  // Mobile navigation: the button controls the menu's open/closed state.
  function closeMenu() {
    primaryNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    primaryNav.classList.toggle("is-open", !isOpen);
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  });

  // Close the mobile menu after a visitor selects a navigation link.
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
      navLinks.forEach((navLink) => navLink.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // If the viewport grows from mobile to desktop, remove the mobile menu state.
  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 701px)").matches) closeMenu();
  });

  // Theme switch. The preference is saved locally in this browser only.
  const savedTheme = localStorage.getItem("ashutosh-portfolio-theme");
  if (savedTheme === "light") document.body.classList.add("light-theme");
  updateThemeButton();

  function updateThemeButton() {
    const isLight = document.body.classList.contains("light-theme");
    themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    themeToggle.querySelector(".theme-icon").textContent = isLight ? "☾" : "☼";
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    const theme = document.body.classList.contains("light-theme") ? "light" : "dark";
    localStorage.setItem("ashutosh-portfolio-theme", theme);
    updateThemeButton();
  });

  // Keep the copyright year current automatically.
  currentYear.textContent = new Date().getFullYear();

  // Project filtering uses data-tech attributes on each project card.
  // A card can contain multiple technologies, e.g. "python django mysql".
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;
      let visibleCount = 0;

      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });

      projectCards.forEach((card) => {
        const technologies = card.dataset.tech.split(" ");
        const shouldShow = selectedFilter === "all" || technologies.includes(selectedFilter);
        card.hidden = !shouldShow;
        if (shouldShow) visibleCount += 1;
      });

      const label = selectedFilter === "all" ? "all" : button.textContent.trim();
      filterStatus.textContent = `Showing ${label} ${visibleCount === 1 ? "project" : "projects"}.`;
    });
  });

  // Front-end validation only. This does NOT send or store the message.

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nameInput = document.querySelector("#senderName");
    const emailInput = document.querySelector("#senderEmail");
    const messageInput = document.querySelector("#senderMessage");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (name.length < 2) {
      showFormMessage("Please enter your name.", "error");
      nameInput.focus();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFormMessage("Enter a valid email address.", "error");
      emailInput.focus();
      return;
    }

    if (message.length < 10) {
      showFormMessage("Please enter at least 10 characters.", "error");
      messageInput.focus();
      return;
    }

    const submitButton = contactForm.querySelector(
      'button[type="submit"]'
    );
    submitButton.disabled = true;
    showFormMessage("Sending your message...", "");

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        throw new Error("The form service rejected the submission.");
      }

      showFormMessage(
        "Message submitted successfully!",
        "success"
      );
      contactForm.reset();
    } catch (error) {
      showFormMessage(
        "Could not send your message. Please try again or email me directly.",
        "error"
      );
    } finally {
      submitButton.disabled = false;
    }
  });

  function showFormMessage(message, type) {
    formFeedback.textContent = message;
    formFeedback.className = type ? `form-feedback ${type}` : "form-feedback";
  }
});
