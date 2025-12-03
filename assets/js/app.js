document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initNavbarScroll();
  initVideoOptimization();
  initSmoothScroll();
});
function initMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  if (!menuToggle || !navMenu) return;
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("menu-open");
    menuToggle.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 768) {
        navMenu.classList.remove("menu-open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  });
  document.addEventListener("click", (e) => {
    if (window.innerWidth < 768) {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove("menu-open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    }
  });
}
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    lastScroll = currentScroll;
  });
}
function initVideoOptimization() {
  const video = document.querySelector(".bg-video");
  if (!video) return;
  const isMobile = window.innerWidth < 768;
    if (isMobile) {
        video.pause();
        video.style.display = 'none';
    }
  video.muted = true;
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        console.log("Vídeo background iniciado");
      })
      .catch((error) => {
        console.log("Autoplay bloqueado:", error);
        video.style.display = "none";
      });
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      video.pause();
    } else {
      video.play().catch(() => {
      });
    }
  });
}
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}
function debounce(func, wait = 100) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const reveal = debounce(() => {
        revealElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('revealed');
            }
        });
    }, 100);
    window.addEventListener('scroll', reveal);
    reveal(); // Executar uma vez no carregamento
}
window.addEventListener("error", (e) => {
  console.error("Erro capturado:", e.error);
});
