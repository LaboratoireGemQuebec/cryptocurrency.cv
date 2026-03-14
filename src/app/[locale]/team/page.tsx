import React from 'react';
import { TEAM } from '../../../data/team';
import { TeamMemberCard } from '../../../components/TeamMemberCard';

export default async function TeamPage() {
  // Fetch contributors from API
  const contributorsRes = await fetch('/api/contributors');
  const contributors = contributorsRes.ok ? await contributorsRes.json() : [];

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 flex items-center text-3xl font-bold">👥 Our Team</h1>
      <p className="mb-8 text-lg text-gray-600">The people behind free-crypto-news</p>

      {/* Leadership */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Leadership</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {TEAM.filter((m) => m.type === 'leadership').map((member) => (
            <TeamMemberCard key={member.slug} member={member} />
          ))}
        </div>
      </section>

      {/* Contributors */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Contributors</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TEAM.filter((m) => m.type === 'core' || m.type === 'contributor').map((member) => (
            <TeamMemberCard key={member.slug} member={member} />
          ))}
        </div>
      </section>

      {/* Open Source Contributors */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Open Source Contributors</h2>
        <p className="mb-4">
          Thanks to our GitHub contributors who have helped build this project.{' '}
          <a
            href="https://github.com/nirholas/free-crypto-news/graphs/contributors"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View all contributors on GitHub →
          </a>
        </p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {contributors.map((c: any) => (
            <a
              key={c.username}
              href={c.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center"
            >
              <img src={c.avatarUrl} alt={c.username} className="mb-1 h-12 w-12 rounded-full" />
              <span className="text-xs font-medium">{c.username}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Join Us */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Join Us</h2>
        <p className="mb-2">We're always looking for contributors.</p>
        <div className="flex space-x-4">
          <a
            href="https://github.com/nirholas/free-crypto-news/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View open issues on GitHub →
          </a>
          <a
            href="https://github.com/nirholas/free-crypto-news/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Read our contributing guide →
          </a>
        </div>
      </section>
    </main>
  );
}
