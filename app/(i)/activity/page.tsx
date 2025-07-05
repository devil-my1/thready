import { getActivity, getUserById } from "@/lib/actions/user.actions"
import { formatDateString } from "@/lib/utils"
import { currentUser } from "@clerk/nextjs/server"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import React from "react"

const ActivityPage = async () => {
	const user = await currentUser()
	if (!user) redirect("/sign-in")

	const userInfo = await getUserById(user.id)

	if (!userInfo?.onboarded) redirect("/onboarding")

	const activity = await getActivity(userInfo._id as unknown as string)

	return (
		<section>
			<h1 className='head-text mb-10'>Activity</h1>
			<section className='mt-10 flex flex-col gap-5'>
				{activity && activity.length > 0 ? (
					<>
						{activity.map((item, index) => (
							<Link
								href={`/thread/${item.parentId}`}
								key={index}
							>
								<article className='activity-card'>
									<div className='flex items-center gap-3'>
										<div className='relative h-6 w-6'>
											<Image
												src={item.author.image || "/assets/user.svg"}
												alt='profile photo'
												fill
												className='rounded-full object-cover shadow-xl'
											/>
										</div>
										<p className='text-light-2 text-small-regular'>
											<Link
												href={`/profile/${item.author.clerkId}`}
												className='mr-1 text-primary-500 hover:underline'
											>
												{item.author.name}
											</Link>{" "}
											replied to your thready
										</p>
									</div>
									<p>{formatDateString(item.createdAt.toString())}</p>
								</article>
							</Link>
						))}
					</>
				) : (
					<p className='text-center text-light-2 text-base-regular'>
						No activity yet.
					</p>
				)}
			</section>
		</section>
	)
}

export default ActivityPage
