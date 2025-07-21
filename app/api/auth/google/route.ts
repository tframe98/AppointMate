import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
  const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;
  const scope = encodeURIComponent('https://www.googleapis.com/auth/calendar.events');
  const state = 'portfolio-csrf'; // TODO: generate and validate real CSRF state
  const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&scope=${scope}&access_type=offline&prompt=consent&state=${state}`;
  return NextResponse.redirect(url);
} 