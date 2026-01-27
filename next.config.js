/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repoBasePath = process.env.NEXT_PUBLIC_BASE_PATH || '/REPO_NAME';

const nextConfig = {
  output: isProd ? 'export' : undefined,
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: isProd ? repoBasePath : '',
  assetPrefix: isProd ? `${repoBasePath}/` : ''
};

export default nextConfig;
