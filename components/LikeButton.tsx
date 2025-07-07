"use client"

import { toggleLike, getLikeStatus } from "@/lib/actions/like.actions"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useEffect, useState, useTransition } from "react"
import { usePathname } from "next/navigation"
import LikesModal from "./LikesModal"

interface LikeButtonProps {
	threadId: string
	userId: string
	initialIsLiked?: boolean
	initialLikesCount?: number
	size?: "sm" | "md" | "lg"
	showCount?: boolean
	variant?: "default" | "minimal"
}

const LikeButton = ({
	threadId,
	userId,
	initialIsLiked = false,
	initialLikesCount = 0,
	size = "md",
	showCount = true,
	variant = "default"
}: LikeButtonProps) => {
	const pathname = usePathname()
	const [isPending, startTransition] = useTransition()

	// Single source of truth for like state
	const [isLiked, setIsLiked] = useState(initialIsLiked)
	const [likesCount, setLikesCount] = useState(initialLikesCount)
	const [justToggled, setJustToggled] = useState(false)

	// Sync with props when they change (e.g., navigation)
	useEffect(() => {
		setIsLiked(initialIsLiked)
		setLikesCount(initialLikesCount)
	}, [initialIsLiked, initialLikesCount])

	const handleLike = async () => {
		if (isPending) return

		const newIsLiked = !isLiked
		const newLikesCount = newIsLiked
			? likesCount + 1
			: Math.max(0, likesCount - 1)

		// Optimistic update - immediately update UI
		setIsLiked(newIsLiked)
		setLikesCount(newLikesCount)
		setJustToggled(true)

		// Reset the toggle animation after a short delay
		setTimeout(() => setJustToggled(false), 300)

		startTransition(async () => {
			try {
				const result = await toggleLike(threadId, userId, pathname)

				if (result.success) {
					// Update with server response (should match optimistic update)
					setIsLiked(result.isLiked)
					setLikesCount(result.likesCount)
				} else {
					// Revert optimistic update on error
					console.error("Failed to toggle like:", result.message)
					setIsLiked(!newIsLiked)
					setLikesCount(likesCount)
				}
			} catch (error) {
				console.error("Error toggling like:", error)
				// Revert optimistic update on error
				setIsLiked(!newIsLiked)
				setLikesCount(likesCount)
			}
		})
	}

	const sizeClasses = {
		sm: "w-4 h-4",
		md: "w-6 h-6",
		lg: "w-8 h-8"
	}

	const buttonSizeClasses = {
		sm: "p-0",
		md: "p-0",
		lg: "p-1"
	}

	const textSizeClasses = {
		sm: "text-xs",
		md: "text-sm",
		lg: "text-base"
	}

	return (
		<div className='flex items-center gap-2'>
			<button
				onClick={handleLike}
				disabled={isPending}
				className={cn(
					"flex items-center justify-center ",
					buttonSizeClasses[size],
					{
						"opacity-70 cursor-not-allowed": isPending,
						"hover:scale-110": !isPending && variant === "default"
					}
				)}
				aria-label={isLiked ? "Unlike thread" : "Like thread"}
			>
				<div className='relative'>
					<Image
						src={
							isLiked ? "/assets/heart-filled.svg" : "/assets/heart-gray.svg"
						}
						alt={isLiked ? "Unlike" : "Like"}
						width={size === "sm" ? 16 : size === "md" ? 24 : 32}
						height={size === "sm" ? 16 : size === "md" ? 24 : 32}
						className={cn("heart-smooth", sizeClasses[size], {
							"filter-red": isLiked,
							"hover:scale-110": !isPending,
							"heart-pop": justToggled, // Quick pop animation when toggled
							"heart-pulse": isPending && isLiked, // Subtle pulse when pending and liked
							"opacity-90": isPending // Slight opacity change when pending
						})}
					/>
				</div>
			</button>

			{showCount && likesCount > 0 && (
				<LikesModal
					key={threadId} // Add key to prevent remounting issues
					threadId={threadId}
					likesCount={likesCount}
				>
					<button
						className={cn(
							"font-medium transition-all duration-200 hover:underline cursor-pointer",
							textSizeClasses[size],
							isLiked ? "text-red-500" : "text-gray-400"
						)}
					>
						{likesCount}
					</button>
				</LikesModal>
			)}
		</div>
	)
}

export default LikeButton
