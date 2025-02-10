import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Handle webhook data
    const data = await request.json();
    
    // Process data
    console.log('Webhook received:', data);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 
