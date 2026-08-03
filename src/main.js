const slides = Array.from(document.querySelectorAll(".hero-slide"));
const dotsWrap = document.querySelector(".hero-dots");
const menuToggle = document.querySelector(".menu-toggle");
const header = document.querySelector(".site-header");
const year = document.querySelector("#year");
const form = document.querySelector(".contact-form");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

let index = 0;
let timer;

function goTo(next) {
  if (!slides.length) return;
  slides[index]?.classList.remove("is-active");
  dotsWrap?.querySelectorAll("button")[index]?.setAttribute("aria-selected", "false");
  index = (next + slides.length) % slides.length;
  slides[index]?.classList.add("is-active");
  dotsWrap?.querySelectorAll("button")[index]?.setAttribute("aria-selected", "true");
}

function startSlideshow() {
  stopSlideshow();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  timer = window.setInterval(() => goTo(index + 1), 5000);
}

function stopSlideshow() {
  if (timer) window.clearInterval(timer);
}

if (dotsWrap && slides.length) {
  slides.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-label", `Show slide ${i + 1}`);
    btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
    btn.addEventListener("click", () => {
      goTo(i);
      startSlideshow();
    });
    dotsWrap.appendChild(btn);
  });
  startSlideshow();
}

menuToggle?.addEventListener("click", () => {
  const open = header?.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

document.querySelectorAll('.nav a, .header-actions a, .pathway, .btn').forEach((el) => {
  el.addEventListener("click", () => {
    header?.classList.remove("nav-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open menu");
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const note = form.querySelector(".form-note");
  form.reset();
  if (note) note.hidden = false;
});

const revealTargets = document.querySelectorAll(
  ".pathway, .split-copy, .pillar, .package, .cta-band-inner, .contact-inner > *"
);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealTargets.forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });
}

const style = document.createElement("style");
style.textContent = `
  .reveal { opacity: 0; transform: translateY(22px); transition: opacity 650ms ease, transform 650ms ease; }
  .reveal.is-visible { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(style);
