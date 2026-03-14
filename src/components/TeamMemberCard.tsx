import React from "react";
import { TeamMember } from "../data/team";

interface Props {
  member: TeamMember;
}

export const TeamMemberCard: React.FC<Props> = ({ member }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
      {member.avatarUrl ? (
        <img src={member.avatarUrl} alt={member.name} className="w-20 h-20 rounded-full mb-2" />
      ) : (
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-2 text-3xl">👤</div>
      )}
      <div className="font-semibold text-lg mb-1">{member.name}</div>
      <div className="text-sm text-gray-600 mb-1">{member.role}</div>
      <div className="text-xs text-gray-500 mb-2 text-center">{member.bio}</div>
      <div className="flex space-x-2">
        {member.githubUsername && (
          <a href={`https://github.com/${member.githubUsername}`} target="_blank" rel="noopener noreferrer" title="GitHub">
            <span role="img" aria-label="GitHub">🐙</span>
          </a>
        )}
        {member.twitterHandle && (
          <a href={`https://twitter.com/${member.twitterHandle}`} target="_blank" rel="noopener noreferrer" title="Twitter/X">
            <span role="img" aria-label="Twitter">🐦</span>
          </a>
        )}
        {member.linkedinUrl && (
          <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn">
            <span role="img" aria-label="LinkedIn">💼</span>
          </a>
        )}
      </div>
    </div>
  );
};
