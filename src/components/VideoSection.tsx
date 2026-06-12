import React, { useState } from 'react';
import { useConfig } from '../hooks/useConfig';

import localVideoUrl from '../assets/wedding-video.mp4';

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

import { Loader2 } from 'lucide-react';

export default function VideoSection() {
  const { config } = useConfig();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const youtubeUrl = config?.youtubeUrl || '';
  const isLocal = config?.videoType === 'local';
  const isNone = config?.videoType === 'none';
  const noVideoImages = config?.noVideoImages || [];

  if (hasError) return null;

  if (isNone) {
    return null;
  }

  return (
    <section className="w-full bg-black fade-in">
      <div className="relative w-full aspect-video flex items-center justify-center bg-gray-900">
        
        {/* Skeleton Loader */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 z-10 bg-gray-900 animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin mb-2 opacity-50" />
            <span className="text-xs">동영상을 불러오는 중입니다...</span>
          </div>
        )}

        {isLocal ? (
          <video 
            src={localVideoUrl}
            className={`w-full h-full object-contain transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            controls
            playsInline
            webkit-playsinline="true"
            preload="metadata"
            poster={config?.localVideoPoster}
            onLoadedMetadata={() => setIsLoading(false)}
            onLoadedData={() => setIsLoading(false)}
            onError={() => setHasError(true)}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <iframe 
            width="100%" 
            height="100%" 
            src={getYoutubeEmbedUrl(youtubeUrl)} 
            title="Wedding Video" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            onError={() => setHasError(true)}
            className={`w-full h-full transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          ></iframe>
        )}
      </div>
    </section>
  );
}

