/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_APPWRITE_ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
        NEXT_PUBLIC_APPWRITE_PROJECT: process.env.NEXT_PUBLIC_APPWRITE_PROJECT
    }
};

export default nextConfig;
