/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // remotePatterns: [new URL('https://static.vecteezy.com/system/resources/thumbnails/029/796/026/small_2x/asian-girl-anime-avatar-ai-art-photo.jpg')],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'static.vecteezy.com',
                port: '',
                search: '',
            },
        ],
    },
};

export default nextConfig;
