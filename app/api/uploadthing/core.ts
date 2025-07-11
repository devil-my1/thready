import { currentUser } from "@clerk/nextjs/server"
import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

const getUser = async () => await currentUser()

export const ourFileRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	media: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
		// Set permissions and file types for this FileRoute
		.middleware(async _req => {
			// This code runs on your server before upload
			const user = await getUser()

			// If you throw, the user will not be able to upload
			if (!user) throw new Error("Unauthorized")

			// Whatever is returned here is accessible in onUploadComplete as `metadata`
			return { userId: user.id }
		})
		.onUploadComplete(async ({ metadata, file }) => {
			return {
				ufsUrl: file.ufsUrl,
				userId: metadata.userId,
				fileName: file.name,
				fileSize: file.size
			}
		})
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
