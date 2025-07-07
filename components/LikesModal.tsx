"use client"

import { getThreadLikes, LikeUser } from "@/lib/actions/like.actions"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { DialogDescription } from "@radix-ui/react-dialog"

interface LikesModalProps {
	threadId: string
	likesCount: number
	children: React.ReactNode
}

const LikesModal = ({ threadId, likesCount, children }: LikesModalProps) => {
	const [likes, setLikes] = useState<LikeUser[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const [hasFetched, setHasFetched] = useState(false)

	useEffect(() => {
		if (isOpen && !hasFetched) {
			async function fetchLikes() {
				console.log("Fetching likes for threadId:", threadId)
				setIsLoading(true)
				try {
					const result = await getThreadLikes(threadId)
					console.log("Fetched likes result:", result)

					if (result && Array.isArray(result.likes)) {
						setLikes(result.likes)
					} else {
						setLikes([])
					}
					setHasFetched(true)
				} catch (error) {
					console.log("Error fetching likes:", error)
					setLikes([])
				} finally {
					setIsLoading(false)
				}
			}
			fetchLikes()
		}
	}, [threadId, isOpen, hasFetched])

	// Reset state when modal is closed
	useEffect(() => {
		if (!isOpen) {
			setLikes([])
			setIsLoading(false)
			setHasFetched(false)
		}
	}, [isOpen])

	// console.log(
	// 	"LikesModal rendered with likesCount:",
	// 	validLikesCount,
	// 	"likes:",
	// 	likes.length
	// )

	return (
		<Dialog
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='max-w-md bg-dark-2 border-dark-3'>
				<DialogHeader>
					<DialogTitle className='text-light-1'>
						{likesCount} {likesCount === 1 ? "Like" : "Likes"}
					</DialogTitle>
				</DialogHeader>
				<DialogDescription />

				<div className='max-h-80 overflow-y-auto'>
					{isLoading ? (
						<div className='flex justify-center py-4'>
							<div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500'></div>
						</div>
					) : likes.length > 0 ? (
						<div className='space-y-3'>
							{likes.map((user, index) => (
								<Link
									key={user._id || index}
									href={`/profile/${user.clerkId}`}
									className='flex items-center gap-3 p-2 rounded-lg hover:bg-dark-3 transition-colors'
									onClick={() => setIsOpen(false)}
								>
									<div className='relative h-8 w-8'>
										<Image
											src={user.image || "/assets/user.svg"}
											alt={`${user.name || "User"}'s profile`}
											fill
											className='rounded-full object-cover'
										/>
									</div>
									<div className='flex-1 min-w-0'>
										<p className='text-light-1 text-sm font-medium truncate'>
											{user.name || "Unknown User"}
										</p>
										{user.username && (
											<p className='text-gray-400 text-xs truncate'>
												@{user.username}
											</p>
										)}
									</div>
								</Link>
							))}
						</div>
					) : (
						<p className='text-gray-400 text-center py-4'>No likes to show</p>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default LikesModal
