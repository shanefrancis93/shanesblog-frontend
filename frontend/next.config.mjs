/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['oaidalleapiprodscus.blob.core.windows.net'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'oaidalleapiprodscus.blob.core.windows.net',
                port: '',
                pathname: '/private/**',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/tech-projects/projects/epistemic-task-assign',
                destination: '/tech-projects/epistemic-task-assign',
                permanent: false,
            },
            {
                source: '/tech-projects/projects/:slug',
                destination: '/tech-projects/:slug',
                permanent: false,
            },
        ];
    },
};

export default nextConfig;
