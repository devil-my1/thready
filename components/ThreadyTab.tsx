import { getThreadsByUserId } from "@/lib/actions/thready.actions"
import React from "react"
import ThreadyCard from "./ThreadyCard"
import {
	ICommunityWithPosts,
	IPopulatedUserProfile,
	IPopulatedThread
} from "@/types/mongo"
import { fetchCommunityPosts } from "@/lib/actions/community.actions"

interface ThreadyTabProps {
	currentUserId: string
	accountId: string
	accountType: "User" | "Community"
}

const ThreadyTab = async ({
	accountId,
	accountType,
	currentUserId
}: ThreadyTabProps) => {
	let result: IPopulatedUserProfile | ICommunityWithPosts | null = null
	const isOwner = accountType === "User" && currentUserId === accountId
	const isCommunityOwner =
		accountType === "Community" && currentUserId === accountId

	// Fetch threads based on accountId and accountType
	if (accountType === "Community") {
		result = await fetchCommunityPosts(accountId)
	} else {
		result = await getThreadsByUserId(accountId)
	}

	if (!result) {
		return (
			<section className='mt-9 flex flex-col gap-10'>
				<h1 className='head-text'>Threads</h1>
				<p>No threads found.</p>
			</section>
		)
	}

	const threads = result?.threads || []

	return (
		<section className='mt-9 flex flex-col gap-10'>
			<h1 className='head-text'>Threads</h1>
			<div className='mt-9 flex flex-col gap-10'>
				{threads && threads.length > 0 ? (
					<>
						{threads.map(thread => {
							// Handle different thread structures based on account type
							const isUserProfile = accountType === "User"
							const userResult = result as IPopulatedUserProfile
							const communityResult = result as ICommunityWithPosts

							// Type-safe handling of thread data
							if (isUserProfile) {
								const userThread = thread as IPopulatedThread
								return (
									<ThreadyCard
										key={userThread._id}
										id={userThread._id}
										parrentId={userThread.parentId || null}
										author={{
											_id: userResult._id,
											name: userResult.name || "Unknown User",
											image: userResult.image || "/assets/user.svg",
											clerkId: userResult.clerkId || ""
										}}
										currentUser={currentUserId}
										comments={
											userThread.children?.map((child: any) => ({
												_id: child._id,
												author: {
													_id: child.author._id,
													name: child.author.name,
													image: child.author.image || "/assets/user.svg"
												}
											})) || null
										}
										text={userThread.text}
										community={userThread.communityId || null}
										createdAt={userThread.createdAt}
										likes={userThread.likes?.map(like => like.clerkId) || []}
										likesCount={userThread.likesCount || 0}
										showActions={isOwner}
									/>
								)
							} else {
								// Community thread handling
								const communityThread =
									thread as ICommunityWithPosts["threads"][0]
								return (
									<ThreadyCard
										key={communityThread._id}
										id={communityThread._id}
										parrentId={null} // Community threads don't have parentId in this structure
										author={{
											_id: communityThread._id, // Use thread ID as fallback
											name: communityThread.author.name,
											image: communityThread.author.image || "/assets/user.svg",
											clerkId: communityThread.author.clerkId || ""
										}}
										currentUser={currentUserId}
										comments={
											communityThread.children?.map((child: any) => ({
												_id: child._id,
												author: {
													_id: child.author._id || child._id,
													name: child.author.clerkId || "Unknown", // Use clerkId as name for community child comments
													image: child.author.image || "/assets/user.svg"
												}
											})) || null
										}
										text={communityThread.text}
										community={{
											_id: communityResult._id,
											id: communityResult.id,
											name: communityResult.name,
											image: communityResult.image
										}}
										createdAt={communityThread.createdAt}
										showActions={isCommunityOwner}
									/>
								)
							}
						})}
					</>
				) : (
					<p>No threads found.</p>
				)}
			</div>
		</section>
	)
}

export default ThreadyTab
