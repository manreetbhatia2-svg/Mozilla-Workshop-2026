/* ==========================================================
   CONTRIBUTORS: add your name on a NEW line, keep the comma!
   ========================================================== */
const CONTRIBUTORS = [
  "Mozilla", "CCOEW" , "Pune", "100"

  
];

//Open source flip cards
const FLIPS = [
  { emoji: "🔓", front: "Open source", back: "The code is public. Anyone can read it, fix bugs and suggest features, just like you're about to do.", color: "var(--mint)" },
  { emoji: "🎃", front: "Hacktoberfest", back: "Every October, developers around the world celebrate open source by contributing to real projects. This workshop is your first step in.", color: "var(--orange)" },
  { emoji: "🔀", front: "Every PR counts", back: "You don't need to be an expert. Fixing a typo or adding your name is a real contribution.", color: "var(--yellow)" },
  { emoji: "🤝", front: "Our club", back: "We learn, build and ship together. Bring a friend and start contributing.", color: "var(--pink)" },
];

const $ = (id) => document.getElementById(id);
const COLORS = ["#ff7139", "#ffe900", "#ff8ad8", "#54ffbd", "#fff1dc"];

/*Terminal typing*/
const lines = [
  "$ git clone mozilla-workshop",
  "Cloning into 'mozilla-workshop'...",
  "$ git checkout -b add-my-name",
  "$ git commit -m \"Add my name\"",
  "$ git push origin add-my-name",
  "Pull request opened.",
  "Merged! You're a contributor now.",
];
let li = 0, ci = 0, out = "";
function type() {
  const term = $("term");
  if (li >= lines.length) { setTimeout(() => { li = 0; out = ""; type(); }, 3000); return; }
  const line = lines[li];
  if (ci < line.length) {
    out += line[ci++];
    term.textContent = out;
    setTimeout(type, line.startsWith("$") ? 45 : 8);
  } else {
    out += "\n"; li++; ci = 0;
    term.textContent = out;
    setTimeout(type, 350);
  }
}
type();



//Flip cards
FLIPS.forEach((f) => {
  const b = document.createElement("button");
  b.className = "flip";
  b.innerHTML = `<div class="flip-in">
    <div class="face front" style="background:${f.color}"><span class="big">${f.emoji}</span>${f.front}</div>
    <div class="face back" style="background:var(--cream)">${f.back}</div></div>`;
  b.addEventListener("click", () => b.classList.toggle("on"));
  $("flips").appendChild(b);
});

//Journey steps
const STEPS = [
  { title: "Fork", sub: "Make your own copy of the repo" },
  { title: "Clone", sub: "Bring it to your laptop" },
  { title: "Pull request", sub: "Add your name and propose it" },
  { title: "Merge", sub: "The host merges your PR" },
  { title: "Deploy", sub: "Put your site on the internet" },
];
const saved = JSON.parse(localStorage.getItem("steps-done") || "[]");

function updateProgress() {
  const done = document.querySelectorAll(".step input:checked").length;
  $("meter-fill").style.width = (done / STEPS.length) * 100 + "%";
  $("meter-label").textContent = done === STEPS.length
    ? "All done! You just shipped a website. 🎉" : done + " of " + STEPS.length + " done";
  return done;
}

STEPS.forEach((s, i) => {
  const el = document.createElement("label");
  el.className = "step" + (saved.includes(i) ? " done" : "");
  el.innerHTML = `
    <div class="step-num">${i + 1}</div>
    <div class="step-title">${s.title}<small>${s.sub}</small></div>
    <input type="checkbox" aria-label="Mark ${s.title} as done" ${saved.includes(i) ? "checked" : ""}>`;
  const box = el.querySelector("input");
  box.addEventListener("change", () => {
    el.classList.toggle("done", box.checked);
    const ticked = [...document.querySelectorAll(".step input")]
      .map((b, n) => (b.checked ? n : -1)).filter((n) => n >= 0);
    localStorage.setItem("steps-done", JSON.stringify(ticked));
    if (updateProgress() === STEPS.length) boom();
  });
  $("steps").appendChild(el);
});
updateProgress();

//Contributor wall
const fun = ["🦊", "🔥", "🚀", "✨", "💜", "🎉"];
CONTRIBUTORS.forEach((name, i) => {
  const c = document.createElement("button");
  c.className = "chip";
  c.textContent = name;
  c.style.background = COLORS[i % COLORS.length];
  c.addEventListener("click", () => {
    c.textContent = fun[Math.floor(Math.random() * fun.length)] + " Hi " + name + "!";
    setTimeout(() => (c.textContent = name), 1500);
    boom(25);
  });
  $("wall-list").appendChild(c);
});

//Scroll bar
addEventListener("scroll", () => {
  const h = document.documentElement;
  $("scrollbar").style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
});

//Confetti
const cv = $("confetti"), ctx = cv.getContext("2d");
let bits = [];
function size() { cv.width = innerWidth; cv.height = innerHeight; }
size(); addEventListener("resize", size);
function boom(n = 120) {
  for (let i = 0; i < n; i++) {
    bits.push({ x: innerWidth / 2, y: innerHeight / 3, vx: (Math.random() - 0.5) * 14, vy: Math.random() * -12 - 2,
      s: 5 + Math.random() * 6, c: COLORS[i % COLORS.length], life: 120 });
  }
  if (bits.length === n) frame();
}
function frame() {
  ctx.clearRect(0, 0, cv.width, cv.height);
  bits = bits.filter((b) => b.life-- > 0);
  bits.forEach((b) => { b.x += b.vx; b.y += b.vy; b.vy += 0.35; ctx.fillStyle = b.c; ctx.fillRect(b.x, b.y, b.s, b.s); });
  if (bits.length) requestAnimationFrame(frame);
}
$("fox").addEventListener("click", () => boom());
