import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_HOST = 'api.avocadoaid.app';
const API_PORT = 80;
const API_PATH = '/generate_greeting/';
const API_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcl9pZCI6IjlmYjRkM2FlLTY2NGUtNDA0Mi05YzU0LTkxOTRkN2QwYWM5NyIsImlhdCI6MTc1Mzk3NDI2Nn0.Sduj1C1_obiqcqhoE6A8vdJrQ81qbW_cuj313EnOQd4';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Proxy received questionnaire:', JSON.stringify(body, null, 2));
    
    // Forward the request to external API using GET with body (Node.js allows this)
    const result = await new Promise<{ ok: boolean; data: unknown; status: number }>((resolve, reject) => {
      const bodyString = JSON.stringify(body);
      
      const options: https.RequestOptions = {
        protocol: 'https:',
        hostname: API_HOST,
        port: API_PORT,
        path: API_PATH,
        method: 'GET',
        headers: {
          'Authorization': API_TOKEN,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(bodyString),
          'Accept': 'application/json, text/plain, */*',
        },
      };

      console.log('Making request to:', `https://${API_HOST}:${API_PORT}${API_PATH}`);

      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          console.log('API response status:', res.statusCode);
          console.log('API response data:', data);
          
          try {
            const parsed = JSON.parse(data);
            resolve({ ok: res.statusCode! >= 200 && res.statusCode! < 300, data: parsed, status: res.statusCode! });
          } catch {
            resolve({ ok: res.statusCode! >= 200 && res.statusCode! < 300, data: { greeting: data }, status: res.statusCode! });
          }
        });
      });

      req.on('error', (error) => {
        console.error('Request error:', error);
        reject(error);
      });

      // Write body to request (this works in Node.js even for GET)
      req.write(bodyString);
      req.end();
    });

    // Add no-cache headers to prevent caching
    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
    };
    
    if (result.ok) {
      return NextResponse.json(result.data, { headers });
    } else {
      return NextResponse.json(result.data, { status: result.status, headers });
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch greeting' }, { status: 500 });
  }
}

