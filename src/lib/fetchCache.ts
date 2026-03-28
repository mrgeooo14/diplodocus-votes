const cache = new Map<string, unknown>();

export async function fetchJSON<T>(url: string): Promise<T> {
  if (cache.has(url)) return cache.get(url) as T;
  const res = await fetch(url);
  const data: T = await res.json();
  cache.set(url, data);
  return data;
}
