import { NextRequest, NextResponse } from "next/server";
import { PressReleaseSubmission } from "../../../../lib/press-release";

// In-memory store for demo
const submissions: PressReleaseSubmission[] = [];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  // Auth check (admin only) — placeholder
  // TODO: Implement real admin auth
  const isAdmin = true;
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status, reviewNote } = await req.json();
  const submission = submissions.find((s) => s.id === params.id);
  if (!submission) return NextResponse.json({ error: "Not found" }, { status: 404 });

  submission.status = status;
  submission.reviewNote = reviewNote;
  submission.updatedAt = new Date().toISOString();

  // TODO: Publish to feed, notify submitter
  return NextResponse.json({ success: true });
}
