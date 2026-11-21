// リポジトリ一覧 — /api/repos から取得し、失敗時は Supabase REST へ直接フォールバック

const TYPE_LABELS = {
  web: "Webアプリ",
  local: "ローカル",
};

// カラーパレット（Color Hunt の人気パレットから選定、他サイト使用分は除外）
// colors: パレット本来の4色（ストライプ表示用、比重 41/26/18/15）
// vars:   役割（メイン/サブ/ライト/アクセント）と、パレットから導出した
//         背景・面・文字色。暗いパレットは暗背景＋明文字、明るいパレットは
//         明背景＋暗文字になるよう各パレットごとに定義する。
const PALETTES = [
  {
    name: "Ocean Breeze",
    colors: ["#48CAE4", "#90E0EF", "#ADE8F4", "#CAF0F8"],
    vars: {
      main: "#023E8A", sub: "#48CAE4", light: "#ADE8F4", accent: "#90E0EF",
      accentText: "#0077B6",
      bg: "#EFFAFF", surface: "#FDFEFF", surfaceMuted: "#DFF3FB",
      text: "#07304F", muted: "#4A6B82", border: "#C4E2F0",
      onMain: "#F4FBFF", headerSub: "#BFE3F5",
    },
  },
  {
    name: "Summer Pop",
    colors: ["#FF9770", "#FFD670", "#E9FF70", "#70D6FF"],
    vars: {
      main: "#E0521F", sub: "#FF9770", light: "#FFD670", accent: "#70D6FF",
      accentText: "#B23A0E",
      bg: "#FFF9EC", surface: "#FFFEF9", surfaceMuted: "#FDEFD2",
      text: "#4A2A14", muted: "#8A6A4A", border: "#F3DFB8",
      onMain: "#FFFEF9", headerSub: "#FFE3C2",
    },
  },
  {
    name: "Pastel Garden",
    colors: ["#F38181", "#FCE38A", "#EAFFD0", "#95E1D3"],
    vars: {
      main: "#C94F4F", sub: "#2F8F76", light: "#FCE38A", accent: "#F38181",
      accentText: "#B03A2E",
      bg: "#FBFFF4", surface: "#FEFFFB", surfaceMuted: "#EFF7DC",
      text: "#3D3A2E", muted: "#75806A", border: "#DDE8C4",
      onMain: "#FEFFFB", headerSub: "#FBD9D9",
    },
  },
  {
    name: "Cotton Candy",
    colors: ["#AA96DA", "#FCBAD3", "#FFFFD2", "#A8D8EA"],
    vars: {
      main: "#6D4C9F", sub: "#AA96DA", light: "#FFFFD2", accent: "#FCBAD3",
      accentText: "#A03D6E",
      bg: "#FBF7FF", surface: "#FEFDFF", surfaceMuted: "#F1EAF9",
      text: "#3B2E4F", muted: "#7A6E94", border: "#E2D6F2",
      onMain: "#FEFDFF", headerSub: "#DCCFF2",
    },
  },
  {
    name: "Midnight Red",
    colors: ["#E94560", "#0F3460", "#16213E", "#1A1A2E"],
    vars: {
      main: "#1A1A2E", sub: "#E94560", light: "#16213E", accent: "#0F3460",
      accentText: "#FF7A93",
      bg: "#12121F", surface: "#1E1E33", surfaceMuted: "#262640",
      text: "#ECECF4", muted: "#9A9AB2", border: "#34344E",
      onMain: "#ECECF4", headerSub: "#B9B9CC",
    },
  },
  {
    name: "Autumn Bold",
    colors: ["#2D4059", "#EA5455", "#F07B3F", "#FFD460"],
    vars: {
      main: "#2D4059", sub: "#EA5455", light: "#FFD460", accent: "#F07B3F",
      accentText: "#C24A12",
      bg: "#FBF6EC", surface: "#FFFEFA", surfaceMuted: "#F6ECD4",
      text: "#22303F", muted: "#66707C", border: "#E7D9BC",
      onMain: "#FFFEFA", headerSub: "#C7D2DE",
    },
  },
  {
    name: "Lagoon Fresh",
    colors: ["#1A535C", "#4ECDC4", "#F7FFF7", "#FFE66D"],
    vars: {
      main: "#1A535C", sub: "#4ECDC4", light: "#F7FFF7", accent: "#FFE66D",
      accentText: "#8F6B00",
      bg: "#F2FBF7", surface: "#FDFFFD", surfaceMuted: "#DFF3EC",
      text: "#123A40", muted: "#527A72", border: "#C6E4D8",
      onMain: "#F7FFF7", headerSub: "#BFE3D9",
    },
  },
  {
    name: "Peach Sorbet",
    colors: ["#FFAAA5", "#FFD3B6", "#DCEDC1", "#A8E6CF"],
    vars: {
      main: "#C65B4E", sub: "#3E8E73", light: "#FFD3B6", accent: "#FFAAA5",
      accentText: "#A83E32",
      bg: "#FFFBF2", surface: "#FFFEF8", surfaceMuted: "#FDEBD9",
      text: "#43302A", muted: "#8A6E62", border: "#F2DCC4",
      onMain: "#FFFEF8", headerSub: "#FFD9CE",
    },
  },
  {
    name: "Royal Gold",
    colors: ["#14213D", "#FCA311", "#E5E5E5", "#8ECAE6"],
    vars: {
      main: "#14213D", sub: "#FCA311", light: "#E5E5E5", accent: "#8ECAE6",
      accentText: "#A86E06",
      bg: "#F5F7FA", surface: "#FCFDFE", surfaceMuted: "#E8EDF3",
      text: "#182236", muted: "#5E6B82", border: "#D3DAE4",
      onMain: "#FCFDFE", headerSub: "#B9C6D8",
    },
  },
  {
    name: "Grape Wine",
    colors: ["#5F0F40", "#9A031E", "#FB8B24", "#E36414"],
    vars: {
      main: "#5F0F40", sub: "#9A031E", light: "#E36414", accent: "#FB8B24",
      accentText: "#FFAB5E",
      bg: "#1E0716", surface: "#2E0E26", surfaceMuted: "#3B1431",
      text: "#F6E9F1", muted: "#B99AAD", border: "#4E2140",
      onMain: "#F6E9F1", headerSub: "#D9BCCD",
    },
  },
];

