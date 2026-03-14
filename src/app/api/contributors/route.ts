import { NextRequest, NextResponse } from 'next/server';

const GITHUB_API = 'https://api.github.com/repos/nirholas/free-crypto-news/contributors';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

let cachedContributors: any = null;
let cacheTimestamp = 0;

export async function GET(req: NextRequest) {
  const now = Date.now();
  if (cachedContributors && now - cacheTimestamp < CACHE_DURATION) {
    return NextResponse.json(cachedContributors);
  }

  const res = await fetch(GITHUB_API);
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch contributors' }, { status: 500 });
  }
  const contributors = await res.json();
  const mapped = contributors.map((c: any) => ({
    avatarUrl: c.avatar_url,
    username: c.login,
    contributions: c.contributions,
    profileUrl: c.html_url,
  }));
  cachedContributors = mapped;
  cacheTimestamp = now;
  return NextResponse.json(mapped);
}
