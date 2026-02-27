/* ══════════════════════════════════════
   BACKGROUND ENGINE — Canvas City + 3D Particles
══════════════════════════════════════ */
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
const cityCanvas = document.createElement("canvas");
const cctx = cityCanvas.getContext("2d");

let W, H, cx, cy;

function seededRng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function drawCity() {
  cityCanvas.width = W;
  cityCanvas.height = H;
  const bgGrad = cctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, "#000000");
  bgGrad.addColorStop(0.5, "#000501");
  bgGrad.addColorStop(1, "#010d05");
  cctx.fillStyle = bgGrad;
  cctx.fillRect(0, 0, W, H);

  const vx = cx,
    vy = H * 0.58;
  cctx.save();

  // Perspective floor grid
  for (let i = 0; i < 18; i++) {
    const t = i / 18;
    const y = vy + Math.pow(t, 1.6) * (H - vy) * 1.1;
    cctx.strokeStyle = "#00ff41";
    cctx.lineWidth = 0.5;
    cctx.globalAlpha = 0.04 + t * 0.12;
    cctx.beginPath();
    cctx.moveTo(0, y);
    cctx.lineTo(W, y);
    cctx.stroke();
  }
  cctx.globalAlpha = 0.06;
  for (let i = 0; i <= 28; i++) {
    const bx = (i / 28) * W;
    cctx.strokeStyle = "#00ff41";
    cctx.lineWidth = 0.5;
    cctx.beginPath();
    cctx.moveTo(vx, vy);
    cctx.lineTo(bx, H * 1.05);
    cctx.stroke();
  }
  cctx.restore();

  // Buildings
  const rng = seededRng(99);
  function building(x, w, h, dens) {
    const by = vy - h;
    cctx.fillStyle = "rgba(0,6,2,0.95)";
    cctx.fillRect(x, by, w, h + 4);
    cctx.fillStyle = "rgba(0,255,65,0.3)";
    const cols = Math.floor(w / 6),
      rows = Math.floor(h / 8);
    for (let r = 1; r < rows; r++)
      for (let c = 1; c < cols; c++)
        if (rng() < dens) cctx.fillRect(x + c * 6, by + r * 8, 2, 2);
    if (rng() > 0.6) {
      cctx.strokeStyle = "rgba(0,255,65,0.15)";
      cctx.lineWidth = 1;
      cctx.beginPath();
      cctx.moveTo(x + w / 2, by);
      cctx.lineTo(x + w / 2, by - 15 - rng() * 20);
      cctx.stroke();
    }
  }
  cctx.save();
  for (let i = 0; i < 40; i++) {
    cctx.globalAlpha = 0.35 + rng() * 0.3;
    building(rng() * W, 10 + rng() * 35, 15 + rng() * 60, 0.08);
  }
  for (let i = 0; i < 20; i++) {
    cctx.globalAlpha = 0.5 + rng() * 0.3;
    building(rng() * W, 20 + rng() * 55, 30 + rng() * 85, 0.14);
  }
  cctx.restore();

  // Dark overlay + horizon glow
  const ov = cctx.createLinearGradient(0, 0, 0, H);
  ov.addColorStop(0, "rgba(0,0,0,0)");
  ov.addColorStop(0.35, "rgba(0,0,0,0)");
  ov.addColorStop(0.58, "rgba(0,0,0,0.4)");
  ov.addColorStop(1, "rgba(0,0,0,0.88)");
  cctx.fillStyle = ov;
  cctx.fillRect(0, 0, W, H);
  const hg = cctx.createLinearGradient(0, vy - 40, 0, vy + 40);
  hg.addColorStop(0, "rgba(0,255,65,0)");
  hg.addColorStop(0.5, "rgba(0,255,65,0.04)");
  hg.addColorStop(1, "rgba(0,255,65,0)");
  cctx.fillStyle = hg;
  cctx.fillRect(0, vy - 40, W, 80);
}

// 3D Particles
const PCOUNT = 280,
  FOV = 420,
  DEPTH = 800,
  SPEED = 0.2;
let particles = [];

function mkParticle(z) {
  const d = z !== undefined ? z : Math.random() * DEPTH;
  return {
    x: (Math.random() - 0.5) * W * 1.9,
    y: (Math.random() - 0.5) * H * 0.85,
    z: d,
    brightness:
      Math.random() > 0.88
        ? 0.9 + Math.random() * 0.1
        : 0.2 + Math.random() * 0.55,
    size:
      Math.random() < 0.68 ? "tiny" : Math.random() < 0.85 ? "mid" : "large",
    vx: (Math.random() - 0.5) * 0.009,
    vy: (Math.random() - 0.5) * 0.007 - 0.003,
    phase: Math.random() * Math.PI * 2,
    ps: 0.01 + Math.random() * 0.025,
  };
}
function proj(x, y, z) {
  const sc = FOV / (FOV + z);
  return { sx: cx + x * sc, sy: H * 0.58 + y * sc, scale: sc };
}

