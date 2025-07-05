"use server"
import { revalidatePath } from "next/cache"
import Thready from "../models/thready.model"
import { connectToDatabase } from "../mongoose"
import {
	AllThreadsParams,
	ICreateThready,
	IPopulatedThread,
	ICommentCreateParams,
	IGetThreadByIdResult,
	ThreadyCreateParams,
	IPopulatedUserProfile
} from "@/types/mongo"
import User from "../models/user.model"
import { handleError } from "../utils"
import path from "path"

export const createThread = async (
	{ author, text, communityId = null }: ThreadyCreateParams,
	path: string
) => {
	try {
		await connectToDatabase()

		const createdThready = await Thready.create<ICreateThready>({
			author,
			text,
			communityId
		})
		await User.findByIdAndUpdate(author, {
			$push: { threads: createdThready._id }
		})

		revalidatePath(path)
	} catch (error) {
		handleError(error)
	}
}

export const createComment = async (
	{ author, parrentThreadID, text }: ICommentCreateParams,
	path: string
) => {
	try {
		await connectToDatabase()

		const thread = await Thready.findById(parrentThreadID)
		if (!thread) {
			throw new Error("Thread not found")
		}

		const createdComment = await Thready.create<ICreateThready>({
			author,
			text,
			parentId: parrentThreadID
		})

		const savedComment = await createdComment.save()

		thread.children.push(savedComment._id)
		await thread.save()

		revalidatePath(path)
	} catch (error) {
		handleError(error)
	}
}

export const getThreadById = async (
	id: string
): Promise<IGetThreadByIdResult | null | undefined> => {
	try {
		await connectToDatabase()
		const thread = Thready.findById(id)
			.populate({
				path: "author",
				model: User,
				select: "_id clerkId name image"
			})
			.populate({
				path: "children",
				populate: [
					{
						path: "author",
						model: User,
						select: "_id clerkId name parentId image"
					},
					{
						path: "children",
						model: Thready,
						populate: {
							path: "author",
							model: User,
							select: "_id clerkId name parentId image"
						}
					}
				]
			})
			.exec()

		if (!thread) return null

		return JSON.parse(JSON.stringify(await thread))
	} catch (error) {
		handleError(error)
	}
}

export const getThreadsByUserId = async (
	userId: string
): Promise<IPopulatedUserProfile | null | undefined> => {
	try {
		await connectToDatabase()

		const threads = await User.findOne({ clerkId: userId })
			.populate({
				path: "threads",
				model: Thready,
				populate: {
					path: "children",
					model: Thready,
					populate: {
						path: "author",
						model: User,
						select: "name image id"
					}
				}
			})
			.sort({ createdAt: "desc" })

		return JSON.parse(JSON.stringify(threads))
	} catch (error) {
		handleError(error)
	}
}

export const getAllThreads = async (
	pageNumber = 1,
	pageSize = 20
): Promise<AllThreadsParams | null | undefined> => {
	const skipAmout = (pageNumber - 1) * pageSize
	try {
		await connectToDatabase()
		const threadsQuery = Thready.find({
			parentId: { $in: [null, undefined] }
		})
			.sort({ createdAt: "desc" })
			.skip(skipAmout)
			.limit(pageSize)
			.populate({
				path: "author",
				model: User
			})
			.populate({
				path: "children",
				populate: {
					path: "author",
					model: User,
					select: "_id name parentId image"
				}
			})

		const totalThreads = await Thready.countDocuments({
			parentId: { $in: [null, undefined] }
		})

		const posts = await threadsQuery.exec()

		const isNext = totalThreads > skipAmout + posts.length

		return JSON.parse(JSON.stringify({ threads: posts, isNext }))
	} catch (error) {
		handleError(error)
	}
}
