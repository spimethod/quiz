import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

const API_URL = 'https://api.avocadoaid.app:80/generate_greeting/';
const API_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcl9pZCI6IjlmYjRkM2FlLTY2NGUtNDA0Mi05YzU0LTkxOTRkN2QwYWM5NyIsImlhdCI6MTc1Mzk3NDI2Nn0.Sduj1C1_obiqcqhoE6A8vdJrQ81qbW_cuj313EnOQd4';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward the request to external API using GET with body (Node.js allows this)
    const result = await new Promise<{ ok: boolean; data: unknown }>((resolve, reject) => {
      const url = new URL(API_URL);
      
      const options = {
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname,
        method: 'GET',
        headers: {
          'Authorization': API_TOKEN,
          'Content-Type': 'application/json',
        },
      };

      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve({ ok: res.statusCode! >= 200 && res.statusCode! < 300, data: parsed });
          } catch {
            resolve({ ok: res.statusCode! >= 200 && res.statusCode! < 300, data: { greeting: data } });
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      // Write body to request (this works in Node.js even for GET)
      req.write(JSON.stringify(body));
      req.end();
    });

    if (result.ok) {
      return NextResponse.json(result.data);
    } else {
      return NextResponse.json(result.data, { status: 500 });
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch greeting' }, { status: 500 });
  }
}
