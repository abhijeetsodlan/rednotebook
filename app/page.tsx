export const dynamic = 'force-dynamic';

import Link from "next/link";
import NoticeBanner from "@/components/NoticeBanner";
import { getActiveNotice } from "@/lib/posts";

export default async function HomePage() {
  const notice = await getActiveNotice();

  return (
    <>
      {notice ? <NoticeBanner id={notice.id} message={notice.message} /> : null}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.2fr_.8fr] md:items-center">
        <div>
          <p className="mb-4 text-sm uppercase text-poster">Independence, Democracy, Socialism</p>
          <h1 className="font-display text-6xl uppercase leading-none text-cream md:text-8xl">
            Red Notebook
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-cream/70">
            I vomit my thoughts and opinions here.
          </p>
          <Link href="/blogs" className="mt-8 inline-flex rounded bg-redflag px-5 py-3 font-semibold text-white hover:bg-oxblood">
            Read the archive
          </Link>
        </div>
        <div className="relative min-h-80 overflow-hidden rounded-lg border border-redflag/30 bg-white/[.035]">
          <div className="absolute inset-0 bg-[radial-gradient(circle,#D6A84F_1px,transparent_1px)] [background-size:13px_13px] opacity-20" />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/47/CheyFidel.jpg"
            alt="Che Guevara and Fidel Castro"
            className="absolute inset-0 h-full w-full object-cover object-center grayscale contrast-125 sepia opacity-85 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-redflag/35 via-coal/10 to-coal/75" />
        </div>
      </section>
      <section className="bg-black px-4 py-20 text-center">
        <div className="mx-auto max-w-4xl space-y-8 md:space-y-10">
          <p className="font-sans text-3xl font-light leading-relaxed text-cream/90 md:text-5xl">
            बोल कि लब आज़ाद हैं तेरे
          </p>
          <p className="font-sans text-3xl font-light leading-relaxed text-cream/90 md:text-5xl">
            बोल ज़बाँ अब तक तेरी है
          </p>
          <p className="font-sans text-3xl font-light leading-relaxed text-cream/90 md:text-5xl">
            तेरा सुत्वाँ जिस्म है तेरा
          </p>
          <p className="font-sans text-3xl font-light leading-relaxed text-cream/90 md:text-5xl">
            बोल कि जाँ अब तक तेरी है
          </p>
        </div>
      </section>
    </>
  );
}