const PALETTE_VAR_KEYS = {
  main: "--main",
  sub: "--sub",
  light: "--light",
  accent: "--accent",
  accentText: "--accent-text",
  bg: "--bg",
  surface: "--surface",
  surfaceMuted: "--surface-muted",
  text: "--text",
  muted: "--muted",
  border: "--border",
  onMain: "--on-main",
  headerSub: "--header-sub",
};

function applyPalette(palette) {
  const root = document.documentElement;
  for (const [key, cssVar] of Object.entries(PALETTE_VAR_KEYS)) {
    root.style.setProperty(cssVar, palette.vars[key]);
  }
  // ストライプはパレット本来の4色をそのまま使う
  const stripe = document.querySelectorAll(".palette-stripe > span");
  stripe.forEach((span, i) => {
    if (palette.colors[i]) span.style.background = palette.colors[i];
  });
}

// パレットの4色を 41/26/18/15 の比率で並べたバー（ヘッダーのストライプと同じ形式）を作る
function buildBar(palette) {
  const bar = el("span", "palette-bar");
  bar.setAttribute("aria-hidden", "true");
  for (const color of palette.colors) {
    const seg = document.createElement("span");
    seg.style.background = color;
    bar.appendChild(seg);
  }
  return bar;
}

function initPalette() {
  const button = document.getElementById("palette-button");
  const buttonSwatch = document.getElementById("palette-button-swatch");
  const buttonName = document.getElementById("palette-button-name");
  const menu = document.getElementById("palette-menu");

  function closeMenu() {
    menu.hidden = true;
    button.setAttribute("aria-expanded", "false");
  }
  function openMenu() {
    menu.hidden = false;
    button.setAttribute("aria-expanded", "true");
  }

  // 選択はその訪問中だけ有効（保存・復元はしない）
  function selectPalette(index) {
    const palette = PALETTES[index];
    applyPalette(palette);
    [...buttonSwatch.children].forEach((seg, i) => {
      if (palette.colors[i]) seg.style.background = palette.colors[i];
    });
    buttonName.textContent = palette.name;
    [...menu.children].forEach((item, i) => {
      const selected = i === index;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-selected", String(selected));
    });
  }

  PALETTES.forEach((palette, i) => {
    const item = el("li", "palette-item");
    item.setAttribute("role", "option");
    item.setAttribute("aria-selected", "false");
    item.tabIndex = -1;
    const head = el("span", "palette-item-head");
    head.appendChild(el("span", "palette-item-name", palette.name));
    head.appendChild(el("span", "palette-check", "✓"));
    item.appendChild(head);
    item.appendChild(buildBar(palette));
    item.addEventListener("click", () => {
      selectPalette(i);
      closeMenu();
      button.focus();
    });
    menu.appendChild(item);
  });

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    if (menu.hidden) openMenu();
    else closeMenu();
  });
  // メニュー内のクリックで外側クリック判定にならないようにする
  menu.addEventListener("click", (e) => e.stopPropagation());
  document.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) {
      closeMenu();
      button.focus();
    }
  });

  // アクセスごとにランダムで1つ選ぶ（前回の選択は保存・復元しない）
  selectPalette(Math.floor(Math.random() * PALETTES.length));
}

