document.addEventListener("DOMContentLoaded", function() {
  // Preloader
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('hidden');
    setTimeout(() => preloader.style.display = 'none', 300);
  });

  // Dynamic footer year
  document.getElementById('current-year').textContent = new Date().getFullYear();

  // Hamburger menu toggle
  const menuToggle = document.querySelector('.home__menu-toggle');
  const navLinks = document.querySelector('.home__nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

  // Sticky navbar
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.home__navbar');
    navbar.classList.toggle('sticky', window.scrollY > 0);
  });

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

  // Hero button loading state
  document.querySelector('.home__btn').addEventListener('click', function() {
    this.classList.add('home__btn--loading');
    setTimeout(() => this.classList.remove('home__btn--loading'), 2000);
  });

  // Form submission and real-time validation
  const contactForm = document.querySelector(".home__contact-form");
  const toast = document.getElementById("toast");
  const inputs = contactForm.querySelectorAll('input, textarea');

  // Real-time validation
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      if (input.name === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
          input.classList.add('invalid');
        } else {
          input.classList.remove('invalid');
        }
      } else if (input.value.trim() === '') {
        input.classList.add('invalid');
      } else {
        input.classList.remove('invalid');
      }
    });
  });

  if (contactForm && toast) {
    contactForm.addEventListener("submit", async function(e) {
      e.preventDefault();

      const formData = new FormData(this);
      const formValues = Object.fromEntries(formData.entries());

      // Validate all fields
      let isValid = true;
      inputs.forEach(input => {
        if (input.name === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formValues.email)) {
            input.classList.add('invalid');
            isValid = false;
          }
        } else if (!formValues[input.name].trim()) {
          input.classList.add('invalid');
          isValid = false;
        }
      });

      if (!isValid) {
        showToast("Please fill all fields correctly.", "error");
        return;
      }

      // Submit to Formspree (replace with your endpoint)
      try {
        const response = await fetch('https://formspree.io/f/your-form-id', {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          showToast("Message sent successfully!", "success");
          this.reset();
          inputs.forEach(input => input.classList.remove('invalid'));
        } else {
          showToast("Failed to send message.", "error");
        }
      } catch (error) {
        showToast("An error occurred.", "error");
      }
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

  // Infinite Scroll and Mouse Drag for Projects Section
  const scrollContainer = document.querySelector('.home__projects-scroll');
  if (scrollContainer) {
    const cards = scrollContainer.querySelectorAll('.home__project-card');
    // Duplicate cards for smooth infinite scroll
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      scrollContainer.appendChild(clone);
    });

    const cardCount = cards.length;
    const cardWidth = 360 + 30; // Card width + gap
    const totalCardsWidth = cardWidth * cardCount;

    // Auto-scroll functionality
    let scrollSpeed = 1;
    let isPaused = false;

    function autoScroll() {
      if (isPaused) return;
      scrollContainer.scrollLeft += scrollSpeed;
      if (scrollContainer.scrollLeft >= totalCardsWidth) {
        scrollContainer.scrollLeft -= totalCardsWidth;
      } else if (scrollContainer.scrollLeft <= 0) {
        scrollContainer.scrollLeft += totalCardsWidth;
      }
      requestAnimationFrame(autoScroll);
    }

    // Start auto-scrolling
    requestAnimationFrame(autoScroll);

    // Pause on hover
    scrollContainer.addEventListener('mouseenter', () => {
      isPaused = true;
    });
    scrollContainer.addEventListener('mouseleave', () => {
      isPaused = false;
      requestAnimationFrame(autoScroll);
    });

    // Mouse drag functionality
    let isDragging = false;
    let startX;
    let scrollLeftStart;

    scrollContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeftStart = scrollContainer.scrollLeft;
      scrollContainer.style.cursor = 'grabbing';
    });

    scrollContainer.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainer.scrollLeft = scrollLeftStart - walk;
    });

    scrollContainer.addEventListener('mouseup', () => {
      isDragging = false;
      scrollContainer.style.cursor = 'grab';
    });

    scrollContainer.addEventListener('mouseleave', () => {
      isDragging = false;
      scrollContainer.style.cursor = 'grab';
    });

    // Smooth looping on manual scroll
    scrollContainer.addEventListener('scroll', () => {
      if (scrollContainer.scrollLeft >= totalCardsWidth) {
        scrollContainer.scrollLeft -= totalCardsWidth;
      } else if (scrollContainer.scrollLeft <= 0) {
        scrollContainer.scrollLeft += totalCardsWidth;
      }
    });
  }
});