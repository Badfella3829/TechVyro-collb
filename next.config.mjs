/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  allowedDevOrigins: [
    '*.run.app',
    '*.aistudio.google.com',
    'localhost',
    '127.0.0.1',
    '*.replit.dev',
    '*.repl.co',
    '*.riker.replit.dev',
  ],
}

export default nextConfig