let allRepos = [];

async function fetchRepos() {
  try {
    const res = await fetch("/api/repos");
    if (!res.ok) throw new Error("api " + res.status);
    return await res.json();
  } catch (e) {
    // フォールバック: config.json の Supabase REST を直接読む
    const cfgRes = await fetch("config.json");
    const cfg = await cfgRes.json();
    const url =
      cfg.supabase.url +
      "/rest/v1/github_repos?select=*&order=sort_order.asc";
    const res = await fetch(url, {
      headers: {
        apikey: cfg.supabase.key,
        authorization: "Bearer " + cfg.supabase.key,
        accept: "application/json",
      },
    });
    if (!res.ok) throw new Error("supabase " + res.status);
    return await res.json();
  }
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

// カード本体クリックの遷移先：Webアプリはアプリ本体、ローカルはリポジトリ
function targetUrl(repo) {
  return repo.app_type === "web" && repo.app_url ? repo.app_url : repo.repo_url;
}

function buildCard(repo) {
  const card = el("article", "card type-" + (repo.app_type || "local"));
  card.tabIndex = 0;
  card.setAttribute("role", "link");
  card.setAttribute("aria-label", repo.title + "を開く");

  if (repo.thumbnail) {
    const img = document.createElement("img");
    img.className = "card-thumb";
    img.src = repo.thumbnail;
    img.alt = repo.title;
    img.loading = "lazy";
    card.appendChild(img);
  }

  const body = el("div", "card-body");

  const head = el("div", "card-head");
  head.appendChild(el("h3", "card-name", repo.title));
  head.appendChild(
    el("span", "badge badge-" + (repo.app_type || "local"),
      TYPE_LABELS[repo.app_type] || repo.app_type || "")
  );
  body.appendChild(head);

  if (repo.description) body.appendChild(el("p", "card-summary", repo.description));

  const foot = el("div", "card-foot");
  if (repo.language) foot.appendChild(el("span", "card-lang", repo.language));
  const detailBtn = el("button", "detail-btn", "詳細");
  detailBtn.type = "button";
  detailBtn.addEventListener("click", (e) => {
    // カード本体のクリック（アプリ／リポジトリ遷移）と干渉させない
    e.stopPropagation();
    openModal(repo);
  });
  foot.appendChild(detailBtn);
  body.appendChild(foot);

  card.appendChild(body);

  const open = () => {
    const url = targetUrl(repo);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };
  card.addEventListener("click", open);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter") open();
  });

  return card;
}

