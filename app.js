(function () {
  "use strict";

  var STORAGE_KEY = "linkhub-data-v1";
  var THEME_KEY = "linkhub-theme";
  var BACKUP_KEY = "linkhub-last-backup";

  var FOLDER_PALETTE = [
    "#8b5cf6", "#06b6d4", "#10b981", "#f97316", "#ec4899",
    "#f59e0b", "#3b82f6", "#a78bfa", "#22d3ee", "#34d399",
    "#fb923c", "#f472b6", "#facc15", "#60a5fa"
  ];

  var EMOJI_CHOICES = [
    "📁", "📚", "🔖", "⭐", "💼", "🎨", "🎵", "🎬",
    "🛠️", "💡", "🚀", "🧠", "📝", "🌐", "🔬", "🏠",
    "🎮", "📸", "🍳", "✈️", "💰", "🏥", "📰", "🎓"
  ];

  // Standardized SVG icon library — one source of truth
  var ICONS = {
    search:    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    close:     '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    plus:      '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    folder:    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/></svg>',
    folderPlus:'<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/><path d="M12 11v6M9 14h6"/></svg>',
    folderAll: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/><path d="M7 12h10M7 16h6"/></svg>',
    star:      '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.6 5.6L20 9.5l-4 4 1 6-5-2.7L7 19.5l1-6-4-4 5.4-.9L12 3Z"/></svg>',
    starFill:  '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.6 5.6L20 9.5l-4 4 1 6-5-2.7L7 19.5l1-6-4-4 5.4-.9L12 3Z" fill="currentColor"/></svg>',
    edit:      '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    trash:     '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>',
    download:  '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>',
    upload:    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21V9M7 14l5-5 5 5"/><path d="M5 3h14"/></svg>',
    eye:       '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
    moon:      '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
    sun:       '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
    help:      '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.6 2.25C12.4 11.7 12 12.3 12 13"/><circle cx="12" cy="16.5" r="0.6" fill="currentColor" stroke="none"/></svg>',
    menu:      '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    clock:     '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    link:      '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7 0l4-4a5 5 0 1 0-7-7L13 3"/><path d="M14 11a5 5 0 0 0-7 0l-4 4a5 5 0 1 0 7 7l1-1"/></svg>',
    tag:       '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12 12 4H4v8l8 8 8-8Z"/><circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none"/></svg>',
    inbox:     '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/><path d="M8 13h8M8 16h5"/></svg>'
  };

  // Weather icon set — minimal lucide-style glyphs colored by .weather-icon.<class>
  var WEATHER_ICONS = {
    sun:      '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></svg>',
    moon:     '<svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
    cloudSun: '<svg viewBox="0 0 24 24"><circle cx="8" cy="8" r="3"/><path d="M8 2v1.5M8 12.5V14M2 8h1.5M12.5 8H14M3.8 3.8l1.1 1.1M11.1 11.1l1.1 1.1M3.8 12.2l1.1-1.1M11.1 4.9l1.1-1.1"/><path d="M16 19a4 4 0 0 0 0-8 5 5 0 0 0-9.7-1.5"/><path d="M5 19h11"/></svg>',
    cloud:    '<svg viewBox="0 0 24 24"><path d="M17 19a4 4 0 0 0 0-8 6 6 0 0 0-11.7 1.5A4.5 4.5 0 0 0 6 19h11Z"/></svg>',
    fog:      '<svg viewBox="0 0 24 24"><path d="M5 9h14M3 13h18M5 17h14"/></svg>',
    drizzle:  '<svg viewBox="0 0 24 24"><path d="M17 14a4 4 0 0 0 0-8 6 6 0 0 0-11.7 1.5A4.5 4.5 0 0 0 6 14"/><path d="M9 17v2M13 17v2M17 17v2"/></svg>',
    rain:     '<svg viewBox="0 0 24 24"><path d="M17 14a4 4 0 0 0 0-8 6 6 0 0 0-11.7 1.5A4.5 4.5 0 0 0 6 14"/><path d="m9 17-1 4M14 17l-1 4M19 17l-1 4"/></svg>',
    snow:     '<svg viewBox="0 0 24 24"><path d="M17 14a4 4 0 0 0 0-8 6 6 0 0 0-11.7 1.5A4.5 4.5 0 0 0 6 14"/><path d="M9 18h.01M13 19h.01M17 18h.01M11 21h.01M15 21h.01"/></svg>',
    thunder:  '<svg viewBox="0 0 24 24"><path d="M17 14a4 4 0 0 0 0-8 6 6 0 0 0-11.7 1.5A4.5 4.5 0 0 0 6 14"/><path d="m13 13-3 5h3l-2 4"/></svg>'
  };

  // WMO weather codes → icon + label + color class
  function weatherInfo(code, isDay) {
    var c = Number(code);
    if (c === 0)               return { icon: isDay ? "sun" : "moon",  label: isDay ? "Clear" : "Clear night", cls: "sunny"   };
    if (c === 1 || c === 2)    return { icon: "cloudSun",               label: "Partly cloudy",                  cls: "cloudy"  };
    if (c === 3)               return { icon: "cloud",                  label: "Overcast",                       cls: "cloudy"  };
    if (c === 45 || c === 48)  return { icon: "fog",                    label: "Foggy",                          cls: "cloudy"  };
    if (c >= 51 && c <= 57)    return { icon: "drizzle",                label: "Drizzle",                        cls: "rainy"   };
    if (c >= 61 && c <= 67)    return { icon: "rain",                   label: "Rainy",                          cls: "rainy"   };
    if (c >= 71 && c <= 77)    return { icon: "snow",                   label: "Snow",                           cls: "snowy"   };
    if (c >= 80 && c <= 82)    return { icon: "rain",                   label: "Showers",                        cls: "rainy"   };
    if (c === 85 || c === 86)  return { icon: "snow",                   label: "Snow showers",                   cls: "snowy"   };
    if (c >= 95)               return { icon: "thunder",                label: "Thunderstorm",                   cls: "thunder" };
    return                            { icon: "cloudSun",               label: "—",                              cls: "cloudy"  };
  }

  function uid() {
    return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9);
  }

  function hashString(str) {
    var h = 0;
    for (var i = 0; i < (str || "").length; i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }

  function colorForString(str) {
    var hue = hashString(str) % 360;
    return "hsl(" + hue + ", 62%, 58%)";
  }

  // Tag palette index (0-7) — finite, harmonious set instead of random hue per tag
  function tagColorIndex(tag) {
    return hashString(tag) % 8;
  }

  function timeAgo(ts) {
    if (!ts) return "";
    var diff = Math.max(0, Date.now() - ts);
    var s = Math.floor(diff / 1000);
    if (s < 60) return "just now";
    var m = Math.floor(s / 60);
    if (m < 60) return m + "m ago";
    var h = Math.floor(m / 60);
    if (h < 24) return h + "h ago";
    var d = Math.floor(h / 24);
    if (d < 7) return d + "d ago";
    var w = Math.floor(d / 7);
    if (w < 5) return w + "w ago";
    var mo = Math.floor(d / 30);
    if (mo < 12) return mo + "mo ago";
    var y = Math.floor(d / 365);
    return y + "y ago";
  }

  function getDomain(url) {
    try {
      var u = new URL(url);
      return u.hostname.replace(/^www\./, "");
    } catch (e) {
      var m = String(url).match(/^([a-zA-Z]+:\/\/)?([^/?#]+)/);
      return m ? m[2] : "";
    }
  }

  function faviconUrl(url) {
    var domain = getDomain(url);
    if (!domain || /^[a-zA-Z]:\\/.test(url) || /^file:/i.test(url)) return "";
    return "https://www.google.com/s2/favicons?domain=" + encodeURIComponent(domain) + "&sz=64";
  }

  function fallbackLetter(link) {
    var src = (link.title || link.url || "?").trim();
    src = src.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
    return (src.charAt(0) || "?").toUpperCase();
  }

  function getGreetingPrefix() {
    var h = new Date().getHours();
    if (h < 5)  return { en: "Working late", hi: "देर रात" };
    if (h < 12) return { en: "Good morning", hi: "सुप्रभात" };
    if (h < 17) return { en: "Good afternoon", hi: "नमस्ते" };
    if (h < 21) return { en: "Good evening", hi: "शुभ संध्या" };
    return { en: "Good night", hi: "शुभ रात्रि" };
  }

  function defaultState() {
    return {
      version: 2,
      folders: [
        { id: "default", name: "General", parentId: null, order: 0, color: "#8b5cf6", emoji: "" }
      ],
      links: []
    };
  }

  function normalizeState(data) {
    var fallback = defaultState();
    if (!data || typeof data !== "object") data = fallback;
    if (!data.folders || !Array.isArray(data.folders)) data.folders = fallback.folders;
    if (!data.links || !Array.isArray(data.links)) data.links = [];

    var seen = {};
    for (var i = 0; i < data.folders.length; i++) {
      var f = data.folders[i];
      if (!f.id) f.id = uid();
      if (!f.name) f.name = "Untitled";
      f.parentId = f.parentId || null;
      if (typeof f.order !== "number") f.order = i;
      if (!f.color) f.color = FOLDER_PALETTE[hashString(f.id) % FOLDER_PALETTE.length];
      if (typeof f.emoji !== "string") f.emoji = "";
      seen[f.id] = true;
    }
    for (var li = 0; li < data.links.length; li++) {
      var lk = data.links[li];
      if (!lk.id) lk.id = uid();
      if (typeof lk.clickCount !== "number") lk.clickCount = 0;
      if (typeof lk.lastOpenedAt !== "number") lk.lastOpenedAt = 0;
      if (typeof lk.createdAt !== "number") lk.createdAt = Date.now();
      if (!Array.isArray(lk.tags)) lk.tags = [];
    }
    for (var j = 0; j < data.folders.length; j++) {
      if (data.folders[j].parentId && !seen[data.folders[j].parentId]) {
        data.folders[j].parentId = null;
      }
    }
    for (var k = 0; k < data.folders.length; k++) {
      var currentId = data.folders[k].parentId;
      var chain = {};
      while (currentId) {
        if (currentId === data.folders[k].id || chain[currentId]) {
          data.folders[k].parentId = null;
          break;
        }
        chain[currentId] = true;
        var parent = null;
        for (var p = 0; p < data.folders.length; p++) {
          if (data.folders[p].id === currentId) { parent = data.folders[p]; break; }
        }
        currentId = parent ? parent.parentId : null;
      }
    }
    return data;
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      return normalizeState(JSON.parse(raw));
    } catch (e) {
      return defaultState();
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  var state = loadState();
  var selectedFolderId = "all";
  var selectedSmartId = null;
  var expandedFolderIds = {};
  var editingLinkId = null;
  var lastDeletedLink = null;
  var lastDeletedFolder = null;
  var contextFolderId = null;
  var clockInterval = null;

  var el = {
    folderList:      document.getElementById("folderList"),
    linkGrid:        document.getElementById("linkGrid"),
    favoritesGrid:   document.getElementById("favoritesGrid"),
    favoritesBlock:  document.getElementById("favoritesBlock"),
    emptyState:      document.getElementById("emptyState"),
    searchInput:     document.getElementById("searchInput"),
    currentFolderLabel: document.getElementById("currentFolderLabel"),
    modalOverlay:    document.getElementById("modalOverlay"),
    modalTitle:      document.getElementById("modalTitle"),
    linkTitle:       document.getElementById("linkTitle"),
    linkUrl:         document.getElementById("linkUrl"),
    linkFolder:      document.getElementById("linkFolder"),
    linkTags:        document.getElementById("linkTags"),
    linkFavorite:    document.getElementById("linkFavorite"),
    folderModalOverlay: document.getElementById("folderModalOverlay"),
    folderName:      document.getElementById("folderName"),
    folderParent:    document.getElementById("folderParent"),
    folderParentPicker: document.getElementById("folderParentPicker"),
    folderParentPickerTrigger: document.getElementById("folderParentPickerTrigger"),
    folderParentPickerMenu: document.getElementById("folderParentPickerMenu"),
    folderParentPreview: document.getElementById("folderParentPreview"),
    sidebar:         document.getElementById("sidebar"),
    sidebarBackdrop: document.getElementById("sidebarBackdrop"),
    btnMenu:         document.getElementById("btnMenu"),
    importFile:      document.getElementById("importFile"),
    emptyImportFile: document.getElementById("emptyImportFile"),
    btnEmptyAdd:     document.getElementById("btnEmptyAdd"),
    heroTitle:       document.getElementById("heroTitle"),
    heroGreetingText:document.getElementById("heroGreetingText"),
    heroStats:       document.getElementById("heroStats"),
    heroWeather:     document.getElementById("heroWeather"),
    weatherIcon:     document.getElementById("weatherIcon"),
    weatherTemp:     document.getElementById("weatherTemp"),
    weatherCondition:document.getElementById("weatherCondition"),
    weatherMeta:     document.getElementById("weatherMeta"),
    weatherChange:   document.getElementById("weatherChange"),
    smartFolders:    document.getElementById("smartFolders"),
    footerLinks:     document.getElementById("footerLinks"),
    footerFolders:   document.getElementById("footerFolders"),
    footerBackup:    document.getElementById("footerBackup"),
    toastStack:      document.getElementById("toastStack"),
    confirmOverlay:  document.getElementById("confirmOverlay"),
    confirmTitle:    document.getElementById("confirmTitle"),
    confirmBody:     document.getElementById("confirmBody"),
    confirmOk:       document.getElementById("confirmOk"),
    confirmCancel:   document.getElementById("confirmCancel"),
    helpOverlay:     document.getElementById("helpOverlay"),
    helpClose:       document.getElementById("helpClose"),
    btnHelp:         document.getElementById("btnHelp"),
    btnTheme:        document.getElementById("btnTheme"),
    folderContextMenu: document.getElementById("folderContextMenu"),
    dropOverlay:     document.getElementById("dropOverlay")
  };

  /* ---------- Folder helpers ---------- */
  function sortedFolders() {
    return state.folders.slice().sort(function (a, b) {
      return (a.order || 0) - (b.order || 0) || (a.name || "").localeCompare(b.name || "");
    });
  }

  function childFolders(parentId) {
    return sortedFolders().filter(function (f) {
      return (f.parentId || null) === (parentId || null);
    });
  }

  function hasChildFolders(folderId) {
    return childFolders(folderId).length > 0;
  }

  function flattenFolders(parentId, level, out) {
    var children = childFolders(parentId);
    for (var i = 0; i < children.length; i++) {
      out.push({ folder: children[i], level: level });
      flattenFolders(children[i].id, level + 1, out);
    }
    return out;
  }

  function isFolderExpanded(folderId) {
    return !!expandedFolderIds[folderId];
  }

  function flattenVisibleFolders(parentId, level, out) {
    var children = childFolders(parentId);
    for (var i = 0; i < children.length; i++) {
      out.push({ folder: children[i], level: level });
      if (isFolderExpanded(children[i].id)) {
        flattenVisibleFolders(children[i].id, level + 1, out);
      }
    }
    return out;
  }

  function expandFolderPath(folderId) {
    var current = folderById(folderId);
    var guard = 0;
    while (current && current.parentId && guard < state.folders.length) {
      expandedFolderIds[current.parentId] = true;
      current = folderById(current.parentId);
      guard++;
    }
  }

  function folderPath(folderId) {
    var names = [];
    var current = folderById(folderId);
    var guard = 0;
    while (current && guard < state.folders.length) {
      names.unshift(current.name);
      current = current.parentId ? folderById(current.parentId) : null;
      guard++;
    }
    return names.join(" / ");
  }

  function folderOptionLabel(folderInfo) {
    var prefix = new Array(folderInfo.level + 1).join("   ");
    var marker = folderInfo.level > 0 ? "↳ " : "";
    var suffix = hasChildFolders(folderInfo.folder.id) ? "  + subfolders" : "";
    return prefix + marker + folderInfo.folder.name + suffix;
  }

  function folderAndDescendantIds(folderId) {
    var ids = [folderId];
    for (var i = 0; i < ids.length; i++) {
      var children = childFolders(ids[i]);
      for (var j = 0; j < children.length; j++) ids.push(children[j].id);
    }
    return ids;
  }

  function folderById(id) {
    for (var i = 0; i < state.folders.length; i++) {
      if (state.folders[i].id === id) return state.folders[i];
    }
    return null;
  }

  function linkCountInFolderTree(folderId) {
    var ids = folderAndDescendantIds(folderId);
    var n = 0;
    for (var i = 0; i < state.links.length; i++) {
      if (ids.indexOf(state.links[i].folderId) !== -1) n++;
    }
    return n;
  }

  function linkIsInSelectedFolder(link) {
    if (selectedFolderId === "all") return true;
    return folderAndDescendantIds(selectedFolderId).indexOf(link.folderId) !== -1;
  }

  function normalizeTags(str) {
    if (!str || typeof str !== "string") return [];
    return str.split(",").map(function (t) { return t.trim(); }).filter(Boolean);
  }

  function matchesSearch(link, q) {
    if (!q) return true;
    var lower = q.toLowerCase();
    var folder = folderById(link.folderId);
    var folderName = folder ? folder.name : "";
    var tags = (link.tags || []).join(" ");
    var hay = (link.title + " " + link.url + " " + tags + " " + folderName).toLowerCase();
    return hay.indexOf(lower) !== -1;
  }

  function windowsPathToFileUrl(path) {
    var p = String(path).trim();
    if (!p) return "";
    p = p.replace(/^file:\/\//i, "");
    p = p.replace(/\\/g, "/");
    if (p.indexOf("|") !== -1) return "";
    if (/^[a-zA-Z]:\//.test(p)) {
      return "file:///" + encodeURI(p.replace(/^\/+/, ""));
    }
    if (p.indexOf("/") === 0) {
      return "file://" + encodeURI(p);
    }
    return "";
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function escapeAttr(s) {
    return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }

  /* ---------- Toasts ---------- */
  var TOAST_ICONS = {
    success: '<svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>',
    error:   '<svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8v5M12 17h.01"/><circle cx="12" cy="12" r="9"/></svg>',
    info:    '<svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8h.01M11 12h1v5h1"/><circle cx="12" cy="12" r="9"/></svg>'
  };

  function toast(message, opts) {
    opts = opts || {};
    var type = opts.type || "info";
    var duration = opts.duration != null ? opts.duration : 4500;
    var node = document.createElement("div");
    node.className = "toast " + type;
    node.style.setProperty("--toast-duration", duration + "ms");

    var content = '<div class="toast-icon">' + (TOAST_ICONS[type] || TOAST_ICONS.info) + "</div>";
    content += '<div class="toast-message">';
    if (opts.title) content += "<strong>" + escapeHtml(opts.title) + "</strong>";
    content += "<span>" + escapeHtml(message) + "</span>";
    if (opts.subtext) content += "<small>" + escapeHtml(opts.subtext) + "</small>";
    content += "</div>";
    if (opts.actionLabel) {
      content += '<button type="button" class="toast-action">' + escapeHtml(opts.actionLabel) + "</button>";
    }
    content += '<button type="button" class="toast-close" aria-label="Dismiss">' + ICONS.close + "</button>";
    if (duration > 0) content += '<div class="toast-progress"></div>';
    node.innerHTML = content;
    el.toastStack.appendChild(node);

    var dismissed = false;
    function dismiss() {
      if (dismissed) return;
      dismissed = true;
      node.classList.add("leaving");
      setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 250);
    }

    var actionBtn = node.querySelector(".toast-action");
    if (actionBtn) {
      actionBtn.addEventListener("click", function () {
        if (typeof opts.onAction === "function") opts.onAction();
        dismiss();
      });
    }
    node.querySelector(".toast-close").addEventListener("click", dismiss);
    if (duration > 0) setTimeout(dismiss, duration);
    return dismiss;
  }

  /* ---------- Custom Prompt ---------- */
  // Resolve values:
  //   string  → user submitted this value
  //   ""      → user submitted intentionally blank (only when allowEmpty: true)
  //   null    → cancelled
  function customPrompt(opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var overlay = document.createElement("div");
      overlay.className = "overlay open";
      overlay.style.zIndex = "150";
      var placeholderAttr = opts.placeholder ? ' placeholder="' + escapeAttr(opts.placeholder) + '"' : "";
      overlay.innerHTML =
        '<div class="modal" style="max-width:420px">' +
          '<div class="modal-header"><h2>' + escapeHtml(opts.title || "Edit") + "</h2></div>" +
          '<div class="modal-body">' +
            '<div class="field">' +
              (opts.label ? "<label>" + escapeHtml(opts.label) + "</label>" : "") +
              '<input type="text" id="__promptInput" maxlength="120"' + placeholderAttr + " />" +
              (opts.hint ? '<small class="hint">' + escapeHtml(opts.hint) + "</small>" : "") +
            "</div>" +
          "</div>" +
          '<div class="modal-footer">' +
            '<button type="button" class="btn" data-act="cancel">Cancel</button>' +
            '<button type="button" class="btn btn-primary" data-act="ok">' + escapeHtml(opts.okLabel || "Save") + "</button>" +
          "</div>" +
        "</div>";
      document.body.appendChild(overlay);
      var input = overlay.querySelector("#__promptInput");
      input.value = opts.value || "";
      setTimeout(function () { input.focus(); input.select(); }, 30);

      function submit() {
        var v = input.value.trim();
        if (!v && !opts.allowEmpty) { close(null); return; }
        close(opts.allowEmpty ? v : (v || null));
      }
      function close(val) {
        document.body.removeChild(overlay);
        resolve(val);
      }
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) close(null);
      });
      overlay.querySelector('[data-act="cancel"]').addEventListener("click", function () { close(null); });
      overlay.querySelector('[data-act="ok"]').addEventListener("click", submit);
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); submit(); }
        if (e.key === "Escape") { e.preventDefault(); close(null); }
      });
    });
  }

  /* ---------- Custom Confirm ---------- */
  var pendingConfirm = null;

  function customConfirm(opts) {
    opts = opts || {};
    el.confirmTitle.textContent = opts.title || "Are you sure?";
    el.confirmBody.textContent = opts.body || "This action cannot be undone.";
    el.confirmOk.textContent = opts.okLabel || "Delete";
    el.confirmOk.className = "btn " + (opts.okClass || "btn-danger");
    el.confirmCancel.textContent = opts.cancelLabel || "Cancel";
    el.confirmOverlay.classList.add("open");
    setTimeout(function () { el.confirmOk.focus(); }, 30);
    return new Promise(function (resolve) {
      pendingConfirm = resolve;
    });
  }

  function resolveConfirm(value) {
    el.confirmOverlay.classList.remove("open");
    if (pendingConfirm) {
      var r = pendingConfirm;
      pendingConfirm = null;
      r(value);
    }
  }

  /* ---------- Click tracking ---------- */
  function recordOpen(linkId) {
    for (var i = 0; i < state.links.length; i++) {
      if (state.links[i].id === linkId) {
        state.links[i].clickCount = (state.links[i].clickCount || 0) + 1;
        state.links[i].lastOpenedAt = Date.now();
        saveState(state);
        scheduleRender();
        break;
      }
    }
  }

  var renderScheduled = false;
  function scheduleRender() {
    if (renderScheduled) return;
    renderScheduled = true;
    requestAnimationFrame(function () {
      renderScheduled = false;
      renderLinks();
      renderSmartFolders();
      renderSidebarFooter();
      renderHeroStats();
    });
  }

  /* ---------- Hero ---------- */
  function renderHero() {
    var g = getGreetingPrefix();
    el.heroGreetingText.textContent = g.hi + " · " + g.en;
    el.heroTitle.textContent = "Welcome back";
    renderHeroStats();
    initWeather();
    renderWeatherMeta();
    if (clockInterval) clearInterval(clockInterval);
    clockInterval = setInterval(renderWeatherMeta, 30000);
  }

  function formatTimeNow(date) {
    var h = date.getHours(), m = date.getMinutes();
    return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
  }

  function formatDateShort(date) {
    return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  }

  function renderWeatherMeta() {
    if (!el.weatherMeta) return;
    var now = new Date();
    var cached = readWeatherCache();
    var loc = cached && cached.city ? cached.city : "";
    var time = formatTimeNow(now);
    var date = formatDateShort(now);
    el.weatherMeta.innerHTML = (loc ? escapeHtml(loc) + '<span class="meta-dot"></span>' : "") +
      time + '<span class="meta-dot"></span>' + escapeHtml(date);
  }

  /* ---------- Weather ---------- */
  var WEATHER_KEY = "linkhub-weather";
  var LOCATION_KEY = "linkhub-weather-location";
  var WEATHER_TTL_MS = 30 * 60 * 1000;        // 30 min: fully fresh
  var WEATHER_STALE_MS = 6 * 60 * 60 * 1000;  // 6 hr: render stale while refreshing

  // Default location used when nothing has been chosen yet.
  var DEFAULT_LOCATION = { name: "Bangalore", lat: 12.9716, lon: 77.5946 };

  function readWeatherCache() {
    try {
      var raw = localStorage.getItem(WEATHER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function getStoredLocation() {
    try {
      var raw = localStorage.getItem(LOCATION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function setStoredLocation(loc) {
    if (loc) localStorage.setItem(LOCATION_KEY, JSON.stringify(loc));
    else localStorage.removeItem(LOCATION_KEY);
  }

  function getActiveLocation() {
    return getStoredLocation() || DEFAULT_LOCATION;
  }

  function renderWeather(data) {
    if (!el.heroWeather) return;
    if (!data) {
      el.heroWeather.classList.remove("is-loading");
      el.heroWeather.classList.add("is-unavailable");
      el.weatherIcon.innerHTML = WEATHER_ICONS.cloudSun;
      el.weatherIcon.className = "weather-icon cloudy";
      el.weatherTemp.textContent = "—";
      el.weatherCondition.textContent = "Weather unavailable";
      renderWeatherMeta();
      return;
    }
    var info = weatherInfo(data.code, data.isDay);
    el.heroWeather.classList.remove("is-loading", "is-unavailable");
    el.weatherIcon.innerHTML = WEATHER_ICONS[info.icon] || WEATHER_ICONS.cloudSun;
    el.weatherIcon.className = "weather-icon " + info.cls;
    el.weatherTemp.innerHTML = data.temp + '<span class="deg">°</span>';
    el.weatherCondition.textContent = info.label;
    renderWeatherMeta();
  }

  function fetchWeatherForCoords(lat, lon, cityName) {
    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat +
      "&longitude=" + lon +
      "&current=temperature_2m,weather_code,is_day&temperature_unit=celsius&timezone=auto";

    fetch(url)
      .then(function (r) { if (!r.ok) throw new Error("weather"); return r.json(); })
      .then(function (data) {
        var w = {
          temp: Math.round(data.current.temperature_2m),
          code: data.current.weather_code,
          isDay: !!data.current.is_day,
          city: cityName || "",
          lat: lat,
          lon: lon,
          fetchedAt: Date.now()
        };
        localStorage.setItem(WEATHER_KEY, JSON.stringify(w));
        renderWeather(w);
      })
      .catch(function () {
        var cached = readWeatherCache();
        if (!cached) renderWeather(null);
      });
  }

  function fetchWeather(force) {
    var loc = getActiveLocation();
    var cached = readWeatherCache();
    var now = Date.now();
    var cacheMatches = cached && cached.lat === loc.lat && cached.lon === loc.lon;

    if (!force && cacheMatches && (now - cached.fetchedAt) < WEATHER_TTL_MS) {
      renderWeather(cached);
      return;
    }
    if (cacheMatches && (now - cached.fetchedAt) < WEATHER_STALE_MS) {
      renderWeather(cached); // show stale, refresh in background
    } else {
      el.heroWeather.classList.add("is-loading");
    }
    fetchWeatherForCoords(loc.lat, loc.lon, loc.name);
  }

  function initWeather() {
    if (!el.heroWeather) return;
    fetchWeather(false);
  }

  /* ---------- Change location ---------- */
  // Open-Meteo's gazetteer indexes some Indian cities under their official renamed forms.
  // Map a few common colloquial spellings so the user still gets the city they expect.
  var CITY_ALIASES = {
    bangalore: "Bengaluru",
    bombay: "Mumbai",
    calcutta: "Kolkata",
    madras: "Chennai",
    poona: "Pune",
    cochin: "Kochi",
    trivandrum: "Thiruvananthapuram"
  };

  function geocodeCity(query) {
    var raw = (query || "").trim();
    var alias = CITY_ALIASES[raw.toLowerCase()];
    var searchTerm = alias || raw;
    var url = "https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(searchTerm) +
      "&count=5&language=en&format=json";
    return fetch(url)
      .then(function (r) { if (!r.ok) throw new Error("geocode_http"); return r.json(); })
      .then(function (data) {
        var results = data && data.results;
        if (!results || !results.length) throw new Error("not_found");
        var qLower = searchTerm.toLowerCase();
        // Prefer an exact name match, otherwise the most populous result.
        var pick = null;
        for (var i = 0; i < results.length; i++) {
          if (results[i].name && results[i].name.toLowerCase() === qLower) { pick = results[i]; break; }
        }
        if (!pick) {
          pick = results.slice().sort(function (a, b) {
            return (b.population || 0) - (a.population || 0);
          })[0];
        }
        // If the user typed a colloquial name, honor their preferred spelling in the UI
        // while using the canonical entry's coordinates.
        return { name: alias ? raw : pick.name, lat: pick.latitude, lon: pick.longitude };
      });
  }

  function useDeviceLocation() {
    if (!navigator.geolocation) {
      toast("Geolocation isn't available in this browser.", { type: "error" });
      return;
    }
    el.heroWeather.classList.add("is-loading");
    el.weatherCondition.textContent = "Getting your location…";
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        var lat = pos.coords.latitude;
        var lon = pos.coords.longitude;
        var geoUrl = "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + lat +
          "&longitude=" + lon + "&localityLanguage=en";
        fetch(geoUrl)
          .then(function (r) { return r.json(); })
          .then(function (geo) {
            var name = geo.city || geo.locality || geo.principalSubdivision || "Your location";
            setStoredLocation({ name: name, lat: lat, lon: lon });
            localStorage.removeItem(WEATHER_KEY);
            fetchWeatherForCoords(lat, lon, name);
            toast("Using your current location", { type: "success", duration: 2000 });
          })
          .catch(function () {
            var name = "Your location";
            setStoredLocation({ name: name, lat: lat, lon: lon });
            fetchWeatherForCoords(lat, lon, name);
          });
      },
      function (err) {
        el.heroWeather.classList.remove("is-loading");
        renderWeather(readWeatherCache());
        if (err && err.code === 1) {
          toast("Location permission denied. Try a city name instead.", { type: "error" });
        } else {
          toast("Couldn't get your location.", { type: "error" });
        }
      },
      { timeout: 8000 }
    );
  }

  function changeLocation() {
    var current = getActiveLocation();
    customPrompt({
      title: "Change weather location",
      label: "City",
      placeholder: "e.g., Tokyo",
      hint: "Leave blank to use your device's current location.",
      value: current.name,
      okLabel: "Set location",
      allowEmpty: true
    }).then(function (input) {
      if (input === null) return; // cancelled
      if (input === "") {
        // Switch to device location
        useDeviceLocation();
        return;
      }
      el.heroWeather.classList.add("is-loading");
      geocodeCity(input)
        .then(function (loc) {
          setStoredLocation(loc);
          localStorage.removeItem(WEATHER_KEY);
          fetchWeatherForCoords(loc.lat, loc.lon, loc.name);
          toast("Weather location set to " + loc.name, { type: "success", duration: 2200 });
        })
        .catch(function () {
          el.heroWeather.classList.remove("is-loading");
          renderWeather(readWeatherCache());
          toast("Couldn't find that city. Try another name.", { type: "error" });
        });
    });
  }

  function renderHeroStats() {
    var pinned = 0, recent = 0;
    var oneWeek = 7 * 24 * 60 * 60 * 1000;
    for (var i = 0; i < state.links.length; i++) {
      if (state.links[i].favorite) pinned++;
      if (state.links[i].createdAt && (Date.now() - state.links[i].createdAt) < oneWeek) recent++;
    }
    var totalFolders = state.folders.length;
    var html =
      '<span class="stat-chip">' + ICONS.link +
        '<span class="stat-num">' + state.links.length + "</span>links</span>" +
      '<span class="stat-chip">' + ICONS.folder.replace('viewBox="0 0 24 24"', 'viewBox="0 0 24 24" class="icon"') +
        '<span class="stat-num">' + totalFolders + "</span>folders</span>" +
      '<span class="stat-chip">' + ICONS.star +
        '<span class="stat-num">' + pinned + "</span>pinned</span>";
    if (recent > 0) {
      html += '<span class="stat-chip">' + ICONS.clock +
        '<span class="stat-num">' + recent + "</span>this week</span>";
    }
    el.heroStats.innerHTML = html;
  }

  /* ---------- Smart folders ---------- */
  var SMART_FOLDERS = [
    { id: "recent",   name: "Recently added", icon: ICONS.clock },
    { id: "popular",  name: "Most opened",    icon: ICONS.star },
    { id: "untagged", name: "Untagged",       icon: ICONS.tag }
  ];

  function smartFolderLinks(id) {
    var arr = state.links.slice();
    if (id === "recent") {
      arr.sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
      return arr.slice(0, 20);
    }
    if (id === "popular") {
      return arr.filter(function (l) { return (l.clickCount || 0) > 0; })
        .sort(function (a, b) { return (b.clickCount || 0) - (a.clickCount || 0); })
        .slice(0, 20);
    }
    if (id === "untagged") {
      return arr.filter(function (l) { return !l.tags || l.tags.length === 0; });
    }
    return [];
  }

  function renderSmartFolders() {
    var html = "";
    for (var i = 0; i < SMART_FOLDERS.length; i++) {
      var sf = SMART_FOLDERS[i];
      var count = smartFolderLinks(sf.id).length;
      var active = selectedSmartId === sf.id ? " active" : "";
      html += '<button type="button" class="smart-folder' + active + '" data-smart="' + sf.id + '">' +
        sf.icon + "<span>" + sf.name + '</span><span class="smart-count">' + count + "</span></button>";
    }
    el.smartFolders.innerHTML = html;
    el.smartFolders.querySelectorAll("[data-smart]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-smart");
        if (selectedSmartId === id) {
          selectedSmartId = null;
        } else {
          selectedSmartId = id;
          selectedFolderId = "all";
        }
        renderFolders();
        renderSmartFolders();
        renderLinks();
      });
    });
  }

  /* ---------- Sidebar footer ---------- */
  function renderSidebarFooter() {
    el.footerLinks.textContent = state.links.length;
    el.footerFolders.textContent = state.folders.length;
    var b = localStorage.getItem(BACKUP_KEY);
    el.footerBackup.textContent = b ? timeAgo(parseInt(b, 10)) : "never";
  }

  /* ---------- Folder context menu ---------- */
  function openFolderContextMenu(folder, x, y) {
    contextFolderId = folder.id;
    var html = '<div class="context-section-title">' + escapeHtml(folder.name) + "</div>";
    html += '<button type="button" class="context-item" data-ctx="rename">' + ICONS.edit + "Rename</button>";
    html += '<button type="button" class="context-item" data-ctx="addchild">' + ICONS.folderPlus + "Add subfolder</button>";
    html += '<div class="context-divider"></div>';
    html += '<div class="context-section-title">Color</div>';
    html += '<div class="color-swatches">';
    for (var i = 0; i < FOLDER_PALETTE.length; i++) {
      var c = FOLDER_PALETTE[i];
      var active = folder.color === c ? " active" : "";
      html += '<button type="button" class="color-swatch' + active + '" data-color="' + c + '" style="background:' + c + '" aria-label="' + c + '"></button>';
    }
    html += "</div>";
    html += '<div class="context-section-title">Emoji</div>';
    html += '<div class="emoji-grid">';
    html += '<button type="button" class="emoji-pick' + (!folder.emoji ? " active" : "") + '" data-emoji="">∅</button>';
    for (var j = 0; j < EMOJI_CHOICES.length; j++) {
      var e = EMOJI_CHOICES[j];
      var ea = folder.emoji === e ? " active" : "";
      html += '<button type="button" class="emoji-pick' + ea + '" data-emoji="' + escapeAttr(e) + '">' + e + "</button>";
    }
    html += "</div>";
    html += '<div class="context-divider"></div>';
    html += '<button type="button" class="context-item danger" data-ctx="delete">' + ICONS.trash + "Delete folder</button>";

    el.folderContextMenu.innerHTML = html;
    el.folderContextMenu.classList.add("open");

    var menuW = 220, menuH = el.folderContextMenu.offsetHeight || 320;
    var px = Math.min(x, window.innerWidth - menuW - 8);
    var py = Math.min(y, window.innerHeight - menuH - 8);
    el.folderContextMenu.style.left = px + "px";
    el.folderContextMenu.style.top = py + "px";

    el.folderContextMenu.querySelectorAll("[data-ctx]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        handleFolderAction(folder.id, btn.getAttribute("data-ctx"));
        closeFolderContextMenu();
      });
    });
    el.folderContextMenu.querySelectorAll("[data-color]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setFolderProp(folder.id, "color", btn.getAttribute("data-color"));
      });
    });
    el.folderContextMenu.querySelectorAll("[data-emoji]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setFolderProp(folder.id, "emoji", btn.getAttribute("data-emoji"));
      });
    });
  }

  function closeFolderContextMenu() {
    el.folderContextMenu.classList.remove("open");
    contextFolderId = null;
  }

  function setFolderProp(id, prop, val) {
    var f = folderById(id);
    if (!f) return;
    f[prop] = val;
    saveState(state);
    renderFolders();
    renderLinks();
    var stillOpen = el.folderContextMenu.classList.contains("open");
    if (stillOpen) {
      var swatches = el.folderContextMenu.querySelectorAll(".color-swatch");
      swatches.forEach(function (s) {
        s.classList.toggle("active", s.getAttribute("data-color") === f.color);
      });
      var emojis = el.folderContextMenu.querySelectorAll(".emoji-pick");
      emojis.forEach(function (s) {
        s.classList.toggle("active", s.getAttribute("data-emoji") === f.emoji);
      });
    }
  }

  function handleFolderAction(id, action) {
    var f = folderById(id);
    if (!f) return;
    if (action === "rename") {
      customPrompt({
        title: "Rename folder",
        label: "Folder name",
        value: f.name,
        okLabel: "Rename"
      }).then(function (name) {
        if (!name) return;
        f.name = name;
        saveState(state);
        renderFolders();
        renderLinks();
        toast("Folder renamed", { type: "success", duration: 2000 });
      });
    } else if (action === "addchild") {
      selectedFolderId = id;
      openFolderModal();
    } else if (action === "delete") {
      var descIds = folderAndDescendantIds(id);
      var linkCount = 0;
      for (var i = 0; i < state.links.length; i++) {
        if (descIds.indexOf(state.links[i].folderId) !== -1) linkCount++;
      }
      var msg = linkCount > 0
        ? "This folder contains " + linkCount + " link" + (linkCount === 1 ? "" : "s") + ". They will be moved to General."
        : "This folder will be deleted.";
      customConfirm({
        title: 'Delete "' + f.name + '"?',
        body: msg,
        okLabel: "Delete folder"
      }).then(function (ok) {
        if (!ok) return;
        deleteFolderById(id);
      });
    }
  }

  function deleteFolderById(id) {
    var ids = folderAndDescendantIds(id);
    var movedLinks = 0;
    for (var i = 0; i < state.links.length; i++) {
      if (ids.indexOf(state.links[i].folderId) !== -1) {
        state.links[i].folderId = "default";
        movedLinks++;
      }
    }
    var deletedFolders = state.folders.filter(function (f) { return ids.indexOf(f.id) !== -1; });
    state.folders = state.folders.filter(function (f) { return ids.indexOf(f.id) === -1; });
    if (!folderById("default")) {
      state.folders.unshift({ id: "default", name: "General", parentId: null, order: 0, color: "#8b5cf6", emoji: "" });
    }
    saveState(state);
    if (selectedFolderId === id || ids.indexOf(selectedFolderId) !== -1) selectedFolderId = "all";
    lastDeletedFolder = { folders: deletedFolders, movedLinks: movedLinks };
    renderFolders();
    renderLinks();
    toast("Folder deleted" + (movedLinks > 0 ? " · " + movedLinks + " link" + (movedLinks === 1 ? "" : "s") + " moved" : ""), {
      type: "success"
    });
  }

  /* ---------- Drag-drop reordering ---------- */
  function handleDragStart(e) {
    // This timeout is a hack to ensure the drag image is created before we modify the element
    setTimeout(function() {
      e.target.classList.add("dragging");
    }, 0);

    var linkCard = e.target.closest(".link-card");
    if (linkCard) {
      var linkId = linkCard.getAttribute("data-link-id");
      e.dataTransfer.setData("application/json", JSON.stringify({ type: "link", id: linkId }));
      e.dataTransfer.effectAllowed = "move";
      return;
    }

    var folderItem = e.target.closest(".folder-item");
    if (folderItem) {
      var folderId = folderItem.getAttribute("data-folder");
      if (folderId && folderId !== "all") {
        e.dataTransfer.setData("application/json", JSON.stringify({ type: "folder", id: folderId }));
        e.dataTransfer.effectAllowed = "move";
      } else {
        e.preventDefault();
      }
    }
  }

  function handleDragEnd(e) {
    e.target.classList.remove("dragging");
  }

  function handleDragOver(e) {
    e.preventDefault();
    var folderItem = e.target.closest(".folder-item");
    if (folderItem) {
      folderItem.classList.add("drag-over");
    }
  }

  function handleDragLeave(e) {
    e.preventDefault();
    var folderItem = e.target.closest(".folder-item");
    if (folderItem) {
      folderItem.classList.remove("drag-over");
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    var folderItem = e.target.closest(".folder-item");
    if (!folderItem) return;
    folderItem.classList.remove("drag-over");

    var targetFolderId = folderItem.getAttribute("data-folder");
    if (!targetFolderId) return;

    var dataStr = e.dataTransfer.getData("application/json");
    if (!dataStr) return;

    try {
      var data = JSON.parse(dataStr);
      if (data.type === "link") {
        moveLinkToFolder(data.id, targetFolderId);
      } else if (data.type === "folder") {
        moveFolderToFolder(data.id, targetFolderId);
      }
    } catch (err) {
      console.error("Drop error", err);
    }
  }

  function moveLinkToFolder(linkId, targetFolderId) {
    if (targetFolderId === "all") return;
    var link = state.links.find(function(l) { return l.id === linkId; });
    if (link && link.folderId !== targetFolderId) {
      link.folderId = targetFolderId;
      saveState(state);
      renderFolders();
      renderLinks();
      toast("Link moved to '" + folderById(targetFolderId).name + "'", { type: "success", duration: 2000 });
    }
  }

  function moveFolderToFolder(folderId, targetFolderId) {
    if (folderId === targetFolderId) return;
    var folder = folderById(folderId);
    if (!folder) return;

    var descendantIds = folderAndDescendantIds(folderId);
    if (descendantIds.indexOf(targetFolderId) !== -1) {
      toast("Cannot move a folder into itself.", { type: "error" });
      return;
    }

    var newParentId = targetFolderId === "all" ? null : targetFolderId;
    folder.parentId = newParentId;

    var siblings = childFolders(newParentId);
    var maxOrder = 0;
    for(var i = 0; i < siblings.length; i++) {
        if(siblings[i].id !== folderId && (siblings[i].order || 0) > maxOrder) {
            maxOrder = siblings[i].order;
        }
    }
    folder.order = maxOrder + 1;

    saveState(state);
    if (newParentId) expandedFolderIds[newParentId] = true;
    renderFolders();
    toast("Folder moved", { type: "success", duration: 2000 });
  }

  /* ---------- Drag-drop import ---------- */
  var dragDepth = 0;
  function setupDragDrop() {
    window.addEventListener("dragenter", function (e) {
      if (!e.dataTransfer) return;
      var hasFiles = (e.dataTransfer.types && Array.prototype.indexOf.call(e.dataTransfer.types, "Files") !== -1);
      if (!hasFiles) return;
      dragDepth++;
      el.dropOverlay.classList.add("visible");
    });
    window.addEventListener("dragover", function (e) {
      if (el.dropOverlay.classList.contains("visible")) e.preventDefault();
    });
    window.addEventListener("dragleave", function () {
      dragDepth = Math.max(0, dragDepth - 1);
      if (dragDepth === 0) el.dropOverlay.classList.remove("visible");
    });
    window.addEventListener("drop", function (e) {
      if (!el.dropOverlay.classList.contains("visible")) return;
      e.preventDefault();
      dragDepth = 0;
      el.dropOverlay.classList.remove("visible");
      var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (!file) return;
      if (!/\.json$/i.test(file.name)) {
        toast("Please drop a .json backup file.", { type: "error" });
        return;
      }
      var reader = new FileReader();
      reader.onload = function () {
        customConfirm({
          title: 'Import "' + file.name + '"',
          body: "Replace ALL current data, or merge into your library?",
          okLabel: "Replace",
          okClass: "btn-danger",
          cancelLabel: "Merge"
        }).then(function (replace) {
          importJson(reader.result, !!replace);
        });
      };
      reader.readAsText(file);
    });
  }

  /* ---------- Folder rendering ---------- */
  function folderIconHtml(folder) {
    if (folder && folder.emoji) {
      return '<span class="folder-emoji" aria-hidden="true">' + escapeHtml(folder.emoji) + "</span>";
    }
    var color = folder ? (folder.color || "#8b5cf6") : "#8b5cf6";
    return '<span class="folder-icon" aria-hidden="true" style="--folder-color:' + color + '">' + ICONS.folder + "</span>";
  }

  function folderIconRootHtml() {
    return '<span class="folder-icon is-root" aria-hidden="true">' + ICONS.folderAll + "</span>";
  }

  function renderFolders() {
    expandFolderPath(selectedFolderId);
    var folders = flattenVisibleFolders(null, 0, []);
    var html = "";
    var allActive = (selectedFolderId === "all" && !selectedSmartId) ? " active" : "";
    html += '<li><button type="button" class="folder-item' + allActive + '" data-folder="all">' +
      '<span class="folder-tree-prefix" style="--level:0"></span>' +
      '<span class="folder-toggle is-spacer" aria-hidden="true"></span>' +
      folderIconRootHtml() +
      '<span class="folder-name">All links</span>' +
      '<span class="count">' + state.links.length + "</span></button></li>";
    for (var i = 0; i < folders.length; i++) {
      var f = folders[i].folder;
      var level = folders[i].level;
      var active = (selectedFolderId === f.id && !selectedSmartId) ? " active" : "";
      var hasChildren = hasChildFolders(f.id);
      var isExpanded = isFolderExpanded(f.id);
      var classes = "folder-item" + active + (level > 0 ? " is-child" : "") + (hasChildren ? " has-children" : "") + (isExpanded ? " is-expanded" : "");
      var count = linkCountInFolderTree(f.id);
      var safeName = escapeHtml(f.name);
      var prefix = '<span class="folder-tree-prefix' + (level > 0 ? " has-line" : "") + '" style="--level:' + level + '"></span>';
      var toggle = '<span class="folder-toggle' + (hasChildren ? "" : " is-spacer") + '" aria-hidden="true"></span>';
      var icon = folderIconHtml(f);
      var expandedAttr = hasChildren ? ' aria-expanded="' + (isExpanded ? "true" : "false") + '"' : "";
      html += '<li><button type="button" class="' + classes + '" data-folder="' + escapeAttr(f.id) + '" title="' + escapeAttr(folderPath(f.id)) + '"' + expandedAttr + ' draggable="true">' +
        prefix + toggle + icon +
        '<span class="folder-name">' + safeName + "</span>" +
        '<span class="count">' + count + "</span>" +
        "</button></li>";
    }
    el.folderList.innerHTML = html;
    el.folderList.querySelectorAll(".folder-item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var folderId = btn.getAttribute("data-folder");
        selectedFolderId = folderId;
        selectedSmartId = null;
        if (folderId !== "all" && hasChildFolders(folderId)) {
          expandedFolderIds[folderId] = !isFolderExpanded(folderId);
        } else {
          closeMobileSidebar();
        }
        renderFolders();
        renderSmartFolders();
        renderLinks();
      });
      btn.addEventListener("contextmenu", function (e) {
        var folderId = btn.getAttribute("data-folder");
        if (folderId === "all") return;
        var f = folderById(folderId);
        if (!f) return;
        e.preventDefault();
        openFolderContextMenu(f, e.clientX, e.clientY);
      });

      // Drag and drop listeners
      btn.addEventListener("dragover", handleDragOver);
      btn.addEventListener("dragleave", handleDragLeave);
      btn.addEventListener("drop", handleDrop);
      if (btn.getAttribute("data-folder") !== "all") {
        btn.addEventListener("dragstart", handleDragStart);
        btn.addEventListener("dragend", handleDragEnd);
      }
    });
  }

  /* ---------- Link rendering ---------- */
  function renderLinks() {
    var q = el.searchInput.value.trim();
    var favorites = [];
    var rest = [];
    var pool = state.links;

    if (selectedSmartId) {
      pool = smartFolderLinks(selectedSmartId);
    }

    for (var i = 0; i < pool.length; i++) {
      var link = pool[i];
      if (!matchesSearch(link, q)) continue;
      if (!selectedSmartId && !linkIsInSelectedFolder(link)) continue;
      if (link.favorite && !selectedSmartId) favorites.push(link);
      else rest.push(link);
    }

    function sortLinks(arr) {
      arr.sort(function (a, b) {
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
    }
    if (!selectedSmartId) sortLinks(favorites);
    if (selectedSmartId !== "popular" && selectedSmartId !== "recent") sortLinks(rest);

    el.favoritesBlock.hidden = favorites.length === 0;
    el.favoritesGrid.innerHTML = favorites.map(function (l, idx) { return cardHtml(l, idx); }).join("");
    el.linkGrid.innerHTML = rest.map(function (l, idx) { return cardHtml(l, idx + favorites.length); }).join("");

    var visibleCount = favorites.length + rest.length;

    if (selectedSmartId) {
      var sf = SMART_FOLDERS.find(function (s) { return s.id === selectedSmartId; });
      el.currentFolderLabel.textContent = (sf ? sf.name : "Smart") + " (" + visibleCount + ")";
    } else if (selectedFolderId === "all") {
      el.currentFolderLabel.textContent = q ? "Search results (" + visibleCount + ")" : "All links";
    } else {
      var fo = folderById(selectedFolderId);
      el.currentFolderLabel.textContent = fo ? folderPath(fo.id) + (q ? " — filtered" : "") : "Folder";
    }

    var showEmpty = state.links.length === 0 || visibleCount === 0;
    el.emptyState.hidden = !showEmpty;
    var emptyH2 = el.emptyState.querySelector("h2");
    var emptyP = el.emptyState.querySelector("p");
    var emptyActions = el.emptyState.querySelector(".empty-actions");
    if (state.links.length === 0) {
      emptyH2.textContent = "Your link hub is empty";
      emptyP.textContent = "Add your first link, or drop a backup JSON anywhere on this window to import it.";
      if (emptyActions) emptyActions.style.display = "";
    } else if (visibleCount === 0) {
      emptyH2.textContent = q ? "No matches" : "Nothing here yet";
      emptyP.textContent = q
        ? "Try a different search or jump to another folder."
        : "Add a link to this folder, or pick another folder.";
      if (emptyActions) emptyActions.style.display = "none";
    }

    function bindCardActions(root) {
      root.querySelectorAll("[data-edit]").forEach(function (btn) {
        btn.addEventListener("click", function () { openEditModal(btn.getAttribute("data-edit")); });
      });
      root.querySelectorAll("[data-del]").forEach(function (btn) {
        btn.addEventListener("click", function () { deleteLink(btn.getAttribute("data-del")); });
      });
      root.querySelectorAll("[data-fav]").forEach(function (btn) {
        btn.addEventListener("click", function () { toggleFavorite(btn.getAttribute("data-fav")); });
      });
      root.querySelectorAll("[data-open]").forEach(function (a) {
        a.addEventListener("click", function () { recordOpen(a.getAttribute("data-open")); });
        a.addEventListener("auxclick", function (e) { if (e.button === 1) recordOpen(a.getAttribute("data-open")); });
      });
      root.querySelectorAll("[data-tag-filter]").forEach(function (t) {
        t.addEventListener("click", function (e) {
          e.preventDefault();
          el.searchInput.value = t.getAttribute("data-tag-filter");
          renderLinks();
          el.searchInput.focus();
        });
      });
      root.querySelectorAll(".link-card").forEach(function(card) {
        card.addEventListener("dragstart", handleDragStart);
        card.addEventListener("dragend", handleDragEnd);
      });
    }
    bindCardActions(el.linkGrid);
    bindCardActions(el.favoritesGrid);

    renderSidebarFooter();
    renderHeroStats();
  }

  function cardHtml(link, idx) {
    var fo = folderById(link.folderId);
    var folderLabel = fo ? fo.name : "Unknown";
    var folderColor = fo ? (fo.color || "#8b5cf6") : "#8b5cf6";

    // Tags use finite palette via data-tag-color (CSS handles hue per index)
    var tags = (link.tags || []).map(function (t) {
      var idx = tagColorIndex(t);
      return '<span class="tag" data-tag-color="' + idx + '" data-tag-filter="' + escapeAttr(t) + '" title="Filter by ' + escapeAttr(t) + '">' + escapeHtml(t) + "</span>";
    }).join("");

    var favClass = link.favorite ? " favorite" : "";
    var fav = faviconUrl(link.url);
    var fallback = fallbackLetter(link);
    var letterColor = colorForString(getDomain(link.url) || link.title || "?");
    var faviconHtml = fav
      ? '<div class="card-favicon" style="background:' + letterColor + '"><img src="' + escapeAttr(fav) + '" alt="" referrerpolicy="no-referrer" loading="lazy" onerror="this.style.display=\'none\';this.parentNode.querySelector(\'.fallback-letter\').style.display=\'block\';" /><span class="fallback-letter" style="display:none">' + escapeHtml(fallback) + "</span></div>"
      : '<div class="card-favicon" style="background:' + letterColor + '"><span class="fallback-letter">' + escapeHtml(fallback) + "</span></div>";

    var domain = getDomain(link.url);
    var added = link.createdAt ? timeAgo(link.createdAt) : "";
    var clicks = link.clickCount || 0;
    var meta = '<div class="card-meta">' +
      (domain ? "<span>" + escapeHtml(domain) + "</span>" : "<span>local file</span>") +
      (added ? '<span class="dot"></span><span title="' + (link.createdAt ? new Date(link.createdAt).toLocaleString() : "") + '">' + escapeHtml(added) + "</span>" : "") +
      (clicks > 0 ? '<span class="open-count" title="Opened ' + clicks + ' time' + (clicks === 1 ? "" : "s") + '">' + ICONS.eye + clicks + "</span>" : "") +
      "</div>";

    var pinBadge = link.favorite ? '<span class="pin-badge" aria-hidden="true">' + ICONS.starFill + "</span>" : "";

    var folderPill = '<span class="card-folder-pill" style="--folder-color:' + folderColor + '"><span class="pill-dot"></span>' + escapeHtml(folderLabel) + "</span>";

    var delay = ' style="--card-delay:' + Math.min((idx || 0) * 30, 240) + 'ms"';

    return (
      '<article class="link-card' + favClass + '"' + delay + ' draggable="true" data-link-id="' + escapeAttr(link.id) + '">' +
        pinBadge +
        '<div class="link-card-top">' +
          faviconHtml +
          '<div class="card-title-wrap">' +
            '<a class="title-link" href="' + escapeAttr(link.url) + '" rel="noopener noreferrer" target="_blank" data-open="' + escapeAttr(link.id) + '">' + escapeHtml(link.title || link.url) + "</a>" +
            meta +
          "</div>" +
        "</div>" +
        (tags ? '<div class="tags">' + tags + "</div>" : "") +
        folderPill +
        '<div class="card-actions">' +
          '<button type="button" class="btn" data-fav="' + escapeAttr(link.id) + '" title="' + (link.favorite ? "Unpin" : "Pin to top") + '">' +
            (link.favorite
              ? '<svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.6 5.6L20 9.5l-4 4 1 6-5-2.7L7 19.5l1-6-4-4 5.4-.9L12 3Z" fill="#facc15" stroke="#facc15"/></svg>'
              : '<svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.6 5.6L20 9.5l-4 4 1 6-5-2.7L7 19.5l1-6-4-4 5.4-.9L12 3Z"/></svg>') +
            (link.favorite ? "Pinned" : "Pin") +
          "</button>" +
          '<button type="button" class="btn" data-edit="' + escapeAttr(link.id) + '" title="Edit"><svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg>Edit</button>' +
          '<button type="button" class="btn btn-danger-ghost" data-del="' + escapeAttr(link.id) + '" title="Delete"><svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>Delete</button>' +
        "</div>" +
      "</article>"
    );
  }

  /* ---------- Link mutations ---------- */
  function toggleFavorite(id) {
    for (var i = 0; i < state.links.length; i++) {
      if (state.links[i].id === id) {
        state.links[i].favorite = !state.links[i].favorite;
        break;
      }
    }
    saveState(state);
    renderFolders();
    renderLinks();
  }

  function deleteLink(id) {
    var link = null;
    for (var i = 0; i < state.links.length; i++) {
      if (state.links[i].id === id) { link = state.links[i]; break; }
    }
    if (!link) return;
    var snapshot = JSON.parse(JSON.stringify(link));
    state.links = state.links.filter(function (l) { return l.id !== id; });
    saveState(state);
    lastDeletedLink = snapshot;
    renderFolders();
    renderLinks();
    toast('Deleted "' + (link.title || link.url) + '"', {
      type: "success",
      actionLabel: "Undo",
      duration: 6000,
      onAction: function () {
        if (!lastDeletedLink) return;
        if (!folderById(lastDeletedLink.folderId)) lastDeletedLink.folderId = "default";
        state.links.push(lastDeletedLink);
        saveState(state);
        lastDeletedLink = null;
        renderFolders();
        renderLinks();
        toast("Restored", { type: "success", duration: 2200 });
      }
    });
  }

  /* ---------- Modals ---------- */
  function openAddModal() {
    editingLinkId = null;
    el.modalTitle.textContent = "Add link";
    el.linkTitle.value = "";
    el.linkUrl.value = "";
    el.linkTags.value = "";
    el.linkFavorite.checked = false;
    populateFolderSelect(selectedFolderId !== "all" ? selectedFolderId : "default");
    el.modalOverlay.classList.add("open");
    el.linkTitle.focus();
  }

  function openEditModal(id) {
    var link = null;
    for (var i = 0; i < state.links.length; i++) {
      if (state.links[i].id === id) { link = state.links[i]; break; }
    }
    if (!link) return;
    editingLinkId = id;
    el.modalTitle.textContent = "Edit link";
    el.linkTitle.value = link.title || "";
    el.linkUrl.value = link.url || "";
    el.linkTags.value = (link.tags || []).join(", ");
    el.linkFavorite.checked = !!link.favorite;
    populateFolderSelect(link.folderId);
    el.modalOverlay.classList.add("open");
  }

  function populateFolderSelect(selectedId) {
    var folders = flattenFolders(null, 0, []);
    el.linkFolder.innerHTML = folders.map(function (f) {
      return '<option value="' + escapeAttr(f.folder.id) + '"' + (f.folder.id === selectedId ? " selected" : "") + ">" + escapeHtml(folderOptionLabel(f)) + "</option>";
    }).join("");
  }

  function folderPickerOptionHtml(value, label, level, active, pathLabel, isRoot) {
    var prefix = '<span class="folder-tree-prefix' + (level > 0 ? " has-line" : "") + '" style="--level:' + level + '"></span>';
    var icon = isRoot
      ? folderIconRootHtml()
      : '<span class="folder-icon" aria-hidden="true">' + ICONS.folder + "</span>";
    var path = pathLabel ? '<span class="folder-picker-path">' + escapeHtml(pathLabel) + "</span>" : "";
    return (
      '<button type="button" class="folder-picker-option' + (active ? " active" : "") + '" role="option" aria-selected="' + (active ? "true" : "false") + '" data-parent-folder="' + escapeAttr(value) + '">' +
        prefix + icon + '<span class="folder-picker-label">' + escapeHtml(label) + "</span>" + path +
      "</button>"
    );
  }

  function renderFolderParentPicker() {
    var selectedId = el.folderParent.value;
    var selectedFolder = selectedId ? folderById(selectedId) : null;
    var triggerLabel = selectedFolder ? selectedFolder.name : "Top-level folder";
    var triggerPath = selectedFolder ? folderPath(selectedId) : "No parent";
    var triggerIcon = selectedFolder
      ? '<span class="folder-icon" aria-hidden="true" style="--folder-color:' + (selectedFolder.color || "#8b5cf6") + '">' + ICONS.folder + "</span>"
      : folderIconRootHtml();

    el.folderParentPickerTrigger.innerHTML =
      triggerIcon +
      '<span class="folder-picker-label">' + escapeHtml(triggerLabel) + "</span>" +
      '<span class="folder-picker-path">' + escapeHtml(triggerPath) + "</span>" +
      '<span class="folder-picker-caret" aria-hidden="true"></span>';

    var folders = flattenFolders(null, 0, []);
    var html = folderPickerOptionHtml("", "Top-level folder", 0, selectedId === "", "No parent", true);
    html += folders.map(function (f) {
      var path = f.level > 0 ? folderPath(f.folder.id) : "";
      return folderPickerOptionHtml(f.folder.id, f.folder.name, f.level, f.folder.id === selectedId, path, false);
    }).join("");
    el.folderParentPickerMenu.innerHTML = html;
    el.folderParentPickerMenu.querySelectorAll("[data-parent-folder]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        el.folderParent.value = btn.getAttribute("data-parent-folder");
        closeFolderParentPicker();
        updateFolderParentPreview();
      });
    });
  }

  function openFolderParentPicker() {
    el.folderParentPicker.classList.add("open");
    el.folderParentPickerTrigger.setAttribute("aria-expanded", "true");
  }

  function closeFolderParentPicker() {
    el.folderParentPicker.classList.remove("open");
    el.folderParentPickerTrigger.setAttribute("aria-expanded", "false");
  }

  function toggleFolderParentPicker() {
    if (el.folderParentPicker.classList.contains("open")) closeFolderParentPicker();
    else openFolderParentPicker();
  }

  function updateFolderParentPreview() {
    var selectedId = el.folderParent.value;
    var label = selectedId ? folderPath(selectedId) : "Top-level folder";
    var description = selectedId
      ? "New folder will be created inside "
      : "New folder will appear directly in the sidebar.";
    el.folderParentPreview.innerHTML = '<span aria-hidden="true">↳</span><span>' + escapeHtml(description) + (selectedId ? "<strong>" + escapeHtml(label) + "</strong>" : "") + "</span>";
    renderFolderParentPicker();
  }

  function populateFolderParentSelect(selectedId) {
    var folders = flattenFolders(null, 0, []);
    var html = '<option value="">Top-level folder</option>';
    html += folders.map(function (f) {
      return '<option value="' + escapeAttr(f.folder.id) + '"' + (f.folder.id === selectedId ? " selected" : "") + ">" + escapeHtml(folderOptionLabel(f)) + "</option>";
    }).join("");
    el.folderParent.innerHTML = html;
    updateFolderParentPreview();
  }

  function closeModal() {
    el.modalOverlay.classList.remove("open");
    editingLinkId = null;
  }

  function saveLink() {
    var title = el.linkTitle.value.trim();
    var url = el.linkUrl.value.trim();
    if (!url) {
      toast("Please enter a URL or path.", { type: "error" });
      el.linkUrl.focus();
      return;
    }
    if (!title) title = url;
    var folderId = el.linkFolder.value;
    var tags = normalizeTags(el.linkTags.value);
    var favorite = el.linkFavorite.checked;
    var wasEditing = !!editingLinkId;

    if (editingLinkId) {
      for (var i = 0; i < state.links.length; i++) {
        if (state.links[i].id === editingLinkId) {
          state.links[i].title = title;
          state.links[i].url = url;
          state.links[i].folderId = folderId;
          state.links[i].tags = tags;
          state.links[i].favorite = favorite;
          break;
        }
      }
    } else {
      state.links.push({
        id: uid(),
        title: title,
        url: url,
        folderId: folderId,
        tags: tags,
        favorite: favorite,
        createdAt: Date.now(),
        clickCount: 0,
        lastOpenedAt: 0
      });
    }
    saveState(state);
    closeModal();
    renderFolders();
    renderLinks();
    toast(wasEditing ? "Link updated" : "Link added", { type: "success", duration: 2200 });
  }

  function openFolderModal() {
    el.folderName.value = "";
    populateFolderParentSelect(selectedFolderId !== "all" ? selectedFolderId : "");
    el.folderModalOverlay.classList.add("open");
    el.folderName.focus();
  }

  function closeFolderModal() {
    el.folderModalOverlay.classList.remove("open");
    closeFolderParentPicker();
  }

  function saveFolder() {
    var name = el.folderName.value.trim();
    if (!name) {
      toast("Enter a folder name.", { type: "error" });
      el.folderName.focus();
      return;
    }
    var maxOrder = 0;
    for (var i = 0; i < state.folders.length; i++) {
      if ((state.folders[i].order || 0) > maxOrder) maxOrder = state.folders[i].order;
    }
    var parentId = el.folderParent.value || null;
    var color = FOLDER_PALETTE[(state.folders.length) % FOLDER_PALETTE.length];
    var newFolder = { id: uid(), name: name, parentId: parentId, order: maxOrder + 1, color: color, emoji: "" };
    state.folders.push(newFolder);
    if (parentId) expandedFolderIds[parentId] = true;
    saveState(state);
    closeFolderModal();
    selectedFolderId = newFolder.id;
    selectedSmartId = null;
    renderFolders();
    renderSmartFolders();
    renderLinks();
    toast("Folder created", { type: "success", duration: 2000 });
  }

  /* ---------- Import / export ---------- */
  function exportJson() {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "link-hub-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
    localStorage.setItem(BACKUP_KEY, String(Date.now()));
    renderSidebarFooter();
    toast("Backup downloaded", {
      type: "success",
      subtext: state.links.length + " links · " + state.folders.length + " folders"
    });
  }

  function importJson(text, replace) {
    try {
      var data = JSON.parse(text);
      if (!data.folders || !data.links) {
        toast("Invalid backup file.", { type: "error" });
        return;
      }
      if (replace) {
        state = normalizeState({
          version: data.version || 1,
          folders: data.folders,
          links: data.links
        });
      } else {
        var maxOrder = 0;
        for (var oi = 0; oi < state.folders.length; oi++) {
          var ord = state.folders[oi].order || 0;
          if (ord > maxOrder) maxOrder = ord;
        }
        var idMap = {};
        for (var fi = 0; fi < data.folders.length; fi++) {
          var of = data.folders[fi];
          var nid = uid();
          idMap[of.id] = nid;
          maxOrder += 1;
          state.folders.push({ id: nid, name: of.name, parentId: null, order: maxOrder });
        }
        for (var pi = 0; pi < data.folders.length; pi++) {
          var importedFolder = data.folders[pi];
          var mappedFolder = folderById(idMap[importedFolder.id]);
          if (mappedFolder && importedFolder.parentId && idMap[importedFolder.parentId]) {
            mappedFolder.parentId = idMap[importedFolder.parentId];
          }
        }
        for (var li = 0; li < data.links.length; li++) {
          var ol = data.links[li];
          var newFolderId = idMap[ol.folderId] || ol.folderId;
          if (!folderById(newFolderId)) newFolderId = "default";
          state.links.push({
            id: uid(),
            title: ol.title,
            url: ol.url,
            folderId: newFolderId,
            tags: ol.tags || [],
            favorite: !!ol.favorite,
            createdAt: ol.createdAt || Date.now()
          });
        }
      }
      saveState(state);
      expandedFolderIds = {};
      expandFolderPath(selectedFolderId);
      renderFolders();
      renderSmartFolders();
      renderLinks();
      toast(replace ? "Library replaced from backup" : "Backup merged into library", {
        type: "success",
        subtext: state.links.length + " links · " + state.folders.length + " folders"
      });
    } catch (e) {
      toast("Could not import: invalid JSON.", { type: "error" });
    }
  }

  /* ---------- Theme ---------- */
  function applyThemeIcon() {
    var t = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    var iconDark = el.btnTheme.querySelector(".theme-icon-dark");
    var iconLight = el.btnTheme.querySelector(".theme-icon-light");
    if (iconDark && iconLight) {
      iconDark.style.display = t === "dark" ? "" : "none";
      iconLight.style.display = t === "light" ? "" : "none";
    }
    var meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", t === "dark" ? "#0b0d12" : "#f7f8fa");
  }

  function initTheme() {
    var t = localStorage.getItem(THEME_KEY);
    if (t === "light" || t === "dark") {
      document.documentElement.setAttribute("data-theme", t);
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      document.documentElement.setAttribute("data-theme", "light");
    }
    applyThemeIcon();
  }

  function toggleTheme() {
    var cur = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    var next = cur === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
    applyThemeIcon();
  }

  /* ---------- Mobile sidebar ---------- */
  function openMobileSidebar() {
    el.sidebar.classList.add("open");
    el.sidebarBackdrop.classList.add("visible");
    el.btnMenu.setAttribute("aria-expanded", "true");
  }

  function closeMobileSidebar() {
    el.sidebar.classList.remove("open");
    el.sidebarBackdrop.classList.remove("visible");
    el.btnMenu.setAttribute("aria-expanded", "false");
  }

  function handleImportFile(input) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      customConfirm({
        title: 'Import "' + file.name + '"',
        body: "Replace ALL current data, or merge into your library?",
        okLabel: "Replace",
        okClass: "btn-danger",
        cancelLabel: "Merge"
      }).then(function (replace) {
        importJson(reader.result, !!replace);
        input.value = "";
      });
    };
    reader.readAsText(file);
  }

  function openHelp() { el.helpOverlay.classList.add("open"); }
  function closeHelp() { el.helpOverlay.classList.remove("open"); }

  /* ============================================================
     Command Palette (⌘K / Ctrl+K)
     ============================================================ */
  var cmdPaletteEl = {
    overlay: document.getElementById("cmdPaletteOverlay"),
    input:   document.getElementById("cmdSearchInput"),
    results: document.getElementById("cmdResults")
  };

  var cmdActiveIndex = -1;
  var cmdCurrentItems = [];

  function isCmdOpen() {
    return cmdPaletteEl.overlay.classList.contains("open");
  }

  function openCmdPalette() {
    cmdPaletteEl.overlay.classList.add("open");
    cmdPaletteEl.input.value = "";
    cmdActiveIndex = -1;
    renderCmdResults("");
    setTimeout(function () { cmdPaletteEl.input.focus(); }, 20);
  }

  function closeCmdPalette() {
    cmdPaletteEl.overlay.classList.remove("open");
    cmdActiveIndex = -1;
    cmdCurrentItems = [];
  }

  function cmdFaviconHtml(link) {
    var fav = faviconUrl(link.url);
    var letter = fallbackLetter(link);
    var bg = colorForString(getDomain(link.url) || link.title || "?");
    if (fav) {
      return '<div class="cmd-favicon" style="background:' + bg + '">' +
        '<img src="' + escapeAttr(fav) + '" alt="" referrerpolicy="no-referrer" loading="lazy" ' +
        'onerror="this.style.display=\'none\';this.parentNode.style.display=\'grid\';this.parentNode.textContent=\'' + escapeAttr(letter) + '\'" />' +
        '</div>';
    }
    return '<div class="cmd-favicon" style="background:' + bg + '">' + escapeHtml(letter) + '</div>';
  }

  function renderCmdResults(q) {
    var html = "";
    var trimQ = (q || "").trim().toLowerCase();
    var items = [];

    if (!trimQ) {
      // Default view: recently opened + recently added
      var recentOpened = state.links.slice()
        .filter(function (l) { return l.lastOpenedAt && l.lastOpenedAt > 0; })
        .sort(function (a, b) { return (b.lastOpenedAt || 0) - (a.lastOpenedAt || 0); })
        .slice(0, 5);

      var recentAdded = state.links.slice()
        .filter(function (l) {
          for (var i = 0; i < recentOpened.length; i++) {
            if (recentOpened[i].id === l.id) return false;
          }
          return true;
        })
        .sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); })
        .slice(0, 5);

      if (recentOpened.length > 0) {
        html += '<div class="cmd-section-label">Recently opened</div>';
        for (var i = 0; i < recentOpened.length; i++) {
          items.push({ type: "link", link: recentOpened[i] });
        }
      }

      if (recentAdded.length > 0) {
        html += '<div class="cmd-section-label" id="cmdSectionAdded">Recently added</div>';
        for (var j = 0; j < recentAdded.length; j++) {
          items.push({ type: "link", link: recentAdded[j], sectionBreak: recentOpened.length === 0 ? false : (j === 0) });
        }
      }

      if (state.links.length === 0) {
        html = '<div style="text-align:center;padding:var(--space-8);color:var(--text-subtle);font-size:var(--text-sm)">No links saved yet</div>';
        cmdCurrentItems = [];
        cmdPaletteEl.results.innerHTML = html;
        return;
      }
    } else {
      // Search mode
      var matched = [];
      for (var k = 0; k < state.links.length; k++) {
        if (matchesSearch(state.links[k], q)) matched.push(state.links[k]);
      }
      matched = matched.slice(0, 12);

      if (matched.length === 0) {
        html = '<div style="text-align:center;padding:var(--space-8);color:var(--text-subtle);font-size:var(--text-sm)">No results for <strong style="color:var(--text)">"' + escapeHtml(q) + '"</strong></div>';
        cmdCurrentItems = [];
        cmdPaletteEl.results.innerHTML = html;
        return;
      }

      html += '<div class="cmd-section-label">Results</div>';
      for (var m = 0; m < matched.length; m++) {
        items.push({ type: "link", link: matched[m] });
      }
    }

    cmdCurrentItems = items;

    // Build HTML for items
    var itemsHtml = "";
    var lastWasSectionBreak = false;
    for (var n = 0; n < items.length; n++) {
      var item = items[n];
      if (item.sectionBreak && !lastWasSectionBreak) {
        itemsHtml += '<div class="cmd-section-label">Recently added</div>';
      }
      lastWasSectionBreak = !!item.sectionBreak;

      var fo2 = folderById(item.link.folderId);
      var folderName = fo2 ? fo2.name : "";
      var domain = getDomain(item.link.url);
      var metaParts = [];
      if (folderName) metaParts.push(folderName);
      if (domain) metaParts.push(domain);

      itemsHtml +=
        '<a class="cmd-item" href="' + escapeAttr(item.link.url) + '" target="_blank" rel="noopener noreferrer" ' +
        'data-cmd-open="' + escapeAttr(item.link.id) + '" role="option" tabindex="-1">' +
        cmdFaviconHtml(item.link) +
        '<div class="cmd-item-body">' +
          '<div class="cmd-item-title">' + escapeHtml(item.link.title || item.link.url) + '</div>' +
          (metaParts.length ? '<div class="cmd-item-meta">' + escapeHtml(metaParts.join(" · ")) + '</div>' : '') +
        '</div>' +
        '<svg class="cmd-item-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
        '</a>';
    }

    cmdPaletteEl.results.innerHTML = html + itemsHtml;

    // Bind click events
    cmdPaletteEl.results.querySelectorAll("[data-cmd-open]").forEach(function (a) {
      a.addEventListener("click", function () {
        recordOpen(a.getAttribute("data-cmd-open"));
        closeCmdPalette();
      });
    });
  }

  function cmdSetActive(idx) {
    var items = cmdPaletteEl.results.querySelectorAll(".cmd-item");
    items.forEach(function (el2, i) {
      el2.classList.toggle("active", i === idx);
    });
    if (items[idx]) {
      items[idx].scrollIntoView({ block: "nearest" });
    }
    cmdActiveIndex = idx;
  }

  function cmdNavigate(dir) {
    var items = cmdPaletteEl.results.querySelectorAll(".cmd-item");
    if (!items.length) return;
    var next = cmdActiveIndex + dir;
    if (next < 0) next = items.length - 1;
    if (next >= items.length) next = 0;
    cmdSetActive(next);
  }

  if (cmdPaletteEl.overlay) {
    // Search input
    cmdPaletteEl.input.addEventListener("input", function () {
      cmdActiveIndex = -1;
      renderCmdResults(cmdPaletteEl.input.value);
    });

    // Keyboard nav inside palette
    cmdPaletteEl.input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); cmdNavigate(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); cmdNavigate(-1); }
      else if (e.key === "Enter") {
        e.preventDefault();
        var items = cmdPaletteEl.results.querySelectorAll(".cmd-item");
        var target = cmdActiveIndex >= 0 ? items[cmdActiveIndex] : items[0];
        if (target) { target.click(); }
      }
      else if (e.key === "Escape") { closeCmdPalette(); }
    });

    // Click outside to close
    cmdPaletteEl.overlay.addEventListener("click", function (e) {
      if (e.target === cmdPaletteEl.overlay) closeCmdPalette();
    });
  }

  // Toolbar button
  var btnCmdPalette = document.getElementById("btnCmdPalette");
  if (btnCmdPalette) {
    btnCmdPalette.addEventListener("click", openCmdPalette);
  }

  /* ---------- Init + bindings ---------- */
  initTheme();
  renderHero();
  renderFolders();
  renderSmartFolders();
  renderLinks();
  renderSidebarFooter();
  setupDragDrop();

  document.getElementById("btnAddLink").addEventListener("click", openAddModal);
  document.getElementById("btnAddFolder").addEventListener("click", openFolderModal);
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalCancel").addEventListener("click", closeModal);
  document.getElementById("modalSave").addEventListener("click", saveLink);
  document.getElementById("folderModalClose").addEventListener("click", closeFolderModal);
  document.getElementById("folderModalCancel").addEventListener("click", closeFolderModal);
  document.getElementById("folderModalSave").addEventListener("click", saveFolder);
  el.folderParent.addEventListener("change", updateFolderParentPreview);
  el.folderParentPickerTrigger.addEventListener("click", toggleFolderParentPicker);
  document.getElementById("btnExport").addEventListener("click", exportJson);
  el.btnTheme.addEventListener("click", toggleTheme);
  el.btnHelp.addEventListener("click", openHelp);
  el.helpClose.addEventListener("click", closeHelp);
  el.helpOverlay.addEventListener("click", function (e) { if (e.target === el.helpOverlay) closeHelp(); });

  el.confirmCancel.addEventListener("click", function () { resolveConfirm(false); });
  el.confirmOk.addEventListener("click", function () { resolveConfirm(true); });
  el.confirmOverlay.addEventListener("click", function (e) {
    if (e.target === el.confirmOverlay) resolveConfirm(false);
  });

  if (el.btnEmptyAdd) el.btnEmptyAdd.addEventListener("click", openAddModal);
  if (el.weatherChange) el.weatherChange.addEventListener("click", changeLocation);

  document.getElementById("btnConvertPath").addEventListener("click", function () {
    var converted = windowsPathToFileUrl(el.linkUrl.value);
    if (converted) {
      el.linkUrl.value = converted;
      toast("Path converted to file:// link", { type: "success", duration: 2000 });
    } else {
      toast("Could not convert. Use a path like C:\\Users\\Name\\Folder.", { type: "error" });
    }
  });

  el.modalOverlay.addEventListener("click", function (e) {
    if (e.target === el.modalOverlay) closeModal();
  });
  el.folderModalOverlay.addEventListener("click", function (e) {
    if (e.target === el.folderModalOverlay) closeFolderModal();
  });
  document.addEventListener("click", function (e) {
    if (!el.folderParentPicker.contains(e.target)) closeFolderParentPicker();
    if (!el.folderContextMenu.contains(e.target)) closeFolderContextMenu();
  });

  el.searchInput.addEventListener("input", function () { renderLinks(); });

  el.importFile.addEventListener("change", function () { handleImportFile(el.importFile); });
  if (el.emptyImportFile) {
    el.emptyImportFile.addEventListener("change", function () { handleImportFile(el.emptyImportFile); });
  }

  el.btnMenu.addEventListener("click", function () {
    if (el.sidebar.classList.contains("open")) closeMobileSidebar();
    else openMobileSidebar();
  });
  el.sidebarBackdrop.addEventListener("click", closeMobileSidebar);

  document.addEventListener("keydown", function (e) {
    var anyModalOpen = el.modalOverlay.classList.contains("open") ||
      el.folderModalOverlay.classList.contains("open") ||
      el.confirmOverlay.classList.contains("open") ||
      el.helpOverlay.classList.contains("open");
    var inField = e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable);

    // ⌘K / Ctrl+K — command palette
    if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
      e.preventDefault();
      if (isCmdOpen()) closeCmdPalette();
      else openCmdPalette();
      return;
    }

    if (isCmdOpen()) return; // let palette handle its own keys

    if (e.key === "/" && document.activeElement !== el.searchInput && !anyModalOpen) {
      e.preventDefault();
      el.searchInput.focus();
      return;
    }
    if (!anyModalOpen && !inField) {
      if (e.key === "n" || e.key === "N") { e.preventDefault(); openAddModal(); return; }
      if (e.key === "t" || e.key === "T") { e.preventDefault(); toggleTheme(); return; }
      if (e.key === "?" || (e.shiftKey && e.key === "/")) { e.preventDefault(); openHelp(); return; }
    }
    if (e.key === "Escape") {
      closeFolderParentPicker();
      closeFolderContextMenu();
      closeModal();
      closeFolderModal();
      closeHelp();
      closeCmdPalette();
      if (el.confirmOverlay.classList.contains("open")) resolveConfirm(false);
      closeMobileSidebar();
    }
  });

  // Refresh time-ago labels and clock periodically
  setInterval(function () {
    if (document.hidden) return;
    renderLinks();
    renderSidebarFooter();
  }, 60000);
})();
