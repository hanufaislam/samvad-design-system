const root = document.documentElement;
const base = (document.body.dataset.base || '/').replace(/\/?$/, '/');
type SearchPage = { title: string; group: string; path: string; description: string; keywords: string };
const pages: SearchPage[] = JSON.parse(document.getElementById('search-pages')!.textContent || '[]');
const get = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const readSetting = (key: string) => { try { return localStorage.getItem(key); } catch { return null; } };
const saveSetting = (key: string, value: string) => { try { localStorage.setItem(key, value); } catch { /* Storage is optional. */ } };

// The documentation theme is separate from the pending production token modes.
const themeButton = get<HTMLButtonElement>('theme-toggle');
function syncThemeButton() {
  const dark = root.dataset.theme === 'dark';
  const label = `Switch to ${dark ? 'light' : 'dark'} theme`;
  themeButton.setAttribute('aria-label', label);
  themeButton.title = label;
  themeButton.setAttribute('aria-pressed', String(dark));
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = getComputedStyle(root).getPropertyValue('--docs-bg').trim();
}
syncThemeButton();
themeButton.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  saveSetting('samvad-docs-theme', root.dataset.theme!);
  syncThemeButton();
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  if (readSetting('samvad-docs-theme')) return;
  root.dataset.theme = event.matches ? 'dark' : 'light';
  syncThemeButton();
});

// Keep the active group discoverable; remember optional disclosure choices.
document.querySelectorAll<HTMLDetailsElement>('[data-nav-group]').forEach(group => {
  const name = group.dataset.navGroup!;
  const saved = readSetting(`samvad-docs-nav:${name}`);
  if (group.querySelector('[aria-current="page"]')) group.open = true;
  else if (saved !== null) group.open = saved === 'true';
  group.addEventListener('toggle', () => saveSetting(`samvad-docs-nav:${name}`, String(group.open)));
});
// New component destinations can sit below several expanded groups. Reveal
// the active item within the sidebar without changing the documentation shell.
requestAnimationFrame(()=>document.querySelector<HTMLElement>('.desktop-sidebar [aria-current="page"]')?.scrollIntoView({block:'nearest'}));

const drawer = get<HTMLDialogElement>('mobile-navigation');
const navigationTrigger = get<HTMLButtonElement>('open-navigation');
navigationTrigger.addEventListener('click', () => {
  drawer.showModal();
  navigationTrigger.setAttribute('aria-expanded', 'true');
  drawer.querySelector<HTMLElement>('[aria-current="page"]')?.scrollIntoView({block:'nearest'});
});
document.querySelector('[data-close-navigation]')!.addEventListener('click', () => drawer.close());
drawer.addEventListener('click', event => { if (event.target === drawer) {
  const bounds = drawer.getBoundingClientRect();
  if (event.clientX > bounds.right || event.clientX < bounds.left) drawer.close();
} });
drawer.addEventListener('close', () => navigationTrigger.setAttribute('aria-expanded', 'false'));
matchMedia('(min-width: 768px)').addEventListener('change', event => { if (event.matches && drawer.open) drawer.close(); });

