"use server"

import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { connectToDatabase } from "../mongoose"
import {
	IUser,
	IUpdateUserParams,
	GetAllUsersResult,
	IActivityReply,
	IPopulatedUserProfile
} from "@/types/mongo"
import { handleError } from "../utils"
import { FilterQuery } from "mongoose"
import Thready from "../models/thready.model"
import { Community } from "../models/community.model"

export const updateUser = async (
	userData: IUpdateUserParams,
	path: string
): Promise<void> => {
	connectToDatabase()

	try {
		await User.findOneAndUpdate(
			{ clerkId: userData.clerkId },
			{
				name: userData.name,
				username: userData.username?.toLocaleLowerCase(),
				bio: userData.bio,
				image: userData.image,
				onboarded: true,
				updatedAt: new Date()
			},
			{ upsert: true }
		)
		if (path === "/profile/edit") {
			revalidatePath(path)
		}
	} catch (error) {
		handleError(error)
	}
}

export async function getUserById(
	id: string
): Promise<IPopulatedUserProfile | null> {
	try {
		await connectToDatabase()
		const user = await User.findOne({ clerkId: id })
			.populate({
				path: "communities",
				model: Community
			})
			.populate({
				path: "threads",
				model: Thready
			})
		if (!user) return null

		return JSON.parse(JSON.stringify(user))
	} catch (error) {
		handleError(error)
		return null
	}
}

export async function getAllUsers({
	userId,
	searchTerm = "",
	pageNumber = 1,
	pageSize = 20,
	sortBy = "desc"
}: GetAllUsersParams): Promise<GetAllUsersResult | null | undefined> {
	try {
		await connectToDatabase()

		const skipAmount = (pageNumber - 1) * pageSize

		const regex = new RegExp(`^${searchTerm}`, "i")
		const query: FilterQuery<IUser> = {
			clerkId: { $ne: userId }
		}

		if (searchTerm.trim() !== "") {
			query.$or = [{ name: { $regex: regex } }, { username: { $regex: regex } }]
		}

		const sortOption = { createdAt: sortBy }

		const usersQuery = User.find(query)
			.skip(skipAmount)
			.limit(pageSize)
			.sort(sortOption)

		const totalUsersCount = await User.countDocuments(query)

		const users = await usersQuery.exec()

		const isNext = totalUsersCount > skipAmount + users.length

		return JSON.parse(JSON.stringify({ users, isNext }))
	} catch (error) {
		handleError(error)
	}
}

export async function getActivity(
	userId: string
): Promise<IActivityReply[] | null | undefined> {
	try {
		await connectToDatabase()

		const userThreads = await Thready.find({ author: userId })

		const childThreadIds: string[] = []
		userThreads.forEach(thread => {
			childThreadIds.push(...thread.children)
		})

		const replies = await Thready.find({
			_id: { $in: childThreadIds },
			author: { $ne: userId }
		}).populate({
			path: "author",
			model: User,
			select: "name image _id clerkId"
		})

		return JSON.parse(JSON.stringify(replies))
	} catch (error) {
		handleError(error)
	}
}
