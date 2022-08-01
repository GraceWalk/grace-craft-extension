// 保存 cloudflare 的配置，方便之后重新部署
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS,PATCH,DELETE',
  'Access-Control-Max-Age': '86400',
};

function handleOptions(request) {
  // Make sure the necessary headers are present
  // for this to be a valid pre-flight request
  let headers = request.headers;
  if (
    headers.get('Origin') !== null &&
    headers.get('Access-Control-Request-Method') !== null &&
    headers.get('Access-Control-Request-Headers') !== null
  ) {
    // Handle CORS pre-flight request.
    // If you want to check or reject the requested method + headers
    // you can do that here.
    let respHeaders = {
      ...corsHeaders,
      // Allow all future content Request headers to go back to browser
      // such as Authorization (Bearer) or X-Client-Name-Version
      'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers'),
    };

    return new Response(null, {
      headers: respHeaders,
    });
  } else {
    // Handle standard OPTIONS request.
    // If you want to allow other HTTP Methods, you can do that here.
    return new Response(null, {
      headers: {
        Allow: 'GET, HEAD, POST, OPTIONS',
      },
    });
  }
}

async function handleRequest(request) {
  const url = new URL(request.url);
  let requestUrl = 'https:/' + url.pathname;
  request = new Request(requestUrl, request);
  request.headers.set('Origin', new URL(requestUrl).origin);
  let response = await fetch(request);

  // Recreate the response so you can modify the headers
  response = new Response(response.body, response);

  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');

  // Append to/Add Vary header so browser will cache response correctly
  response.headers.append('Vary', 'Origin');

  return response;
}

addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api.notion.com')) {
    if (request.method === 'OPTIONS') {
      // Handle CORS preflight requests
      event.respondWith(handleOptions(request));
    } else if (
      request.method === 'GET' ||
      request.method === 'HEAD' ||
      request.method === 'POST' ||
      request.method === 'PATCH' ||
      request.method === 'DELETE'
    ) {
      // Handle requests to the API server
      event.respondWith(handleRequest(request));
    } else {
      event.respondWith(
        new Response(null, {
          status: 405,
          statusText: 'Method Not Allowed',
        })
      );
    }
  } else {
    event.respondWith("hello gracewalk's cloudflare");
  }
});
