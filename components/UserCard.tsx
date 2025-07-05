"use client"
import Image from "next/image"
import React from "react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

const UserCard = ({
	id,
	imgUrl,
	name,
	personType,
	username
}: UserCardProps) => {
	const router = useRouter()
	return (
		<article className='user-card'>
			<div className='user-card_avatar'>
				<div className='relative h-20 w-20'>
					<Image
						src={imgUrl || "/assets/user.svg"}
						alt='profile photo'
						fill
						className='rounded-full object-cover shadow-xl'
					/>
				</div>
				<div className='flex-1 text-ellipsis'>
					<h4 className='text-base-semibold text-light-1'>{name}</h4>
					<p className='text-small-medium text-gray-1'>@{username}</p>
				</div>
			</div>
			<Button
				className='user-card_button hover:text-primary-500 transition-colors'
				onClick={() => router.push(`/profile/${id}`)}
			>
				View
			</Button>
		</article>
	)
}

export default UserCard
