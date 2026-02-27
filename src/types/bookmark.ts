export interface Bookmark {
  id: string;
  url: string;
  title: string;
  tags: string[];
  created_at: string;
}

export interface CreateBookmarkPayload {
  url: string;
  title: string;
  tags?: string[];
}

export interface UpdateBookmarkPayload {
  url?: string;
  title?: string;
  tags?: string[];
}

export interface BookmarkFilters {
  tag?: string;
  search?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface BookmarksApiResponse {
  data: Bookmark[];
  count: number;
}
