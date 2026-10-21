const VIDEOS = [
  { title: "Welcome to ESOneworld", channel: "UniEdge", category: "Community", duration: "3:12", hue: 0 },
  { title: "Campus Life Highlights", channel: "UniEdge Media", category: "Education", duration: "8:45", hue: 210 },
  { title: "Top 10 Study Tips", channel: "Study Lab", category: "Education", duration: "12:03", hue: 140 },
  { title: "Live Music Night", channel: "ESO Arts", category: "Music", duration: "45:20", hue: 280 },
  { title: "Tech Talk: Building the Web", channel: "Dev Circle", category: "Technology", duration: "27:51", hue: 190 },
  { title: "Weekend Sports Recap", channel: "ESO Sports", category: "Sports", duration: "9:30", hue: 30 },
  { title: "Healthy Cooking in 15 Minutes", channel: "Kitchen Corner", category: "Lifestyle", duration: "15:00", hue: 90 },
  { title: "Global Voices Panel", channel: "UniEdge", category: "Community", duration: "52:14", hue: 340 },
];

const grid = document.getElementById("grid");
const chips = document.getElementById("chips");
const search = document.getElementById("search");
const empty = document.getElementById("empty");
let category = "All";

const play = '<svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
const esc = (s) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function render() {
  const q = search.value.trim().toLowerCase();
  const list = VIDEOS.filter(
    (v) => (category === "All" || v.category === category) &&
      (!q || `${v.title} ${v.channel}`.toLowerCase().includes(q))
  );
  grid.innerHTML = list
    .map(
      (v) => `<article class="card">
        <div class="thumb" style="background:linear-gradient(135deg,hsl(${v.hue} 60% 35%),hsl(${v.hue + 40} 60% 20%))">${play}<span class="dur">${v.duration}</span></div>
        <div class="meta"><h3>${esc(v.title)}</h3><p>${esc(v.channel)} · ${esc(v.category)}</p></div>
      </article>`
    )
    .join("");
  empty.hidden = list.length > 0;
}

["All", ...new Set(VIDEOS.map((v) => v.category))].forEach((c) => {
  const b = document.createElement("button");
  b.textContent = c;
  b.setAttribute("aria-pressed", String(c === category));
  b.onclick = () => {
    category = c;
    chips.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    render();
  };
  chips.appendChild(b);
});

search.addEventListener("input", render);
document.getElementById("year").textContent = new Date().getFullYear();
render();

// Service worker: offline support + update prompt
if ("serviceWorker" in navigator && location.hostname !== "localhost") {
  const toast = document.getElementById("toast");
  let refreshing = false;
  const showUpdate = (worker) => {
    toast.hidden = false;
    document.getElementById("refresh").onclick = () => {
      refreshing = true;
      worker.postMessage("skipWaiting");
    };
  };
  navigator.serviceWorker.addEventListener("controllerchange", () => refreshing && location.reload());
  navigator.serviceWorker
    .register("/sw.js")
    .then((reg) => {
      if (reg.waiting && navigator.serviceWorker.controller) return showUpdate(reg.waiting);
      reg.addEventListener("updatefound", () => {
        const w = reg.installing;
        w?.addEventListener("statechange", () => {
          if (w.state === "installed" && navigator.serviceWorker.controller) showUpdate(w);
        });
      });
    })
    .catch((err) => console.log("Service Worker registration failed:", err));
}