const dialog = get<HTMLDialogElement>('search-dialog');
const input = get<HTMLInputElement>('docs-search');
const resultList = get<HTMLUListElement>('search-results');
const searchStatus = get<HTMLParagraphElement>('search-status');
let searchModule: Promise<any> | undefined;
let requestId = 0;
let debounce: ReturnType<typeof setTimeout>;
let searchOpener: HTMLElement | null = null;
function appendResult(title: string, group: string, url: string, excerpt: string) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = url;
  const small = document.createElement('small'); small.textContent = group;
  const strong = document.createElement('strong'); strong.textContent = title;
  const p = document.createElement('p'); p.textContent = excerpt.replace(/<[^>]*>/g, '');
  a.append(small, strong, p); li.append(a); resultList.append(li);
}
function pageMatches(query: string) {
  return pages.filter(p => `${p.title} ${p.group} ${p.description} ${p.keywords}`.toLowerCase().includes(query.toLowerCase()));
}
async function search(query: string) {
  const ownRequest = ++requestId;
  const q = query.trim();
  resultList.replaceChildren();
  if (!q) {
    pages.forEach(p => appendResult(p.title, p.group, base + p.path, p.description));
    searchStatus.textContent = `Explore the ${pages.length} available preview pages.`;
    return;
  }
  searchStatus.textContent = 'Searching documentation…';
  try {
    // In development there is no generated Pagefind index. The production
    // build + local preview uses full-text Pagefind, not this title fallback.
    if (import.meta.env.DEV) throw new Error('Development route search');
    searchModule ||= import(/* @vite-ignore */ `${base}pagefind/pagefind.js`).then(async module => {
      await module.options({ baseUrl: base }); return module;
    }).catch(error => { searchModule = undefined; throw error; });
    const module = await searchModule;
    const response = await module.search(q);
    const found = await Promise.all(response.results.slice(0, 8).map((r: any) => r.data()));
    if (ownRequest !== requestId) return;
    resultList.replaceChildren();
    found.forEach((r: any) => {
      const page = pages.find(p => new URL(base + p.path, location.origin).pathname === new URL(r.url, location.origin).pathname);
      appendResult(page?.title || r.meta.title || 'Documentation', page?.group || 'Documentation', r.url, r.excerpt);
    });
    searchStatus.textContent = found.length ? `${found.length} result${found.length === 1 ? '' : 's'} for “${q}”.` : `No results for “${q}”. Try colour, typography or principles.`;
  } catch {
    if (ownRequest !== requestId) return;
    const matches = pageMatches(q);
    resultList.replaceChildren();
    matches.forEach(p => appendResult(p.title, p.group, base + p.path, p.description));
    searchStatus.textContent = matches.length ? `${matches.length} page match${matches.length === 1 ? '' : 'es'} for “${q}”.` : `No page matches for “${q}”. Try colour, typography or principles.`;
  }
}
function openSearch() {
  if (drawer.open) drawer.close();
  searchOpener = document.activeElement as HTMLElement;
  if (!dialog.open) dialog.showModal();
  input.focus(); input.select(); void search(input.value);
}
document.querySelectorAll('[data-open-search]').forEach(button => button.addEventListener('click', openSearch));
document.querySelector('[data-close-search]')!.addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { ++requestId; searchOpener?.focus(); });
// A focused WebKit search input can consume Escape to clear its value before
// the dialog's native cancel action. Dismiss explicitly and return focus.
dialog.addEventListener('keydown', event => {
  if(event.key==='Escape'){event.preventDefault();event.stopPropagation();dialog.close();}
});
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
input.addEventListener('input', () => { ++requestId; clearTimeout(debounce); debounce = setTimeout(() => void search(input.value), 120); });
input.addEventListener('keydown', event => { if (event.key === 'ArrowDown') { event.preventDefault(); resultList.querySelector<HTMLAnchorElement>('a')?.focus(); } });
resultList.addEventListener('keydown', event => {
  if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
  const links = [...resultList.querySelectorAll<HTMLAnchorElement>('a')];
  const current = links.indexOf(document.activeElement as HTMLAnchorElement);
  if (current < 0) return;
  event.preventDefault();
  if (event.key === 'ArrowUp' && current === 0) input.focus();
  else links[Math.min(links.length - 1, current + (event.key === 'ArrowDown' ? 1 : -1))]?.focus();
});
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); dialog.open ? dialog.close() : openSearch(); }
});
if (!/Mac|iPhone|iPad/.test(navigator.platform)) document.querySelectorAll('.search-trigger kbd').forEach(kbd => kbd.textContent = 'Ctrl K');

let toastTimeout: ReturnType<typeof setTimeout>;
document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach(button => button.addEventListener('click', async () => {
  const value = button.dataset.copy!;
  const status = get<HTMLDivElement>('copy-status');
  try { await navigator.clipboard.writeText(value); status.textContent = `Copied ${button.dataset.copyLabel || value}`; }
  catch { status.textContent = `Copy unavailable. Value: ${value}`; }
  status.classList.add('visible'); clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => status.classList.remove('visible'), 2400);
}));
get<HTMLInputElement>('type-input')?.addEventListener('input', event => {
  const value = (event.target as HTMLInputElement).value || 'A little character. A lot of clarity.';
  document.querySelectorAll('[data-type-example]').forEach(example => example.textContent = value);
});

// Mark the current visible content section without changing browser history.
const tocLinks = [...document.querySelectorAll<HTMLAnchorElement>('.on-this-page nav a')];
const sections = tocLinks.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean) as HTMLElement[];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.find(entry => entry.isIntersecting);
    if (!visible) return;
    tocLinks.forEach(link => { if (link.hash === `#${visible.target.id}`) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  }, { rootMargin: '-100px 0px -55% 0px' });
  sections.forEach(section => observer.observe(section));
}
