"use client"
import { cn, formatDateString } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import DeleteThready from "./DeleteThready"
import LikeButton from "./LikeButton"

const ThreadyCard = ({
	author,
	text,
	comments,
	community,
	id,
	parrentId: parentId,
	currentUser,
	showActions = false,
	isComment,
	createdAt,
	likes,
	likesCount
}: ThreadyCardProps) => {
	const [isPortrait, setIsPortrait] = useState(false)

	const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
		const img = event.currentTarget
		setIsPortrait(img.naturalHeight > img.naturalWidth)
	}
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
							href={
								community
									? `/communities/${community.id}`
									: `/profile/${author?.clerkId}`
							}
						>
							<div className='flex-shrink-0 w-12 h-12'>
								<Image
									src={community?.image || author?.image || "/assets/user.svg"}
									alt={community ? "community logo" : "profile photo"}
									fill
									className='cursor-pointer rounded-full object-cover border border-gray-700'
									style={isPortrait ? { objectPosition: "center -8px" } : {}}
									onLoad={handleImageLoad}
								/>
							</div>
						</Link>
						<div className='thread-card_bar' />
					</div>
					<div className='flex w-full flex-col'>
						<Link
							className='w-fit'
							href={
								community
									? `/communities/${community.id}`
									: `/profile/${author?.clerkId}`
							}
						>
							<div className='flex items-center gap-2'>
								<h3 className='cursor-pointer text-base-semibold text-light-1'>
									{community?.name || author?.name}
								</h3>
								{community && (
									<span className='text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full'>
										Community
									</span>
								)}
							</div>
						</Link>
						<p
							className={cn(
								"mt-2 text-small-regular text-light-2 preserve-formatting"
							)}
						>
							{text}
						</p>
						<div
							className={cn("mt-5 flex flex-col gap-3", {
								"mt-10 md:group-hover:translate-y-0 md:translate-y-2 md:opacity-0 md:group-hover:opacity-100 md:transition-all md:duration-300 md:ease-out opacity-100 translate-y-0":
									isComment
							})}
						>
							<div className='action-icons-container'>
								<LikeButton
									threadId={id}
									userId={currentUser}
									initialLikesCount={likesCount || 0}
									initialIsLiked={likes?.includes(currentUser) || false}
									size='md'
									showCount={true}
								/>
								<Link
									href={`/thread/${id}`}
									className='flex items-center'
								>
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
								<button className='flex items-center'>
									<Image
										src='/assets/repost.svg'
										alt='repost'
										width={24}
										height={24}
										className='action-icon_item'
									/>
								</button>
								<button className='flex items-center'>
									<Image
										src='/assets/share.svg'
										alt='share'
										width={24}
										height={24}
										className='action-icon_item'
									/>
								</button>
							</div>
							{isComment && comments && comments?.length > 0 && (
								<Link href={`/thread/${id}`}>
									<p className='mt-1 text-subtle-medium text-gray-1'>
										{comments.length} repl{comments.length > 1 ? "ies" : "y"}
									</p>
								</Link>
							)}
						</div>
						{community == null && (
							<p className='mt-1 text-small-medium text-gray-1'>
								{formatDateString(createdAt.toString())}
							</p>
						)}
					</div>
				</div>
				{showActions && <DeleteThready threadId={id} />}
			</div>
			{!isComment && community && (
				<Link
					href={`/communities/${community.id}`}
					className='flex items-center  mt-5'
				>
					<p className='text-subtle-medium text-gray-1'>
						{formatDateString(createdAt.toString())} - {community.name}{" "}
						Community
					</p>
					<Image
						src={community.image || "/assets/community.svg"}
						alt='community logo'
						width={14}
						height={14}
						className='ml-2 object-cover rounded-full'
					/>
				</Link>
			)}
		</article>
	)
}

export default ThreadyCard
