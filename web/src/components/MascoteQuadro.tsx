import { useEffect, useState } from 'react';

const MENSAGENS = [
  'Uma tarefa de cada vez! ✨',
  'Quadro organizado, mente calma! 📑',
  'Vamos transformar planos em ação! 🚀',
  'Mais um item concluído? Parabéns! 🌟',
];

export function MascoteQuadro() {
  const [indiceMensagem, setIndiceMensagem] = useState(0);

  useEffect(() => {
    const intervalo = window.setInterval(() => {
      setIndiceMensagem((indiceAtual) => (indiceAtual + 1) % MENSAGENS.length);
    }, 15000);

    return () => window.clearInterval(intervalo);
  }, []);


  return (
    <div
      aria-hidden="true"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 pointer-events-none z-10 hidden md:flex items-end gap-3 select-none transition-all duration-300"
    >
      <div className="relative mb-8 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xs text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 surface-shadow text-xs font-medium max-w-[190px] animate-in fade-in">
        <p className="leading-snug">{MENSAGENS[indiceMensagem]}</p>
        <div className="absolute -right-1.5 bottom-3 w-3 h-3 bg-white dark:bg-slate-800 border-r border-b border-slate-200 dark:border-slate-700 rotate-[-45deg]" />
      </div>

      <div className="w-24 h-32 sm:w-28 sm:h-36 relative flex-shrink-0 drop-shadow-md">
        <svg viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <ellipse cx="60" cy="144" rx="42" ry="5" fill="rgba(0, 0, 0, 0.08)" />
          <path
            d="M 22 14 Q 20 14 20 18 L 20 134 Q 20 138 24 138 L 96 138 Q 100 138 100 134 L 100 38 L 76 14 Z"
            fill="#FAFAFA"
            stroke="#1E293B"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path d="M 76 14 L 76 38 L 100 38 Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="3.5" strokeLinejoin="round" />
          <circle cx="28" cy="34" r="3" fill="#CBD5E1" stroke="#1E293B" strokeWidth="2" />
          <circle cx="28" cy="76" r="3" fill="#CBD5E1" stroke="#1E293B" strokeWidth="2" />
          <circle cx="28" cy="118" r="3" fill="#CBD5E1" stroke="#1E293B" strokeWidth="2" />
          <line x1="38" y1="22" x2="38" y2="132" stroke="#F87171" strokeWidth="2" strokeLinecap="round" />
          <line x1="44" y1="46" x2="92" y2="46" stroke="#93C5FD" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="44" y1="62" x2="92" y2="62" stroke="#93C5FD" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="44" y1="78" x2="92" y2="78" stroke="#93C5FD" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="44" y1="94" x2="92" y2="94" stroke="#93C5FD" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="44" y1="110" x2="92" y2="110" stroke="#93C5FD" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="44" y1="126" x2="92" y2="126" stroke="#93C5FD" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="56" cy="74" r="3.5" fill="#1E293B" />
          <circle cx="55" cy="73" r="1.2" fill="#FFFFFF" />
          <circle cx="78" cy="74" r="3.5" fill="#1E293B" />
          <circle cx="77" cy="73" r="1.2" fill="#FFFFFF" />
          <ellipse cx="50" cy="80" rx="3.5" ry="2" fill="#FDA4AF" opacity="0.8" />
          <ellipse cx="84" cy="80" rx="3.5" ry="2" fill="#FDA4AF" opacity="0.8" />
          <path d="M 62 80 Q 67 86 72 80" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 44 10 L 44 26 L 50 21 L 56 26 L 56 10 Z" fill="#10B981" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 102 68 L 105 73 L 110 74 L 105 75 L 102 80 L 99 75 L 94 74 L 99 73 Z" fill="#FBBF24" opacity="0.85" />
        </svg>
      </div>
    </div>
  );
}
