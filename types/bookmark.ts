export interface Bookmark {
  id: string;
  url: string;
  title: string;
  tags: string[];
  created_at: string;
}

export interface CreateBookmarkInput {
  url: string;
  title: string;
  tags?: string[];
}

export interface UpdateBookmarkInput {
  url?: string;
  title?: string;
  tags?: string[];
}

export interface BookmarkQueryParams {
  tag?: string;
  search?: string;
}

export interface ApiError {
  error: string;
  details?: string;
}

export type ApiResponse<T> = T | ApiError;
