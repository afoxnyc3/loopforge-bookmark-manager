import React, { useState, useEffect } from 'react';

interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { url: string; title: string; tags: string[] }) => Promise<void>;
}

export default function AddBookmarkModal({ isOpen, onClose, onAdd }: AddBookmarkModalProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ url?: string; title?: string }>({});

  useEffect(() => {
    if (!isOpen) {
      setUrl('');
      setTitle('');
      setTagsInput('');
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors: { url?: string; title?: string } = {};
    if (!url.trim()) {
      newErrors.url = 'URL is required';
    } else {
      try {
        new URL(url.trim());
      } catch {
        newErrors.url = 'Please enter a valid URL';
      }
    }
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    setIsSubmitting(true);
    try {
      await onAdd({ url: url.trim(), title: title.trim(), tags });
      onClose();
    } catch (err) {
      console.error('Failed to add bookmark:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Add Bookmark</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className={`block w-full px-3 py-2.5 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.url ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.url && <p className="mt-1 text-xs text-red-500">{errors.url}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My bookmark title"
              className={`block w-full px-3 py-2.5 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="react, tools, design (comma-separated)"
              className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <p className="mt-1 text-xs text-gray-400">Separate tags with commas</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Adding...' : 'Add Bookmark'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
