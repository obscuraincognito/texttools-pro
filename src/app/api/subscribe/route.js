import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Store in a JSON file (works on Vercel with /tmp)
    // For production at scale, use a database or email service API
    const filePath = path.join('/tmp', 'tt_subscribers.json');

    let subscribers = [];
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      subscribers = JSON.parse(data);
    } catch {
      // File doesn't exist yet
    }

    if (subscribers.includes(cleanEmail)) {
      return NextResponse.json({ success: true, message: 'Already subscribed' });
    }

    subscribers.push(cleanEmail);
    await fs.writeFile(filePath, JSON.stringify(subscribers, null, 2));

    console.log(`New subscriber: ${cleanEmail} (total: ${subscribers.length})`);

    return NextResponse.json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Subscribe error:', error.message);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const filePath = path.join('/tmp', 'tt_subscribers.json');
    let subscribers = [];
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      subscribers = JSON.parse(data);
    } catch {}

    return NextResponse.json({ count: subscribers.length, subscribers });
  } catch {
    return NextResponse.json({ count: 0, subscribers: [] });
  }
}
