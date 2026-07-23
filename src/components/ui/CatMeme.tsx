type CatVariant = "wizard" | "sad" | "happy";

function CatSvg({ variant }: { variant: CatVariant }) {
  return (
    <svg viewBox="0 0 100 100" width="72" height="72" aria-hidden="true">
      {/* ears */}
      <polygon points="22,36 32,8 44,34" fill="#fff2e6" stroke="#c94f70" strokeWidth="2.5" strokeLinejoin="round" />
      <polygon points="78,36 68,8 56,34" fill="#fff2e6" stroke="#c94f70" strokeWidth="2.5" strokeLinejoin="round" />
      <polygon points="27,30 32,16 39,29" fill="#ffbecb" />
      <polygon points="73,30 68,16 61,29" fill="#ffbecb" />

      {/* head */}
      <circle cx="50" cy="56" r="34" fill="#fff2e6" stroke="#c94f70" strokeWidth="2.5" />

      {/* whiskers */}
      <g stroke="#c94f70" strokeWidth="1.5" strokeLinecap="round">
        <line x1="14" y1="58" x2="30" y2="56" />
        <line x1="14" y1="66" x2="30" y2="64" />
        <line x1="86" y1="58" x2="70" y2="56" />
        <line x1="86" y1="66" x2="70" y2="64" />
      </g>

      {/* nose */}
      <polygon points="47,60 53,60 50,64" fill="#e8577f" />

      {variant === "happy" && (
        <>
          <path d="M36 50 Q41 43 46 50" fill="none" stroke="#c94f70" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M54 50 Q59 43 64 50" fill="none" stroke="#c94f70" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="34" cy="60" r="4" fill="#ffbecb" opacity="0.7" />
          <circle cx="66" cy="60" r="4" fill="#ffbecb" opacity="0.7" />
          <path
            d="M43 66 Q46 71 50 66 Q54 71 57 66"
            fill="none"
            stroke="#c94f70"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}

      {variant === "sad" && (
        <>
          <line x1="37" y1="44" x2="45" y2="47" stroke="#c94f70" strokeWidth="2" strokeLinecap="round" />
          <line x1="63" y1="44" x2="55" y2="47" stroke="#c94f70" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="41" cy="53" rx="3" ry="4" fill="#c94f70" />
          <ellipse cx="59" cy="53" rx="3" ry="4" fill="#c94f70" />
          <path d="M43 70 Q50 65 57 70" fill="none" stroke="#c94f70" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M40 58 Q38 64 41 68 Q44 64 40 58 Z" fill="#a3c9f0" opacity="0.85" />
        </>
      )}

      {variant === "wizard" && (
        <>
          {/* hat */}
          <polygon points="50,2 34,38 66,38" fill="#cf9f43" stroke="#c94f70" strokeWidth="2" strokeLinejoin="round" />
          <ellipse cx="50" cy="38" rx="20" ry="5" fill="#e2bd6c" stroke="#c94f70" strokeWidth="2" />
          <path d="M46 6 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 Z" fill="#fff7f2" />
          <circle cx="70" cy="20" r="2" fill="#e2bd6c" />
          <circle cx="26" cy="26" r="1.6" fill="#e2bd6c" />
          {/* eyes */}
          <circle cx="41" cy="54" r="3.4" fill="#3a2430" />
          <circle cx="59" cy="54" r="3.4" fill="#3a2430" />
          <circle cx="42.4" cy="52.6" r="1.1" fill="#fff" />
          <circle cx="60.4" cy="52.6" r="1.1" fill="#fff" />
          <path
            d="M44 67 Q47 70 50 67 Q53 70 56 67"
            fill="none"
            stroke="#c94f70"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}

/** A small original cat illustration styled as a meme card, with a caption. */
export function CatMeme({ variant, caption }: { variant: CatVariant; caption: string }) {
  return (
    <div className="inline-flex flex-col items-center gap-1.5">
      <div className="rounded-2xl bg-white/85 border border-rose-100 p-2.5 shadow-sm">
        <CatSvg variant={variant} />
      </div>
      <p className="max-w-[11rem] text-center text-xs font-semibold text-rose-500/90 font-sans">{caption}</p>
    </div>
  );
}
