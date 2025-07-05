"use client"
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage
} from "./ui/form"
import { Control, FieldPath } from "react-hook-form"

import { z } from "zod"
import Image from "next/image"

interface CustomFormFieldProps<T extends z.ZodType> {
	control: Control<z.infer<T>>
	name: FieldPath<z.infer<T>>
	placeholder?: string
	label?: string
	className?: string
	labelClassName?: string
	controlClassName?: string
	render: (props: { field: any }) => React.ReactNode
}

const CustomFormField = <T extends z.ZodType>({
	control,
	name,
	label,
	className,
	labelClassName,
	controlClassName,
	render
}: CustomFormFieldProps<T>) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={className}>
					{name === "image" ? (
						<FormLabel className={labelClassName}>
							{field.value ? (
								<Image
									src={field.value}
									alt='profile photo'
									width={96}
									height={96}
									priority
									className='rounded-full object-contain max-w-[96px] max-h-[96px] pointer-events-none'
								/>
							) : (
								<Image
									src='/assets/profile.svg'
									alt='profile photo'
									width={24}
									height={24}
									className='rounded-full object-contain'
								/>
							)}
						</FormLabel>
					) : (
						label && <FormLabel className={labelClassName}>{label}</FormLabel>
					)}
					<FormControl className={controlClassName}>
						{render({ field })}
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}

export default CustomFormField
