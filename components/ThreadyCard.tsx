import { cn, formatDateString } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import React from "react"

const ThreadyCard = ({
	author,
	text,
	comments,
	community,
	id,
	parrentId: parentId,
	currentUser,
	isComment,
	createdAt
}: ThreadyCardProps) => {
	return (
		<article
			className={cn("flex w-full flex-col rounded-xl group", {
				"thread-card_comment px-0 xs:px-7 mt-4": isComment,
				"bg-dark-2 p-7": !isComment
			})}
		>
			<div className='flex items-start justify-between'>
				<div className='flex w-full flex-1 gap-4'>
					<div className='flex flex-col items-center'>
						<Link
							className='relative h-11 w-11'
							href={`/profile/${author?.clerkId}`}
						>
							<Image
								src={author?.image || "/assets/user.svg"}
								alt='profile photo'
								fill
								className='rounded-full cursor-pointer'
							/>
						</Link>
						<div className='thread-card_bar' />
					</div>
					<div className='flex w-full flex-col'>
						<Link
							className='w-fit'
							href={`/profile/${author?.clerkId}`}
						>
							<h3 className='cursor-pointer text-base-semibold text-light-1'>
								{author?.name}
							</h3>
						</Link>
						<p className={cn("mt-2 text-small-regular text-light-2")}>{text}</p>
						<div
							className={cn("mt-5 flex flex-col gap-3", {
								"mt-10 md:group-hover:translate-y-0 md:translate-y-2 md:opacity-0 md:group-hover:opacity-100 md:transition-all md:duration-300 md:ease-out opacity-100 translate-y-0":
									isComment
							})}
						>
							<div className='flex gap-3.5'>
								<Image
									src='/assets/heart-gray.svg'
									alt='heart'
									width={24}
									height={24}
									className='action-icon_item'
								/>
								<Link href={`/thread/${id}`}>
									<div className='flex relative'>
										<Image
											src='/assets/reply.svg'
											alt='reply'
											width={24}
											height={24}
											className='action-icon_item'
										/>
										{!isComment && comments && comments?.length > 0 && (
											<span className='absolute -top-2 -right-2 min-w-5 h-5 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-pink-600 px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm'>
												{comments?.length}
											</span>
										)}
									</div>
								</Link>
								<Image
									src='/assets/repost.svg'
									alt='repost'
									width={24}
									height={24}
									className='action-icon_item'
								/>
								<Image
									src='/assets/share.svg'
									alt='share'
									width={24}
									height={24}
									className='action-icon_item'
								/>
							</div>
							{isComment && comments && comments?.length > 0 && (
								<Link href={`/thread/${id}`}>
									<p className='mt-1 text-subtle-medium text-gray-1'>
										{comments.length} repl{comments.length > 1 ? "ies" : "y"}
									</p>
								</Link>
							)}
						</div>
						<p className='mt-1 text-small-medium text-gray-1'>
							{formatDateString(createdAt.toString())}
						</p>
					</div>
				</div>
			</div>
		</article>
	)
}

export default ThreadyCard
