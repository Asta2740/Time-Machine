type CatVariant = "wizard" | "sad" | "happy" | "happy2";

const IMAGE_SRC: Record<CatVariant, string> = {
  wizard: "/images/wizard.jfif",
  happy: "/images/happy.jfif",
  happy2: "/images/happy2.jfif",
  sad: "/images/Sad.jfif",
};

/** A small cat image styled as a meme card, with a caption. */
export function CatMeme({ variant, caption }: { variant: CatVariant; caption: string }) {
  return (
    <div className="inline-flex flex-col items-center gap-1.5">
      <div className="overflow-hidden rounded-2xl bg-white/85 border border-rose-100 p-1.5 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={IMAGE_SRC[variant]}
          alt=""
          width={96}
          height={96}
          className="h-24 w-24 rounded-xl object-cover"
        />
      </div>
      <p className="max-w-[11rem] text-center text-xs font-semibold text-rose-500/90 font-sans">{caption}</p>
    </div>
  );
}
