import { NextRequest, NextResponse } from "next/server";
import { PressReleaseSubmission, validatePressRelease, sanitizeInput } from "../../../lib/press-release";
import { nanoid } from "nanoid";

const submissions: PressReleaseSubmission[] = [];
const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24h

export async function POST(req: NextRequest) {
  const data = await req.json();
  // Sanitize inputs
  for (const key in data) {
    if (typeof data[key] === "string") {
      data[key] = sanitizeInput(data[key]);
    }
  }
  // Validate
  const errors = validatePressRelease(data);
  if (errors.length) {
    return NextResponse.json({ errors }, { status: 400 });
  }
  // Rate limit
  const now = Date.now();
  const recent = submissions.filter(
    (s) => s.contactEmail === data.contactEmail && now - new Date(s.createdAt).getTime() < RATE_LIMIT_WINDOW
  );
  if (recent.length >= RATE_LIMIT) {
    return NextResponse.json({ error: "Rate limit exceeded (3 submissions per email per day)." }, { status: 429 });
  }
  // Store submission
  const submission: PressReleaseSubmission = {
    ...data,
    id: nanoid(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  submissions.push(submission);
  // TODO: Send confirmation email, notify admin
  return NextResponse.json({ id: submission.id }, { status: 201 });
}
