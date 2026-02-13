import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const width = parseInt(searchParams.get('width') || '160');
  const height = parseInt(searchParams.get('height') || '90');
  
  // Generate a simple placeholder thumbnail
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <g transform="translate(${width/2}, ${height/2})">
        <circle r="20" fill="white" fill-opacity="0.2"/>
        <polygon points="-8,-6 -8,6 8,0" fill="white"/>
      </g>
      <text x="${width/2}" y="${height - 10}" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" opacity="0.8">
        Preview
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
