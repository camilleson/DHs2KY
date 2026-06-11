// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { fileName, base64Content, fileType } = req.body;

  if (!fileName || !base64Content) {
    return res.status(400).json({ error: 'Missing fileName or base64Content' });
  }

  // Repository details
  const owner = process.env.GITHUB_OWNER || 'camilleson';
  const repo = process.env.GITHUB_REPO || 'DHs2KY';

  // Sanitize file name
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const token = process.env.GITHUB_TOKEN;

  // Determine upload destination based on fileType
  let webPath: string;
  let githubPath: string;
  let commitMessage: string;

  if (fileType === 'audio') {
    webPath = `audio/${Date.now()}-${cleanFileName}`;
    githubPath = `public/${webPath}`;
    commitMessage = `배경음악 추가: ${fileName} (Secret Admin)`;
  } else if (fileType === 'video') {
    webPath = `videos/${Date.now()}-${cleanFileName}`;
    githubPath = `public/${webPath}`;
    commitMessage = `동영상 추가: ${fileName} (Secret Admin)`;
  } else {
    // Images get timestamp prefix to avoid collisions
    webPath = `images/gallery/${Date.now()}-${cleanFileName}`;
    githubPath = `public/${webPath}`;
    commitMessage = `사진 추가: ${fileName} (Secret Admin)`;
  }

  if (!token) {
    return res.status(500).json({
      error: 'GITHUB_TOKEN is not configured in Vercel Environment Variables.'
    });
  }

  try {

    const body: Record<string, string> = {
      message: commitMessage,
      content: base64Content,
    };

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${githubPath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      return res.status(200).json({ success: true, message: '업로드 성공!', path: `/${webPath}` });
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
