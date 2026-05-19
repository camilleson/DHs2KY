import React from 'react';

export default function VideoSection() {
  return (
    <section className="w-full bg-black fade-in">
      <div className="relative w-full aspect-video flex items-center justify-center">
        <iframe 
          width="100%" 
          height="100%" 
          src="https://www.youtube.com/embed/XO77YuyMOek?start=9" 
          title="Wedding Video" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
}

