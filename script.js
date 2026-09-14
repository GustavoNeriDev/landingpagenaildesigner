// ===== Dados =====
// Número de WhatsApp para os links de agendamento (formato internacional)
const WA_NUMBER = "5579981759686";

const SERVICES = [
  {
    id: "gel",
    name: "Unha em gel",
    price: 85,
    tag: "Assinatura",
    desc: "Um resultado impecável e resistente.",
  },
  {
    id: "Postiça",
    name: "Postiça realista",
    price: 35,

    tag: "Popular",
    desc: "Com brilho espelhado e acabamento delicado.",
  },
  {
    id: "esmaltação",
    name: "Esmaltação em gel",
    price: 40,

    tag: "Fortalecimento",
    desc: "Cor intensa e brilho de vitrine por até 30 dias, com cuticulagem precisa e finalização hidratante.",
  },
  {
    id: "banho",
    name: "Banho em gel",
    price: 60,
    tag: "Retorno",
    desc: "Resitência, Durabilidade & Proteção",
  },
];

const TIME_SLOTS = [
  "09:00",
  "10:30",
  "13:00",
  "14:30",
  "16:00",
  "17:30",
  "19:00",
];

const GALLERY = [
  {
    src: "assets/web/gl1.jpg",
    title: "Unha em gel",
    cat: "Unha em gel",
  },
  {
    src: "assets/web/gl2.jpg",
    title: "Unha em Gel",
    cat: "Unha em gel",
  },
  {
    src: "assets/web/gl3.jpg",
    title: "Unha em gel",
    cat: "Unha em gel",
  },
  {
    src: "assets/web/gl4.jpg",
    title: "Unha em gel",
    cat: "Unha em gel",
  },
  {
    src: "assets/web/pa1.jpg",
    title: "Postiça realista",
    cat: "Postiça realista",
  },
  {
    src: "assets/web/pa2.jpg",
    title: "Postiça realista",
    cat: "Postiça realista",
  },
  {
    src: "assets/web/pa3.jpg",
    title: "Postiça realista",
    cat: "Postiça realista",
  },
  {
    src: "assets/web/gl5.jpg",
    title: "Unha em gel",
    cat: "Unha em gel",
  },
];

const MARQUEE_ITEMS = [
  "Unha em gel",
  "Postiça realista",
  "Esmaltação em gel",
  "Banho em gel",
  "Nail art",
];

// ===== Helpers =====
const $ = (s) => document.querySelector(s);
const brl = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    v,
  );
const waLink = (msg) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

// Links diretos de WhatsApp (nav, footer, botão flutuante)
document
  .querySelectorAll("[data-wa]")
  .forEach((a) => (a.href = waLink(a.dataset.wa)));

$("#year").textContent = new Date().getFullYear();

// ===== Scroll suave para âncoras =====
document.querySelectorAll("[data-scroll]").forEach((el) => {
  el.addEventListener("click", () => {
    const target = document.getElementById(el.dataset.scroll);
    if (!target) return;
    const y = target.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top: y, behavior: "smooth" });
    $("#navMobile").classList.remove("open");
  });
});

// ===== Nav: vidro ao rolar + menu mobile =====
const nav = $("#nav");
window.addEventListener(
  "scroll",
  () => nav.classList.toggle("scrolled", window.scrollY > 40),
  { passive: true },
);
$("#navToggle").addEventListener("click", () =>
  $("#navMobile").classList.toggle("open"),
);

// ===== Parallax do hero =====
const heroBg = document.querySelector(".hero-bg");
window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    if (y < window.innerHeight)
      heroBg.style.transform = `translateY(${y * 0.22}px) scale(1.05)`;
  },
  { passive: true },
);

// ===== Reveal on scroll (progressive enhancement) =====
document.documentElement.classList.add("js");

const revealEls = document.querySelectorAll(".reveal");

// Rede de segurança: se algo falhar, o conteúdo NUNCA fica invisível.
function showAllReveals() {
  revealEls.forEach((el) => el.classList.add("in"));
}
window.addEventListener("load", showAllReveals);
setTimeout(showAllReveals, 1800);

const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
  { threshold: 0.12, rootMargin: "0px 0px -60px" },
);
revealEls.forEach((el) => io.observe(el));

// ===== Estado do agendamento =====
const state = { service: "gel", date: "", time: "" };

function renderServicePills() {
  $("#servicePills").innerHTML = SERVICES.map(
    (s) => `
    <button type="button" class="pill ${state.service === s.id ? "active" : ""}" data-service="${s.id}">
      <span class="pill-name">${s.name}</span>
      <span class="pill-price">${s.priceNote ? s.priceNote + " " : ""}${brl(s.price)}</span>
    </button>`,
  ).join("");
  document
    .querySelectorAll("[data-service]")
    .forEach((b) =>
      b.addEventListener("click", () => selectService(b.dataset.service)),
    );
}

