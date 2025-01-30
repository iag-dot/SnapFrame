import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const response = await fetch('https://wf509sbwz2.execute-api.ap-south-1.amazonaws.com/default/SendSnapframeInWhatsapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: data.phoneNumber,
        imageBase64: data.imageBase64
      })
    });

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in API route:', error)
    return NextResponse.json(
      { error: 'Failed to send WhatsApp message' },
      { status: 500 }
    )
  }
}

