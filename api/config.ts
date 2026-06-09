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
  const configPath = 'public/data/config.json';
  const indexPath = 'index.html';
  const siteUrl = 'https://dh-s2-ky.vercel.app';
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return res.status(500).json({ 
      error: 'GITHUB_TOKEN is not configured in Vercel Environment Variables.' 
    });
  }

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    // 1. Get current config.json SHA and update it
    const getConfigRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${configPath}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    let configSha;
    if (getConfigRes.ok) {
      const currentData = await getConfigRes.json();
      configSha = currentData.sha;
    } else if (getConfigRes.status !== 404) {
      return res.status(getConfigRes.status).json({ error: 'Failed to fetch current config.json', details: await getConfigRes.json() });
    }

    const configContent = Buffer.from(JSON.stringify(newConfig, null, 2)).toString('base64');
    
    const putConfigRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${configPath}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: '설정 업데이트: 사진 순서 및 메인 사진 변경 (Secret Admin)',
        content: configContent,
        sha: configSha
      }),
    });

    if (!putConfigRes.ok) {
      const errorData = await putConfigRes.json();
      console.error('GitHub API Error (PUT config):', errorData);
      return res.status(putConfigRes.status).json({ error: 'Failed to update config.json', details: errorData });
    }

    // 2. Update index.html og:image to reflect the new mainPhoto
    if (newConfig.mainPhoto) {
      try {
        const getIndexRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${indexPath}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (getIndexRes.ok) {
          const indexData = await getIndexRes.json();
          const indexSha = indexData.sha;
          const currentHtml = Buffer.from(indexData.content, 'base64').toString('utf-8');

          // Replace the og:image URL with the new mainPhoto (absolute URL)
          const newOgImageUrl = `${siteUrl}${newConfig.mainPhoto}`;
          const updatedHtml = currentHtml.replace(
            /<meta property="og:image" content="[^"]*"\s*\/>/,
            `<meta property="og:image" content="${newOgImageUrl}" />`
          );

          if (updatedHtml !== currentHtml) {
            const indexContent = Buffer.from(updatedHtml).toString('base64');
            await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${indexPath}`, {
              method: 'PUT',
              headers,
              body: JSON.stringify({
                message: 'chore: OG 이미지 업데이트 (메인 사진 변경)',
                content: indexContent,
                sha: indexSha
              }),
            });
          }
        }
      } catch (ogErr) {
        // Non-fatal: config was saved, just og:image update failed
        console.error('og:image update failed (non-fatal):', ogErr);
      }
    }

    return res.status(200).json({ success: true, message: 'Config updated successfully!' });

  } catch (error) {
    console.error('Config update error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
