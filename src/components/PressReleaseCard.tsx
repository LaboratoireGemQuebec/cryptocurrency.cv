import React from "react";
import { PressReleaseSubmission } from "../../lib/press-release";

interface Props {
  release: PressReleaseSubmission;
}

export function PressReleaseCard({ release }: Props) {
  return (
    <div className="border rounded p-4 mb-4 bg-white">
      <div className="flex items-center mb-2">
        <span className="bg-yellow-400 text-xs font-bold px-2 py-1 rounded mr-2">PRESS RELEASE</span>
        <span className="text-sm text-gray-500">{release.category}</span>
      </div>
      <h2 className="text-lg font-semibold mb-1">{release.title}</h2>
      <div className="text-sm text-gray-700 mb-2">{release.projectName}</div>
      <div className="text-xs text-gray-400 mb-2">{new Date(release.createdAt).toLocaleDateString()}</div>
      {release.imageUrl && (
        <img src={release.imageUrl} alt="Featured" className="w-full h-48 object-cover mb-2 rounded" />
      )}
      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: release.body }} />
    </div>
  );
}
