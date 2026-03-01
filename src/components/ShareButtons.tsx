'use client';

/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */


interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = [
    {
      name: 'Twitter',
      icon: '𝕏',
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}%20via%20cryptocurrency.cv&url=${encodedUrl}`,
      color: 'hover:bg-black hover:text-white',
    },
    {
      name: 'LinkedIn',
      icon: 'in',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:bg-blue-700 hover:text-white',
    },
    {
      name: 'Reddit',
      icon: '⬆',
      url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      color: 'hover:bg-orange-500 hover:text-white',
    },
    {
      name: 'Telegram',
      icon: '✈',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}%20via%20cryptocurrency.cv`,
      color: 'hover:bg-blue-500 hover:text-white',
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="flex items-center gap-1">
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-sm transition-colors ${link.color}`}
          title={`Share on ${link.name}`}
        >
          {link.icon}
        </a>
      ))}
      <button
        onClick={handleCopyLink}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-sm transition-colors hover:bg-gray-700 hover:text-white"
        title="Copy link"
      >
        🔗
      </button>
    </div>
  );
}
