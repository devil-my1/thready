"use server"

import { FilterQuery } from "mongoose"

import { Community } from "../models/community.model"
import Thready from "../models/thready.model"
import User from "../models/user.model"

import { connectToDatabase } from "../mongoose"
import {
	ICommunity,
	IPopulatedCommunity,
	ICommunityWithPosts,
	IFetchCommunitiesResult,
	IFetchCommunitiesParams,
	ICommunityOperationSuccess
} from "@/types/mongo"

export async function createCommunity(
	id: string,
	name: string,
	username: string,
	image: string,
	bio: string,
	createdById: string
): Promise<ICommunity | null | undefined> {
	try {
		connectToDatabase()

		// Find the user with the provided unique id
		const user = await User.findOne({ id: createdById })

		if (!user) {
			throw new Error("User not found") // Handle the case if the user with the id is not found
		}

		const newCommunity = new Community({
			id,
			name,
			username,
			image,
			bio,
			createdBy: user._id // Use the mongoose ID of the user
		})

		const createdCommunity = await newCommunity.save()

		// Update User model
		user.communities.push(createdCommunity._id)
		await user.save()

		return JSON.parse(JSON.stringify(createdCommunity)) as ICommunity
	} catch (error) {
		// Handle any errors
		console.error("Error creating community:", error)
		throw error
	}
}

export async function fetchCommunityDetails(
	id: string
): Promise<IPopulatedCommunity | null | undefined> {
	try {
		connectToDatabase()

		const communityDetails = await Community.findOne({ id }).populate([
			"createdBy",
			{
				path: "members",
				model: User,
				select: "name username image _id id"
			}
		])

		return JSON.parse(JSON.stringify(communityDetails)) as IPopulatedCommunity
	} catch (error) {
		// Handle any errors
		console.error("Error fetching community details:", error)
		throw error
	}
}

export async function fetchCommunityPosts(
	id: string
): Promise<ICommunityWithPosts | null> {
	try {
		connectToDatabase()

		const communityPosts = await Community.findById(id).populate({
			path: "threads",
			model: Thready,
			populate: [
				{
					path: "author",
					model: User,
					select: "name image id" // Select the "name" and "_id" fields from the "User" model
				},
				{
					path: "children",
					model: Thready,
					populate: {
						path: "author",
						model: User,
						select: "image _id clerkId" // Select the "name" and "_id" fields from the "User" model
					}
				}
			]
		})

		return JSON.parse(JSON.stringify(communityPosts)) as ICommunityWithPosts
	} catch (error) {
		// Handle any errors
		console.error("Error fetching community posts:", error)
		return null
	}
}

export async function fetchCommunities({
	searchString = "",
	pageNumber = 1,
	pageSize = 20,
	sortBy = "desc"
}: IFetchCommunitiesParams): Promise<
	IFetchCommunitiesResult | null | undefined
> {
	try {
		connectToDatabase()

		// Calculate the number of communities to skip based on the page number and page size.
		const skipAmount = (pageNumber - 1) * pageSize

		// Create a case-insensitive regular expression for the provided search string.
		const regex = new RegExp(searchString, "i")

		// Create an initial query object to filter communities.
		const query: FilterQuery<typeof Community> = {}

		// If the search string is not empty, add the $or operator to match either username or name fields.
		if (searchString.trim() !== "") {
			query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }]
		}

		// Define the sort options for the fetched communities based on createdAt field and provided sort order.
		const sortOptions = { createdAt: sortBy }

		// Create a query to fetch the communities based on the search and sort criteria.
		const communitiesQuery = Community.find(query)
			.sort(sortOptions)
			.skip(skipAmount)
			.limit(pageSize)
			.populate("members")

		// Count the total number of communities that match the search criteria (without pagination).
		const totalCommunitiesCount = await Community.countDocuments(query)

		const communities = await communitiesQuery.exec()

		// Check if there are more communities beyond the current page.
		const isNext = totalCommunitiesCount > skipAmount + communities.length

		return JSON.parse(
			JSON.stringify({ communities, isNext })
		) as IFetchCommunitiesResult
	} catch (error) {
		console.error("Error fetching communities:", error)
		throw error
	}
}

export async function addMemberToCommunity(
	communityId: string,
	memberId: string
): Promise<ICommunity | null | undefined> {
	try {
		connectToDatabase()

		// Find the community by its unique id
		const community = await Community.findOne({ id: communityId })

		if (!community) {
			throw new Error("Community not found")
		}

		// Find the user by their unique id
		const user = await User.findOne({ id: memberId })

		if (!user) {
			throw new Error("User not found")
		}

		// Check if the user is already a member of the community
		if (community.members.includes(user._id)) {
			throw new Error("User is already a member of the community")
		}

		// Add the user's _id to the members array in the community
		community.members.push(user._id)
		await community.save()

		// Add the community's _id to the communities array in the user
		user.communities.push(community._id)
		await user.save()

		return JSON.parse(JSON.stringify(community)) as ICommunity
	} catch (error) {
		// Handle any errors
		console.error("Error adding member to community:", error)
		throw error
	}
}

export async function removeUserFromCommunity(
	userId: string,
	communityId: string
): Promise<ICommunityOperationSuccess | null | undefined> {
	try {
		connectToDatabase()

		const userIdObject = await User.findOne({ id: userId }, { _id: 1 })
		const communityIdObject = await Community.findOne(
			{ id: communityId },
			{ _id: 1 }
		)

		if (!userIdObject) {
			throw new Error("User not found")
		}

		if (!communityIdObject) {
			throw new Error("Community not found")
		}

		// Remove the user's _id from the members array in the community
		await Community.updateOne(
			{ _id: communityIdObject._id },
			{ $pull: { members: userIdObject._id } }
		)

		// Remove the community's _id from the communities array in the user
		await User.updateOne(
			{ _id: userIdObject._id },
			{ $pull: { communities: communityIdObject._id } }
		)

		return JSON.parse(
			JSON.stringify({ success: true })
		) as ICommunityOperationSuccess
	} catch (error) {
		// Handle any errors
		console.error("Error removing user from community:", error)
		throw error
	}
}

export async function updateCommunityInfo(
	communityId: string,
	name: string,
	username: string,
	image: string
): Promise<ICommunity | null | undefined> {
	try {
		connectToDatabase()

		// Find the community by its _id and update the information
		const updatedCommunity = await Community.findOneAndUpdate(
			{ id: communityId },
			{ name, username, image }
		)

		if (!updatedCommunity) {
			throw new Error("Community not found")
		}

		return JSON.parse(JSON.stringify(updatedCommunity)) as ICommunity
	} catch (error) {
		// Handle any errors
		console.error("Error updating community information:", error)
		throw error
	}
}

export async function deleteCommunity(
	communityId: string
): Promise<ICommunity | null | undefined> {
	try {
		connectToDatabase()

		// Find the community by its ID and delete it
		const deletedCommunity = await Community.findOneAndDelete({
			id: communityId
		})

		if (!deletedCommunity) {
			throw new Error("Community not found")
		}

		// Delete all threads associated with the community
		await Thready.deleteMany({ community: communityId })

		// Find all users who are part of the community
		const communityUsers = await User.find({ communities: communityId })

		// Remove the community from the 'communities' array for each user
		const updateUserPromises = communityUsers.map(user => {
			user.communities.pull(communityId)
			return user.save()
		})

		await Promise.all(updateUserPromises)

		return JSON.parse(JSON.stringify(deletedCommunity)) as ICommunity
	} catch (error) {
		console.error("Error deleting community: ", error)
		throw error
	}
}
