import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';


export async function POST(request: NextRequest) {
    try{
        const body = await request.json();
        const response = await fetch(`${API_BASE_URL}/checkins/check-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Backend error ${response.status}:`, errorText.substring(0, 200));
            return NextResponse.json({ 
                success: false, 
                message: `Server error: ${response.status}` 
            }, { status: response.status });
        }

        const data = await response.json();

        return NextResponse.json(data , {status: response.status});
    }catch (error) {
        console.error("Error processing check-in:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');
        
        // For getting today's check-ins across all resorts
        const response = await fetch(`${API_BASE_URL}/checkins${date ? `?date=${date}` : ''}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        });

        const data = await response.json();
        
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
        { success: false, message: 'Server error' },
        { status: 500 }
        );
    }
}