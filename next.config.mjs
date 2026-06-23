/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Product images can come from arbitrary URLs in the Google Sheet,
    // so allow remote images. (We render them via CSS background-image,
    // but this keeps next/image usable if added later.)
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
