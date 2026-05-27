'use client';
import { useState, useEffect } from 'react';

const FALLBACK = {
  messages: [
    'FREE SHIPPING ON ORDERS OVER £150',
    'NEW ARRIVALS — RESORT COLLECTION 2025',
    'COMPLIMENTARY GIFT WRAPPING ON ALL ORDERS',
    'SAME-DAY DISPATCH BEFORE 2PM',
  ],
  enabled: true,
  speed:   18,
};

export default function AnnouncementBar() {
  const [config, setConfig] = useState(FALLBACK);

  useEffect(() => {
    fetch('/api/announcement')
      .then((r) => r.json())
      .then((d) => {
        if (d?.messages?.length) setConfig(d);
      })
      .catch(() => {}); // keep fallback on error
  }, []);

  if (!config.enabled) return null;

  const marqueeContent = [...config.messages, ...config.messages];

  return (
    <div className="bg-ebony text-ivory py-2.5 overflow-hidden">
      <div
        className="marquee-track flex whitespace-nowrap"
        style={{ width: 'max-content', animationDuration: `${config.speed}s` }}
      >
        {marqueeContent.map((msg, i) => (
          <span key={i} className="text-[10px] tracking-[3px] mx-12 font-medium">
            {msg}
            <span className="ml-12 text-gold">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
