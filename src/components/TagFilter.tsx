'use client';

interface TagFilterProps {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export function TagFilter({ tags, selectedTag, onSelectTag }: TagFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mr-1">
        Filter:
      </span>
      <button
        onClick={() => onSelectTag(null)}
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
          selectedTag === null
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            selectedTag === tag
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}
