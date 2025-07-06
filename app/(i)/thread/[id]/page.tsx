import ThreadyCard from "@/components/ThreadyCard"
import { getThreadById } from "@/lib/actions/thready.actions"
import { getUserById } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import React from "react"
import Comment from "@/components/Comment"
import { IPopulatedThreadChild } from "@/types/mongo"

const ThreadDetailPage = async ({ params }: SearchParamProps) => {
	// const { id } = useParams<{ id: string }>()
	const { id } = await params

	const user = await currentUser()

	if (!user) return null

	const userInfo = await getUserById(user.id)

	if (!userInfo?.onboarded) redirect("/onboarding")

	const thread = await getThreadById(id)

	if (!thread) {
		return <p className='text-center text-light-2'>Thread not found.</p>
	}

	return (
		<section className='relative'>
			<div>
				<ThreadyCard
					id={thread?._id as string}
					parrentId={thread.parentId!! || null}
					author={thread.author}
					currentUser={user?.id}
					comments={thread.children}
					text={thread.text}
					community={thread?.communityId || null}
					createdAt={thread.createdAt!}
				/>
			</div>

			<div className='mt-7'>
				<Comment
					parrentThreadId={thread._id as string}
					currentUserImg={userInfo.image}
					currentUserId={userInfo._id as unknown as string}
				/>
			</div>

			<div className='mt-10'>
				{thread.children &&
					thread?.children.map((childItem: IPopulatedThreadChild) => (
						<ThreadyCard
							key={childItem._id}
							id={childItem._id}
							currentUser={user?.id}
							parrentId={childItem.parentId!! || null}
							text={childItem.text}
							author={childItem.author}
							community={childItem.communityId || null}
							createdAt={childItem.createdAt}
							comments={childItem.children}
							isComment
						/>
					))}
			</div>
		</section>
	)
}

export default ThreadDetailPage
