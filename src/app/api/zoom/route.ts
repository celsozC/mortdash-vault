import { NextRequest, NextResponse } from 'next/server';
import { ZoomAPI } from '@/lib/zoom-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, fromDate, toDate } = body;

    // Check if ZOOM_KEY is configured
    if (!process.env.ZOOM_KEY) {
      return NextResponse.json(
        { error: 'Missing ZOOM_KEY environment variable' },
        { status: 500 }
      );
    }

    const zoomAPI = new ZoomAPI();

    // Get access token first
    const accessToken = await zoomAPI.getAccessToken();
    
    // Get recordings list with optional date parameters
    const recordings = await zoomAPI.getListMeetings(accessToken, fromDate, toDate);

    return NextResponse.json({
      success: true,
      meetings: recordings,
      message: 'Successfully fetched recordings from Zoom API'
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 