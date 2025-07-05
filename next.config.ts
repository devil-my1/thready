import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	typescript: {
		ignoreBuildErrors: true
	},
	experimental: {
		serverActions: {
			bodySizeLimit: "4mb"
		}
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "img.clerk.com"
			},
			{
				protocol: "https",
				hostname: "images.clerk.dev"
			},
			{
				protocol: "https",
				hostname: "uploadthing.com"
			},
			{
				protocol: "https",
				hostname: "placehold.co"
			},
			{
				hostname: "utfs.io",
				protocol: "https"
			},
			{
				hostname: "k2far3z952.ufs.sh"
			}
		]
	}
}

nextConfig.serverExternalPackages = ["mongoose"]
export default nextConfig
