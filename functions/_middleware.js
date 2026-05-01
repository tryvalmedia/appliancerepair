export async function onRequest({ request, next }) {
  const response = await next();
  
  const contentType = response.headers.get('content-type') || '\;
  if (!contentType.includes('text/html')) return response;

  const city = request.cf?.city || '\;
  const state = request.cf?.regionCode || '\;
  
  const geoScript = `<script>window.__GEO={city:${JSON.stringify(city)},state:${JSON.stringify(state)}};</script>`;
  
  const html = await response.text();
  const injected = html.replace('<head>', '<head>
' + geoScript);
  
  return new Response(injected, {
    status: response.status,
    headers: response.headers,
  });
}

