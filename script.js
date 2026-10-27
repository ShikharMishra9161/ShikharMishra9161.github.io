// Nav: background on scroll + active link
const nav = document.getElementById("nav");
const navLinks = document.getElementById("navLinks");
const navToggle = document.getElementById("navToggle");
const sectionLinks = [...navLinks.querySelectorAll('a[href^="#"]')];

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", open);
});
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", false);
  }
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    sectionLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("section[id]").forEach((s) => sectionObserver.observe(s));

// Reveal on scroll + stat counters
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function countUp(el) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  if (reduceMotion) { el.textContent = target + suffix; return; }
  const duration = 1400;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    entry.target.querySelectorAll("[data-count]").forEach(countUp);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 80}ms`;
  revealObserver.observe(el);
});

// Typing effect
const phrases = [
  "scalable backend systems",
  "full-stack AI apps",
  "fast, reliable APIs",
  "fault-tolerant job queues",
];
const typed = document.getElementById("typed");
if (!reduceMotion) {
  let phrase = 0, char = phrases[0].length, deleting = true;
  const loop = () => {
    const text = phrases[phrase];
    char += deleting ? -1 : 1;
    typed.textContent = text.slice(0, char);
    let delay = deleting ? 35 : 70;
    if (!deleting && char === text.length) { deleting = true; delay = 2000; }
    else if (deleting && char === 0) { deleting = false; phrase = (phrase + 1) % phrases.length; delay = 300; }
    setTimeout(loop, delay);
  };
  setTimeout(loop, 2200);
}

// Copy email
const toast = document.getElementById("toast");
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}
document.getElementById("copyEmail").addEventListener("click", async (e) => {
  const email = e.currentTarget.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
    showToast("Email copied ✓");
  } catch {
    showToast(email);
  }
});

document.getElementById("year").textContent = new Date().getFullYear();
