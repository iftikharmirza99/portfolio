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

/* Fullscreen Gallery Lightbox - robust and DOM-safe */
document.addEventListener("DOMContentLoaded", () => {
  const l=document.getElementById("lightbox"), im=document.getElementById("lightboxImage");
  if(!l||!im) return;
  const cap=document.getElementById("lightboxCaption"), cnt=document.getElementById("lightboxCounter");
  const closeBtn=document.getElementById("lightboxClose"), prevBtn=document.getElementById("lightboxPrev"), nextBtn=document.getElementById("lightboxNext");
  let i=0;
  const imgs=()=>[...document.querySelectorAll(".gallery-item img")];
  const show=(n)=>{const a=imgs();if(!a.length)return;i=(n+a.length)%a.length;const x=a[i];im.src=x.currentSrc||x.src;im.alt=x.alt||"Gallery image";if(cap)cap.textContent=x.alt||"";if(cnt)cnt.textContent=`${i+1} / ${a.length}`;};
  const open=(n)=>{show(n);l.classList.add("open");l.setAttribute("aria-hidden","false");document.body.classList.add("lightbox-open");};
  const shut=()=>{l.classList.remove("open");l.setAttribute("aria-hidden","true");document.body.classList.remove("lightbox-open");};
  document.addEventListener("click",e=>{const img=e.target.closest(".gallery-item img");if(img){e.preventDefault();e.stopPropagation();const a=imgs();open(a.indexOf(img));}},true);
  closeBtn?.addEventListener("click",shut);prevBtn?.addEventListener("click",()=>show(i-1));nextBtn?.addEventListener("click",()=>show(i+1));
  l.addEventListener("click",e=>{if(e.target===l)shut();});
  document.addEventListener("keydown",e=>{if(!l.classList.contains("open"))return;if(e.key==="Escape")shut();else if(e.key==="ArrowLeft")show(i-1);else if(e.key==="ArrowRight")show(i+1);});
});

/* Premium portfolio upgrades */
const typingEl = document.getElementById("typingText");
if (typingEl) {
  const phrases = ["Excel & Reporting", "Banking Documentation", "Import & Export Support", "Accounts & Office Solutions"];
  let phrase = 0, char = 0, deleting = false;
  const typeLoop = () => {
    const text = phrases[phrase];
    typingEl.textContent = deleting ? text.slice(0, --char) : text.slice(0, ++char);
    let delay = deleting ? 45 : 78;
    if (!deleting && char === text.length) { deleting = true; delay = 1500; }
    else if (deleting && char === 0) { deleting = false; phrase = (phrase + 1) % phrases.length; delay = 350; }
    setTimeout(typeLoop, delay);
  };
  setTimeout(typeLoop, 600);
}

/* Animated counters */
const counterObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || "";
    const start = performance.now();
    const duration = 1200;
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = `${Math.round(target * eased)}${suffix}`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    obs.unobserve(el);
  });
}, {threshold:.5});
document.querySelectorAll("[data-count]").forEach(el => counterObserver.observe(el));

/* Back to top */
const backTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  backTop?.classList.toggle("show", window.scrollY > 500);
}, {passive:true});
backTop?.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));

/* Contact form: opens the visitor's email client with a prepared message */
const contactForm = document.getElementById("contactForm");
contactForm?.addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("contactName")?.value.trim();
  const email = document.getElementById("contactEmail")?.value.trim();
  const message = document.getElementById("contactMessage")?.value.trim();
  if (!name || !email || !message) return;
  const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  window.location.href = `mailto:iftikhar.mirza099@gmail.com?subject=${subject}&body=${body}`;
  const toast = document.getElementById("toast");
  if (toast) {
    toast.textContent = "Opening your email app…";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2600);
  }
});

/* Lightbox counter enhancement */
const lightboxCounter = document.getElementById("lightboxCounter");
const originalLightbox = document.getElementById("lightbox");
if (originalLightbox && lightboxCounter) {
  const updateCounter = () => {
    const total = document.querySelectorAll(".gallery-item img").length;
    const imageSrc = document.getElementById("lightboxImage")?.src || "";
    const images = [...document.querySelectorAll(".gallery-item img")];
    const idx = images.findIndex(img => (img.currentSrc || img.src) === imageSrc);
    lightboxCounter.textContent = idx >= 0 ? `${idx + 1} / ${total}` : "";
  };
  new MutationObserver(updateCounter).observe(originalLightbox, {attributes:true, subtree:true, childList:true});
  originalLightbox.addEventListener("click", () => setTimeout(updateCounter, 20));
  document.addEventListener("keydown", () => setTimeout(updateCounter, 20));
}

/* Gentle cursor spotlight on desktop */
if (window.matchMedia("(pointer:fine)").matches) {
  const spotlight = document.createElement("div");
  spotlight.className = "cursor-spotlight";
  document.body.appendChild(spotlight);
  window.addEventListener("pointermove", e => {
    spotlight.style.transform = `translate3d(${e.clientX - 120}px,${e.clientY - 120}px,0)`;
  }, {passive:true});
}
