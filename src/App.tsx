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

function App() {
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
