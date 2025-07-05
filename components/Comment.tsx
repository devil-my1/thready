"use client"
import { createComment } from "@/lib/actions/thready.actions"
import { commentValidationSchema } from "@/lib/validations/thread"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePathname } from "next/navigation"
import React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import CustomFormField from "./CustomFormField"
import { Form } from "./ui/form"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import Image from "next/image"

const Comment = ({
	parrentThreadId,
	currentUserImg,
	currentUserId
}: CommentProps) => {
	const pathname = usePathname()

	const form = useForm<z.infer<typeof commentValidationSchema>>({
		resolver: zodResolver(commentValidationSchema),
		defaultValues: {
			comment: ""
		}
	})

	const onSubmit = async (data: z.infer<typeof commentValidationSchema>) => {
		await createComment(
			{
				author: currentUserId,
				parrentThreadID: parrentThreadId,
				text: data.comment
			},
			pathname
		)
		toast.success("Replied successfully!")
		form.reset()
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='comment-form'
			>
				<Image
					src={currentUserImg || "/assets/profile.svg"}
					alt='user profile'
					width={48}
					height={48}
					className='rounded-full object-cover'
				/>
				<CustomFormField<typeof commentValidationSchema>
					control={form.control}
					name='comment'
					className='flex flex-col w-full gap-3'
					controlClassName='border-none bg-transparent no-focus'
					render={({ field }) => (
						<Input
							{...field}
							placeholder='Reply to this thready...'
							className='no-fucus text-light-1 outline-none '
						/>
					)}
				/>
				<Button
					type='submit'
					className='duration-300 hover:!bg-primary-500/70 comment-form_btn'
				>
					Reply
				</Button>
			</form>
		</Form>
	)
}

export default Comment
