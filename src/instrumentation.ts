export async function register() {
  // Node.js 25 ships an experimental localStorage that is a Proxy without
  // working getItem/setItem unless --localstorage-file is provided.
  // Patch it so SSR code and dependencies don't crash.
  if (typeof globalThis.localStorage !== "undefined") {
    try {
      globalThis.localStorage.getItem("__test");
    } catch {
      // Replace the broken proxy with a simple Map-backed implementation
      const store = new Map<string, string>();
      (globalThis as Record<string, unknown>).localStorage = {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => { store.set(k, String(v)); },
        removeItem: (k: string) => { store.delete(k); },
        clear: () => { store.clear(); },
        get length() { return store.size; },
        key: (i: number) => [...store.keys()][i] ?? null,
      };
    }
  }
}
