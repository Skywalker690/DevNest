document.addEventListener("DOMContentLoaded", function() {
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

        // Update active link
        updateActiveLink(targetId);
      }
    });
  });

  // Function to update active link
  function updateActiveLink(targetId) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === targetId) {
        link.classList.add('active');
      }
    });
  }

  // Intersection Observer for active link on scroll
  const sections = document.querySelectorAll('section[id], body[id]');
  const observerOptions = {
    root: null,
    threshold: 0.3,
    rootMargin: '-80px 0px -80px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = `#${entry.target.id}`;
        updateActiveLink(id);
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

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