import React from 'react';
import { useConfig } from '../hooks/useConfig';

function getYoutubeEmbedUrl(url?: string) {
  const defaultUrl = 'https://www.youtube.com/embed/XO77YuyMOek?start=9';
  if (!url) return defaultUrl;
  
  let videoId = '';
  try {
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/watch')) {
      const urlParams = new URL(url).searchParams;
      videoId = urlParams.get('v') || '';
    } else if (url.includes('youtube.com/embed/')) {
      return url;
    }
  } catch (e) {
    return defaultUrl;
  }
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : defaultUrl;
}

export default function VideoSection() {
  const { config } = useConfig();
  const youtubeUrl = config?.youtubeUrl || '';

  return (
    <section className="w-full bg-black fade-in">
      <div className="relative w-full aspect-video flex items-center justify-center">
        <iframe 
          width="100%" 
          height="100%" 
          src={getYoutubeEmbedUrl(youtubeUrl)} 
          title="Wedding Video" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
}

