(function () {
  "use strict";
  var $ = function (id) {
    return document.getElementById(id);
  };
  var stage = $("stage"),
    view = "home",
    homeFocus = 0,
    gridView = false,
    fullPreview = false;
  var page = "root",
    pageFocus = {},
    editorReturn = "home",
    modalReturn = null,
    toastTimer;
  var reorder = false,
    reorderDraft = [],
    reorderApp = null,
    enterTimer = 0;
  var storeKey = "tv-shell-preview.v1";
  var gear = '<img src="assets/icons/settings.svg" alt="">';
  var flower = '<svg class="flower" viewBox="0 0 120 120" aria-hidden="true">';
  [
    "#ffb400",
    "#ff6d31",
    "#ff3f75",
    "#cb43a9",
    "#7253c1",
    "#4795d2",
    "#4ebf94",
    "#92cf53",
  ].forEach(function (c, i) {
    flower +=
      '<ellipse cx="60" cy="35" rx="16.5" ry="27" fill="' +
      c +
      '" fill-opacity=".85" transform="rotate(' +
      i * 45 +
      ' 60 60)"/>';
  });
  flower += "</svg>";
  var apps = [
    {
      id: "youtube",
      name: "YouTube",
      preview: true,
      html: '<img class="brand-image" src="assets/icons/youtube.svg" alt="YouTube">',
    },
    {
      id: "netflix",
      name: "Netflix",
      preview: true,
      html: '<img class="brand-image" src="assets/icons/netflix.svg" alt="Netflix">',
    },
    {
      id: "kyivstar",
      name: "Київстар ТБ",
      preview: true,
      html: '<span class="kyivstar-mark"><span class="kyivstar-star">✳</span>Київстар ТБ</span>',
    },
    { id: "megogo", name: "MEGOGO", preview: true, html: "MEGOGO" },
    {
      id: "jellyfin",
      name: "Jellyfin",
      preview: true,
      html: '<svg class="triangle" viewBox="0 0 60 65" aria-hidden="true"><path d="M30 7 Q32 4 35 10 L54 50 Q56 56 48 57 L12 57 Q4 57 7 50 L25 10 Q28 5 30 7Z"/><path d="M30 27 L40 46 L20 46Z"/></svg><span>Jellyfin</span>',
    },
    {
      id: "hdmi",
      name: "HDMI 1",
      html: '<svg viewBox="0 0 100 65" aria-hidden="true"><path d="M17 8H83V49H17Z M6 56H94 M43 25L65 35L43 45Z"/></svg>',
    },
    {
      id: "spotify",
      name: "Spotify",
      html: '<img class="brand-image" src="assets/icons/spotify.svg" alt="Spotify">',
    },
    {
      id: "prime",
      name: "Prime Video",
      html: '<span>prime video</span><img class="brand-image" src="assets/icons/primevideo.svg" alt="">',
    },
    { id: "photos", name: "Фото", html: flower },
    {
      id: "browser",
      name: "Браузер",
      html: '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="43" cy="42" r="28"/><path d="M63 63L88 88"/></svg>',
    },
    {
      id: "apps",
      name: "Застосунки",
      html: '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="13" y="13" width="29" height="29" rx="7"/><rect x="58" y="13" width="29" height="29" rx="7"/><rect x="13" y="58" width="29" height="29" rx="7"/><rect x="58" y="58" width="29" height="29" rx="7"/></svg>',
    },
    {
      id: "settings",
      name: "Налаштування",
      html: '<img class="settings-mark" src="assets/icons/settings.svg" alt="">',
    },
  ];
  var ids = apps.map(function (a) {
    return a.id;
  });
  var prefs = {
    wallpaper: "ridge",
    theme: "dark",
    size: "default",
    hidden: [],
    order: ids.slice(),
  };
  try {
    var old = JSON.parse(localStorage.getItem(storeKey));
    if (old) {
      if (["ridge", "peaks", "flat"].indexOf(old.wallpaper) >= 0)
        prefs.wallpaper = old.wallpaper;
      if (["dark", "light", "auto"].indexOf(old.theme) >= 0)
        prefs.theme = old.theme;
      if (old.size === "large") prefs.size = "large";
      if (Array.isArray(old.hidden))
        prefs.hidden = old.hidden.filter(function (id) {
          return ids.indexOf(id) >= 0 && id !== "settings" && id !== "apps";
        });
      if (Array.isArray(old.order)) {
        var clean = [];
        old.order.forEach(function (id) {
          if (ids.indexOf(id) >= 0 && clean.indexOf(id) < 0) clean.push(id);
        });
        prefs.order = clean.concat(
          ids.filter(function (id) {
            return clean.indexOf(id) < 0;
          }),
        );
      }
    }
  } catch (e) {}
  var rootRows = [
    ["picture", "Зображення"],
    ["sound", "Звук"],
    ["broadcast", "Трансляція"],
    ["general", "Загальні"],
    ["support", "Підтримка"],
    ["appearance", "Оформлення"],
  ];
  var definitions = {
    picture: {
      title: "Зображення",
      description:
        "Налаштуйте режим зображення, розмір і додаткові параметри телевізора.",
      symbol: "screen",
      rows: [
        "Режим зображення",
        "Налаштування розміру зображення",
        "Експертні налаштування",
      ],
    },
    sound: {
      title: "Звук",
      description: "Виберіть спосіб виведення звуку й параметри відтворення.",
      symbol: "speaker",
      rows: ["Виведення звуку", "Режим звуку", "Експертні налаштування"],
    },
    broadcast: {
      title: "Трансляція",
      description: "Налаштуйте телевізійні канали та приймання сигналу.",
      symbol: "screen",
      rows: [
        "Автоматичне налаштування",
        "Параметри каналів",
        "Експертні налаштування",
      ],
    },
    general: {
      title: "Загальні",
      description: "Мережа, зовнішні пристрої та інші параметри Samsung Tizen.",
      symbol: "gear",
      rows: [
        "Мережа",
        "Диспетчер зовнішніх пристроїв",
        "Економія енергії",
        "Спеціальні можливості",
      ],
    },
    support: {
      title: "Підтримка",
      description:
        "Відомості про телевізор і підготовка повернення до початкового стану.",
      symbol: "gear",
      rows: ["Про цей телевізор", "Бекап і відкат", "Відкрити Samsung Home"],
    },
  };
  function buttons(root) {
    return [].slice.call(root.querySelectorAll("button")).filter(function (b) {
      return !b.hidden && !b.disabled && b.offsetParent !== null;
    });
  }
  function clonePrefs() {
    return {
      wallpaper: prefs.wallpaper,
      theme: prefs.theme,
      size: prefs.size,
      hidden: prefs.hidden.slice(),
      order: prefs.order.slice(),
    };
  }
  function save(next) {
    try {
      localStorage.setItem(storeKey, JSON.stringify(next));
      prefs = next;
      applyClasses();
      return true;
    } catch (e) {
      dialog(
        "Не вдалося зберегти",
        "Браузер не дозволив запис. Попередні налаштування залишено.",
      );
      return false;
    }
  }
  function effectiveLight() {
    if (prefs.theme === "auto") {
      var h = Number(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/Kiev",
          hour: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
      return h >= 7 && h < 19;
    }
    return prefs.theme === "light";
  }
  function applyClasses() {
    stage.className = [
      prefs.wallpaper,
      effectiveLight() ? "light" : "dark",
      prefs.size === "large" ? "large" : "",
      view === "home" ? (gridView ? "home-grid" : "home-shelf") : "is-" + view,
      fullPreview ? "preview-full" : "",
      reorder ? "is-reordering" : "",
    ].join(" ");
  }
  function cols() {
    return prefs.size === "large" ? 5 : 6;
  }
  function sortedApps() {
    var order = reorder ? reorderDraft : prefs.order;
    return order
      .map(function (id) {
        return apps[ids.indexOf(id)];
      })
      .filter(function (a) {
        return prefs.hidden.indexOf(a.id) < 0;
      });
  }
  function notify(text) {
    clearTimeout(toastTimer);
    $("toast").textContent = text;
    $("toast").hidden = false;
    toastTimer = setTimeout(function () {
      $("toast").hidden = true;
    }, 2200);
  }
  function previewBrand(a) {
    if (a.id === "youtube")
      return '<img src="assets/icons/youtube.svg" alt=""><span>YouTube</span>';
    if (a.id === "netflix") return '<span class="brand-netflix">NETFLIX</span>';
    if (a.id === "megogo") return '<span class="brand-megogo">MEGOGO</span>';
    return "<span>" + a.name + "</span>";
  }
  function syncHome() {
    var a = sortedApps()[homeFocus];
    if (!a) return;
    gridView = homeFocus >= cols() || !a.preview;
    applyClasses();
    $("shelf-brand").innerHTML = a.preview ? previewBrand(a) : "";
    $("shelf-hint").hidden = gridView || fullPreview || reorder || !a.preview;
    $("status-pill").hidden = gridView || fullPreview || reorder;
    $("app-grid").hidden = fullPreview;
    $("dock-glass").hidden = fullPreview;
    $("reorder-hint").hidden = !reorder;
  }
  function drawHome() {
    var grid = $("app-grid");
    grid.textContent = "";
    sortedApps().forEach(function (a, i) {
      var b = document.createElement("button");
      b.className = "app-tile " + a.id;
      b.setAttribute("aria-label", a.name);
      b.setAttribute("data-app", a.id);
      b.innerHTML = a.html + '<span class="tile-label">' + a.name + "</span>";
      b.onfocus = function () {
        homeFocus = i;
        syncHome();
      };
      b.onclick = function () {
        if (reorder) commitReorder();
        else activate(a);
      };
      b.oncontextmenu = function (e) {
        e.preventDefault();
        homeFocus = i;
        startReorder();
      };
      grid.appendChild(b);
    });
  }
  function home() {
    view = "home";
    fullPreview = false;
    ["home", "settings", "editor"].forEach(function (id) {
      $(id).hidden = id !== "home";
    });
    drawHome();
    homeFocus = Math.min(homeFocus, sortedApps().length - 1);
    syncHome();
    buttons($("app-grid"))[homeFocus].focus();
  }
  function activate(a) {
    if (a.id === "settings") {
      openSettings();
      return;
    }
    if (a.id === "apps") {
      openEditor("home");
      return;
    }
    dialog(
      a.name,
      a.id === "hdmi"
        ? "Перемикання HDMI стане доступним після підключення телевізора. Зараз вхід не змінюється."
        : "Ця плитка відкриватиме встановлений на телевізорі застосунок.\nЗараз це локальний макет — запуск на ТВ не виконується.",
    );
  }
  function fullShelf() {
    var a = sortedApps()[homeFocus];
    if (!a || !a.preview || gridView) return;
    fullPreview = true;
    syncHome();
    $("home").tabIndex = -1;
    $("home").focus();
  }
  function startReorder() {
    if (
      view !== "home" ||
      fullPreview ||
      reorder ||
      !$("dialog").hidden ||
      !$("control").hidden
    )
      return;
    reorderApp = sortedApps()[homeFocus].id;
    reorderDraft = prefs.order.slice();
    reorder = true;
    drawHome();
    syncHome();
    buttons($("app-grid"))[homeFocus].focus();
  }
  function commitReorder() {
    var next = clonePrefs();
    next.order = reorderDraft.slice();
    if (save(next)) {
      reorder = false;
      home();
      notify("Розташування збережено");
    }
  }
  function cancelReorder() {
    reorder = false;
    reorderDraft = [];
    homeFocus = Math.max(
      0,
      sortedApps()
        .map(function (a) {
          return a.id;
        })
        .indexOf(reorderApp),
    );
    reorderApp = null;
    home();
  }
  function moveReorder(target) {
    var visible = sortedApps();
    if (target < 0 || target >= visible.length || target === homeFocus) return;
    var a = reorderDraft.indexOf(visible[homeFocus].id),
      b = reorderDraft.indexOf(visible[target].id),
      t = reorderDraft[a];
    reorderDraft[a] = reorderDraft[b];
    reorderDraft[b] = t;
    homeFocus = target;
    drawHome();
    syncHome();
    buttons($("app-grid"))[homeFocus].focus();
  }
  function symbol(name) {
    if (name === "screen")
      return '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="8" y="16" width="84" height="58" rx="4"/><path d="M35 87H65M50 74V87"/></svg>';
    if (name === "speaker")
      return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M12 38H30L55 18V82L30 62H12Z M68 32Q88 50 68 68 M78 18Q110 50 78 82"/></svg>';
    return gear;
  }
  function row(label, value, action) {
    return { label: label, value: value || "", action: action };
  }
  function nativeAction(label) {
    dialog(
      label,
      "Ця дія потребує підключення до телевізора та перевірки підтримки.\nСистемні параметри не змінюються.",
    );
  }
  function getSettings() {
    var d = {
      title: "Налаштування",
      description: "Параметри вашого телевізора Samsung Tizen.",
      symbol: "gear",
      section: "",
      note: "",
      rows: [],
    };
    if (page === "root") {
      d.rows = rootRows.map(function (r) {
        return row(r[1], "›", function () {
          goPage(r[0]);
        });
      });
      return d;
    }
    if (definitions[page]) {
      var def = definitions[page];
      d.title = def.title;
      d.description = def.description;
      d.symbol = def.symbol;
      d.section = "SAMSUNG TIZEN";
      d.note = "Пункти та їхню доступність перевіримо на телевізорі.";
      d.rows = def.rows.map(function (label, i) {
        return row(label, "›", function () {
          if (page === "support" && i === 0)
            dialog(
              "Про цей телевізор",
              "Samsung QE55Q77AATXXH\nT-NKM2DEUC-2301.1\n\nВідомості з вашого фото. Живе підключення не встановлено.",
            );
          else if (page === "support" && i === 1)
            dialog(
              "Бекап і відкат",
              "Бекап телевізора ще не створено.\n\nПеред системними змінами збережемо початкові значення й доступні дані на Mac та перевіримо відновлення Samsung Home. Можливість повного образу та копіювання авторизацій ще не підтверджено.",
            );
          else nativeAction(label);
        });
      });
      return d;
    }
    d.title = "Оформлення";
    d.description = "Налаштуйте вигляд домашнього екрана та меню.";
    d.section = "ДОМАШНІЙ ЕКРАН";
    if (page === "appearance") {
      d.rows = [
        row(
          "Вигляд",
          { dark: "Темний", light: "Світлий", auto: "Автоматично" }[
            prefs.theme
          ],
          function () {
            goPage("theme");
          },
        ),
        row(
          "Розмір елементів",
          prefs.size === "large" ? "Великі" : "Стандартні",
          function () {
            goPage("size");
          },
        ),
        row(
          "Фон прев’ю",
          { ridge: "Сонячні хребти", peaks: "Сині вершини", flat: "Без фото" }[
            prefs.wallpaper
          ],
          function () {
            goPage("wallpaper");
          },
        ),
        row("Застосунки на головній", "›", function () {
          openEditor("settings");
        }),
      ];
      d.note = "Зміни оформлення зберігаються лише в цьому браузері.";
      return d;
    }
    var field =
      page === "theme" ? "theme" : page === "size" ? "size" : "wallpaper";
    var options =
      page === "theme"
        ? [
            ["light", "Світлий"],
            ["dark", "Темний"],
            ["auto", "Автоматично"],
          ]
        : page === "size"
          ? [
              ["default", "Стандартні"],
              ["large", "Великі"],
            ]
          : [
              ["ridge", "Сонячні хребти"],
              ["peaks", "Сині вершини"],
              ["flat", "Без фото"],
            ];
    d.title =
      page === "theme"
        ? "Вигляд"
        : page === "size"
          ? "Розмір елементів"
          : "Фон прев’ю";
    d.section = "";
    d.description =
      page === "size"
        ? "Стандартний розмір — шість плиток у ряд. Великі елементи — п’ять."
        : page === "theme"
          ? "Автоматичний режим змінює тему залежно від часу доби."
          : "Приклад фону для локального прев’ю. Це не рекомендації чи історія з ваших застосунків.";
    d.rows = options.map(function (o) {
      return row(o[1], prefs[field] === o[0] ? "✓" : "", function () {
        var next = clonePrefs();
        next[field] = o[0];
        if (save(next)) renderSettings();
      });
    });
    return d;
  }
  function renderSettings() {
    var d = getSettings();
    $("settings-title").textContent = d.title;
    $("settings-description").textContent = d.description;
    $("settings-icon").innerHTML = symbol(d.symbol);
    $("settings-section").textContent = d.section;
    $("settings-note").textContent = d.note;
    var root = $("setting-rows");
    root.textContent = "";
    d.rows.forEach(function (r, i) {
      var b = document.createElement("button");
      b.className = "setting-row";
      var label = document.createElement("span"),
        value = document.createElement("span");
      label.textContent = r.label;
      value.className = "row-value" + (r.value === "›" ? " chevron" : "");
      value.textContent = r.value;
      b.appendChild(label);
      b.appendChild(value);
      b.onfocus = function () {
        pageFocus[page] = i;
      };
      b.onclick = r.action;
      root.appendChild(b);
    });
    applyClasses();
    var all = buttons(root);
    all[Math.min(pageFocus[page] || 0, all.length - 1)].focus();
  }
  function goPage(target) {
    page = target;
    renderSettings();
  }
  function openSettings() {
    reorder = false;
    fullPreview = false;
    $("control").hidden = true;
    view = "settings";
    ["home", "settings", "editor"].forEach(function (id) {
      $(id).hidden = id !== "settings";
    });
    page = "root";
    renderSettings();
  }
  function openEditor(from) {
    editorReturn = from;
    view = "editor";
    ["home", "settings", "editor"].forEach(function (id) {
      $(id).hidden = id !== "editor";
    });
    applyClasses();
    drawEditor();
    buttons($("editor-grid"))[0].focus();
  }
  function drawEditor() {
    var root = $("editor-grid");
    root.textContent = "";
    apps
      .filter(function (a) {
        return a.id !== "settings" && a.id !== "apps";
      })
      .forEach(function (a, i) {
        var shown = prefs.hidden.indexOf(a.id) < 0,
          b = document.createElement("button");
        b.className = "editor-app";
        b.setAttribute("aria-pressed", shown ? "true" : "false");
        var label = document.createElement("span"),
          check = document.createElement("span");
        label.textContent = a.name;
        check.textContent = shown ? "✓" : "＋";
        b.appendChild(label);
        b.appendChild(check);
        b.onclick = function () {
          var next = clonePrefs(),
            at = next.hidden.indexOf(a.id);
          if (at < 0) next.hidden.push(a.id);
          else next.hidden.splice(at, 1);
          if (save(next)) {
            drawEditor();
            buttons(root)[i].focus();
          }
        };
        root.appendChild(b);
      });
  }
  function closeEditor() {
    if (editorReturn === "home") home();
    else {
      view = "settings";
      $("editor").hidden = true;
      $("settings").hidden = false;
      page = "appearance";
      renderSettings();
    }
  }
  function dialog(title, copy) {
    modalReturn = document.activeElement;
    $("dialog-title").textContent = title;
    $("dialog-copy").textContent = copy;
    $("dialog").hidden = false;
    $("dialog-close").focus();
  }
  function closeDialog() {
    $("dialog").hidden = true;
    if (modalReturn && document.body.contains(modalReturn)) modalReturn.focus();
    else if (view === "home") home();
    else if (view === "settings") renderSettings();
    else buttons($("editor-grid"))[0].focus();
  }
  function openControl() {
    if (reorder) return;
    $("control").hidden = false;
    $("control-power").focus();
  }
  function closeControl() {
    $("control").hidden = true;
    $("status-pill").hidden = false;
    $("status-pill").focus();
  }
  function back() {
    if (!$("dialog").hidden) {
      closeDialog();
      return;
    }
    if (!$("control").hidden) {
      closeControl();
      return;
    }
    if (view === "editor") {
      closeEditor();
      return;
    }
    if (view === "settings") {
      if (page === "root") home();
      else
        goPage(
          ["theme", "size", "wallpaper"].indexOf(page) >= 0
            ? "appearance"
            : "root",
        );
      return;
    }
    if (reorder) {
      cancelReorder();
      return;
    }
    if (fullPreview) {
      fullPreview = false;
      syncHome();
      buttons($("app-grid"))[homeFocus].focus();
      return;
    }
    if (gridView) {
      homeFocus = 0;
      home();
      return;
    }
    dialog(
      "Samsung Home",
      "У підключеній версії тут буде перехід до оригінального Samsung Home.\nЗараз телевізор не підключено.",
    );
  }
  function step(list, amount) {
    if (!list.length) return;
    var i = list.indexOf(document.activeElement);
    list[Math.max(0, Math.min(list.length - 1, i + amount))].focus();
  }
  function arrow(key) {
    if (!$("dialog").hidden) {
      $("dialog-close").focus();
      return;
    }
    if (!$("control").hidden) {
      step(
        buttons($("control")),
        key === "ArrowUp" || key === "ArrowLeft" ? -1 : 1,
      );
      return;
    }
    if (view === "settings") {
      if (key === "ArrowLeft") {
        back();
        return;
      }
      if (document.activeElement === $("back-settings")) {
        buttons($("setting-rows"))[0].focus();
        return;
      }
      if (key === "ArrowUp" || key === "ArrowDown")
        step(buttons($("setting-rows")), key === "ArrowUp" ? -1 : 1);
      else if (key === "ArrowRight") document.activeElement.click();
      return;
    }
    if (view === "editor") {
      step(
        buttons($("editor-grid")),
        key === "ArrowUp"
          ? -3
          : key === "ArrowDown"
            ? 3
            : key === "ArrowLeft"
              ? -1
              : 1,
      );
      return;
    }
    if (fullPreview) {
      if (key === "ArrowDown") back();
      return;
    }
    var list = buttons($("app-grid")),
      i = list.indexOf(document.activeElement),
      c = cols();
    if (i < 0) {
      if (key === "ArrowDown") list[homeFocus].focus();
      else if (document.activeElement === $("shelf-hint") && key === "ArrowUp")
        fullShelf();
      return;
    }
    var target = i;
    if (key === "ArrowLeft" && i % c > 0) target--;
    if (key === "ArrowRight" && i % c < c - 1 && i + 1 < list.length) target++;
    if (key === "ArrowDown" && i + c < list.length) target += c;
    if (key === "ArrowUp") {
      if (i >= c) target -= c;
      else if (!reorder) {
        if (sortedApps()[i].preview) fullShelf();
        return;
      }
    }
    if (reorder) moveReorder(target);
    else list[target].focus();
  }
  function keyName(e) {
    return (
      e.key ||
      {
        13: "Enter",
        27: "Escape",
        37: "ArrowLeft",
        38: "ArrowUp",
        39: "ArrowRight",
        40: "ArrowDown",
        10009: "Escape",
      }[e.keyCode]
    );
  }
  document.addEventListener("keydown", function (e) {
    if (!stage.contains(document.activeElement)) return;
    var k = keyName(e);
    if (k === "Escape" || k === "Backspace") {
      e.preventDefault();
      clearTimeout(enterTimer);
      enterTimer = 0;
      if (!e.repeat) back();
      return;
    }
    if (k && k.indexOf("Arrow") === 0) {
      e.preventDefault();
      arrow(k);
      return;
    }
    if (k === "Enter") {
      e.preventDefault();
      if (e.repeat) return;
      var b = document.activeElement;
      if (
        view === "home" &&
        !reorder &&
        !fullPreview &&
        $("dialog").hidden &&
        $("control").hidden &&
        b.classList.contains("app-tile")
      ) {
        enterTimer = setTimeout(function () {
          enterTimer = 0;
          startReorder();
        }, 550);
      } else if (b && b.click) b.click();
      return;
    }
    if (k === "Tab") {
      e.preventDefault();
      var root = !$("dialog").hidden
        ? $("dialog")
        : !$("control").hidden
          ? $("control")
          : $(view);
      step(buttons(root), e.shiftKey ? -1 : 1);
    }
  });
  document.addEventListener("keyup", function (e) {
    if (keyName(e) !== "Enter") return;
    if (enterTimer) {
      clearTimeout(enterTimer);
      enterTimer = 0;
      if (document.activeElement && document.activeElement.click)
        document.activeElement.click();
    }
  });
  window.addEventListener("blur", function () {
    clearTimeout(enterTimer);
    enterTimer = 0;
  });
  $("dialog-close").onclick = closeDialog;
  $("shelf-hint").onclick = fullShelf;
  $("status-pill").onclick = openControl;
  $("back-settings").onclick = back;
  $("back-editor").onclick = closeEditor;
  $("control-power").onclick = function () {
    nativeAction("Вимкнути телевізор");
  };
  $("control-network").onclick = function () {
    nativeAction("Мережа");
  };
  $("control-settings").onclick = openSettings;
  $("control-home").onclick = function () {
    nativeAction("Samsung Home");
  };
  $("preview-home").onclick = function () {
    if (reorder) reorder = false;
    $("control").hidden = true;
    $("dialog").hidden = true;
    homeFocus = 0;
    home();
  };
  $("preview-grid").onclick = function () {
    reorder = false;
    $("control").hidden = true;
    $("dialog").hidden = true;
    homeFocus = Math.min(cols(), sortedApps().length - 1);
    home();
  };
  $("preview-settings").onclick = function () {
    $("dialog").hidden = true;
    openSettings();
  };
  function resize() {
    var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.transform = "scale(" + s + ")";
    stage.style.left = (window.innerWidth - 1920 * s) / 2 + "px";
    stage.style.top = (window.innerHeight - 1080 * s) / 2 + "px";
  }
  function clock() {
    var d = new Date(),
      text;
    try {
      text = new Intl.DateTimeFormat("uk-UA", {
        timeZone: "Europe/Kiev",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(d);
    } catch (e) {
      var h = d.getHours(),
        m = d.getMinutes();
      text = (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
    }
    [].forEach.call(document.querySelectorAll(".clock"), function (t) {
      t.textContent = text;
    });
  }
  window.addEventListener("resize", resize);
  resize();
  clock();
  setInterval(clock, 30000);
  home();
})();
