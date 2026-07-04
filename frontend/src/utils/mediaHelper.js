/**
 * Helper to resolve media URLs.
 * If the URL starts with '/static/', it prepends the backend base URL (VITE_API_BASE_URL).
 * Otherwise, it returns the URL unchanged (e.g. Cloudinary URLs or full URLs).
 */
export const getMediaUrl = (url) => {
  if (!url) return '';
  
  if (url.startsWith('/static/')) {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
    // Strip trailing slash if present
    const formattedBase = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
    return `${formattedBase}${url}`;
  }
  
  return url;
};
