import { type TeamMember } from '@/data/team';
import { Github, Twitter, Linkedin } from 'lucide-react';

interface Props {
  member: TeamMember;
  featured?: boolean;
}

export function TeamMemberCard({ member, featured }: Props) {
  const avatarUrl =
    member.avatarUrl ??
    (member.githubUsername
      ? `https://github.com/${member.githubUsername}.png?size=160`
      : undefined);

  return (
    <div
      className={`flex ${featured ? 'flex-row gap-6' : 'flex-col items-center'} rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-6 transition-colors hover:border-[var(--color-accent)]/50`}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={member.name}
          width={featured ? 96 : 80}
          height={featured ? 96 : 80}
          className={`rounded-full ${featured ? 'h-24 w-24' : 'mb-3 h-20 w-20'} shrink-0`}
        />
      ) : (
        <div
          className={`flex items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-3xl ${featured ? 'h-24 w-24' : 'mb-3 h-20 w-20'} shrink-0`}
        >
          👤
        </div>
      )}
      <div className={featured ? '' : 'text-center'}>
        <div className="text-lg font-bold text-[var(--color-text-primary)]">{member.name}</div>
        <div className="mb-1 text-sm font-medium text-[var(--color-accent)]">{member.role}</div>
        {member.bio && (
          <p className="mb-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {member.bio}
          </p>
        )}
        <div className="flex justify-center gap-3">
          {member.githubUsername && (
            <a
              href={`https://github.com/${member.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {member.twitterHandle && (
            <a
              href={`https://x.com/${member.twitterHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              title="X (Twitter)"
              className="text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              <Twitter className="h-4 w-4" />
            </a>
          )}
          {member.linkedinUrl && (
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
