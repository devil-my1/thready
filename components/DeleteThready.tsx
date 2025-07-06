"use client"

import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"

import { deleteThread } from "@/lib/actions/thready.actions"
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
	DialogDescription,
	DialogClose,
	DialogOverlay
} from "@radix-ui/react-dialog"
import { DialogHeader } from "./ui/dialog"
import { useState } from "react"
import { Button } from "./ui/button"
import { toast } from "sonner"

interface Props {
	threadId: string
}

function DeleteThready({ threadId }: Props) {
	const pathname = usePathname()
	const router = useRouter()
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)

	const handleDelete = async () => {
		try {
			setIsDeleting(true)
			await deleteThread(threadId, pathname)
			toast.success("Thread deleted successfully!")
			setIsDialogOpen(false)

			// Redirect to home if we're on the thread detail page
			if (pathname.includes(`/thread/${threadId}`)) {
				router.push("/")
			}
		} catch (error) {
			toast.error("Failed to delete thread. Please try again.")
		} finally {
			setIsDeleting(false)
		}
	}

	return (
		<Dialog
			open={isDialogOpen}
			onOpenChange={setIsDialogOpen}
		>
			<DialogTrigger asChild>
				<Image
					src='/assets/delete.svg'
					alt='delte'
					width={18}
					height={18}
					className='cursor-pointer object-contain hover:scale-125 transition-all duration-200'
				/>
			</DialogTrigger>
			<DialogOverlay className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50' />
			<DialogContent className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dark-2 border border-dark-4 text-light-1 max-w-md w-full mx-4 p-6 rounded-lg z-50 shadow-xl'>
				<DialogHeader>
					<DialogTitle className='text-light-1'>
						Are you sure you want to delete this thread?
					</DialogTitle>
					<DialogDescription className='text-light-2'>
						This action cannot be undone. This will permanently delete the
						thread and all its replies from our servers.
					</DialogDescription>
				</DialogHeader>
				<div className='flex gap-3 mt-4'>
					<DialogClose asChild>
						<Button
							type='button'
							variant='secondary'
							className='flex-1'
							disabled={isDeleting}
						>
							Cancel
						</Button>
					</DialogClose>
					<Button
						type='button'
						variant='destructive'
						className='flex-1 bg-red-600 hover:bg-red-700 text-white'
						onClick={handleDelete}
						disabled={isDeleting}
					>
						{isDeleting ? "Deleting..." : "Delete"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default DeleteThready
