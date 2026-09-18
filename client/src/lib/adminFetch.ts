// fetch untuk endpoint admin: menyertakan token login yang disimpan AuthContext
export function adminFetch(url: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const token = localStorage.getItem('admin_token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return fetch(url, { ...init, headers });
}
