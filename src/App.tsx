import React, { useEffect } from 'react';
import Hero from './components/Hero';
import Greeting from './components/Greeting';
import Gallery from './components/Gallery';
import VideoSection from './components/VideoSection';
import Calendar from './components/Calendar';
import Location from './components/Location';
import CharterBus from './components/CharterBus';
import Account from './components/Account';
import AudioPlayer from './components/AudioPlayer';
import Share from './components/Share';
import BakeryTour from './components/BakeryTour';
import ClickParticles from './components/ClickParticles';
import SecretAdmin from './pages/SecretAdmin';
import MiddlePhotoSection from './components/MiddlePhotoSection';
import { useConfig } from './hooks/useConfig';


const KAKAO_MAP_URL = 'https://map.naver.com/p/search/the%20bmk/place/33794156?c=15.00,0,0,3,dh&isCorrectAnswer=true&placePath=/home?from=map&fromPanelNum=1&additionalHeight=76&timestamp=202605191517&locale=ko&svcName=map_pcv5&searchText=the%20bmk';

function App() {
  const { loading } = useConfig();

  // Simple intersection observer for fade-in animations
  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const observeElements = () => {
      document.querySelectorAll('.fade-in').forEach((el) => {
        observer.observe(el);
      });
    };

    observeElements();

    // Observe future DOM changes to catch dynamically rendered fade-in elements
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [loading]);

  // /map 경로 접속 시 카카오맵으로 즉시 리다이렉트
  if (window.location.pathname === '/map') {
    window.location.replace(KAKAO_MAP_URL);
    return null;
  }

  if (window.location.pathname === '/20231216') {
    return <SecretAdmin />;
  }

  if (loading) {
    return <div className="max-w-md mx-auto bg-[#fcfcfc] min-h-screen relative shadow-2xl"></div>;
  }

  return (
    <div 
      className="user-view max-w-md mx-auto bg-white min-h-screen relative shadow-2xl overflow-x-hidden pb-10"
      onContextMenu={(e) => e.preventDefault()}
    >
      <ClickParticles />
      <AudioPlayer />
      <Hero />
      <Greeting />
      <Calendar />
      <VideoSection />
      <MiddlePhotoSection />
      <Gallery />
      <Location />
      <CharterBus />
      <Account />
      <BakeryTour />
      <Share />
    </div>
  );
}

export default App;
