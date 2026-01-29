import type { MetadataRoute } from 'next';
import { tools } from '../data';

const SITE_URL = 'https://whichiac.com';

const withTrailingSlash = (path: string) => (path.endsWith('/') ? path : `${path}/`);

const buildUrl = (path: string) => `${SITE_URL}${withTrailingSlash(path)}`;

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticRoutes = ['/', '/quiz/', '/compare/', '/about/', '/result/'];
  const toolRoutes = tools.map((tool) => `/tools/${tool.id}/`);

  return [...staticRoutes, ...toolRoutes].map((path) => ({
    url: buildUrl(path),
    lastModified
  }));
}
