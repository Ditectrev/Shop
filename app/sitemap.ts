import { getCollections, getPages, getProducts } from 'lib/shopify';
import { baseUrl, validateEnvironmentVariables } from 'lib/utils';
import { MetadataRoute } from 'next';

type Route = {
  url: string;
  lastModified: string;
};

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  validateEnvironmentVariables();

  try {
    const [collections, products, pages] = await Promise.all([
      getCollections().then((shopifyCollections) =>
        shopifyCollections.map((collection) => ({
          url: `${baseUrl}${collection.path}`,
          lastModified: collection.updatedAt,
        })),
      ),
      getProducts({}).then((shopifyProducts) =>
        shopifyProducts.map((product) => ({
          url: `${baseUrl}/product/${product.handle}`,
          lastModified: product.updatedAt,
        })),
      ),
      getPages().then((shopifyPages) =>
        shopifyPages.map((page) => ({
          url: `${baseUrl}/${page.handle}`,
          lastModified: page.updatedAt,
        })),
      ),
    ]);

    const fetchedRoutes: Route[] = [...collections, ...products, ...pages];
    const newestRoute = fetchedRoutes.reduce((latest, route) => {
      return route.lastModified > latest ? route.lastModified : latest;
    }, new Date(0).toISOString());

    return [
      {
        url: baseUrl,
        lastModified: newestRoute,
      },
      ...fetchedRoutes,
    ];
  } catch (error) {
    throw JSON.stringify(error, null, 2);
  }
}
