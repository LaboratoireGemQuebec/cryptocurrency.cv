import React from "react";
import { TEAM } from "../../../data/team";
import { TeamMemberCard } from "../../../components/TeamMemberCard";

export default async function TeamPage() {
  // Fetch contributors from API
  const contributorsRes = await fetch("/api/contributors");
  const contributors = contributorsRes.ok ? await contributorsRes.json() : [];

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2 flex items-center">👥 Our Team</h1>
      <p className="text-lg text-gray-600 mb-8">The people behind free-crypto-news</p>

      {/* Leadership */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Leadership</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TEAM.filter(m => m.type === "leadership").map(member => (
            <TeamMemberCard key={member.slug} member={member} />
          ))}
        </div>
      </section>

      {/* Contributors */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Contributors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEAM.filter(m => m.type === "core" || m.type === "contributor").map(member => (
            <TeamMemberCard key={member.slug} member={member} />
          ))}
        </div>
      </section>

      {/* Open Source Contributors */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Open Source Contributors</h2>
        <p className="mb-4">Thanks to our GitHub contributors who have helped build this project. <a href="https://github.com/nirholas/free-crypto-news/graphs/contributors" target="_blank" rel="noopener noreferrer" className="underline">View all contributors on GitHub →</a></p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {contributors.map((c: any) => (
            <a key={c.username} href={c.profileUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
              <img src={c.avatarUrl} alt={c.username} className="w-12 h-12 rounded-full mb-1" />
              <span className="text-xs font-medium">{c.username}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Join Us */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Join Us</h2>
        <p className="mb-2">We're always looking for contributors.</p>
        <div className="flex space-x-4">
          <a href="https://github.com/nirholas/free-crypto-news/issues" target="_blank" rel="noopener noreferrer" className="underline">View open issues on GitHub →</a>
          <a href="https://github.com/nirholas/free-crypto-news/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="underline">Read our contributing guide →</a>
        </div>
      </section>
    </main>
  );
}
