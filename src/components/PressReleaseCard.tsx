import React from 'react';
import { PressReleaseSubmission } from '../../lib/press-release';

interface Props {
  release: PressReleaseSubmission;
}

export function PressReleaseCard({ release }: Props) {
  return (
    <div className="mb-4 rounded border bg-white p-4">
      <div className="mb-2 flex items-center">
        <span className="mr-2 rounded bg-yellow-400 px-2 py-1 text-xs font-bold">
          PRESS RELEASE
        </span>
        <span className="text-sm text-gray-500">{release.category}</span>
      </div>
      <h2 className="mb-1 text-lg font-semibold">{release.title}</h2>
      <div className="mb-2 text-sm text-gray-700">{release.projectName}</div>
      <div className="mb-2 text-xs text-gray-400">
        {new Date(release.createdAt).toLocaleDateString()}
      </div>
      {release.imageUrl && (
        <img
          src={release.imageUrl}
          alt="Featured"
          className="mb-2 h-48 w-full rounded object-cover"
        />
      )}
      <div
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: release.body }}
      />
    </div>
  );
}
