const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const nav = document.getElementById("nav");

navToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});

navLinks?.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => navLinks.classList.remove("is-open"));
});

document.getElementById("year").textContent = new Date().getFullYear();

/* Filter chips */
const chips = document.querySelectorAll(".chip");
const cards = document.querySelectorAll(".card");

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("is-on"));
    chip.classList.add("is-on");
    const f = chip.dataset.filter;
    cards.forEach((card) => {
      const show = f === "all" || card.dataset.cat === f;
      card.classList.toggle("is-hidden", !show);
    });
  });
});

/* Lightbox */
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbClose = document.getElementById("lbClose");

document.getElementById("projectGrid").addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  const src = card.dataset.full;
  if (!src) {
    document.getElementById("motion")?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  lbImg.src = src;
  lightbox.showModal();
});

lbClose.addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.close();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.open) lightbox.close();
});

/* Contact form → mailto */
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const name = data.get("name");
  const email = data.get("email");
  const type = data.get("type");
  const message = data.get("message");
  const subject = encodeURIComponent(`Brief — ${type} — ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nProject: ${type}\n\n${message}`
  );
  window.location.href = `mailto:vikasmehra8283@gmail.com?subject=${subject}&body=${body}`;
  const note = document.getElementById("formNote");
  note.textContent = "Opening your mail client… if nothing happens, write directly to vikasmehra8283@gmail.com";
  note.classList.add("is-ok");
});

/* Subtle nav shrink on scroll */
let last = 0;
window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    nav.style.boxShadow = y > 12 ? "0 8px 30px rgba(22,19,16,0.06)" : "none";
    last = y;
  },
  { passive: true }
);

/* 3D portrait tilts + mini mark follows cursor */
(() => {
  const card = document.getElementById("hero3d");
  const buddy = document.getElementById("cursorBuddy");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (reduce) return;

  const look = { x: 0, y: 0 };
  const lookCur = { x: 0, y: 0 };
  const pos = { x: -200, y: -200 };
  const posCur = { x: -200, y: -200 };
  let visible = false;
  let raf = 0;

  const tick = () => {
    lookCur.x += (look.x - lookCur.x) * 0.14;
    lookCur.y += (look.y - lookCur.y) * 0.14;
    posCur.x += (pos.x - posCur.x) * 0.18;
    posCur.y += (pos.y - posCur.y) * 0.18;

    if (card) {
      card.style.setProperty("--ry", `${lookCur.x * 18}deg`);
      card.style.setProperty("--rx", `${-lookCur.y * 12}deg`);
      card.style.setProperty("--hx", `${lookCur.x * 16}px`);
      card.style.setProperty("--hy", `${lookCur.y * 12}px`);
      card.style.setProperty("--ox", `${-lookCur.x * 22}px`);
      card.style.setProperty("--oy", `${-lookCur.y * 16}px`);
      card.style.setProperty("--sx", `${50 + lookCur.x * 30}%`);
      card.style.setProperty("--sy", `${30 + lookCur.y * 24}%`);
    }

    if (buddy && !coarse) {
      const rot = lookCur.x * 12;
      buddy.style.transform = `translate3d(${posCur.x}px, ${posCur.y}px, 0) rotate(${rot}deg)`;
      buddy.classList.toggle("is-on", visible);
    }

    raf = requestAnimationFrame(tick);
  };

  const point = (clientX, clientY) => {
    if (card) {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.38;
      look.x = Math.max(-1, Math.min(1, (clientX - cx) / (window.innerWidth * 0.5)));
      look.y = Math.max(-1, Math.min(1, (clientY - cy) / (window.innerHeight * 0.5)));
    }
    pos.x = clientX + 22;
    pos.y = clientY + 18;
    visible = true;
  };

  window.addEventListener("mousemove", (e) => point(e.clientX, e.clientY), { passive: true });
  window.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches[0];
      if (t) point(t.clientX, t.clientY);
    },
    { passive: true }
  );
  document.addEventListener("mouseleave", () => {
    visible = false;
    look.x = 0;
    look.y = 0;
  });
  document.querySelectorAll("input, textarea, select, button, a").forEach((el) => {
    el.addEventListener("mouseenter", () => { visible = false; });
    el.addEventListener("mouseleave", () => { visible = true; });
  });

  raf = requestAnimationFrame(tick);
})();
