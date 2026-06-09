export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { newConfig } = req.body;

  if (!newConfig) {
    return res.status(400).json({ error: 'Missing newConfig' });
  }

  const owner = process.env.GITHUB_OWNER || 'camilleson';
  const repo = process.env.GITHUB_REPO || 'DHs2KY';
  const path = 'public/data/config.json';
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return res.status(500).json({ 
      error: 'GITHUB_TOKEN is not configured in Vercel Environment Variables.' 
    });
  }

  try {
    // 1. Get current file SHA
    const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    let sha;
    if (getRes.ok) {
      const currentData = await getRes.json();
      sha = currentData.sha;
    } else if (getRes.status !== 404) {
      // 404 is fine (file doesn't exist yet), anything else is an error
      return res.status(getRes.status).json({ error: 'Failed to fetch current config.json', details: await getRes.json() });
    }

    // 2. Put new file
    const content = Buffer.from(JSON.stringify(newConfig, null, 2)).toString('base64');
    
    const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: '설정 업데이트: 사진 순서 및 메인 사진 변경 (Secret Admin)',
        content: content,
        sha: sha // Required for updating existing files
      }),
    });

    if (putRes.ok) {
      return res.status(200).json({ success: true, message: 'Config updated successfully!' });
    } else {
      const errorData = await putRes.json();
      console.error('GitHub API Error (PUT):', errorData);
      return res.status(putRes.status).json({ error: 'Failed to update config.json', details: errorData });
    }
  } catch (error) {
    console.error('Config update error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
