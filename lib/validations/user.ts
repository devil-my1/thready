import z from "zod"

export const userValidationSchema = z.object({
	username: z.string().min(2).max(30).optional(),
	name: z.string().min(2).max(30).optional(),
	bio: z.string().min(5).max(1000).optional(),
	image: z.string().url().nonempty()
})
