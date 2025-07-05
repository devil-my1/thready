import z from "zod"

export const threadValidationSchema = z.object({
	thread: z
		.string()
		.min(2, { message: "Thread must be at least 2 characters long." })
})

export const commentValidationSchema = z.object({
	comment: z
		.string()
		.min(2, { message: "Comment must be at least 2 characters long." })
})
