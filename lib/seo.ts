import { Product } from 'lib/shopify/types';
import { baseUrl } from 'lib/utils';

export const SITE_NAME = process.env.SITE_NAME || 'Ditectrev Shop';
export const COMPANY_NAME = process.env.COMPANY_NAME || 'Ditectrev';

export const SITE_TAGLINE = 'IT certification practice tests and study guides';

export const SITE_DESCRIPTION =
  'Shop Ditectrev digital study guides and practice tests for Azure, AWS, GCP, Scrum, and more. Instant downloads, free delivery, and refunds if you are not happy.';

const ORGANIZATION_ID = `${baseUrl}/#organization`;
const WEBSITE_ID = `${baseUrl}/#website`;
const ORGANIZATION_LOGO_PATH = '/organization-logo.svg';

export function truncateMetaDescription(text: string, max = 160) {
  const cleaned = text.replace(/\s+/g, ' ').trim();

  if (!cleaned) {
    return SITE_DESCRIPTION;
  }

  if (cleaned.length <= max) {
    return cleaned;
  }

  return `${cleaned.slice(0, max - 1).trimEnd()}…`;
}

export function getProductUrl(handle: string) {
  return `${baseUrl}/product/${handle}`;
}

export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: COMPANY_NAME,
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}${ORGANIZATION_LOGO_PATH}`,
      width: 799,
      height: 799,
    },
    sameAs: [
      'https://github.com/Ditectrev',
      'https://github.com/Ditectrev/shop',
    ],
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      '@id': `${baseUrl}/#return-policy`,
      applicableCountry: 'PL',
      returnPolicyCategory:
        'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 30,
      returnFees: 'https://schema.org/FreeReturn',
    },
  };
}

export function getWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: baseUrl,
    description: SITE_DESCRIPTION,
    publisher: {
      '@id': ORGANIZATION_ID,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getProductJsonLd(product: Product) {
  const productUrl = getProductUrl(product.handle);
  const images = [
    product.featuredImage?.url,
    ...product.images.map((image) => image.url),
  ].filter(
    (url, index, list): url is string =>
      Boolean(url) && list.indexOf(url) === index,
  );
  const offer =
    product.variants.find((variant) => variant.availableForSale) ||
    product.variants[0];
  const price =
    offer?.price.amount || product.priceRange.minVariantPrice.amount;
  const priceCurrency =
    offer?.price.currencyCode ||
    product.priceRange.minVariantPrice.currencyCode;
  const sku = offer?.sku || product.handle;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    name: product.title,
    description: product.description || product.seo.description,
    image: images,
    sku,
    mpn: sku,
    url: productUrl,
    brand: {
      '@type': 'Brand',
      name: product.vendor || COMPANY_NAME,
    },
    category: product.productType || undefined,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency,
      price,
      priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        '@id': ORGANIZATION_ID,
        name: COMPANY_NAME,
      },
      hasMerchantReturnPolicy: {
        '@id': `${baseUrl}/#return-policy`,
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: priceCurrency,
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'PL',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 0,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 0,
            unitCode: 'DAY',
          },
        },
      },
    },
  };
}

export function getProductBreadcrumbJsonLd(product: Product) {
  const productUrl = getProductUrl(product.handle);

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.title,
        item: productUrl,
      },
    ],
  };
}