// Code fragments
const codeLayer = document.getElementById("code-layer");
const FRAGS = [
  "SECURE_CONN\n> 443 OPEN\nTLS 1.3 OK\nCERT VALID",
  "CVE-2024\nCRIT 9.8\nPATCH NOW\nDEPLOY",
  "SCAN 192.168\n48 HOSTS\n3 VULN\nBLOCKING",
  "HASH SHA256\na3f2e1b9\nd7e8f0a1\nc3d4e5f6",
  "FIREWALL\nDROP INPUT\n0.0.0.0/0\ntcp dport",
  "AUTH TOKEN\neyJhbGci\nOiJSUzI1\nNiIsIn",
  "NMAP SCAN\nPORT 22 SSH\nPORT 80 HTTP\n443 HTTPS",
  "INTRUSION\n[02:14 UTC]\nDETECTED\nBLOCKING",
];
const activeFrags = [];

function spawnFrag() {
  const el = document.createElement("div");
  el.className = "code-frag";
  el.textContent = FRAGS[Math.floor(Math.random() * FRAGS.length)];
  const side = Math.random();
  let x =
    side < 0.35
      ? -10 + Math.random() * 100
      : side < 0.65
        ? W - 90 + Math.random() * 100
        : W * 0.05 + Math.random() * W * 0.9;
  let y = H * 0.05 + Math.random() * H * 0.88;
  el.style.cssText = `left:${x}px;top:${y}px;filter:blur(${Math.random() * 1.2}px);transform:scale(${0.65 + Math.random() * 0.75});transform-origin:top left;`;
  codeLayer.appendChild(el);
  const maxA = 0.1 + Math.random() * 0.3;
  activeFrags.push({
    el,
    x,
    y,
    vy: -(0.08 + Math.random() * 0.22),
    vx: (Math.random() - 0.5) * 0.07,
    maxA,
    alpha: 0,
    state: "fadein",
    hold: 160 + Math.random() * 200,
    hc: 0,
    fs: 0.003 + Math.random() * 0.005,
  });
}

// Bokeh
const bokehLayer = document.getElementById("bokeh-layer");
const bokehOrbs = [];
[
  [90, 0.5, 1],
  [65, 0.48, 0.85],
  [110, 0.4, 0.7],
  [45, 0.58, 1.2],
  [80, 0.45, 0.9],
  [130, 0.32, 0.6],
  [55, 0.52, 1.1],
  [75, 0.43, 0.8],
  [42, 0.62, 1.3],
  [95, 0.38, 0.75],
].forEach(([sz, ba, sp]) => {
  const el = document.createElement("div");
  el.className = "bokeh";
  const x = Math.random() * (W || window.innerWidth + 200) - 100,
    y = Math.random() * (H || window.innerHeight + 200) - 100;
  el.style.cssText = `width:${sz}px;height:${sz}px;left:${x - sz / 2}px;top:${y - sz / 2}px;`;
  bokehLayer.appendChild(el);
  bokehOrbs.push({
    el,
    x,
    y,
    sz,
    vx: (Math.random() - 0.5) * 0.2 * sp,
    vy: -(0.1 + Math.random() * 0.25) * sp,
    ba,
    phase: Math.random() * Math.PI * 2,
    ps: 0.007 + Math.random() * 0.012,
  });
});

