/** Documentation paths; keep root, project-base and external destinations distinct. */
export const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
export const href = (path = '') => base + path.replace(/^\//, '');
export function internalHref(value: string | URL | null | undefined) {
 if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return value;
 return base !== '/' && (value === base.slice(0,-1) || value.startsWith(base)) ? value : href(value);
}