// ---- 詳細モーダル ----
const overlay = () => document.getElementById("modal-overlay");
let lastFocus = null;

function openModal(repo) {
  lastFocus = document.activeElement;
  const ov = overlay();
  const thumb = document.getElementById("modal-thumb");
  if (repo.thumbnail) {
    thumb.src = repo.thumbnail;
    thumb.alt = repo.title;
    thumb.hidden = false;
  } else {
    thumb.hidden = true;
  }
  document.getElementById("modal-title").textContent = repo.title;
  const badge = document.getElementById("modal-badge");
  badge.className = "badge badge-" + (repo.app_type || "local");
  badge.textContent = TYPE_LABELS[repo.app_type] || repo.app_type || "";
  document.getElementById("modal-meta").textContent =
    [repo.name, repo.language].filter(Boolean).join(" ・ ");
  document.getElementById("modal-description").textContent = repo.description || "";
  document.getElementById("modal-usage").textContent = repo.usage || "";
  const openLink = document.getElementById("modal-open");
  openLink.href = targetUrl(repo) || "#";
  openLink.textContent =
    repo.app_type === "web" ? "アプリを開く" : "リポジトリを開く";
  const repoLink = document.getElementById("modal-repo");
  if (repo.repo_url) {
    repoLink.href = repo.repo_url;
    // Webアプリのときだけ「アプリを開く」と別にリポジトリリンクを出す
    repoLink.hidden = repo.app_type !== "web";
  } else {
    repoLink.hidden = true;
  }
  ov.hidden = false;
  document.getElementById("modal-close").focus();
}

function closeModal() {
  overlay().hidden = true;
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

function initModal() {
  document.getElementById("modal-close").addEventListener("click", closeModal);
  overlay().addEventListener("click", (e) => {
    if (e.target === overlay()) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay().hidden) closeModal();
  });
}

function currentFilters() {
  return {
    q: document.getElementById("search").value.trim().toLowerCase(),
    type: document.getElementById("filter-type").value,
  };
}

function matches(repo, f) {
  if (f.type && repo.app_type !== f.type) return false;
  if (f.q) {
    const hay = [repo.name, repo.title, repo.description, repo.usage, repo.language]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (!hay.includes(f.q)) return false;
  }
  return true;
}

function render() {
  const f = currentFilters();
  const shown = allRepos.filter((r) => matches(r, f));

  document.getElementById("count-shown").textContent = shown.length;

  const grid = document.getElementById("cards");
  grid.innerHTML = "";
  for (const r of shown) grid.appendChild(buildCard(r));

  const msg = document.getElementById("status-msg");
  if (shown.length === 0) {
    msg.textContent = "該当するリポジトリがありません。";
    msg.hidden = false;
  } else {
    msg.hidden = true;
  }
}

function initSummary() {
  document.getElementById("count-total").textContent = allRepos.length;
  document.getElementById("count-web").textContent = allRepos.filter(
    (r) => r.app_type === "web"
  ).length;
  document.getElementById("count-local").textContent = allRepos.filter(
    (r) => r.app_type === "local"
  ).length;
}

async function init() {
  const msg = document.getElementById("status-msg");
  try {
    allRepos = await fetchRepos();
  } catch (e) {
    msg.textContent = "データの取得に失敗しました。";
    msg.hidden = false;
    return;
  }
  initSummary();
  render();

  document.getElementById("search").addEventListener("input", render);
  document.getElementById("filter-type").addEventListener("change", render);
}

initPalette();
initModal();
init();
