"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "../mongoose"
import Thready from "../models/thready.model"
import User from "../models/user.model"
import { handleError } from "../utils"

export interface LikeResponse {
	success: boolean
	isLiked: boolean
	likesCount: number
	message?: string
}

export interface LikeUser {
	_id: string
	clerkId: string
	name: string
	image?: string
	username?: string
}

export interface GetThreadLikesResponse {
	likes: LikeUser[]
	likesCount: number
}

export interface LikeStatusResponse {
	isLiked: boolean
	likesCount: number
}

export const toggleLike = async (
	threadId: string,
	userId: string,
	path: string
): Promise<LikeResponse> => {
	try {
		await connectToDatabase()

		const thread = await Thready.findById(threadId)
		const user = await User.findOne({ clerkId: userId })

		if (!thread || !user) {
			return {
				success: false,
				isLiked: false,
				likesCount: 0,
				message: "Thread or user not found"
			}
		}

		const userObjectId = user._id
		const isCurrentlyLiked = thread.likes.includes(userObjectId)

		if (isCurrentlyLiked) {
			// Unlike the thread
			await Thready.findByIdAndUpdate(threadId, {
				$pull: { likes: userObjectId },
				$inc: { likesCount: -1 }
			})

			await User.findByIdAndUpdate(userObjectId, {
				$pull: { likedThreads: threadId }
			})

			revalidatePath(path)

			return {
				success: true,
				isLiked: false,
				likesCount: Math.max(0, thread.likesCount - 1),
				message: "Thread unliked successfully"
			}
		} else {
			// Like the thread
			await Thready.findByIdAndUpdate(threadId, {
				$addToSet: { likes: userObjectId },
				$inc: { likesCount: 1 }
			})

			await User.findByIdAndUpdate(userObjectId, {
				$addToSet: { likedThreads: threadId }
			})

			// Create activity notification if the liker is not the thread author
			const threadAuthor = thread.author
			if (threadAuthor.toString() !== userObjectId.toString()) {
				// Note: You can extend this to create a notification system
				// For now, we'll just log or you can implement notification logic here
				console.log(
					`User ${userId} liked thread ${threadId} by ${threadAuthor}`
				)
			}

			revalidatePath(path)

			return JSON.parse(
				JSON.stringify({
					success: true,
					isLiked: true,
					likesCount: thread.likesCount + 1,
					message: "Thread liked successfully"
				})
			)
		}
	} catch (error) {
		handleError(error)
		return {
			success: false,
			isLiked: false,
			likesCount: 0,
			message: "An error occurred while toggling like"
		}
	}
}

export const getLikeStatus = async (
	threadId: string,
	userId: string
): Promise<LikeStatusResponse> => {
	try {
		await connectToDatabase()

		const user = await User.findOne({ clerkId: userId }).select("_id")
		const thread = await Thready.findById(threadId).select("likes likesCount")

		if (!thread || !user) {
			return { isLiked: false, likesCount: 0 }
		}

		const isLiked = thread.likes.includes(user._id)

		return JSON.parse(
			JSON.stringify({
				isLiked,
				likesCount: thread.likesCount || 0
			})
		)
	} catch (error) {
		handleError(error)
		return { isLiked: false, likesCount: 0 }
	}
}

export const getThreadLikes = async (
	threadId: string
): Promise<GetThreadLikesResponse> => {
	try {
		await connectToDatabase()

		const thread = await Thready.findById(threadId)
			.populate({
				path: "likes",
				model: User,
				select: "_id clerkId name image username"
			})
			.select("likes likesCount")

		if (!thread) {
			return { likes: [], likesCount: 0 }
		}

		return JSON.parse(
			JSON.stringify({
				likes: thread.likes || [],
				likesCount: thread.likesCount || 0
			})
		)
	} catch (error) {
		console.error("Error in getThreadLikes:", error)
		handleError(error)
		return { likes: [], likesCount: 0 }
	}
}