let fragTimer = 0;
function animate() {
  requestAnimationFrame(animate);
  ctx.drawImage(cityCanvas, 0, 0);

  // 3D particle field
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.z -= SPEED;
    p.x += p.vx;
    p.y += p.vy;
    p.phase += p.ps;
    const { sx, sy, scale } = proj(p.x, p.y, p.z);
    if (p.z <= 1 || sx < -120 || sx > W + 120 || sy < -120 || sy > H + 120) {
      particles[i] = mkParticle(DEPTH - 10 + Math.random() * 30);
      continue;
    }
    const pulse = 0.7 + 0.3 * Math.sin(p.phase);
    const br = p.brightness * pulse;
    const dA = Math.min(1, (1 - p.z / DEPTH) * 1.5);
    const alpha = br * dA;
    let bs =
      p.size === "tiny"
        ? 0.7 + scale * 1.1
        : p.size === "mid"
          ? 1.4 + scale * 2.3
          : 2.8 + scale * 3.8;
    const yellow = p.brightness > 0.85 && Math.sin(p.phase * 0.5) > 0.5;
    const [r, g, b] = yellow
      ? [70, 255, 20]
      : [0, 215 + Math.floor(br * 40), 65];

    if (bs > 2.5) {
      const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, bs * 2.2);
      grd.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
      grd.addColorStop(0.4, `rgba(${r},${g},${b},${alpha * 0.45})`);
      grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(sx, sy, bs * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(sx, sy, bs, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fill();
    }
    if (p.brightness > 0.78 && scale > 0.45) {
      const cs = bs * 2.8;
      ctx.strokeStyle = `rgba(0,255,65,${alpha * 0.45})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(sx - cs, sy);
      ctx.lineTo(sx + cs, sy);
      ctx.moveTo(sx, sy - cs);
      ctx.lineTo(sx, sy + cs);
      ctx.stroke();
    }
  }

  // Code frags
  fragTimer++;
  if (fragTimer > 110 && activeFrags.length < 9) {
    spawnFrag();
    fragTimer = 0;
  }
  for (let i = activeFrags.length - 1; i >= 0; i--) {
    const f = activeFrags[i];
    f.y += f.vy;
    f.x += f.vx;
    f.el.style.top = f.y + "px";
    f.el.style.left = f.x + "px";
    if (f.state === "fadein") {
      f.alpha += f.fs;
      if (f.alpha >= f.maxA) {
        f.alpha = f.maxA;
        f.state = "hold";
      }
    } else if (f.state === "hold") {
      f.hc++;
      f.el.style.opacity = (
        f.alpha *
        (1 + 0.07 * Math.sin(f.hc * 0.06))
      ).toFixed(3);
      if (f.hc >= f.hold) f.state = "fadeout";
      continue;
    } else if (f.state === "fadeout") {
      f.alpha -= f.fs * 0.65;
      if (f.alpha <= 0) {
        f.el.remove();
        activeFrags.splice(i, 1);
        continue;
      }
    }
    f.el.style.opacity = f.alpha.toFixed(3);
  }

  // Bokeh
  for (const o of bokehOrbs) {
    o.x += o.vx;
    o.y += o.vy;
    o.phase += o.ps;
    if (o.y + o.sz < -60) {
      o.y = H + 60;
      o.x = Math.random() * (W + 200) - 100;
    }
    if (o.x + o.sz < -150) o.x = W + 100;
    if (o.x - o.sz > W + 150) o.x = -100;
    const pa = (o.ba * (0.55 + 0.45 * Math.sin(o.phase))).toFixed(3);
    o.el.style.left = o.x - o.sz / 2 + "px";
    o.el.style.top = o.y - o.sz / 2 + "px";
    o.el.style.background = `radial-gradient(circle,rgba(0,255,65,${pa}) 0%,rgba(0,200,50,${(pa * 0.3).toFixed(3)}) 42%,transparent 70%)`;
  }
}

function init() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  cx = W / 2;
  cy = H / 2;
  drawCity();
  particles = Array.from({ length: PCOUNT }, () => mkParticle());
}

window.addEventListener("resize", () => {
  init();
});
init();
for (let i = 0; i < 5; i++) setTimeout(spawnFrag, i * 600);
animate();

/* ══════════════════════════════════════
   THEME TOGGLE (with localStorage)
══════════════════════════════════════ */
const themeToggle = document.getElementById("themeToggle");
const htmlEl = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem("kjd-theme");
if (savedTheme === "light") {
  htmlEl.setAttribute("data-theme", "light");
  if (themeToggle) themeToggle.textContent = "☀️";
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = htmlEl.getAttribute("data-theme");
    const next = current === "light" ? null : "light";
    if (next) {
      htmlEl.setAttribute("data-theme", "light");
      themeToggle.textContent = "☀️";
      localStorage.setItem("kjd-theme", "light");
    } else {
      htmlEl.removeAttribute("data-theme");
      themeToggle.textContent = "🌙";
      localStorage.setItem("kjd-theme", "dark");
    }
  });
}

/* ══════════════════════════════════════
   HAMBURGER MENU (Mobile)
══════════════════════════════════════ */
const hamburgerBtn = document.getElementById("hamburgerBtn");
const navLinksEl = document.getElementById("navLinks");

if (hamburgerBtn && navLinksEl) {
  hamburgerBtn.addEventListener("click", () => {
    navLinksEl.classList.toggle("mobile-open");
    const icon = hamburgerBtn.querySelector("i");
    if (navLinksEl.classList.contains("mobile-open")) {
      icon.className = "fas fa-times";
    } else {
      icon.className = "fas fa-bars";
    }
  });

  // Close menu when a nav link is clicked
  navLinksEl.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navLinksEl.classList.remove("mobile-open");
      const icon = hamburgerBtn.querySelector("i");
      icon.className = "fas fa-bars";
    });
  });
}

/* ══════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════ */
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.08 },
);
document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

// Timeline
const tlObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  },
  { threshold: 0.2 },
);
document.querySelectorAll(".timeline-item").forEach((el) => tlObs.observe(el));

/* ══════════════════════════════════════
   HEADER HIDE/SHOW ON SCROLL
══════════════════════════════════════ */
let lastST = 0;
const hdr = document.getElementById("main-header");
window.addEventListener("scroll", () => {
  const st = window.scrollY;
  if (hdr) {
    hdr.style.transform =
      st > lastST && st > 120 ? "translateY(-100%)" : "translateY(0)";
  }
  lastST = st <= 0 ? 0 : st;

  // Active nav link
  let cur = "";
  document.querySelectorAll("section[id]").forEach((s) => {
    if (window.scrollY >= s.offsetTop - 220) cur = s.id;
  });
  document.querySelectorAll(".nav-links a").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === "#" + cur);
  });
});

/* ══════════════════════════════════════
   SKILLS CAROUSEL CLONE
══════════════════════════════════════ */
const track = document.getElementById("skillsTrack");
if (track)
  Array.from(track.children).forEach((c) =>
    track.appendChild(c.cloneNode(true)),
  );

/* ══════════════════════════════════════
   SMOOTH SCROLL
══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute("href"));
    if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

/* ══════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════ */
const form = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const successMsg = document.getElementById("successMessage");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "TRANSMITTING...";
    const data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      message: document.getElementById("message").value,
    };
    try {
      const res = await fetch(
        "https://formsubmit.co/ajax/dimlakylejustine@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(data),
        },
      );
      if (res.ok) {
        successMsg.style.display = "block";
        form.reset();
        setTimeout(() => (successMsg.style.display = "none"), 5000);
      }
    } catch (err) {
      alert("Message sent! Thank you.");
      form.reset();
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "SEND MESSAGE";
    }
  });
}

/* ══════════════════════════════════════
   CHATBOT
══════════════════════════════════════ */
const chatContainer = document.getElementById("chatContainer");
const chatToggleBtn = document.getElementById("chatToggleBtn");
const closeChatBtn = document.getElementById("closeChatBtn");
const chatInput = document.getElementById("chatInput");
const chatSendBtn = document.getElementById("chatSendBtn");
const chatMessages = document.getElementById("chatMessages");

chatToggleBtn?.addEventListener("click", () => {
  chatContainer.classList.toggle("active");
  if (chatContainer.classList.contains("active")) chatInput.focus();
});
closeChatBtn?.addEventListener("click", () =>
  chatContainer.classList.remove("active"),
);

function getContext() {
  const ids = ["about", "experience", "projects", "skills", "education"];
  let ctx =
    "You are the AI representative for Kyle Justine C. Dimla.\nINSTRUCTIONS:\n1. Answer strictly based on the resume below.\n2. Use bullet points for lists and bold for key skills.\n3. Be professional and concise.\n--- RESUME DATA ---\n";
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el)
      ctx += `[${id.toUpperCase()}]\n${el.innerText.replace(/\s+/g, " ").trim()}\n\n`;
  });
  return ctx;
}

function fmtBot(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
    .replace(/^\s*[-*]\s+(.*)$/gm, "• $1");
}

function addMsg(text, isUser, type = "") {
  const d = document.createElement("div");
  d.className = `message ${isUser ? "user" : "bot"} ${type}`;
  if (isUser || type === "loading") d.textContent = text;
  else d.innerHTML = fmtBot(text);
  chatMessages.appendChild(d);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return d;
}

async function sendMsg() {
  const text = chatInput.value.trim();
  if (!text) return;
  addMsg(text, true);
  chatInput.value = "";
  const loading = addMsg("Thinking...", false, "loading");
  try {
    const res = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, context: getContext() }),
    });
    const data = await res.json();
    chatMessages.removeChild(loading);
    if (data.error) addMsg(`Error: ${data.error}`, false);
    else
      addMsg(
        data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.",
        false,
      );
  } catch (err) {
    chatMessages.removeChild(loading);
    addMsg("// System Error: Unable to reach AI server.", false);
  }
}

chatSendBtn?.addEventListener("click", sendMsg);
chatInput?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMsg();
});
