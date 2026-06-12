import React from 'react';
import { useConfig } from '../hooks/useConfig';

export default function MiddlePhotoSection() {
  const { config } = useConfig();
  const noVideoImages = config?.noVideoImages || [];

  if (!noVideoImages.length) return null;

  return (
    <>
      {noVideoImages.map((imgUrl, idx) => (
        <section key={idx} className="w-full bg-black fade-in">
          <img src={imgUrl} alt={`Section Image ${idx + 1}`} className="w-full block" />
        </section>
      ))}
    </>
  );
}
