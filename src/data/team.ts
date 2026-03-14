export interface TeamMember {
  name: string;
  slug: string;
  role: string;
  bio: string;
  avatarUrl?: string;
  githubUsername?: string;
  twitterHandle?: string;
  linkedinUrl?: string;
  type: "leadership" | "core" | "contributor";
}

export const TEAM: TeamMember[] = [
  {
    name: "nirholas",
    slug: "nirholas",
    role: "Founder & Lead Developer",
    bio: "Building the free and open crypto news infrastructure the industry needs.",
    githubUsername: "nirholas",
    type: "leadership",
  },
  // ... additional team members
];
