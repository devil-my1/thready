"use client"
import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"

const ProfileHeader = ({
	accountId,
	authUserId,
	type,
	bio,
	createdAt,
	image,
	name,
	username
}: ProfileHeaderProps) => {
	const date = new Date(createdAt).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	})
	const [isPortrait, setIsPortrait] = useState(false)

	const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
		const img = event.currentTarget
		setIsPortrait(img.naturalHeight > img.naturalWidth)
	}

	return (
		<div className='flex w-full flex-col justify-start'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<div className='relative h-20 w-20'>
						<Image
							src={image || "/assets/user.svg"}
							alt='profile photo'
							fill
							className='cursor-pointer rounded-full object-cover border border-gray-700'
							style={isPortrait ? { objectPosition: "center -8px" } : {}}
							onLoad={handleImageLoad}
						/>
					</div>
					<div className='flex-1'>
						<h2 className='text-left text-heading3-bold text-light-1'>
							{name}
						</h2>
						<p className='text-base-medium text-gray-1'>@{username}</p>
					</div>
				</div>
				<div className='flex flex-col gap-3'>
					{accountId === authUserId && type !== "Community" && (
						<Link
							href='/profile/edit'
							className=' flex-1'
						>
							<div className='flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2'>
								<Image
									src='/assets/edit.svg'
									alt='logout'
									width={16}
									height={16}
								/>

								<p className='text-light-2 max-sm:hidden'>Edit</p>
							</div>
						</Link>
					)}
					<p className='text-gray-1 align-bottom'>{`Joined us from: ${date}`}</p>
				</div>
			</div>
			<p className='mt-6 text-base-regular text-light-2'>{bio}</p>
			<div className='mt-12 h-0.5 w-full bg-dark-3'></div>
		</div>
	)
}

export default ProfileHeader
