import React from 'react';

interface TagFilterProps {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export default function TagFilter({ tags, selectedTag, onSelectTag }: TagFilterProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelectTag(null)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          selectedTag === null
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedTag === tag
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
