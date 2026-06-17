import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Connect to the Upstash database using the environment variables
const redis = Redis.fromEnv();

// Configure the Sliding Window: Allow 10 requests every 60 seconds per IP
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, '60 s'),
});

export async function proxy(request: NextRequest) {
  // Extract the incoming IP address from headers (Vercel provides this)
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';

  // Check the rate limit
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  // If the user exceeds 10 requests in 60 seconds, block them
  if (!success) {
    return new NextResponse('Too Many Requests. Please slow down.', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
        'Retry-After': reset.toString(),
      },
    });
  }

  // If safe, let the request through
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  return response;
}

// Ensure the middleware ONLY runs on API routes and page loads, not static assets like images or the manifest
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
