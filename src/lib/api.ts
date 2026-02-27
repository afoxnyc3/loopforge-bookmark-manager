import type {
  Bookmark,
  BookmarkFilters,
  BookmarksApiResponse,
  CreateBookmarkPayload,
  UpdateBookmarkPayload,
} from '@/types/bookmark';

const API_BASE = '/api/bookmarks';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchBookmarks(
  filters: BookmarkFilters = {}
): Promise<BookmarksApiResponse> {
  const params = new URLSearchParams();
  if (filters.tag) params.set('tag', filters.tag);
  if (filters.search) params.set('search', filters.search);

  const url = params.toString() ? `${API_BASE}?${params}` : API_BASE;
  const res = await fetch(url);
  return handleResponse<BookmarksApiResponse>(res);
}

export async function createBookmark(
  payload: CreateBookmarkPayload
): Promise<Bookmark> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Bookmark>(res);
}

export async function updateBookmark(
  id: string,
  payload: UpdateBookmarkPayload
): Promise<Bookmark> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Bookmark>(res);
}

export async function deleteBookmark(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `Delete failed with status ${res.status}`);
  }
}
