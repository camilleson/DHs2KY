import { useState, useEffect } from 'react';

export interface AppConfig {
  mainPhoto: string;
  mainBackgroundPhoto?: string;
  backgroundMusic?: string;
  customBackgroundMusics?: { label: string; value: string }[];
  galleryPhotos: string[];
  videoType?: 'youtube' | 'local' | 'none';
  noVideoImages?: string[];
  localVideoPoster?: string;
  youtubeUrl?: string;
  greetingMessage?: string;
  heroTextColor?: string;
  heroBottomTextColor?: string;
  hideHeroText?: boolean;
  heroTextScale?: number;
  heroTopName?: string;
  heroTopNameX?: number;
  heroTopNameY?: number;
  heroBottomName?: string;
  heroBottomNameX?: number;
  heroBottomNameY?: number;
  heroDetailsScale?: number;
  heroDetailsX?: number;
  heroDetailsY?: number;
  stickers?: Sticker[];
  heroTextAnimation?: 'none' | 'fade-in' | 'slide-up' | 'typewriter';
}

export interface Sticker {
  id: string;
  src: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  scale: number; // scale multiplier
}

let cachedConfigPromise: Promise<AppConfig> | null = null;
let cachedConfig: AppConfig | null = null;

export function useConfig() {
  const [config, setConfig] = useState<AppConfig | null>(cachedConfig);
  const [loading, setLoading] = useState(!cachedConfig);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (cachedConfig) {
      setConfig(cachedConfig);
      setLoading(false);
      return;
    }

    if (!cachedConfigPromise) {
      cachedConfigPromise = fetch('/data/config.json?' + new Date().getTime()) // Prevent caching
        .then(res => {
          if (!res.ok) throw new Error('Failed to load config');
          return res.json();
        })
        .then(data => {
          cachedConfig = data;
          return data;
        });
    }

    cachedConfigPromise
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading config:', err);
        setError(err);
        setLoading(false);
      });
  }, []);

  return { config, loading, error };
}
