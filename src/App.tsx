import React, { useEffect } from 'react';
import Hero from './components/Hero';
import Greeting from './components/Greeting';
import Gallery from './components/Gallery';
import VideoSection from './components/VideoSection';
import Calendar from './components/Calendar';
import Location from './components/Location';
import Account from './components/Account';
import AudioPlayer from './components/AudioPlayer';
import Share from './components/Share';

const KAKAO_MAP_URL = 'https://map.kakao.com/?urlX=590939.0000000012&urlY=784024.9999999977&urlLevel=3&itemId=22301957&q=%EB%8D%94BMK%EC%BB%A8%EB%B2%A4%EC%85%98&srcid=22301957&map_type=TYPE_MAP';

function App() {
  // /map 경로 접속 시 카카오맵으로 즉시 리다이렉트
  if (window.location.pathname === '/map') {
    window.location.replace(KAKAO_MAP_URL);
    return null;
  }

  // Simple intersection observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative shadow-2xl overflow-hidden pb-10">
      <AudioPlayer />
      <Hero />
      <Greeting />
      <Calendar />
      <VideoSection />
      <Gallery />
      <Location />
      <Account />
      <Share />
    </div>
  );
}

export default App;
