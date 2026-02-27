export interface Bookmark {
  id: string;
  url: string;
  title: string;
  tags: string[];
  created_at: string;
}

export type CreateBookmarkInput = {
  url: string;
  title: string;
  tags?: string[];
};

export type UpdateBookmarkInput = Partial<CreateBookmarkInput>;
