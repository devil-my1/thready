"use client"
import React from "react"
import { Form } from "./ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import CustomFormField from "./CustomFormField"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import Image from "next/image"

import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import { threadValidationSchema } from "@/lib/validations/thread"
import { createThread } from "@/lib/actions/thready.actions"
import { useOrganization } from "@clerk/nextjs"

const PostThready = ({ userId }: { userId: string }) => {
	const router = useRouter()
	const pathname = usePathname()
	const { organization } = useOrganization()

	const form = useForm<z.infer<typeof threadValidationSchema>>({
		resolver: zodResolver(threadValidationSchema),
		defaultValues: {
			thread: ""
		}
	})

	const onSubmit = async (data: z.infer<typeof threadValidationSchema>) => {
		await createThread(
			{
				text: data.thread, // Keep the text as-is to preserve formatting
				author: userId,
				communityId: organization?.id || null
			},
			pathname
		)

		form.reset() // Reset the form after successful submission
		toast.success("Thready posted successfully!")

		router.push("/")
	}

	return (
		<Form {...form}>
			{organization && (
				<div className='mb-4 p-3 bg-primary-500/10 border border-primary-500/20 rounded-lg'>
					<div className='flex items-center gap-2'>
						<Image
							src={organization.imageUrl || "/assets/community.svg"}
							alt={organization.name}
							width={24}
							height={24}
							className='rounded-full'
						/>
						<p className='text-sm text-light-2'>
							Posting as{" "}
							<span className='text-primary-500 font-semibold'>
								{organization.name}
							</span>
						</p>
					</div>
				</div>
			)}
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col justify-start gap-10 mt-10'
			>
				<CustomFormField<typeof threadValidationSchema>
					control={form.control}
					name='thread'
					label='Thready'
					className='flex flex-col w-full gap-3'
					labelClassName='text-base-semibold text-light-2'
					controlClassName='no-focus border border-dark-4 bg-dark-3 text-light-1'
					render={({ field }) => (
						<Textarea
							{...field}
							placeholder='Write your thoughts here...'
							rows={15}
							style={{
								whiteSpace: "pre-wrap",
								resize: "vertical"
							}}
						/>
					)}
				/>
				<Button
					type='submit'
					className='bg-primary-500 flex-1'
				>
					Post Thready
				</Button>
			</form>
		</Form>
	)
}

export default PostThready
