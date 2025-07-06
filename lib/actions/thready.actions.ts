"use server"
import { revalidatePath } from "next/cache"
import Thready from "../models/thready.model"
import { connectToDatabase } from "../mongoose"
import {
	AllThreadsParams,
	ICreateThready,
	ICommentCreateParams,
	IGetThreadByIdResult,
	ThreadyCreateParams,
	IPopulatedUserProfile
} from "@/types/mongo"
import User from "../models/user.model"
import { handleError } from "../utils"
import { Community } from "../models/community.model"

export const createThread = async (
	{ author, text, communityId = null }: ThreadyCreateParams,
	path: string
): Promise<void> => {
	try {
		await connectToDatabase()

		const communityIdObject = await Community.findOne(
			{ id: communityId },
			{ _id: 1 }
		)

		const createdThready = await Thready.create<ICreateThready>({
			author,
			text: text.trim(), // Preserve whitespace but remove leading/trailing spaces
			communityId: communityIdObject
		})

		await User.findByIdAndUpdate(author, {
			$push: { threads: createdThready._id }
		})

		if (communityIdObject) {
			await Community.findByIdAndUpdate(communityIdObject, {
				$push: { threads: createdThready._id }
			})
		}

		revalidatePath(path)
	} catch (error) {
		handleError(error)
	}
}

export const createComment = async (
	{ author, parrentThreadID, text }: ICommentCreateParams,
	path: string
): Promise<void> => {
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
): Promise<IGetThreadByIdResult | null> => {
	try {
		await connectToDatabase()
		const thread = await Thready.findById(id)
			.populate({
				path: "author",
				model: User,
				select: "_id clerkId name image"
			})
			.populate({
				path: "communityId",
				model: Community,
				select: "_id id name image"
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
					},
					{
						path: "communityId",
						model: Community,
						select: "_id id name image"
					}
				]
			})
			.exec()

		if (!thread) return null

		return JSON.parse(JSON.stringify(thread))
	} catch (error) {
		handleError(error)
		return null
	}
}

export const getThreadsByUserId = async (
	userId: string
): Promise<IPopulatedUserProfile | null> => {
	try {
		await connectToDatabase()

		// First get the user
		const user = await User.findOne({ clerkId: userId }).populate({
			path: "communities",
			model: Community,
			select: "_id id name image"
		})

		if (!user) {
			return null
		}

		// Then find only personal threads (no communityId) created by this user
		const personalThreads = await Thready.find({
			author: user._id,
			communityId: { $in: [null, undefined] }, // Only personal threads, not community threads
			parentId: { $in: [null, undefined] } // Only top-level threads, not comments
		})
			.populate([
				{
					path: "author",
					model: User,
					select: "_id clerkId name image"
				},
				{
					path: "children",
					model: Thready,
					populate: {
						path: "author",
						model: User,
						select: "_id name image"
					}
				}
			])
			.sort({ createdAt: "desc" })

		// Combine user data with personal threads
		const result = {
			...user.toObject(),
			threads: personalThreads
		}

		return JSON.parse(JSON.stringify(result))
	} catch (error) {
		handleError(error)
		return null
	}
}

export const getAllThreads = async (
	pageNumber = 1,
	pageSize = 20
): Promise<AllThreadsParams | null> => {
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
				model: User,
				select: "_id clerkId name image"
			})
			.populate({
				path: "communityId",
				model: Community,
				select: "_id id name image"
			})
			.populate({
				path: "children",
				populate: {
					path: "author",
					model: User,
					select: "_id name image"
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
		return null
	}
}

async function fetchAllChildThreads(threadId: string): Promise<any[]> {
	// Use BFS approach to avoid stack overflow for deeply nested threads
	const allDescendants = []
	const queue = [threadId]

	while (queue.length > 0) {
		const currentId = queue.shift()

		// Find all direct children of the current thread
		const children = await Thready.find({ parentId: currentId })

		// Add children to our results
		allDescendants.push(...children)

		// Add child IDs to the queue for further processing
		queue.push(...children.map(child => child._id.toString()))
	}

	return allDescendants
}

export async function deleteThread(id: string, path: string): Promise<void> {
	try {
		connectToDatabase()

		// Find the thread to be deleted (the main thread)
		const mainThread = await Thready.findById(id).populate("author communityId")

		if (!mainThread) {
			throw new Error("Thread not found")
		}

		// Fetch all child threads and their descendants recursively
		const descendantThreads = await fetchAllChildThreads(id)

		// Get all descendant thread IDs including the main thread ID and child thread IDs
		const descendantThreadIds = [
			id,
			...descendantThreads.map(thread => thread._id)
		]

		// Extract the authorIds and communityIds to update User and Community models respectively
		const uniqueAuthorIds = new Set(
			[
				...descendantThreads.map(thread => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
				mainThread.author?._id?.toString()
			].filter(id => id !== undefined)
		)

		const uniqueCommunityIds = new Set(
			[
				...descendantThreads.map(thread => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
				mainThread.community?._id?.toString()
			].filter(id => id !== undefined)
		)

		// Recursively delete child threads and their descendants
		await Thready.deleteMany({ _id: { $in: descendantThreadIds } })

		// Update User model
		await User.updateMany(
			{ _id: { $in: Array.from(uniqueAuthorIds) } },
			{ $pull: { threads: { $in: descendantThreadIds } } }
		)

		// Update Community model
		await Community.updateMany(
			{ _id: { $in: Array.from(uniqueCommunityIds) } },
			{ $pull: { threads: { $in: descendantThreadIds } } }
		)

		revalidatePath(path)
	} catch (error: any) {
		handleError(error)
	}
}
