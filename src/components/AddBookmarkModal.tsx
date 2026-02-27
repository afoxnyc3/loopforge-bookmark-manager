'use client';

import { useEffect, useRef, useState } from 'react';
import type { Bookmark } from '@/types/bookmark';

interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: { url: string; title: string; tags: string[] }) => Promise<void>;
  initialValues?: Partial<Bookmark>;
  title?: string;
}

export function AddBookmarkModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  title = 'Add Bookmark',
}: AddBookmarkModalProps) {
  const [url, setUrl] = useState(initialValues?.url ?? '');
  const [bookmarkTitle, setBookmarkTitle] = useState(initialValues?.title ?? '');
  const [tagsInput, setTagsInput] = useState(
    initialValues?.tags?.join(', ') ?? ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  // Sync form when initialValues change (edit mode)
  useEffect(() => {
    if (isOpen) {
      setUrl(initialValues?.url ?? '');
      setBookmarkTitle(initialValues?.title ?? '');
      setTagsInput(initialValues?.tags?.join(', ') ?? '');
      setValidationError(null);
      setTimeout(() => urlInputRef.current?.focus(), 50);
    }
  }, [isOpen, initialValues]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedUrl = url.trim();
    const trimmedTitle = bookmarkTitle.trim();

    if (!trimmedUrl) {
      setValidationError('URL is required.');
      return;
    }
    try {
      new URL(trimmedUrl);
    } catch {
      setValidationError('Please enter a valid URL (e.g. https://example.com).');
      return;
    }
    if (!trimmedTitle) {
      setValidationError('Title is required.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    setIsSubmitting(true);
    try {
      await onSubmit({ url: trimmedUrl, title: trimmedTitle, tags });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 id="modal-title" className="text-base font-semibold text-gray-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="px-6 py-5 space-y-4">
            {validationError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {validationError}
              </div>
            )}

            <div>
              <label
                htmlFor="bookmark-url"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                URL <span className="text-red-500">*</span>
              </label>
              <input
                ref={urlInputRef}
                id="bookmark-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="input-field"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="bookmark-title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="bookmark-title"
                type="text"
                value={bookmarkTitle}
                onChange={(e) => setBookmarkTitle(e.target.value)}
                placeholder="My Awesome Resource"
                className="input-field"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="bookmark-tags"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tags
                <span className="ml-1 text-xs font-normal text-gray-400">
                  (comma-separated)
                </span>
              </label>
              <input
                id="bookmark-tags"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="react, typescript, tools"
                className="input-field"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 12 0 12 12h4z"
                    />
                  </svg>
                  Saving…
                </>
              ) : (
                title
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
