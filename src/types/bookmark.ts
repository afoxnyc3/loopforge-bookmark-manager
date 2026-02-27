export interface Bookmark {
  id: string;
  url: string;
  title: string;
  tags: string[];
  created_at: string;
}

export type CreateBookmarkInput = Omit<Bookmark, 'id' | 'created_at'>;
