'use client';
import { useState } from 'react';

const PHONE   = '447900736211'; // UK number without + or spaces
const MESSAGE = encodeURIComponent("Hi! I'm interested in your products at Olubukola Couture. Could you help me?");
const WA_URL  = `https://wa.me/${PHONE}?text=${MESSAGE}`;

// Official WhatsApp SVG logo
function WhatsAppIcon({ size = 28 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="white"
      aria-hidden="true"
    >
      <path d="M16.003 2C8.285 2 2 8.284 2 16c0 2.496.655 4.88 1.9 6.97L2 30l7.233-1.877A14.016 14.016 0 0 0 16.003 30C23.718 30 30 23.716 30 16S23.718 2 16.003 2zm0 25.6a11.59 11.59 0 0 1-5.908-1.614l-.424-.252-4.294 1.115 1.142-4.17-.277-.44A11.558 11.558 0 0 1 4.4 16c0-6.398 5.207-11.6 11.603-11.6C22.4 4.4 27.6 9.602 27.6 16c0 6.397-5.2 11.6-11.597 11.6zm6.37-8.676c-.348-.174-2.06-1.016-2.38-1.132-.32-.116-.552-.174-.785.174-.232.347-.9 1.132-1.103 1.364-.203.232-.406.26-.754.087-.348-.174-1.47-.542-2.8-1.727-1.034-.923-1.732-2.062-1.935-2.41-.203-.347-.022-.535.153-.708.157-.155.348-.406.522-.608.174-.203.232-.348.348-.58.116-.232.058-.435-.029-.608-.087-.174-.785-1.89-1.075-2.588-.283-.68-.57-.587-.785-.598-.203-.01-.435-.013-.667-.013s-.608.087-.927.435c-.319.347-1.218 1.19-1.218 2.903s1.247 3.368 1.421 3.6c.174.232 2.453 3.746 5.943 5.252.83.358 1.48.572 1.986.733.834.265 1.594.228 2.194.138.669-.1 2.06-.842 2.35-1.655.29-.812.29-1.508.203-1.655-.086-.145-.318-.232-.667-.406z" />
    </svg>
  );
}

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  return (
    <>
      {/* Tooltip */}
      <div
        className={`fixed bottom-[88px] right-6 z-50 transition-all duration-300 ${
          tooltip ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
        }`}
      >
        <div className="bg-ebony text-ivory text-[11px] tracking-[0.5px] px-3 py-2 rounded shadow-lg whitespace-nowrap relative">
          Chat with us on WhatsApp
          {/* Arrow */}
          <span className="absolute -bottom-1.5 right-5 w-3 h-3 bg-ebony rotate-45" />
        </div>
      </div>

      {/* FAB Button */}
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        onMouseEnter={() => { setHovered(true); setTooltip(true); }}
        onMouseLeave={() => { setHovered(false); setTooltip(false); }}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300"
        style={{
          backgroundColor: '#25D366',
          boxShadow: hovered
            ? '0 8px 30px rgba(37, 211, 102, 0.55), 0 4px 12px rgba(0,0,0,0.2)'
            : '0 4px 16px rgba(37, 211, 102, 0.35), 0 2px 8px rgba(0,0,0,0.15)',
          transform: hovered ? 'scale(1.12) translateY(-2px)' : 'scale(1) translateY(0)',
        }}
      >
        {/* Pulse ring animation */}
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{ backgroundColor: 'rgba(37,211,102,0.3)', animationDuration: '2.5s' }}
        />

        {/* Icon */}
        <span className="relative z-10">
          <WhatsAppIcon size={28} />
        </span>
      </a>
    </>
  );
}
