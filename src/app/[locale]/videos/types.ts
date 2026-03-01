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
