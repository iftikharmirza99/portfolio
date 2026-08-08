const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");
const progress = document.getElementById("scrollProgress");

navToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open);
});

document.querySelectorAll("#navLinks a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const light = document.body.classList.contains("light");
  themeToggle.textContent = light ? "☾" : "☼";
  localStorage.setItem("theme", light ? "light" : "dark");
});

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  if (themeToggle) themeToggle.textContent = "☾";
}

/* Scroll reveal */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const sections = [...document.querySelectorAll("main section[id]")];
const links = [...document.querySelectorAll(".nav-links a")];

let ticking = false;
function updateScrollUI() {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${height ? (scrollTop / height) * 100 : 0}%`;

  let current = "home";
  sections.forEach(section => {
    if (scrollTop >= section.offsetTop - 160) current = section.id;
  });
  links.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${current}`));
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollUI);
    ticking = true;
  }
}, { passive: true });
updateScrollUI();

/* Small tilt effect for desktop cards */
if (window.matchMedia("(pointer:fine)").matches && !window.matchMedia("(prefers-reduced-motion:reduce)").matches) {
  document.querySelectorAll(".skill-card, .service-card").forEach(card => {
    card.addEventListener("mousemove", event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 3).toFixed(2)}deg) translateY(-8px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

document.getElementById("year")?.replaceChildren(String(new Date().getFullYear()));


/* Fullscreen Gallery Lightbox */
(function () {
  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const viewer = document.getElementById('lightboxImage');
    const caption = document.getElementById('lightboxCaption');
    const close = document.getElementById('lightboxClose');
    const prev = document.getElementById('lightboxPrev');
    const next = document.getElementById('lightboxNext');
    const images = Array.from(document.querySelectorAll('.gallery-item img'));
    if (!lightbox || !viewer || !images.length) return;
    let index = 0;
    function show(i) {
      index = (i + images.length) % images.length;
      const source = images[index].getAttribute('src');
      viewer.src = source;
      viewer.alt = images[index].alt || 'Gallery image';
      caption.textContent = images[index].alt || '';
    }
    function open(i) {
      show(i);
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
    }
    function shut() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');
    }
    images.forEach((img, i) => img.addEventListener('click', () => open(i)));
    close.addEventListener('click', shut);
    prev.addEventListener('click', () => show(index - 1));
    next.addEventListener('click', () => show(index + 1));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) shut(); });
    viewer.addEventListener('click', e => e.stopPropagation());
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') shut();
      else if (e.key === 'ArrowLeft') show(index - 1);
      else if (e.key === 'ArrowRight') show(index + 1);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initLightbox);
  else initLightbox();
})();
