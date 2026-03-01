/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

export interface VideoItem {
  id: string;
  title: string;
  channel: string;
  channelUrl: string;
  thumbnail: string;
  duration: string;
  date: string;
  category: 'video' | 'podcast' | 'livestream';
  tags: string[];
  url: string;
  description: string;
}

export interface PodcastShow {
  id: string;
  name: string;
  host: string;
  description: string;
  logo: string;
  platforms: { name: string; url: string }[];
  category: string;
  frequency: string;
  rating: number;
}
