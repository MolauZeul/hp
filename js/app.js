document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuButton = document.getElementById("btn-hamburger");
  const navLinks = document.querySelectorAll(".nav-links a");
  const allMenuLinks = document.querySelectorAll(".nav-links a, .mobile-menu a");
  const revealElements = document.querySelectorAll(".reveal");
  const sections = document.querySelectorAll("main section[id]");
  const factNumbers = document.querySelectorAll(".fact-number[data-value]");
  const yearEl = document.getElementById("current-year");

  const setScrolledState = () => {
    if (!navbar) {
      return;
    }

    navbar.classList.toggle("scrolled", window.scrollY > 24);
  };

  setScrolledState();
  window.addEventListener("scroll", setScrolledState);

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("menu-open", isOpen);
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      });
    });
  }

  if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.16 });

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", isActive);
        });
      });
    }, { rootMargin: "-40% 0px -45% 0px" });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  allMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth > 760) {
        return;
      }

      mobileMenu?.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });

  const animateNumber = (element) => {
    const rawValue = Number(element.dataset.value);
    if (Number.isNaN(rawValue)) {
      return;
    }

    const startTime = performance.now();
    const duration = 1800;

    const tick = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.floor(rawValue * eased).toString();

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  if (factNumbers.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        animateNumber(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.65 });

    factNumbers.forEach((number) => counterObserver.observe(number));
  }

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }
});
