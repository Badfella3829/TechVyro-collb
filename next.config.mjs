/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  allowedDevOrigins: [
    '**.run.app',
    '*.run.app',
    '**.aistudio.google.com',
    'aistudio.google.com',
    '**.googleusercontent.com',
    '**.google.com',
    'localhost',
    '127.0.0.1',
    '**.replit.dev',
    '**.repl.co',
  ],
}

export default nextConfig
