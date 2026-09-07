import { Carousel } from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';
import Footer from 'components/layout/footer';
import { WelcomeToast } from 'components/welcome-toast';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from 'lib/seo';
import { baseUrl } from 'lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME} | ${SITE_TAGLINE}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: 'website',
    url: baseUrl,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
};

export default function HomePage() {
  return (
    <>
      <WelcomeToast />
      <section className="mx-auto max-w-(--breakpoint-2xl) px-4 pb-4 pt-2">
        <h1 className="text-2xl font-bold md:text-3xl">{SITE_TAGLINE}</h1>
        <p className="mt-1 text-sm text-neutral-600 md:text-base dark:text-neutral-400">
          Instant digital downloads for Microsoft Azure, AWS, Google Cloud,
          Scrum, and more.
        </p>
      </section>
      <ThreeItemGrid />
      <Carousel />
      <Footer />
    </>
  );
}