function renderSlots() {
  $("#timeSlots").innerHTML = TIME_SLOTS.map(
    (t) =>
      `<button type="button" class="slot ${state.time === t ? "active" : ""}" data-slot="${t}">${t}</button>`,
  ).join("");
  document.querySelectorAll("[data-slot]").forEach((b) =>
    b.addEventListener("click", () => {
      state.time = b.dataset.slot;
      renderSlots();
      renderSummary();
    }),
  );
}

function selectService(id) {
  state.service = id;
  renderServicePills();
  renderSummary();
}

function prettyDate(iso) {
  if (!iso) return "";
  return new Date(iso + "T12:00:00").toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function renderSummary() {
  const s = SERVICES.find((x) => x.id === state.service);
  $("#smService").textContent = s ? s.name : "—";

  $("#smDate").textContent = prettyDate(state.date) || "—";
  $("#smTime").textContent = state.time || "—";
  $("#smTotal").textContent = s ? brl(s.price) : "R$ —";
}

$("#bkDate").min = new Date().toISOString().split("T")[0];
$("#bkDate").addEventListener("change", (e) => {
  state.date = e.target.value;
  renderSummary();
});

$("#btnWhatsApp").addEventListener("click", () => {
  const name = $("#bkName").value.trim();

  const s = SERVICES.find((x) => x.id === state.service);
  if (!s || !state.date || !state.time || !name) {
    $("#formError").hidden = false;
    return;
  }
  $("#formError").hidden = true;
  const msg = `Olá Nickolle! Gostaria de agendar um horário no seu Studio.\n\nServiço: ${s.name} (${brl(s.price)})\nData: ${prettyDate(state.date)}\nHorário: ${state.time}\nNome: ${name}\nPodemos confirmar a disponibilidade?`;
  window.open(waLink(msg), "_blank");
});

renderServicePills();
renderSlots();
renderSummary();

// ===== Cards de serviços =====
$("#servicesGrid").innerHTML = SERVICES.map(
  (s) => `
  <article class="svc reveal">
    <span class="svc-tag">${s.tag}</span>
    <h3>${s.name}</h3>
    <p class="svc-desc">${s.desc}</p>
    <div class="svc-foot">
      <div>
        <p class="svc-price">${s.priceNote ? `<small>${s.priceNote}</small>` : ""}${brl(s.price)}</p>
      </div>
      <button class="svc-btn" data-book="${s.id}">Agendar ↗</button>
    </div>
  </article>`,
).join("");

document.querySelectorAll("[data-book]").forEach((b) =>
  b.addEventListener("click", () => {
    selectService(b.dataset.book);
    const y =
      $("#agendamento").getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top: y, behavior: "smooth" });
  }),
);
document
  .querySelectorAll("#servicesGrid .reveal")
  .forEach((el) => io.observe(el));

// ===== Marquee =====
const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
$("#marqueeTrack").innerHTML = items
  .map((t) => `<span>${t}<i></i></span>`)
  .join("");

// ===== Galeria + filtros + lightbox =====
const FILTERS = ["Todos", ...new Set(GALLERY.map((g) => g.cat))];
let filter = "Todos";

function renderFilters() {
  $("#galleryFilters").innerHTML = FILTERS.map(
    (f) =>
      `<button class="filter ${filter === f ? "active" : ""}" data-filter="${f}">${f}</button>`,
  ).join("");
  document.querySelectorAll("[data-filter]").forEach((b) =>
    b.addEventListener("click", () => {
      filter = b.dataset.filter;
      renderFilters();
      renderGallery();
    }),
  );
}

function renderGallery() {
  const items =
    filter === "Todos" ? GALLERY : GALLERY.filter((g) => g.cat === filter);
  $("#galleryGrid").innerHTML = items
    .map(
      (g, i) => `
    <button class="gitem" data-index="${GALLERY.indexOf(g)}" style="animation-delay:${i * 0.05}s">
      <img src="${g.src}" alt="${g.title}" loading="lazy" decoding="async" />
      <span class="gitem-cap"><strong>${g.title}</strong><span>${g.cat}</span></span>
    </button>`,
    )
    .join("");
  document
    .querySelectorAll("[data-index]")
    .forEach((b) =>
      b.addEventListener("click", () =>
        openLightbox(GALLERY[+b.dataset.index]),
      ),
    );
}

const lightbox = $("#lightbox");
function openLightbox(g) {
  // No lightbox, carrega uma versão maior (w=1200) só no clique
  $("#lbImg").src = g.src.replace("w=800", "w=1200");
  $("#lbImg").alt = g.title;
  $("#lbTitle").textContent = g.title;
  $("#lbCat").textContent = g.cat;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
}
$("#lbClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

renderFilters();
renderGallery();
