document.addEventListener("DOMContentLoaded", function() {
  // Mobile menu functionality
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const body = document.body;

  // Toggle mobile menu
  if (hamburger && navLinks && mobileOverlay) {
    hamburger.addEventListener("click", function(e) {
      e.stopPropagation();
      navLinks.classList.toggle("active");
      mobileOverlay.classList.toggle("active");
      hamburger.setAttribute("aria-expanded", navLinks.classList.contains("active"));
      body.style.overflow = navLinks.classList.contains("active") ? "hidden" : "auto";
    });

    // Close menu when clicking overlay
    mobileOverlay.addEventListener("click", closeMobileMenu);

    // Close menu when clicking outside
    document.addEventListener("click", function(e) {
      if (window.innerWidth <= 768 && 
          navLinks.classList.contains("active") && 
          !e.target.closest(".home__navbar-right")) {
        closeMobileMenu();
      }
    });

    // Close menu when clicking on nav links
    document.querySelectorAll(".home__nav-links a").forEach(link => {
      link.addEventListener("click", function() {
        if (window.innerWidth <= 768) {
          closeMobileMenu();
        }
      });
    });

    // Close menu function
    function closeMobileMenu() {
      navLinks.classList.remove("active");
      mobileOverlay.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      body.style.overflow = "auto";
    }

    // Close menu when resizing to desktop
    window.addEventListener("resize", function() {
      if (window.innerWidth > 768 && navLinks.classList.contains("active")) {
        closeMobileMenu();
      }
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const offset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // Form submission handling
  const contactForm = document.querySelector(".home__contact-form");
  const toast = document.getElementById("toast");

  if (contactForm && toast) {
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();

      const formData = new FormData(this);
      const formValues = Object.fromEntries(formData.entries());

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formValues.email)) {
        showToast("Please enter a valid email address.", "error");
        return;
      }

      // Here you would typically send the data to a server
      console.log("Form submitted:", formValues);

      // Show success message
      showToast("Thank you for your message! We'll get back to you soon.", "success");
      this.reset();
    });
  }

  // Toast notification function
  function showToast(message, type) {
    if (toast) {
      toast.textContent = message;
      toast.className = `toast show ${type}`;
      setTimeout(() => {
        toast.className = "toast";
      }, 3000);
    }
  }
});