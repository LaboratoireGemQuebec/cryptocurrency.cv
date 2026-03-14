import React from 'react';
import { TeamMember } from '../data/team';

interface Props {
  member: TeamMember;
}

export const TeamMemberCard: React.FC<Props> = ({ member }) => {
  return (
    <div className="flex flex-col items-center rounded-lg bg-white p-4 shadow">
      {member.avatarUrl ? (
        <img src={member.avatarUrl} alt={member.name} className="mb-2 h-20 w-20 rounded-full" />
      ) : (
        <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-3xl">
          👤
        </div>
      )}
      <div className="mb-1 text-lg font-semibold">{member.name}</div>
      <div className="mb-1 text-sm text-gray-600">{member.role}</div>
      <div className="mb-2 text-center text-xs text-gray-500">{member.bio}</div>
      <div className="flex space-x-2">
        {member.githubUsername && (
          <a
            href={`https://github.com/${member.githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
          >
            <span role="img" aria-label="GitHub">
              🐙
            </span>
          </a>
        )}
        {member.twitterHandle && (
          <a
            href={`https://twitter.com/${member.twitterHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Twitter/X"
          >
            <span role="img" aria-label="Twitter">
              🐦
            </span>
          </a>
        )}
        {member.linkedinUrl && (
          <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn">
            <span role="img" aria-label="LinkedIn">
              💼
            </span>
          </a>
        )}
      </div>
    </div>
  );
};
