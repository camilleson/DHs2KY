export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { fileName, base64Content } = req.body;

  if (!fileName || !base64Content) {
    return res.status(400).json({ error: 'Missing fileName or base64Content' });
  }

  // Repository details
  const owner = process.env.GITHUB_OWNER || 'camilleson';
  const repo = process.env.GITHUB_REPO || 'DHs2KY';
  // Use a timestamp to prevent file naming collisions
  const path = `public/images/gallery/${Date.now()}-${fileName.replace(/\s+/g, '_')}`;
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return res.status(500).json({ 
      error: 'GITHUB_TOKEN is not configured in Vercel Environment Variables.' 
    });
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `사진 추가: ${fileName} (Secret Admin)`,
        content: base64Content,
      }),
    });

    if (response.ok) {
      return res.status(200).json({ success: true, message: '업로드 성공!', path: `/${path}` });
    } else {
      const errorData = await response.json();
      console.error('GitHub API Error:', errorData);
      return res.status(response.status).json({ error: 'GitHub API 오류', details: errorData });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: '서버 내부 오류' });
  }
}
