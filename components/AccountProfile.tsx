"use client"
import React, { useState } from "react"
import { Form } from "./ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import CustomFormField from "./CustomFormField"
import { userValidationSchema } from "@/lib/validations/user"
import { Textarea } from "./ui/textarea"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { UploadButton } from "@/lib/uploadthing"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import { updateUser } from "@/lib/actions/user.actions"

const AccountProfile = ({ user, btnTitle }: AccountProfileProps) => {
	const router = useRouter()
	const pathname = usePathname()

	const form = useForm<z.infer<typeof userValidationSchema>>({
		resolver: zodResolver(userValidationSchema),
		defaultValues: {
			username: user.username || "",
			name: user.name || "",
			bio: user.bio || "",
			image: user.image || ""
		}
	})

	const [files, setFiles] = useState<File[]>([])

	const onSubmit = async (data: z.infer<typeof userValidationSchema>) => {
		await updateUser(
			{
				name: data.name || "",
				username: data.username ? data.username.toLowerCase() : "",
				clerkId: user.clerkId,
				bio: data.bio,
				image: data.image
			},
			pathname
		)

		if (pathname === "/profile/edit") {
			router.back()
		} else {
			router.push("/")
		}

		console.log("Form submitted:", data)
	}

	const handleImageUpload = (f: File[], onChange: (value: string) => void) => {
		// f.preventDefault()

		const fileReader = new FileReader()

		if (f.length) {
			const file = f[0]

			if (!file.type.includes("image")) {
				toast.error("Please upload a valid image file.", {
					className: "!bg-red-500 text-white",
					duration: 3000
				})
				return
			}
			setFiles(Array.from(f))

			fileReader.onload = async event => {
				const imageDataUrl = event.target?.result?.toString() || ""
				onChange(imageDataUrl)
			}

			fileReader.readAsDataURL(file)
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col justify-start gap-10'
			>
				<CustomFormField<typeof userValidationSchema>
					control={form.control}
					name='image'
					className='flex items-center gap-4'
					labelClassName='account-form_image-label'
					controlClassName='flex-1 text-base-semibold text-gray-200'
					render={({ field }) => (
						<UploadButton
							appearance={{
								button:
									"!bg-transparent hover:!text-primary-500 duration-200 !items-center !justify-start !w-full !no-focus !outline-none !border-none",
								allowedContent: "hidden"
							}}
							className='account-form_image-input !no-focus !outline-none !border-none'
							endpoint='media'
							onChange={f => handleImageUpload(f, field.onChange)}
							onClientUploadComplete={res => {
								const file = res[0]
								form.setValue("image", file.ufsUrl)

								toast.info("Image changed successfully")
							}}
							onUploadError={(error: Error) => {
								// Do something with the error.
								toast.error(`ERROR! ${error.message}`)
							}}
						/>
					)}
				/>
				<CustomFormField<typeof userValidationSchema>
					control={form.control}
					name='username'
					label='Username'
					className='flex flex-col gap-3 w-full'
					labelClassName='text-base-semibold text-light-2'
					render={({ field }) => (
						<Input
							placeholder='Enter your username'
							className='account-form_input no-focus'
							{...field}
						/>
					)}
				/>
				<CustomFormField<typeof userValidationSchema>
					control={form.control}
					name='name'
					label='Name'
					className='flex  flex-col gap-3 w-full'
					labelClassName='text-base-semibold text-light-2'
					render={({ field }) => (
						<Input
							placeholder='Enter your name'
							className='account-form_input no-focus'
							{...field}
						/>
					)}
				/>
				<CustomFormField<typeof userValidationSchema>
					control={form.control}
					name='bio'
					label='Bio'
					className='flex flex-col gap-3 w-full'
					labelClassName='text-base-semibold text-light-2'
					render={({ field }) => (
						<Textarea
							rows={10}
							className='account-form_input no-focus'
							placeholder='Tell us about yourself'
							{...field}
						/>
					)}
				/>
				{/* <div className='flex justify-center items-center gap-4 w-full'> */}
				<Button
					type='submit'
					className='bg-primary-500 flex-1'
				>
					{btnTitle}
				</Button>
			</form>
		</Form>
	)
}

export default AccountProfile
