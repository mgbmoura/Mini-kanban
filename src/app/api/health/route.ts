import { NextResponse } from 'next/server';

/**
 * @fileOverview A simple API health check route.
 * This demonstrates how to create traditional REST endpoints in Next.js.
 */

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'KanFlow API'
  });
}
