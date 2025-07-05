"use client"
import React from "react"
import { Form } from "./ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import CustomFormField from "./CustomFormField"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"

import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import { threadValidationSchema } from "@/lib/validations/thread"
import { createThread } from "@/lib/actions/thready.actions"

const PostThready = ({ userId }: { userId: string }) => {
	const router = useRouter()
	const pathname = usePathname()

	const form = useForm<z.infer<typeof threadValidationSchema>>({
		resolver: zodResolver(threadValidationSchema),
		defaultValues: {
			thread: ""
		}
	})

	const onSubmit = async (data: z.infer<typeof threadValidationSchema>) => {
		await createThread(
			{
				text: data.thread,
				author: userId
			},
			pathname
		)
		toast.success("Thready posted successfully!")

		router.push("/")
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col justify-start gap-10 mt-10'
			>
				<CustomFormField<typeof threadValidationSchema>
					control={form.control}
					name='thread'
					label='Thread'
					className='flex flex-col w-full gap-3'
					labelClassName='text-base-semibold text-light-2'
					controlClassName='no-focus border border-dark-4 bg-dark-3 text-light-1'
					render={({ field }) => (
						<Textarea
							{...field}
							placeholder='Write your thouts here...'
							rows={15}
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
