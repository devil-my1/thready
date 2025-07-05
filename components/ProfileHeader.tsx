import Image from "next/image"
import React from "react"

const ProfileHeader = ({
	accountId,
	authUserId,
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

	return (
		<div className='flex w-full flex-col justify-start'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<div className='relative h-20 w-20'>
						<Image
							src={image || "/assets/user.svg"}
							alt='profile photo'
							fill
							className='rounded-full object-cover shadow-xl'
						/>
					</div>
					<div className='flex-1'>
						<h2 className='text-left text-heading3-bold text-light-1'>
							{name}
						</h2>
						<p className='text-base-medium text-gray-1'>@{username}</p>
					</div>
				</div>
				<p className='text-gray-1 self-end'>{`Joined us from: ${date}`}</p>
			</div>
			<p className='mt-6 text-base-regular text-light-2'>{bio}</p>
			<div className='mt-12 h-0.5 w-full bg-dark-3'></div>
		</div>
	)
}

export default ProfileHeader
