import { useState, useEffect } from 'react';

export interface AppConfig {
  mainPhoto: string;
  galleryPhotos: string[];
}

let cachedConfig: AppConfig | null = null;

export function useConfig() {
  const [config, setConfig] = useState<AppConfig | null>(cachedConfig);
  const [loading, setLoading] = useState(!cachedConfig);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (cachedConfig) {
      setLoading(false);
      return;
    }

    fetch('/data/config.json?' + new Date().getTime()) // Prevent caching
      .then(res => {
        if (!res.ok) throw new Error('Failed to load config');
        return res.json();
      })
      .then(data => {
        cachedConfig = data;
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
