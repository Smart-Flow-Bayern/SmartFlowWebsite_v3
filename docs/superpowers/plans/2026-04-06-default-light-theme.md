# Default Light Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Switch the default theme from dark to light, so first-time visitors see a light page and can toggle to dark mode.

**Architecture:** Swap the CSS variable values between `:root` (becomes light) and `[data-theme="dark"]` (new, replaces `[data-theme="light"]`). Update JS to persist/restore only `"dark"` instead of `"light"`. Flip the theme-toggle icon visibility logic. Update Cal.com embed theme detection. Re-minify both files.

**Tech Stack:** CSS custom properties, vanilla JS, npx terser, npx clean-css-cli

---

### Task 1: Swap CSS `:root` and theme override variables

**Files:**
- Modify: `css/styles.css:19-82` (design tokens)

- [ ] **Step 1: Replace `:root` color block with light values**

In `css/styles.css`, replace lines 19-64 with:

```css
:root {
  --color-bg: #ffffff;
  --color-bg-alt: #f5f5f5;
  --color-surface: #eeeeee;
  --color-text: #111111;
  --color-text-secondary: #555555;
  --color-text-muted: #888888;
  --color-accent: #0099bb;
  --color-border: rgba(0, 0, 0, 0.1);

  --font-body: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;

  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;

  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2rem;
  --space-xl: 3rem;
  --space-2xl: 5rem;
  --space-3xl: 8rem;

  --section-gap: clamp(120px, 15vh, 200px);
  --container-max: 1000px;
  --header-height: 72px;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;

  --z-sticky: 200;

  /* Theme toggle button */
  --header-bg: rgba(255, 255, 255, 0.85);
  --mobile-menu-bg: #f0f0f0;
  --btn-cta-bg: #111111;
  --btn-cta-color: #ffffff;
  --process-number-color: rgba(0, 0, 0, 0.16);
}
```

- [ ] **Step 2: Replace `[data-theme="light"]` block with `[data-theme="dark"]`**

Replace lines 66-82 (the `[data-theme="light"]` block) with:

```css
/* Dark theme */
[data-theme="dark"] {
  --color-bg: #000000;
  --color-bg-alt: #111111;
  --color-surface: #1a1a1a;
  --color-text: #ffffff;
  --color-text-secondary: #999999;
  --color-text-muted: #666666;
  --color-accent: #00D9FF;
  --color-border: rgba(255, 255, 255, 0.1);

  --header-bg: rgba(0, 0, 0, 0.85);
  --mobile-menu-bg: #0a0a0a;
  --btn-cta-bg: #ffffff;
  --btn-cta-color: #000000;
  --process-number-color: rgba(255, 255, 255, 0.08);
}
```

---

### Task 2: Fix theme-toggle icon visibility CSS

**Files:**
- Modify: `css/styles.css:251-266` (theme toggle icon rules)

The current logic shows sun icon by default (dark mode = show sun to switch to light). After the swap, the default is light, so we show the moon icon by default (to switch to dark).

- [ ] **Step 1: Replace theme toggle icon rules**

Replace the icon visibility block (lines 251-266) with:

```css
.theme-toggle .icon-sun,
.theme-toggle .icon-moon {
  display: none;
}

:root .theme-toggle .icon-moon {
  display: block;
}

[data-theme="dark"] .theme-toggle .icon-moon {
  display: none;
}

[data-theme="dark"] .theme-toggle .icon-sun {
  display: block;
}
```

Logic: Default (light) shows moon icon (click to go dark). Dark mode shows sun icon (click to go light).

---

### Task 3: Update JavaScript theme persistence logic

**Files:**
- Modify: `js/main.js:1-9` (IIFE theme restore)
- Modify: `js/main.js:155-171` (initThemeToggle function)

- [ ] **Step 1: Update the IIFE to restore only "dark"**

Replace lines 3-9 with:

```js
/* Theme: apply saved preference before paint to avoid flash */
(function() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
```

- [ ] **Step 2: Update initThemeToggle to toggle "dark" attribute**

Replace lines 155-171 with:

```js
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    if (next === 'light') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.removeItem('theme');
    } else {
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    }
  });
}
```

Logic: Light is now the default (no attribute). Only `"dark"` gets saved to localStorage and applied as `data-theme="dark"`.

---

### Task 4: Update Cal.com embed theme detection

**Files:**
- Modify: `index.html:486`
- Modify: `en/index.html:486`

- [ ] **Step 1: Fix Cal.com theme detection in `index.html`**

Replace line 486:

```js
          var calTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
```

with:

```js
          var calTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
```

- [ ] **Step 2: Fix Cal.com theme detection in `en/index.html`**

Replace the same line 486 in `en/index.html`:

```js
          var calTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
```

with:

```js
          var calTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
```

---

### Task 5: Re-minify CSS and JS

**Files:**
- Overwrite: `css/styles.min.css`
- Overwrite: `js/main.min.js`

- [ ] **Step 1: Minify CSS**

```bash
npx clean-css-cli -o css/styles.min.css css/styles.css
```

- [ ] **Step 2: Minify JS**

```bash
npx terser js/main.js -c -m -o js/main.min.js
```

---

### Task 6: Manual verification

- [ ] **Step 1: Start local server and verify light default**

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080` in a fresh browser (or incognito). The page should render with a **white/light background** by default.

- [ ] **Step 2: Verify dark toggle works**

Click the theme toggle (moon icon). The page should switch to dark mode. The icon should change to a sun. Refresh the page — dark mode should persist.

- [ ] **Step 3: Verify toggle back to light**

Click the sun icon. The page should return to light mode. Refresh — light should persist (or rather, no theme is stored, so default light appears).

- [ ] **Step 4: Verify Cal.com embed matches theme**

Scroll to the contact/booking section. The Cal.com embed should match the current theme (light embed on light page, dark embed on dark page).

- [ ] **Step 5: Verify legal pages have theme toggle**

Navigate to `/impressum.html` and toggle theme. Verify the toggle button is present and functional.

- [ ] **Step 6: Verify 404 page colors**

Navigate to a non-existent URL. The 404 page should display correctly in both light and dark themes with readable text.

- [ ] **Step 7: Stop the server**

```bash
lsof -ti:8080 | xargs kill
```

---

### Task 7: Commit

- [ ] **Step 1: Stage and commit all changes**

```bash
git add css/styles.css css/styles.min.css js/main.js js/main.min.js index.html en/index.html
git commit -m "feat: switch default theme from dark to light

Light theme is now the default for first-time visitors.
Dark mode available via toggle and persisted in localStorage."
```
