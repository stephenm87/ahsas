const { Readable } = require('stream');

exports.handler = async function(event) {
  const file = event.queryStringParameters?.file;
  const width = parseInt(event.queryStringParameters?.w || '800', 10);
  
  if (!file) {
    return { statusCode: 400, body: 'Missing ?file= parameter' };
  }

  // Only allow Wikimedia Commons files
  const allowed = /^[A-Za-z0-9_\-%.()]+\.(jpg|jpeg|png|gif|svg|JPG|JPEG|PNG|GIF|SVG)$/;
  if (!allowed.test(file)) {
    return { statusCode: 400, body: 'Invalid filename' };
  }

  try {
    // Use Wikimedia Commons Special:FilePath which auto-redirects to the image
    const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AHSAS-EducationalTool/1.0 (https://ahsas-project.netlify.app; educational use)',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      return { statusCode: response.status, body: `Wikimedia returned ${response.status}` };
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = Buffer.from(await response.arrayBuffer());

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
        'Access-Control-Allow-Origin': '*',
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (err) {
    return { statusCode: 500, body: `Proxy error: ${err.message}` };
  }
};
