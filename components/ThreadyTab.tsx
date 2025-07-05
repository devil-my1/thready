import { getThreadsByUserId } from "@/lib/actions/thready.actions"
import React from "react"
import ThreadyCard from "./ThreadyCard"

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
	const isOwner = accountType === "User" && currentUserId === accountId
	const isCommunityOwner =
		accountType === "Community" && currentUserId === accountId

	// Fetch threads based on accountId and accountType
	const result = await getThreadsByUserId(accountId)
	const threads = result?.threads || []

	console.log("Threads fetched:", threads)

	return (
		<section className='mt-9 flex flex-col gap-10'>
			<h1 className='head-text'>Threads</h1>
			<div className='mt-9 flex flex-col gap-10'>
				{threads && threads.length > 0 ? (
					<>
						{threads.map(thread => (
							<ThreadyCard
								key={thread?._id}
								id={thread?._id}
								parrentId={thread.parentId!!}
								author={
									accountType === "User"
										? {
												name: result?.name || "Unknown User",
												image: result?.image || "/assets/user.svg",
												clerkId: result?.clerkId || ""
											}
										: {
												name: thread.author.name,
												image: thread.author.image,
												clerkId: thread.author.clerkId
											}
								}
								currentUser={currentUserId}
								comments={thread.children}
								text={thread.text}
								community={null}
								createdAt={thread.createdAt!}
							/>
						))}
					</>
				) : (
					<p>No threads found.</p>
				)}
			</div>
		</section>
	)
}

export default ThreadyTab
